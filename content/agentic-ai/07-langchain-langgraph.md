Two libraries from the same project, doing different jobs. LangChain gives you
adapters and building blocks; LangGraph gives you a state machine with
persistence. Most real systems that use either end up using LangGraph for the
control flow and a handful of LangChain pieces inside it.

## LangChain: the useful third

LangChain is large, and most of it you will not need. What earns its place:

- **One interface across providers.** Swap OpenAI for Anthropic for a local
  model without rewriting your calls.
- **Document loaders and splitters.** PDF, HTML, Markdown, Notion, and the
  text splitters from the previous lesson.
- **Vector store adapters.** The same `similarity_search` across pgvector,
  Chroma, Qdrant.
- **Output parsers.** Structured output with retries when the model returns
  something malformed.

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

prompt = ChatPromptTemplate.from_template(
    "Summarise this in two sentences:\n\n{text}"
)
chain = prompt | ChatOpenAI(model="gpt-4o-mini") | StrOutputParser()
chain.invoke({"text": document})
```

The `|` is LCEL — a pipeline where each piece feeds the next, with `.invoke`,
`.batch`, `.stream` and async versions for free.

Where LangChain stops being the right tool is control flow. A chain is a
straight line. The moment you need "if the retrieval was poor, rewrite the
query and try again", you are fighting it — and that is precisely what
LangGraph is for.

## LangGraph: state, nodes, edges

Three concepts.

**State** — a typed dictionary that flows through the graph. Every node
receives it and returns updates to it.

```python
from typing import Annotated, TypedDict
from operator import add

class State(TypedDict):
    question: str
    documents: list[str]
    answer: str
    attempts: Annotated[int, add]      # reducer: updates accumulate
```

Without a reducer, a returned key replaces the old value. `Annotated[..., add]`
makes it accumulate instead — the usual choice for message lists and counters.

**Nodes** — plain functions. State in, partial state out.

```python
def retrieve(state: State) -> dict:
    docs = vector_store.similarity_search(state["question"], k=5)
    return {"documents": [d.page_content for d in docs], "attempts": 1}

def generate(state: State) -> dict:
    context = "\n\n".join(state["documents"])
    return {"answer": llm.invoke(f"{context}\n\nQ: {state['question']}").content}
```

**Edges** — what runs next. Fixed, or decided at runtime.

```python
from langgraph.graph import StateGraph, START, END

def good_enough(state: State) -> str:
    if state["documents"]:
        return "generate"
    if state["attempts"] >= 3:        # the cap, again — always have one
        return "give_up"
    return "rewrite_query"

builder = StateGraph(State)
builder.add_node("retrieve", retrieve)
builder.add_node("rewrite_query", rewrite_query)
builder.add_node("generate", generate)
builder.add_node("give_up", give_up)

builder.add_edge(START, "retrieve")
builder.add_conditional_edges("retrieve", good_enough)
builder.add_edge("rewrite_query", "retrieve")     # the loop
builder.add_edge("generate", END)

graph = builder.compile()
graph.invoke({"question": "what is the refund window?", "attempts": 0})
```

That is a self-correcting RAG pipeline in thirty lines. The conditional edge is
the thing a chain cannot express.

## Checkpointers: why this matters in production

A checkpointer saves the state after every node.

```python
from langgraph.checkpoint.postgres import PostgresSaver

with PostgresSaver.from_conn_string(DATABASE_URL) as saver:
    graph = builder.compile(checkpointer=saver)

    config = {"configurable": {"thread_id": "student-42"}}
    graph.invoke({"question": "what did I ask before?"}, config)
```

Three things follow from that, all of which you would otherwise have to build:

- **Conversation memory is free.** A `thread_id` resumes exactly where it left
  off; the accumulated state *is* the history.
- **Crashes are recoverable.** The process dies at step four; restarting the
  thread resumes at step four rather than step one.
- **You can inspect and rewind.** `graph.get_state_history(config)` gives you
  every step. When an agent does something inexplicable, this is how you find
  out why.

Use `MemorySaver` while developing, a Postgres saver in production. The
interface is identical.

## Human in the loop

Some steps should not happen unsupervised — sending an email, issuing a
refund, deleting anything.

```python
graph = builder.compile(checkpointer=saver, interrupt_before=["send_email"])

graph.invoke(inputs, config)                  # stops before send_email
state = graph.get_state(config)               # show the draft to a person
graph.invoke(None, config)                    # approved: continue
```

The graph pauses, persists, and waits — for a second, or for a day. This is
much harder to build by hand than it looks, and it is the strongest single
reason to use LangGraph rather than your own loop.

## Should you use it?

Honestly:

**Yes** when the flow has branches or loops, when you need conversation state
across sessions, when a human must approve a step, or when you need to see
what happened after the fact.

**No** for a single call, a straight-line chain of two or three calls, or a
simple tool loop. `while` and a list of messages is less code and easier to
debug, and the ten lines at the top of the agent lesson genuinely are the
whole pattern.

The trap with every agent framework is reaching for it before you have a
problem it solves. Write the loop first. When you find yourself building
checkpointing, resumability and conditional routing by hand, that is the
signal — and by then you will understand exactly what LangGraph is doing for
you.

## Debugging

Set `LANGSMITH_TRACING=true` and every node, prompt, token count and latency
is recorded. Alternatives — Langfuse (open source), or plain OpenTelemetry —
do the same job.

Some tracing is not optional. An agent that fails on one input in twenty
cannot be debugged from logs; you need the tree of what actually ran.

---

**Next.** What the agent remembers between turns, between sessions, and
between users.
