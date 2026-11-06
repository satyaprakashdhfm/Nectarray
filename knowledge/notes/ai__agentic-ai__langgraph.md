# LangGraph Notes - Organized by Category

## 1. STATE MANAGEMENT

### Type Annotations & Reducers
**Point 1**: For a standard Python interpreter and generic static type checking, `Optional[str]` and `Annotated[Optional[str], operator.add]` are treated as the same type: Optional[str] (which is a str | None type). The operator.add metadata is ignored by default type checkers.

| Reducer | Use Case | Behavior |
| :--- | :--- | :--- |
| **(None)** | Simple vars | Usually replaces (overwrites). |
| **`"replace"`** | Status, Flags | Strictly overwrites old value with new. |
| **`operator.add`** | Lists, Counters | Appends to lists; Sums integers. |
| **`add_messages`** | Chat History | Appends new messages; Updates existing ones by ID. |
| **Custom Func** | Complex Logic | Whatever logic you write (merging dicts, deduplicating, etc.). |

### State Access Patterns
**Point 3**: In Python, class variables can be accessed in several ways, primarily using dot notation (e.g., ClassName.variable or instance.variable). In LangGraph, the state is typically accessed like a dictionary because the underlying data structure used for managing the graph's state is a dictionary, often defined using TypedDict or Pydantic BaseModel.

**Point 6**: In LangGraph, you must update the state by returning a dictionary of the changes, as in-place mutation of the passed state object will not work correctly or reliably.

**Point 9**: Rule of Thumb: If it's a node with function in the graph, it must receives the state as 1 param in function & to update the state it must return state

**Point 18**: A common LangGraph mistake is accessing state with `state["key"]` when the key may be missing or `None`, which raises a KeyError or breaks downstream logic; always prefer `state.get()` and provide a default value so the graph can continue safely even when data is absent.

```python
value = state.get("summary")                  # safe, returns None if missing
value = state.get("summary", "")              # safe, default empty string
value = state.get("summary", state.get("raw"))# safe fallback to another state value
value = state["summary"]                      # unsafe if key is not set
```

- Using `state.get("key", not)` is invalid because `not` is an operator in Python, not a value; Python expects a concrete object (like None, "", 0, or False) as the default.so sipmle `state.get(value)` will work because if None as no value then it will route to else.

### State Schemas
**Point 34**: Context schema (what it really is)

In LangGraph, **"context schema" is not a separate class**, it's a **role** played by part of the state that comes from `config["configurable"]`.

So we have **four conceptual layers**, not three.

---

**Input schema**
What the user sends **as data**.

• Comes from `app.invoke(input)`
• Validated by `input_schema`
• Becomes part of state

Example:

```python
InputState = {"claim": "..."}
```

---

**Context schema**
What the system sends **as execution context**, not data.

• Comes from `config["configurable"]`
• Not merged into state
• Used for identity, routing, memory, threads

Example:

```python
config = {
  "configurable": {
    "user_id": "u1",
    "thread_id": "t1"
  }
}
```

Used like:

```python
def node(state, *, config):
    user_id = config["configurable"]["user_id"]
```

Think of it as:
"Who is running this graph, and under what session."

---

**OverallState (internal working state)**
What the graph **mutates and reasons with**.

• Includes inputs + node outputs
• Grows during execution
• Stored in checkpoints

Example:

```python
class OverallState(TypedDict):
    claim: str
    evidence: str
    confidence: float
```

---

**Output schema**
What the graph **is allowed to return**.

• Filtered view of OverallState
• Enforced at END
• Safe response

Example:

```python
OutputState = {"report": dict}
```

---

**Why context is NOT part of state**

• Context should not be checkpointed
• Context should not be branched
• Context should not affect determinism
• Context is execution metadata

If user_id were in state, branching or replay would break identity.

---

**One-line mental model**

InputState → data
Context → execution metadata
OverallState → reasoning memory
OutputState → final answer

---

## 2. MESSAGES & MESSAGE HANDLING

### Message Types & Tuples
**Point 5**: The tuple ('user', user_input) is automatically interpreted by LangGraph instead of importing it explicitly as a HumanMessage with the content set to the user_input string. The string 'user' specifies the role of the message sender.

- Instead of explicitly importing and using the message classes (e.g., SystemMessage(content="...")), you can use the following format:
    - System Message: ('system', 'You are a helpful assistant.')
    - AI Message: ('ai', 'Hello! How can I help you?') or ('assistant', 'Hello! How can I help you?')
    - Human Message: ('user', user_input) or ('human', user_input)

### LLM Response Structure
**Point 7**: example of llm.invoke reponse :`content="Hello! I'm just a language model, so I don't have emotions or feelings like humans do, but I'm functioning properly and ready to assist you with any questions or tasks you may have. How can I help you today?" additional_kwargs={} response_metadata={'token_usage': {'completion_tokens': 48, 'prompt_tokens': 39, 'total_tokens': 87}, 'model_name': 'meta-llama/Llama-3.2-3B-Instruct', 'system_fingerprint': '', 'finish_reason': 'stop', 'logprobs': None} id='lc_run--ea426322-2f95-4904-91b8-d148414bee4c-0' usage_metadata={'input_tokens': 39, 'output_tokens': 48, 'total_tokens': 87}`

- so please use for the add_messages in explicit agentstate class or MessagesState(langgraph class) we should use while appending 
    ```python 
       def process(state:AgentState)->AgentState:
        response = llm.invoke(state['message'])
        state['message'].append(AIMessage(content = response.content)) # here we are only taking content instead of any other tokens all those things
        return state
    ```

### add_messages Reducer
**Point 15**: The `add_messages` reducer is used for a state key (usually `messages`) that stores a **list of LangChain message objects**, not plain strings. Each item is an instance like `HumanMessage`, `AIMessage`, `SystemMessage`, or `ToolMessage`, and internally each message holds `role/type`, `content`, and optionally an `id`.

- add_messages requires role information; raw strings have content but no speaker, so they cannot be upgraded into valid message objects.
- Because `add_messages` appends new items onto an existing list, it requires the update to be a list; wrapping a single message in a list keeps the reducer logic consistent and allows uniform merging of one or many messages.
- Message object types represent who produced the message and why, which lets LangGraph and LLMs reason over conversation history correctly instead of raw text blobs. 

```python
from langgraph.graph.message import add_messages
messages: Annotated[list, add_messages]
```

```python
HumanMessage(content="user input")
AIMessage(content="model reply")
SystemMessage(content="instructions")
ToolMessage(content="tool output")
&
Input given to graph            → Stored internally as
------------------------------------------------------------
('user', user_input)            → HumanMessage(content=...)
('assistant', reply)            → AIMessage(content=...)
SystemMessage("rules")          → SystemMessage
ToolMessage("tool output")      → ToolMessage
```

### Message Unpacking
**Point 21**: In this call, the `*` before `state["messages"]` is **Python unpacking**, not dict dumping. It expands the list so each message becomes a separate element in the prompt list.

```python
response = model.invoke(
    [
        {"role": "system", "content": system_prompt},
        *state["messages"]
    ]
)
```

- `*list] `  → spreads elements
- `{**dict}`  → spreads key:value pairs

---

## 3. GRAPH EXECUTION & STREAMING

### Stream Mechanics
**Point 4**: The graph.stream() method in LangChain/LangGraph returns a generator object (an iterator) that yields a series of events incrementally. Each event in this stream is a dictionary representing the output or updates from each step (node execution) in the graph's execution flow. The structure of the data can vary slightly depending on the stream_mode parameter used (e.g., "values", "updates", "messages"), but the fundamental yielded object for a single mode is a dictionary (or a tuple if streaming multiple modes). The inner `for value in event.values():` loop iterates over the values within that dictionary event to access the actual content chunks (like LLM tokens or state updates) for processing or display. This design allows for real-time, token-by-token streaming, which significantly improves user experience for applications built on large language models.

### Stream Modes
**Point 20**: `stream_mode` controls *what* LangGraph streams during execution; you can pass a single mode or a list to stream multiple views at once.

```python
graph.stream(input, stream_mode=["values", "messages"])
```

- Meaning of common `stream_mode` values: `"values"` streams full state snapshots, `"updates"` streams only state changes, `"messages"` streams LLM tokens, `"custom"` streams user-defined data, `"debug"` streams internal execution details, and `"events"` streams everything.

---

## 4. ROUTING & CONDITIONAL EDGES

### Router Patterns
**Point 12**: When the first node in the graph is a router, we use a simple passthrough function so the router only forwards state and lets the decision logic choose the next step. The router node is added with a lambda that returns the incoming state unchanged, then START connects to this router, and finally a conditional edge uses `deciee_next_node` to pick whether the flow continues to `addition_node` or `subtract_node`.

```python
graph.add_node("router", lambda state: state)        # passthrough router node
graph.add_edge(START, "router")                      # graph begins by entering router
graph.add_conditional_edges(
    "router",                                        # source node
    deciee_next_node,                                # decision function
    {
        "addition_operation": "addition_node",       # route to addition
        "subtraction_operation": "subtract_node"     # route to subtraction
    }
)                                                    # avoids looping unless mapped back to router
```

- A route node can `return END` to stop the graph , If a routing decision needs to end the graph, the route function can directly return END instead of a node name; this is useful when the decision point itself acts as the terminator rather than sending flow to a separate end-node.
- using state variables in the conditional logic
  ```python
        graph.add_conditional_edges(
        "router",
        lambda state: (
            "addition_node" if "add" in state["user_message"].lower()
            else END         if "stop" in state["user_message"].lower()
            else "fallback_node"
        )
        )
  ```
- if we written the condition like "additional_operation":"addiontal_operation" then i will show in teh graph diagram if nt it will know things internally and works well but it will not show in the graph.

**Point 13**: Here `add_conditional_edges` doesn't need a dictionary for routing if the routing function already returns the exact next node name (e.g., "junior_node"), so the framework can jump directly without a path-map; in the earlier case the function returned labels that required a dictionary to translate them into real node names.

**Point 28**: every routing conditional will add extra function to code

---

## 5. COMMAND & CONTROL FLOW

### Command Object
**Point 10**: 
1. **`Command`** is a unified control object that combines **state updates** and **graph navigation** into a single return value.
2. It allows a node to dynamically dictate the next step (`goto`), effectively replacing the need for conditional edges or routers.
    - **In a Node (Routing & Updating):**
    - Returns data and directs the flow.
    ```python
    return Command(update={"status": "approved"}, goto="proceed")
    ```
4. It also acts as the standard payload mechanism to **resume** execution when unpausing a graph that is waiting for input.
    - **In Invoke (Resuming Human-in-the-Loop):**
    - Wakes up a paused graph and delivers the user's answer.
    ```python
    app.invoke(Command(resume="approved"), config=thread_config)
    ```

### Interrupt Types
**Point 11**: intterupt types

| Name | Type | Role | You Use It? |
| :--- | :--- | :--- | :--- |
| **`interrupt`** | **Function** | **Pauses the graph** and waits for input, It halts the graph immediately at that line. It returns whatever value is passed into Command(resume=...) when the graph resumes. | **YES** (Inside nodes) |
| **`Interrupt`** | **Class** | The internal **signal** that stops execution. | **NO** (It's internal machinery) |

### Interrupting Execution
**Point 26**: stopping the graph right after or before some nodes we use

```python
#run1 with interupt
app = graph.compile(
checkpointer=saver,
interrupt_before=["recommend"])
# RUN 2: recompile without interrupt and resume from saved state
app2 = graph.compile(checkpointer=saver)
```

---

## 6. TOOLS & TOOL CALLING

### Tool Condition
**Point 13**: toolnode and toolcondition
 
Here is exactly what happens behind the scenes inside `tools_condition`:

1. **The Check:** It looks at the **last message** output by the LLM (the `AIMessage`).
2. **The Attribute:** It checks the property `.tool_calls`.
3. **The Decision:**
    * **If `tool_calls` has data** (e.g., `[{name: 'send_email', ...}]`): It returns **"tools"** -> **Loop continues**.
    * **If `tool_calls` is Empty** (e.g., `[]`): It returns **`END`** -> **Graph stops**.

### Visual Summary

| LLM Output | `tool_calls` Content | `tools_condition` Decision | Result |
| :--- | :--- | :--- | :--- |
| "I need to send an email..." | `[send_email(...)]` | **"tools"** | Go to ToolNode |
| "The email has been sent." | `[]` (Empty) | **`END`** | **STOP (Finish)** |

### Tool Calling Patterns
**Point 17**: For strict tool usage, keep **two LLM paths**: use plain `llm` for normal responses, and only use `llm_with_tool_call` when the model explicitly needs a tool. This avoids unnecessary tool calls and keeps graphs predictable.

```python
response = llm.invoke(messages) if no_tool_needed else llm_with_tool_call.invoke(messages)
```

**Point 27**: **there are exactly three practical ways tools get called in LangGraph / LangChain-style agents**, and your snippets

```
Tool calling happens in three patterns, depending on who controls the decision.
```

#### 1. Manual tool calling (fully controlled by you)

You explicitly read `tool_calls`, invoke tools yourself, and append `ToolMessage`.

```python
tools = [climate_data_tool, general_facts_tool]
tools_by_name = {tool.name: tool for tool in tools}
model_with_tools = llm.bind_tools(tools)
def call_llm(state: MessagesState):
    # print("state['messages']:",state['messages'])
    return {"messages": [model_with_tools.invoke([state['messages'][-1],])]}

def retrieve_evidence(state: AgentState):
    result = []
    for tool_call in state["messages"][-1].tool_calls:
        tool = tools_by_name[tool_call["name"]]
        print(tool)
        observation = tool.invoke(tool_call["args"])
        result.append(ToolMessage(content=observation, tool_call_id=tool_call["id"]))
    return {"messages": result}
```

or 

```python
# both together in single function
    response = model_with_tools.invoke(
        [{"role": "user", "content": prompt}]
    )
    if not response.tool_calls:
        return {
            "evidence": "",
            "messages": [response]
        }
    evidence_texts = []
    for tool_call in response.tool_calls: 
# direct from llm :  response.tools or 
# if checking from messages of state variablel: if isinstance(lastmes, AIMessage): use lastmes.tool_calls
        tool = tools_by_name[tool_call["name"]]
        observation = tool.invoke(tool_call["args"])
        evidence_texts.append(str(observation)) # or we can send to message like : result.append(ToolMessage(content=observation, tool_call_id=tool_call["id"]))
    final_evidence = "\n".join(evidence_texts)
    return {
        "evidence": final_evidence,
        "messages": [response]
    }
```

Meaning:

```
LLM suggests tools
YOU decide how and when to run them
Maximum control, more code
```

Used when:

```
Custom logic
Validation
Multi-tool orchestration
Learning internals
```

#### 2. ToolNode + tools_condition (LangGraph-managed)

LangGraph checks whether the LLM requested a tool and routes automatically.

```python
tools = [climate_data_tool, general_facts_tool]
model_with_tools = llm.bind_tools(tools)
graph.add_node("tools", ToolNode(tools))
graph.add_conditional_edges(
    "llm",
    tools_condition,
    {"tools": "tools", "end": END}
)
```

Meaning:

```
LLM decides
LangGraph executes tools
Minimal boilerplate
```

Used when:

```
Clean agent graphs
Standard tool usage
You don't need custom control
```

#### 3. direct calling as a function

```python
if ct == "Environmental":
    result = climate_data_tool.invoke({"query": claim})
else:
    result = general_fact_tool.invoke({"query": claim})}
```

#### 4. extra way is using create react agent

### Tool Calls Location
**Point 29**: Tool calls location depends on where you read from.

```
1) Direct LLM call (outside graph)
   response = model_with_tools.invoke(...)
   → use response.tool_calls
```

```
2) Inside graph (reading from state["messages"])
   last_msg = state["messages"][-1]

   if isinstance(last_msg, AIMessage):
       last_msg.tool_calls        # model asking to call tools
```

```
3) Tool execution result
   if isinstance(last_msg, ToolMessage):
       last_msg.content           # tool output (NOT tool_calls)
```

```
AIMessage  → tool_calls
ToolMessage → content
```

### Tool Arguments
**Point 30**: Here is the **5-line mental note**, clean and save-worthy:

1. When you use

```python
model_with_tools = llm.bind_tools(tools)
```

the **LLM is allowed to decide tool + arguments**.

2. The LLM internally produces something like:

```python
{"name": "general_fact_tool", "args": {"query": claim}}
```

3. That's why `tool_call["args"]` already contains `query` — **you didn't lose it**.

4. This line actually passes the query:

```python
tool.invoke(tool_call["args"])
```

5. Rule to remember:

```
Manual tool call → you pass args
LLM tool call    → model passes args
```

### Graph vs Node Tool Control
**Point 31**: 

**Graph-driven tool calling (graph controls tools)**

```python
tools = [search_tool]
graph.add_node("llm", call_llm)
graph.add_node("tools", ToolNode(tools))

graph.add_conditional_edges(
    "llm",
    tools_condition,
    {"tools": "tools", "end": END}
)
```

**What happens**
LLM returns `tool_calls` → graph inspects → routes to ToolNode → can loop again.

**Use when**
Agent planning, retries, multi-tool chains.

**Node-driven tool calling (node controls tools)**

```python
model = llm.bind_tools([search_tool])

def retrieve(state):
    msg = model.invoke([state["messages"][-1]])
    for tc in msg.tool_calls:
        tool = tools_by_name[tc["name"]]
        obs = tool.invoke(tc["args"])
    return {"evidence": obs}
```

**What happens**
Node calls LLM → LLM calls tool → node executes tool → graph moves on.

**Use when**
Verification, fact-check, moderation, human-review pipelines.

**One-line memory hook**

```
Graph decides → tools_condition needed
Node decides  → tools_condition not needed
```

---

## 7. MEMORY & PERSISTENCE

### Memory Types
**Point 8**: reducers & reducres with stream in chatbot is dont remeber the history but it remember only single converstoin vs run time external memory vs database external memory

### Thread Management
**Point 22**: The observation is correct: calling graph.stream() with only a new input dictionary {'messages': ('user', user_input)} for each turn, without providing a config containing a thread_id, will result in a new, stateless execution every time. The previous state accumulated by the StateGraph is saved to a "checkpoint" tied to a specific thread_id in a checkpointer, but it is not automatically reloaded without that thread_id. 

- Reducers (like add_messages for a messages list in the state) solve the "single run append problem" by defining how new data is merged into the existing state within a single, continuous graph execution. However, they do not inherently handle the persistence and retrieval of that state across separate invocations (multiple calls to stream() or invoke()).

### InMemoryStore
**Point 23**: Think of InMemoryStore as a nested dictionary where the first level is the namespace (who + category), the second level is the item key, and the value is the stored data.

```
store = {
    ("user_42", "memories"): {
        "m1": {"text": "I like Python"},
        "m2": {"text": "Working on LangGraph"},
        "m3": {"text": "Prefers short answers"}
    },
    ("user_42", "summaries"): {
        "s1": {"summary": "User is a CS student"},
        "s2": {"summary": "Interested in AI workflows"}
    },
    ("user_99", "memories"): {
        "m1": {"text": "New user joined today"} # here it replaced with new memory
    }
}
```
   
**Namespace rules to memorize (InMemoryStore):**
1. A namespace is NOT mandatory to be a tuple; any hashable value is allowed.
2. Tuple namespaces are best practice because they encode multiple dimensions (who + category).
3. Keys must be unique only inside the same namespace; same keys across namespaces are safe.
4. Same key + same namespace overwrites the old value.
5. Namespace defines grouping and isolation; key defines the specific item.
6. Poor namespace design causes mixed data and accidental overwrites.

**Important store rule (must memorize):** `store.get()` does NOT return the raw value; it returns an Item wrapper, so you must access `.value` before using it like a dict, otherwise you'll get `TypeError: 'Item' object is not subscriptable`.

```python
item = store.get((user_id, "learning_profile"), "current")
profile = item.value if item else {
    "goals": [],
    "completed": [],
    "last_seen": None
}

Wrong pattern:
profile = store.get((user_id, "learning_profile"), "current")   # returns Item, not dict

Right pattern:
profile = store.get(...).value                                  # actual stored data
```

**Patterns (like habits or emotions)** are remembered across chats because they are stored using a stable namespace (user + category), the namespace ensures the memory belongs to the same user and pattern type(where habits are notted), Keys in InMemoryStore are often strings (not numbers) because uniqueness is only one requirement; stability, composability, and cross-system safety matter more than numeric order.

```
("user_42","habits")["night_owl"] = {
    "evidence": ["messages after midnight", "late coding sessions"],
    "confidence": 0.87
}
```

**why keys are acutally strings not number:**
- Keys must be hashable, stable, and serializable
- Strings survive restarts, logging, JSON, and debugging cleanly
- Strings can encode meaning (type, time, source, version)
- Numbers alone carry no semantic context

### SQLite Persistence
**Point 24**: to make long term memory we use `InmemoryStore` and for the shorttermmemory we use `MemorySaver` and both to be persistent we use :

```python
import sqlite3
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.store.sqlite import SQLiteStore
conn = sqlite3.connect("checkpoints.db")
checkpointer = SqliteSaver(conn)

store = SQLiteStore("memory.db")
```

- If SQLite throws "objects created in a thread can only be used in that same thread", open the connection with check_same_thread=False.

**Point 25**: Logic: LangGraph executes node code where store reads/writes can happen many times, but checkpointing is a single automatic snapshot taken after the node finishes.

```
LangGraph × SQLite compatibility:
SQLite starts implicit transactions by default.
LangGraph Store explicitly calls BEGIN / COMMIT.
If SQLite already started a transaction, BEGIN after BEGIN causes errors.
```

```
Parameters:

Store (SqliteStore):
- check_same_thread=False
- isolation_level=None      # disable implicit BEGIN

Checkpoint (SqliteSaver):
- check_same_thread=False
- isolation_level=None NOT needed
```

```
Why isolation_level=None is not needed for checkpoints:
Checkpointing writes once per step,
does not nest BEGIN calls,
and works safely with SQLite defaults.
```

```
Why the store needs it:
Store may write multiple times per node,
explicitly manages BEGIN / COMMIT,
and must avoid BEGIN-after-BEGIN conflicts.
```

```
Rule to memorize:
If LangGraph controls BEGIN, SQLite must not auto-BEGIN.
```

```python
conn_store = sqlite3.connect(
"store.db",
check_same_thread=False,
isolation_level=None
)

conn_store.execute("PRAGMA journal_mode=WAL;")
conn_store.execute("PRAGMA synchronous=NORMAL;")
```

- here is the code of something
    ```python
    user_id = config["configurable"]["user_id"]
    item = store.get((user_id, "learning_profile"), "current")
    profile = item.value if item else {
        "goals": [],
        "completed": [],
        "last_seen": None } # here we can sipmly store {"text":""} but here to be specific we are using the like this 
    ```

---

## 8. TIME TRAVEL & STATE HISTORY

### State Overwrite
**Point 32**: Here's the **combined one-point markdown note**, tight and exam-friendly.

• **State time-travel + overwrite execution**
You can jump to any past checkpoint, overwrite part of the state as if a node just ran, and then continue the graph from there.

```python
selected_state = history[1]

app.update_state(
    selected_state.config,
    values={"summary": "mahesh babu is smartest person in the room"},
    as_node="generate_summary"
)

result = app.invoke(None, selected_state.config)
print(result["summary"])
```

### Branching
**Point 33**: Here's the **same note extended with branching**, still clean and minimal.

• **State time-travel + overwrite + branching**
You can rewind to a past checkpoint, clone it, explore an alternative path, and keep the original untouched.

```python
# go back in time
selected_state = history[1]

# branch 1: overwrite and continue normally
app.update_state(
    selected_state.config,
    values={"summary": "mahesh babu is smartest person in the room"},
    as_node="generate_summary"
)
result1 = app.invoke(None, selected_state.config)

# branch 2: create an alternative branch
branch_state = selected_state.values.copy()
branch_state["summary"] = "alternative opinion generated"

result2 = app.invoke(branch_state, selected_state.config)
```

**Mental model**
`get_state_history` = rewind
`update_state` = rewrite one timeline
`copy + invoke` = create a parallel timeline

This is LangGraph's built-in *time travel + multiverse debugging*.

---

## 9. VALIDATION & ERROR HANDLING

**Point 11**: `raise ValueError(f"Validation failed: Age '{age}' must be an integer between 18 and 99.")`
can be used for normal node type but for explicilty mention of validation node we should use below

- Forcing a specific tool choice is often used interchangeably with LangChain's with_structured_output method, which guarantees the model returns data matching a specific schema, built atop the tool-calling infrastructure.

---

## 10. PROMPTING & FORMATTING

**Point 14**: we can write prompt like this    
```python
prompt = f"""your are a scorer of the given text {state["refined"] if state.get("refined") else state['summarized']} in the metric of how good is it written.ONLY RETURN ANSWER IN INTEGER IN BETWEEN 1 TO 10. again i am saying please remeber only in between 1 and 10 any single number okay"""
```

```python
prompt = f"you are appreciating the agent of {state['first_type']} of this text work it have done {state[state['first_type']]}"
```

---

## 11. FUNCTION SIGNATURES & PARAMETERS

**Point 19**: the function signature `def chat(state: MessagesState, *, store: BaseStore) -> dict:` the `*` means **everything after it is keyword-only**, so `store` must be passed explicitly and cannot be positional.

```python
chat(state, store=store)   # valid
chat(state, store)         # invalid
```

---

## 12. UTILITY & HELPERS

**Point 12**: json.load() expects a file. You have a string. Fix: Use json.loads(response.content). Note the s.

---

## 13. SUBGRAPHS

**Point 35**: **Invoke a graph from a node**: Subgraphs are called within a node of the parent graph.

## Complete LangGraph Key Points - Final Notes

**Question 2: What happens when you resume a graph after an interrupt()?**
- ✓ **The graph resumes from the next node**

**Question 3: What type of data can be passed to the interrupt() function?**
- ✓ **Any JSON-serializable value including strings, numbers, lists, and dictionaries**

**Question 5: Common strategy to manage short-term memory in LangGraph?**
- ✓ **Trimming or summarizing older messages**

**Question 8: Role of namespace and key in long-term memory?**
- ✓ **They organize and retrieve stored data**

**Question 9: How to enable both short-term and long-term memory?**
- ✓ **Combine a checkpointer and a store during graph compilation**

**Question 12: Which memory stores all messages in a conversation?**
- The correct answer would be **EntityMemory** or similar comprehensive memory type

**Question 16: How does the supervisor decide which agent to invoke?**
- ✓ **It analyzes the input context and uses prompt-based reasoning**

**Question 18: AWS role for clearing CDN cache?**
- ✓ **saml.awsprodfw.role.CloudFrontPurge**

**Question 19: Key feature of LangGraph?**
- ✓ **Human-in-the-loop integration**

**Question 21: Best combination for multi-agent system with modular interaction and fallback?**
- ✓ **Subgraphs + Streaming API + Human-in-the-loop API**

**Question 22: How does Pregel-inspired execution model enhance agentic workflows?**
- ✓ **It enables each node to update its state based on incoming messages from connected nodes in supersteps**

---

## Additional Important Concepts

### **Tool Conditions & Routing:**
- ✓ Tool conditions must have a default route set, otherwise the graph will END
- ✓ Always define default path and explicit END node in conditional edges
- ✓ Without proper routing, missing conditions cause automatic graph termination

### **LLM with Tools - Critical Understanding:**
- ✓ **LLM with bound tools only REQUESTS tool calls** - it does NOT execute them
- ✓ **ToolNode is mandatory** to actually execute tools and get real results
- ✓ Without ToolNode, LLM returns tool_calls but no actual data/answer
- ✓ **Workflow**: LLM requests → ToolNode executes → Process results
- ✓ **You cannot skip ToolNode** - either use ToolNode or manually execute tools
- ✓ LLM cannot return tool results directly without execution

### **Flow Control After Tool Execution:**
- ✓ **Add edge from "tools" node** to continue graph flow after tool execution
- ✓ Use `workflow.add_edge("tools", "next_node")` to flow to any custom node
- ✓ Can skip going back to agent entirely if not needed
- ✓ Can chain multiple processing nodes: tools → processor → validator → formatter → END
- ✓ Can use conditional routing after tools based on tool results
- ✓ **Without edge from tools**: Graph will end after tool execution
- ✓ Most common pattern: `workflow.add_edge("tools", "agent")` loops back for LLM to format answer

### **Built-in `tools_condition` Function:**
- ✓ **Import**: `from langgraph.prebuilt import tools_condition`
- ✓ **Purpose**: Built-in LangGraph function for automatic tool routing
- ✓ **Automatic routing**: tool_calls exist → "tools" node, no tool_calls → END (or default)
- ✓ **Requirement**: Node must be named exactly "tools" when using built-in
- ✓ **Simpler syntax**: No need to write custom routing function or mapping dict
- ✓ **Cannot customize node names**: If you need custom names, write your own routing function

### **`default` Parameter in `tools_condition`:**
- ✓ **Purpose**: Specifies where to route when NO tool calls are made by agent
- ✓ **Default behavior** (without `default`): routes to END (graph stops)
- ✓ **Custom behavior** (with `default="node"`): routes to specified node (graph continues)
- ✓ **Syntax**: `workflow.add_conditional_edges("agent", tools_condition, default="processor")`
- ✓ **Prevents premature ending**: Allows workflow continuation even when tools aren't needed
- ✓ **Common use cases**: Route to final processor, another agent, validator, or output handler
- ✓ **Key difference**: Without default → END, With default → continues to specified node
- ✓ Must specify valid node name that exists in your graph

### **Complete Routing Pattern:**
```python
# Built-in tools_condition handles: agent → tools/default
workflow.add_conditional_edges("agent", tools_condition, default="processor")

# You handle: tools → next_node
workflow.add_edge("tools", "your_next_node")
```

### **Flow Control Summary:**
- ✓ **Direct edge**: `add_edge("from", "to")` - no condition needed
- ✓ **Conditional edge**: `add_conditional_edges("from", function, mapping)` - dynamic routing
- ✓ **After tools**: Always add edge to continue flow or graph ends
- ✓ **Default parameter**: Prevents END when no tool calls, continues to specified node

---
---

# 📘 Complete LangGraph Master Notes

*Your comprehensive guide from theory to implementation*

---

## TABLE OF CONTENTS

**PART 1: THEORY & CONCEPTS**
1. [Introduction & Foundation](#1-introduction--foundation)
2. [Architecture Deep Dive](#2-architecture-deep-dive)
3. [State Management Mastery](#3-state-management-mastery)
4. [Nodes Explained](#4-nodes-explained)
5. [Edges & Routing](#5-edges--routing)
6. [Graph Types](#6-graph-types)
7. [Messages & Communication](#7-messages--communication)
8. [Agent Patterns](#8-agent-patterns)
9. [Memory Systems](#9-memory-systems)
10. [Advanced Features](#10-advanced-features)

**PART 2: PRACTICAL CODE EXAMPLES**
11. [Complete Code Examples](#11-complete-code-examples)
12. [Quick Reference & Cheat Sheets](#12-quick-reference--cheat-sheets)
13. [Troubleshooting & Best Practices](#13-troubleshooting--best-practices)

---

# PART 1: THEORY & CONCEPTS

## 1. INTRODUCTION & FOUNDATION

### What is LangGraph?

**LangGraph is a powerful orchestration framework** designed to build **stateful, agentic, and composable AI workflows**. It's a Python framework that extends LangChain by introducing **graph-based orchestration**.

Think of it as: **Excel formulas (LangChain) → Visual workflow builder (LangGraph)**

### The Problem LangGraph Solves

**Traditional LLM Pipelines Are Limited:**
- ❌ Stateless and linear - no memory between calls
- ❌ Cannot handle complex decision trees
- ❌ No way to loop back for refinement
- ❌ Difficult to add human oversight
- ❌ Can't parallelize operations

**Real-World Applications Need:**
- ✅ **Memory** - Context across conversation turns
- ✅ **Decision-making** - Choose paths based on results
- ✅ **Tool usage** - Call APIs, databases, functions
- ✅ **Human-in-the-loop** - Escalate when uncertain
- ✅ **Persistence** - Save and resume workflows
- ✅ **Streaming** - Real-time user feedback
- ✅ **Loops** - Iterative refinement
- ✅ **Parallelization** - Run multiple tasks simultaneously

### Why "Graph"?

LangGraph uses a **graph structure** where:
- **Nodes** = Actions/Functions (what to do)
- **Edges** = Transitions (what to do next)
- **State** = Data flowing through the graph

```
[User Input] → [Classify Intent] → [Call Weather API] → [Generate Response]
     ↓              ↓                      ↓                    ↓
   Node 1        Node 2                Node 3              Node 4
```

### Core Philosophy: Balance Agency and Reliability

LangGraph solves: **"How do we give LLMs autonomy without losing control?"**

**The Solution:**
1. **Graph-based orchestration** - Structured control flow
2. **State management** - Maintains context for consistency
3. **Human-in-the-loop** - Oversight for critical decisions
4. **Conditional routing** - Dynamic but predictable branching

---

## 🎯 CRITICAL CONCEPTS (MUST MEMORIZE)

### The 5 Pillars of LangGraph

#### 1. STATE
**What:** Shared data structure holding the current "snapshot"
**Contains:** Messages, context, flags, partial results, counters
**Key Point:** State is **passed between nodes** and **updated over time**

**Analogy:** State is like a package being passed through postal stations - each station reads it, adds information, and sends it forward.

#### 2. NODES  
**What:** Functions that receive state, perform operations, return updates
**Types:** LLM calls, tool invocations, logic functions, human input
**Key Point:** Each node has **one clear responsibility**

**Analogy:** Nodes are workers on an assembly line - each does their specific job.

#### 3. EDGES
**What:** Define transitions between nodes
**Types:** 
- **Fixed** - Always go from A to B
- **Conditional** - Route based on state
**Key Point:** Edges control the **flow of execution**

**Analogy:** Edges are roads connecting cities - some are direct highways, others are intersections with traffic signals deciding which way to go.

#### 4. GRAPH EXECUTION
**How it works:** State travels through nodes, accumulating context
**Benefits:** Memory, persistence, debuggability
**Key Point:** The graph is your **workflow blueprint**

#### 5. LOOPS & CONDITIONALS
**Loops:** Allow iterative refinement (re-asking for details)
**Conditionals:** Enable dynamic branching (if X then Y)
**Key Point:** Makes workflows **adaptive** instead of rigid

---

### Key Mechanisms Explained

#### Graph-based Orchestration
- **Nodes** and **edges** structure the workflow
- Allows **both linear flows and complex branching**
- Each node sees the current state
- State accumulates context like a snowball rolling downhill

#### Memory and State Management
- State **persists across nodes**
- Maintains conversation history
- Tracks progress through workflow
- Enables **context-aware decisions**

#### Human-in-the-Loop
When automation reaches its limit, LangGraph can:
- **Pause execution** for human review
- **Pass full interaction history** to the human
- **Resume** after human provides input

---

## 2. ARCHITECTURE DEEP DIVE

### LangGraph's Three-Layer Architecture

LangGraph can be visualized as three distinct layers:

```
┌──────────────────────────────────────────────┐
│   GRAPH DEFINITION LAYER                     │
│   (What to do - StateGraph API)              │
├──────────────────────────────────────────────┤
│   EXECUTION LAYER                            │
│   (How to do it - Pregel Engine)             │
├──────────────────────────────────────────────┤
│   STATE MANAGEMENT LAYER                     │
│   (Remember & persist - Channels, Reducers)  │
└──────────────────────────────────────────────┘
```

### Layer A) Graph Definition Layer

**Purpose:** Define the workflow structure

**Components:**
- **StateGraph API** - Your interface to build graphs
- **Nodes** - Functions representing tasks (LLM calls, tools, logic)
- **Edges** - Transitions between nodes (static and conditional)

**Example Structure:**
```
START → Analyze Input → Decision Point
                          ├→ Call Weather Tool → Generate Response → END
                          └→ Call Database → Generate Response → END
```

**What You Define:**
- State schema (what data flows through)
- Node functions (what each step does)
- Edge logic (how to move between steps)

### Layer B) Execution Layer

**Purpose:** Run the workflow efficiently and reliably

**Key Component: Pregel Engine**
- Named after Google's graph processing system
- Implements **super-step execution model**
- Enables **parallelism** - multiple nodes run simultaneously
- Provides **fault tolerance** - can survive crashes

**What It Handles:**
- Parallel node execution (when nodes don't depend on each other)
- State updates and merging
- Checkpointing for recovery
- Retries and error handling
- Resource management

**Example:**
```
     ┌→ Tool 1 (runs in parallel) ┐
Start┼→ Tool 2 (runs in parallel) ┼→ Combine Results → End
     └→ Tool 3 (runs in parallel) ┘
     
All 3 tools execute simultaneously, results merged before next step
```

### Layer C) State Management Layer

**Purpose:** Maintain and share data across the workflow

**Components:**

1. **Channels** - Named pathways for state data
2. **Reducers** - Functions defining how state updates merge
3. **Checkpointing** - Automatic state snapshots for recovery

**Supports:**
- **Short-term memory** - Session-level (current conversation)
- **Long-term memory** - Cross-session (user preferences, history)

**Checkpointing Benefits:**
- Resume interrupted workflows
- "Time travel" - inspect any previous state
- Debug by replaying execution
- Implement undo/redo functionality

---

### How the Layers Work Together

**Scenario:** Customer service chatbot

1. **Graph Definition Layer:** You design the flow
   - Node 1: Classify customer intent
   - Node 2: Search knowledge base  
   - Node 3: Generate response
   - Node 4: Check if satisfied

2. **Execution Layer:** Pregel Engine runs it
   - Executes nodes in order
   - If Node 2 takes long, it doesn't block other operations
   - Saves checkpoint after each node

3. **State Management Layer:** Tracks everything
   - Stores conversation history
   - Remembers customer info
   - Saves checkpoints for recovery

---

## 3. STATE MANAGEMENT MASTERY

### What is State?

**Definition:** A shared data structure (typically a TypedDict) that holds the current "snapshot" of your application.

**Contains:**
- Conversation messages
- User context
- Intermediate results
- Flags and counters
- Tool outputs
- Decision tracking

**Flow:**
```
Initial State → [Node 1] → Updated State → [Node 2] → Updated State → ...
```

### Why State Matters (Critical Understanding)

**Without State:**
```
User: "What's the weather?"
Bot: "The weather in New York is sunny"
User: "What about tomorrow?"
Bot: "What location?" ❌ (No memory)
```

**With State:**
```
State = {messages: [...], location: "New York"}

User: "What's the weather?"
Bot: "The weather in New York is sunny"
User: "What about tomorrow?"
Bot: "Tomorrow in New York will be cloudy" ✅ (Remembers location)
```

### State Type Options

#### Option 1: TypedDict (Basic & Clear)

Simple dictionary with type annotations:

```python
from typing import TypedDict

class AgentState(TypedDict):
    messages: list           # Conversation history
    user_input: str         # Current query
    next_step: str          # Routing decision
    tool_results: dict      # Tool outputs
    iteration_count: int    # Loop counter
    final_answer: str       # Response to user
```

**Use when:**
- You need straightforward state
- No special merge logic required
- State updates replace previous values

#### Option 2: Annotated with Reducers (Advanced)

Control how state updates are merged:

```python
from typing import Annotated, TypedDict
import operator

class AdvancedState(TypedDict):
    # Append to list instead of replacing
    messages: Annotated[list, operator.add]
    
    # Sum values instead of replacing
    counter: Annotated[int, operator.add]
    
    # Replace entirely (default behavior)
    metadata: dict
```

**Use when:**
- Multiple nodes might update same field
- You need custom merge logic
- Want to accumulate values (lists, sums)

#### Option 3: MessagesState (Built-in for Chat)

Pre-configured state for conversational AI:

```python
from langgraph.graph import MessagesState

class MyState(MessagesState):
    # Automatically includes:
    # messages: Annotated[list, add_messages]
    
    # Add your custom fields:
    user_name: str
    session_id: str
    preferences: dict
```

**Use when:**
- Building chatbots or conversational agents
- Want message handling out-of-the-box
- Need automatic message ID tracking

### Understanding Reducers

**What are reducers?**
Functions that determine how to **merge state updates** when nodes return partial state.

**Common Reducers:**

**1. `operator.add` - For lists and numbers**
```python
# Current state: {"items": [1, 2]}
# Node returns: {"items": [3, 4]}
# Result: {"items": [1, 2, 3, 4]}  ← Appended!

# Current state: {"count": 5}
# Node returns: {"count": 3}
# Result: {"count": 8}  ← Summed!
```

**2. `add_messages` - Smart message merging**
```python
from langgraph.graph.message import add_messages

# Handles:
# - Appending new messages
# - Updating existing messages by ID
# - Proper tool call tracking
# - Message deduplication
```

**3. Custom Reducers - Your own logic**
```python
def merge_dicts(existing: dict, new: dict) -> dict:
    """Deep merge dictionaries"""
    result = existing.copy()
    result.update(new)
    return result

class CustomState(TypedDict):
    config: Annotated[dict, merge_dicts]
```

### State Update Patterns

#### Pattern 1: Partial Updates (Most Common)

Nodes only return fields they want to update:

```python
def my_node(state: AgentState) -> dict:
    # Only update iteration_count
    return {"iteration_count": state["iteration_count"] + 1}
    # Other fields remain unchanged
```

#### Pattern 2: Full State Return

Return complete state (less common):

```python
def my_node(state: AgentState) -> AgentState:
    state["field1"] = "new value"
    state["field2"] = 42
    return state
```

#### Pattern 3: Conditional Updates

Update different fields based on logic:

```python
def conditional_node(state: AgentState) -> dict:
    if state["score"] > 0.8:
        return {"status": "approved", "confidence": "high"}
    else:
        return {"status": "needs_review", "confidence": "low"}
```

### State Lifecycle

```
1. Initial State Created
   ↓
2. Node 1 receives state
   ↓
3. Node 1 returns updates
   ↓
4. Reducer merges updates → New state version
   ↓
5. Checkpoint saved (if enabled)
   ↓
6. Node 2 receives updated state
   ↓
7. ... cycle continues ...
   ↓
8. Final state returned
```

### State Best Practices

✅ **Keep state minimal** - Only include what you need
✅ **Use TypedDict** - Get type checking and autocomplete
✅ **Document fields** - Add comments explaining purpose
✅ **Choose right reducer** - Match merge behavior to needs
✅ **Avoid nested complexity** - Flat structures are easier
✅ **Version your schema** - Plan for changes over time

❌ **Don't store functions** - State should be serializable
❌ **Don't put secrets** - State may be logged/checkpointed
❌ **Don't use mutable defaults** - Use None and initialize

---

## 4. NODES EXPLAINED

### What are Nodes?

**Definition:** Functions (or units of logic) that:
1. Receive the current state
2. Perform some operation
3. Return updated state (or side-effects)

**Signature:**
```python
def my_node(state: StateType) -> dict:
    # Do something
    return {"field": "updated_value"}
```

### Node Types in Detail

#### Type 1: LLM Nodes

Call language models for reasoning, generation, or decision-making:

```python
from langchain_openai import ChatOpenAI

def llm_node(state: AgentState) -> dict:
    llm = ChatOpenAI(model="gpt-4")
    
    # Use state to build prompt
    messages = state["messages"]
    
    # Get response
    response = llm.invoke(messages)
    
    # Return state update
    return {"messages": [response]}
```

**Common uses:**
- Generate responses
- Classify intent
- Make decisions
- Summarize content

#### Type 2: Tool Nodes

Execute external functions or API calls:

```python
def search_node(state: AgentState) -> dict:
    query = state["search_query"]
    
    # Call external API
    results = search_api(query)
    
    return {
        "search_results": results,
        "has_results": len(results) > 0
    }
```

**Common uses:**
- Web search
- Database queries
- API calls
- File operations
- Calculations

#### Type 3: Logic Nodes

Pure Python logic for transformations or validations:

```python
def validation_node(state: AgentState) -> dict:
    user_input = state["user_input"]
    
    # Validation logic
    is_valid = len(user_input) >= 10 and "@" in user_input
    
    if is_valid:
        return {"is_valid": True, "error": None}
    else:
        return {"is_valid": False, "error": "Invalid input format"}
```

**Common uses:**
- Data validation
- Formatting/parsing
- Business logic
- Calculations
- Filtering

#### Type 4: Routing Nodes

Make decisions about where to go next:

```python
def router_node(state: AgentState) -> dict:
    intent = classify_intent(state["user_input"])
    
    return {
        "intent": intent,
        "route_to": intent  # Used by conditional edge
    }
```

**Common uses:**
- Intent classification
- Confidence checking
- Priority routing
- Load balancing

#### Type 5: Human-in-the-Loop Nodes

Pause for human input or approval:

```python
def human_review_node(state: AgentState) -> dict:
    # Mark as needing review
    # Actual implementation depends on your UI
    return {
        "status": "pending_review",
        "review_data": state["draft_response"]
    }
```

**Common uses:**
- Approval workflows
- Content moderation
- Quality review
- Edge case handling

### Node Best Practices

#### ✅ DO:

**1. Single Responsibility**
```python
# Good - focused purpose
def extract_email(state):
    return {"email": parse_email(state["input"])}

# Bad - doing too much
def do_everything(state):
    email = parse_email(state["input"])
    weather = get_weather()
    db_data = query_database()
    # ... too much!
```

**2. Return Partial State**
```python
# Good - only update what changed
def increment(state):
    return {"counter": state["counter"] + 1}

# Bad - returning full state unnecessarily
def increment(state):
    return {
        "counter": state["counter"] + 1,
        "messages": state["messages"],  # Unnecessary
        "user": state["user"],          # Unnecessary
        # ...
    }
```

**3. Handle Errors Gracefully**
```python
def robust_node(state):
    try:
        result = risky_operation()
        return {"result": result, "error": None}
    except Exception as e:
        return {"result": None, "error": str(e)}
```

**4. Add Logging**
```python
import logging

def logged_node(state):
    logging.info(f"Processing with state: {state['id']}")
    result = process(state)
    logging.info(f"Completed: {result}")
    return {"result": result}
```

#### ❌ DON'T:

**1. Modify State Directly**
```python
# Bad - mutating state
def bad_node(state):
    state["field"] = "new"  # ❌ Don't do this
    return state

# Good - return updates
def good_node(state):
    return {"field": "new"}  # ✅ Do this
```

**2. Have Side Effects Without Tracking**
```python
# Bad - hidden side effect
def bad_node(state):
    send_email()  # No record of this
    return {}

# Good - track side effects
def good_node(state):
    email_sent = send_email()
    return {"email_sent": email_sent, "timestamp": now()}
```

**3. Make Nodes Too Complex**
```python
# Bad - node is too large
def massive_node(state):
    # 200 lines of code...
    pass

# Good - break into smaller nodes
def node1(state):
    # 20 lines
    pass

def node2(state):
    # 20 lines  
    pass
```

---

## 5. EDGES & ROUTING

### What are Edges?

**Definition:** Define the transitions between nodes - the "roads" connecting your workflow steps.

**Purpose:** Control the flow of execution - what happens after each node completes.

### Edge Types

#### Type 1: Fixed Edges (Static Routing)

**Always** go from Node A to Node B:

```python
graph.add_edge("node_a", "node_b")
# After node_a completes, always run node_b next
```

**Visual:**
```
Node A ──────→ Node B
      (always)
```

**Use when:**
- Next step is always the same
- Linear workflow sections
- No decision needed

**Example:**
```python
graph.add_edge(START, "validate_input")
graph.add_edge("validate_input", "process_data")
graph.add_edge("process_data", "save_results")
graph.add_edge("save_results", END)
```

#### Type 2: Conditional Edges (Dynamic Routing)

Route based on state - enables **branching logic**:

```python
def router(state: AgentState) -> str:
    """Decide which node to go to next"""
    if state["confidence"] > 0.9:
        return "auto_approve"
    elif state["confidence"] > 0.5:
        return "human_review"
    else:
        return "reject"

graph.add_conditional_edges(
    "decision_node",      # From this node
    router,               # Use this function to decide
    {                     # Mapping: router output → actual node name
        "auto_approve": "approval_node",
        "human_review": "review_node",
        "reject": "rejection_node"
    }
)
```

**Visual:**
```
              ┌→ auto_approve (confidence > 0.9)
Decision Node ┼→ human_review (0.5 < confidence ≤ 0.9)
              └→ reject (confidence ≤ 0.5)
```

**Use when:**
- Next step depends on runtime conditions
- Branching logic needed
- Different paths for different scenarios

#### Type 3: START and END (Special Nodes)

**START** - Entry point (pseudo-node, not a real function)
**END** - Terminal node (workflow complete)

```python
from langgraph.graph import START, END

graph.add_edge(START, "first_node")    # Begin execution here
graph.add_edge("final_node", END)       # Workflow complete
```

### Conditional Edge Patterns

#### Pattern 1: Simple Binary Decision

```python
def should_continue(state) -> str:
    if state["count"] < 5:
        return "continue"
    else:
        return "finish"

graph.add_conditional_edges(
    "worker",
    should_continue,
    {
        "continue": "worker",  # Loop back
        "finish": END          # Exit
    }
)
```

**Visual:**
```
     ┌────────────┐
     ↓            │ (count < 5)
  Worker ─────────┘
     │
     └→ END (count ≥ 5)
```

#### Pattern 2: Multi-way Branching

```python
def route_by_intent(state) -> str:
    intent = state["user_intent"]
    return intent  # Returns "weather", "news", or "chat"

graph.add_conditional_edges(
    "classifier",
    route_by_intent,
    {
        "weather": "weather_tool",
        "news": "news_tool",
        "chat": "general_chat",
        "unknown": "clarification"
    }
)
```

**Visual:**
```
                ┌→ weather_tool
                ├→ news_tool
Classifier ─────┼→ general_chat
                └→ clarification
```

#### Pattern 3: Loop with Multiple Exit Conditions

```python
def check_loop_status(state) -> str:
    if state["task_complete"]:
        return "success"
    elif state["iterations"] >= 10:
        return "timeout"
    elif state["error"]:
        return "error"
    else:
        return "continue"

graph.add_conditional_edges(
    "processor",
    check_loop_status,
    {
        "continue": "processor",     # Loop back
        "success": "finalizer",      # Exit with success
        "timeout": "timeout_handler", # Exit with timeout
        "error": "error_handler"     # Exit with error
    }
)
```

#### Pattern 4: Fan-out (Parallel Paths)

```python
# Multiple fixed edges from one node
graph.add_edge("start_parallel", "task_a")
graph.add_edge("start_parallel", "task_b")
graph.add_edge("start_parallel", "task_c")

# All tasks execute in parallel
# Then converge
graph.add_edge("task_a", "combine")
graph.add_edge("task_b", "combine")
graph.add_edge("task_c", "combine")
```

**Visual:**
```
           ┌→ Task A ┐
Start ─────┼→ Task B ┼→ Combine
           └→ Task C ┘
```

### Routing Function Guidelines

**DO:**
```python
# ✅ Clear, explicit logic
def router(state):
    if state["score"] > 0.8:
        return "high_confidence"
    elif state["score"] > 0.5:
        return "medium_confidence"
    else:
        return "low_confidence"
```

**DON'T:**
```python
# ❌ Complex nested logic
def bad_router(state):
    if state.get("field1"):
        if state.get("field2"):
            if random.random() > 0.5:
                return "maybe_this"
            else:
                # ... gets confusing
```

### Edge Best Practices

✅ **Keep routing logic simple** - Easy to understand and debug
✅ **Always handle all cases** - Don't leave paths undefined
✅ **Use meaningful names** - "auto_approve" not "option_1"
✅ **Document complex routing** - Explain the decision logic
✅ **Test edge cases** - What if state is empty/None?

❌ **Don't create infinite loops** - Always have exit conditions
❌ **Don't use random routing** - Unless explicitly needed
❌ **Don't make routing stateful** - Routing should be based on state only

---

## 6. GRAPH TYPES

### StateGraph (Primary - Most Used)

**Definition:** Full-featured graph with custom state schema.

**When to use:**
- You need custom state structure
- Building complex workflows
- Want fine-grained control
- Need multiple data types in state

**Structure:**
```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict

# 1. Define state
class MyState(TypedDict):
    messages: list
    counter: int
    user_data: dict

# 2. Create graph
workflow = StateGraph(MyState)

# 3. Add nodes
workflow.add_node("node1", function1)
workflow.add_node("node2", function2)

# 4. Add edges
workflow.add_edge(START, "node1")
workflow.add_edge("node1", "node2")
workflow.add_edge("node2", END)

# 5. Compile
app = workflow.compile()

# 6. Run
result = app.invoke({
    "messages": [],
    "counter": 0,
    "user_data": {}
})
```

**Pros:**
- Maximum flexibility
- Type safety with TypedDict
- Clear state structure
- Easy to extend

**Cons:**
- More boilerplate
- Need to define state schema

### MessageGraph (Simplified for Chat)

**Definition:** Specialized graph where state is just a list of messages.

**When to use:**
- Building simple chatbots
- Pure conversational AI
- Don't need complex state
- Quick prototypes

**Structure:**
```python
from langgraph.graph import MessageGraph, END
from langchain_core.messages import AIMessage

def chatbot(messages: list) -> list:
    # messages is a list of Message objects
    # Return list of new messages to add
    return [AIMessage(content="Hello!")]

graph = MessageGraph()
graph.add_node("chatbot", chatbot)
graph.add_edge(START, "chatbot")

# Can add conditional edges based on messages
def should_end(messages: list) -> str:
    if len(messages) > 10:
        return "end"
    return "chatbot"

graph.add_conditional_edges(
    "chatbot",
    should_end,
    {"chatbot": "chatbot", "end": END}
)

app = graph.compile()
```

**Pros:**
- Very simple API
- Less boilerplate
- Great for quick chatbots
- Automatic message handling

**Cons:**
- Limited to message data
- Can't track other state
- Less flexible

### Comparison Table

| Feature | StateGraph | MessageGraph |
|---------|-----------|--------------|
| **State Schema** | Custom TypedDict | List of messages (automatic) |
| **Flexibility** | High - any data structure | Low - messages only |
| **Type Safety** | Explicit with TypedDict | Implicit (list) |
| **Use Case** | Complex workflows | Simple chat |
| **Learning Curve** | Moderate | Easy |
| **State Access** | Full control via state dict | Messages list only |
| **Best For** | Production apps, multi-agent | Prototypes, simple bots |
| **Can Track** | Anything | Just conversation |

### When to Choose Which?

**Choose StateGraph if:**
- ✅ You need to track multiple pieces of data
- ✅ Building multi-step workflows
- ✅ Need tool results, flags, counters
- ✅ Want type checking and IDE support
- ✅ Building for production

**Choose MessageGraph if:**
- ✅ Simple chatbot with no extra state
- ✅ Rapid prototyping
- ✅ Learning LangGraph basics
- ✅ Only care about conversation history

### Migration Path

Start with MessageGraph, migrate to StateGraph when you need more:

```python
# Started with MessageGraph
messages = [HumanMessage(content="Hello")]

# Migrate to StateGraph
class UpgradedState(MessagesState):  # Inherits messages
    user_id: str        # Add tracking
    session_data: dict  # Add context
    tool_results: list  # Add tool outputs
```

---

## 7. MESSAGES & COMMUNICATION

### Message System Overview

LangGraph uses **LangChain's message types** for standardized communication between nodes, LLMs, and tools.

**Why standardized messages?**
- Consistent format across all LLMs
- Proper tool call tracking
- Message history management
- Easy debugging and logging

### Message Types Reference

#### 1. SystemMessage

**Purpose:** Set context, instructions, or constraints for the LLM

**When to use:**
- Define agent role/persona
- Provide guidelines
- Set behavior rules
- Give examples

```python
from langchain_core.messages import SystemMessage

SystemMessage(
    content="You are a helpful Python programming assistant. "
            "Always provide code examples and explain your reasoning."
)
```

**Best practices:**
- Put at start of conversation
- Be specific about desired behavior
- Include any constraints
- Can include few-shot examples

#### 2. HumanMessage

**Purpose:** Represent user input

```python
from langchain_core.messages import HumanMessage

HumanMessage(content="What is the weather in San Francisco?")

# Can include additional metadata
HumanMessage(
    content="Explain recursion",
    name="Alice",
    additional_kwargs={"user_id": "123"}
)
```

#### 3. AIMessage

**Purpose:** LLM responses and tool calls

```python
from langchain_core.messages import AIMessage

# Simple text response
AIMessage(content="The weather in San Francisco is sunny, 72°F.")

# Response with tool calls
AIMessage(
    content="",  # Can be empty when using tools
    tool_calls=[
        {
            "id": "call_123",
            "name": "get_weather",
            "args": {"location": "San Francisco"}
        }
    ]
)
```

**Key points:**
- Generated by LLMs
- Can contain both text and tool calls
- Tool calls have unique IDs for tracking

#### 4. ToolMessage

**Purpose:** Results from tool execution

```python
from langchain_core.messages import ToolMessage

ToolMessage(
    content="Temperature: 72°F, Conditions: Sunny",
    tool_call_id="call_123"  # Must match the tool call ID
)
```

**Critical:** The `tool_call_id` must match the ID from the AIMessage that requested the tool.

#### 5. FunctionMessage (Legacy)

**Purpose:** Similar to ToolMessage but older format

```python
from langchain_core.messages import FunctionMessage

FunctionMessage(
    content="Result data",
    name="function_name"
)
```

**Note:** Prefer ToolMessage for new code.

### Message Flow in Action

**Complete cycle example:**

```
1. SystemMessage: "You are a helpful assistant"
2. HumanMessage: "What's the weather in SF?"
3. AIMessage: [tool_call to get_weather]
4. ToolMessage: "72°F, Sunny"
5. AIMessage: "The weather in San Francisco is 72°F and sunny!"
```

### MessagesState Class

**Built-in state class** optimized for message handling:

```python
from langgraph.graph import MessagesState

class MyState(MessagesState):
    # Automatically includes:
    # messages: Annotated[list, add_messages]
    
    # Add your custom fields:
    user_name: str
    session_id: str
    metadata: dict
```

**Benefits:**
- Automatic message list with reducer
- Handles message appending correctly
- Tracks message IDs
- Manages tool call/response pairing

### The add_messages Reducer

**Most important reducer for chat applications.**

**What it does:**
1. Appends new messages to list
2. Updates existing messages by ID
3. Maintains tool call relationships
4. Prevents duplicate messages

**Example:**
```python
# Current state
{"messages": [HumanMessage(content="Hello", id="1")]}

# Node returns
{"messages": [AIMessage(content="Hi!", id="2")]}

# Result (messages appended, not replaced)
{"messages": [
    HumanMessage(content="Hello", id="1"),
    AIMessage(content="Hi!", id="2")
]}

# If same ID is returned, message is UPDATED
{"messages": [AIMessage(content="Hi there!", id="2")]}
# Result: Second message content updated
```

### Message Best Practices

✅ **DO:**
- Use SystemMessage at conversation start
- Keep message content focused
- Use proper message types
- Track tool call IDs correctly
- Include metadata when useful

❌ **DON'T:**
- Mix message formats inconsistently
- Forget to match tool_call_ids
- Put system instructions in HumanMessage
- Manually manage message IDs (let add_messages handle it)

---

## 8. AGENT PATTERNS

### Anatomy of an Agent

Based on the course architecture, an agent consists of:

**6 Core Components:**

1. **LLM Core** - The reasoning engine
   - GPT-4, Claude, Gemini, etc.
   - Does the "thinking"

2. **Prompt Template** - Defines behavior
   - System message with role
   - Instructions and constraints
   - Few-shot examples

3. **Memory Module** - Retains context
   - Short-term: Current conversation
   - Long-term: User preferences, history

4. **Toolset** - External capabilities
   - Search engines
   - Calculators
   - Databases
   - APIs

5. **State** - Current context tracker
   - Messages
   - Variables
   - Flags

6. **Hooks & Transitions** - Control flow
   - Pre-processing
   - Post-processing
   - Routing logic

### Agent Architecture Patterns

#### Pattern 1: ReAct Agent (Reasoning + Acting)

**Concept:** Agent reasons about what to do, then acts, then reasons about results.

**Flow:**
```
Thought → Action → Observation → Thought → Action → ... → Answer
```

**Example thought process:**
```
Thought: "I need to find the weather"
Action: Call weather API
Observation: "72°F, Sunny"
Thought: "Now I can answer"
Action: Generate response
```

**Key features:**
- Iterative problem-solving
- Tool usage based on reasoning
- Self-correcting through observations
- Transparent decision process

**When to use:**
- Complex multi-step tasks
- Need tool usage
- Want explainability
- Tasks requiring verification

#### Pattern 2: Agentic RAG (Retrieval-Augmented Generation)

**Concept:** Agent decides when and what to retrieve.

**Flow:**
```
Query → Analyze → Decide if retrieval needed → Retrieve → Generate
                     ↓
                  No retrieval → Generate directly
```

**Advanced features:**
- Query reformulation
- Multi-hop retrieval
- Source verification
- Context ranking

**When to use:**
- Knowledge-intensive tasks
- Need accurate citations
- Large knowledge bases
- Reducing hallucinations

#### Pattern 3: SQL Agent

**Concept:** Converts natural language to SQL queries.

**Flow:**
```
Question → Understand schema → Generate SQL → Execute → 
Validate results → Refine if needed → Answer
```

**Key features:**
- Schema awareness
- Query validation
- Error recovery
- Result interpretation

**When to use:**
- Database querying
- Analytics requests
- Data exploration
- Business intelligence

#### Pattern 4: Multi-Agent Supervisor

**Concept:** Supervisor delegates to specialized workers.

**Architecture:**
```
                Supervisor
                    ↓
        ┌───────────┼───────────┐
        ↓           ↓           ↓
    Research    Coding      Writing
     Agent      Agent        Agent
        ↓           ↓           ↓
        └───────────┼───────────┘
                    ↓
                Supervisor
               (aggregates)
```

**Key features:**
- Task decomposition
- Specialized expertise
- Parallel execution
- Centralized coordination

**When to use:**
- Complex projects
- Multiple skill sets needed
- Parallel work possible
- Need quality control

### Agent Capabilities Explained

#### 1. Autonomy Levels

**Level 1: Fully Scripted**
- Follows exact steps
- No decisions
- Like traditional code

**Level 2: Conditional**
- Can choose between paths
- Based on rules
- Limited flexibility

**Level 3: Tool-using**
- Decides which tools to use
- Can chain tool calls
- More autonomous

**Level 4: Self-directed**
- Plans own approach
- Adapts to failures
- Highest autonomy

#### 2. Memory

**Short-term (Working Memory):**
- Current conversation
- Recent context
- Session variables

**Long-term (Persistent Memory):**
- User preferences
- Past interactions
- Learned patterns

#### 3. Adaptability

**Feedback loops:**
- Learn from outcomes
- Adjust strategy
- Improve over time

**Error recovery:**
- Detect failures
- Try alternatives
- Escalate if needed

---

## 9. MEMORY SYSTEMS

### Why Memory Matters

**Without memory:**
```
User: "My name is Alice"
Bot: "Nice to meet you!"
User: "What's my name?"
Bot: "I don't know" ❌
```

**With memory:**
```
User: "My name is Alice"
Bot: "Nice to meet you, Alice!"
User: "What's my name?"
Bot: "Your name is Alice" ✅
```

### Memory Types

#### 1. State-Based Memory (Built-in)

**Implementation:** Store directly in state

```python
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user_name: str
    user_preferences: dict
    conversation_summary: str
```

**Pros:**
- Simple and automatic
- Works with checkpointing
- No external dependencies

**Cons:**
- Limited to current session (unless checkpointed)
- Can grow large
- Not queryable

**Best for:**
- Session context
- Recent history
- Temporary data

#### 2. Vector Store Memory (Semantic Search)

**Implementation:** Store embeddings for similarity search

```python
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

# Initialize
vectorstore = Chroma(
    collection_name="user_memories",
    embedding_function=OpenAIEmbeddings()
)

# Store memory
def save_memory(user_id: str, text: str):
    vectorstore.add_texts(
        texts=[text],
        metadatas=[{"user_id": user_id, "timestamp": now()}]
    )

# Retrieve relevant memories
def recall_memory(user_id: str, query: str, k: int = 3):
    results = vectorstore.similarity_search(
        query,
        k=k,
        filter={"user_id": user_id}
    )
    return results
```

**Pros:**
- Semantic search
- Scales to large datasets
- Finds relevant context

**Cons:**
- Requires vector database
- Added complexity
- Embedding costs

**Best for:**
- Large knowledge bases
- Finding relevant past conversations
- Long-term memory

#### 3. Database Memory (Structured Storage)

**Implementation:** Store in relational/document database

```python
import sqlite3

# Store memory
def save_preference(user_id: str, key: str, value: str):
    conn = sqlite3.connect('memory.db')
    conn.execute(
        "INSERT OR REPLACE INTO preferences VALUES (?, ?, ?)",
        (user_id, key, value)
    )
    conn.commit()

# Retrieve memory
def get_preference(user_id: str, key: str):
    conn = sqlite3.connect('memory.db')
    result = conn.execute(
        "SELECT value FROM preferences WHERE user_id=? AND key=?",
        (user_id, key)
    ).fetchone()
    return result[0] if result else None
```

**Pros:**
- Structured queries
- Persistent across sessions
- Easy to update/delete

**Cons:**
- Database management needed
- More setup required

**Best for:**
- User profiles
- Structured data
- Long-term storage

### Memory Management Strategies

#### Strategy 1: Conversation Summarization

**Problem:** Conversations get too long for context window

**Solution:** Periodically summarize

```python
def summarize_if_needed(state: AgentState):
    messages = state["messages"]
    
    if len(messages) > 20:  # Threshold
        # Summarize old messages
        summary = llm.invoke([
            SystemMessage(content="Summarize this conversation"),
            *messages[:-10]  # All but last 10
        ])
        
        # Keep recent + summary
        return {
            "messages": [
                SystemMessage(content=f"Previous context: {summary}"),
                *messages[-10:]  # Last 10 messages
            ]
        }
    
    return {}  # No change needed
```

#### Strategy 2: Selective Memory

**Store only important information:**

```python
def extract_important_facts(state: AgentState):
    """Extract key facts to remember"""
    
    # Use LLM to identify important info
    last_exchange = state["messages"][-2:]
    
    prompt = """Extract any important facts to remember:
    - User preferences
    - Personal information
    - Important decisions
    
    Return as JSON list."""
    
    facts = llm.invoke(prompt + str(last_exchange))
    
    # Store in vector database
    for fact in facts:
        save_to_vectorstore(state["user_id"], fact)
```

#### Strategy 3: Hierarchical Memory

**Different retention periods:**

```python
class HierarchicalMemory:
    def __init__(self):
        self.working_memory = []  # Last few turns
        self.short_term = {}      # Current session
        self.long_term = {}       # Persistent
    
    def remember(self, key, value, level="short_term"):
        if level == "working":
            self.working_memory.append(value)
            if len(self.working_memory) > 10:
                self.working_memory.pop(0)
        elif level == "short_term":
            self.short_term[key] = value
        elif level == "long_term":
            self.long_term[key] = value
            save_to_database(key, value)
```

### Memory Best Practices

✅ **DO:**
- Implement memory cleanup
- Use appropriate storage for each type
- Add timestamps to memories
- Allow users to clear memory
- Index for fast retrieval

❌ **DON'T:**
- Store everything forever
- Mix temporary and permanent data
- Forget about privacy
- Let memory grow unbounded
- Store sensitive data unencrypted

---

## 10. ADVANCED FEATURES

### Feature 1: Checkpointing & Persistence

**What:** Save workflow state at each step

**Benefits:**
1. **Resume interrupted workflows**
2. **Debug by inspecting past states**
3. **"Time travel" through execution**
4. **Implement undo functionality**

**Implementation:**

```python
from langgraph.checkpoint.sqlite import SqliteSaver

# Create checkpointer
memory = SqliteSaver.from_conn_string(":memory:")
# Or use file: SqliteSaver.from_conn_string("checkpoints.db")

# Compile with checkpointing
app = workflow.compile(checkpointer=memory)

# Run with thread_id for tracking
config = {"configurable": {"thread_id": "user-123"}}
result = app.invoke(initial_state, config)

# Get state at any checkpoint
state = app.get_state(config)
print(f"Current state: {state.values}")

# Resume from checkpoint
result = app.invoke(None, config)  # Continues from last checkpoint

# Get all checkpoints (history)
history = app.get_state_history(config)
for state in history:
    print(f"Step: {state.values}")
```

**Use cases:**
- Long-running workflows
- Error recovery
- Debugging
- User session management

### Feature 2: Streaming

**What:** Get real-time updates as workflow executes

**Stream Modes:**

#### Mode 1: "values" - Stream state updates

```python
for chunk in app.stream(initial_state):
    print(chunk)  # Complete state after each node
```

#### Mode 2: "updates" - Stream only changes

```python
for chunk in app.stream(initial_state, stream_mode="updates"):
    print(chunk)  # Only the updates from each node
```

#### Mode 3: "messages" - Stream LLM tokens

```python
for chunk in app.stream(initial_state, stream_mode="messages"):
    print(chunk.content, end="", flush=True)  # Token by token
```

**Example with UI:**

```python
import streamlit as st

# Streamlit chat interface
for event in app.stream({"messages": [user_input]}):
    if "chatbot" in event:
        st.write(event["chatbot"]["messages"][-1].content)
```

**Benefits:**
- Better UX (users see progress)
- Real-time feedback
- Can cancel long operations
- Reduced perceived latency

### Feature 3: Parallelization

**What:** Run multiple nodes simultaneously

**How it works:**
- Pregel engine identifies independent nodes
- Executes them in parallel
- Merges results before next step

**Example:**

```python
# These run in parallel
graph.add_edge(START, "tool1")
graph.add_edge(START, "tool2")
graph.add_edge(START, "tool3")

# Wait for all, then continue
graph.add_edge("tool1", "aggregator")
graph.add_edge("tool2", "aggregator")
graph.add_edge("tool3", "aggregator")
```

**Visual:**
```
           ┌→ Tool1 (parallel) ┐
START ─────┼→ Tool2 (parallel) ┼→ Aggregator → END
           └→ Tool3 (parallel) ┘
```

**Benefits:**
- Faster execution
- Efficient resource use
- Better for multi-tool agents

**Caution:**
- Nodes must be independent
- State updates from parallel nodes are merged
- Consider thread safety

### Feature 4: Subgraphs

**What:** Nest graphs within graphs

**Why:**
- Modularity and reusability
- Cleaner organization
- Easier testing

**Example:**

```python
# Create specialized subgraph
research_subgraph = StateGraph(ResearchState)
research_subgraph.add_node("search", search_node)
research_subgraph.add_node("summarize", summarize_node)
research_subgraph.add_edge("search", "summarize")
compiled_research = research_subgraph.compile()

# Use in main graph
main_graph = StateGraph(MainState)
main_graph.add_node("research_task", compiled_research)
main_graph.add_node("other_task", other_node)
```

**Use cases:**
- Reusable workflows
- Complex multi-stage processes
- Specialized sub-agents
- Team organization

### Feature 5: Human-in-the-Loop

**What:** Pause execution for human input

**Patterns:**

#### Pattern 1: Review and Approve

```python
def needs_approval(state):
    if state["confidence"] < 0.8:
        return "human_review"
    return "auto_proceed"

graph.add_conditional_edges(
    "decision",
    needs_approval,
    {
        "human_review": "wait_node",
        "auto_proceed": "continue_node"
    }
)
```

#### Pattern 2: Interrupt

```python
# Compile with interrupt
app = workflow.compile(
    checkpointer=memory,
    interrupt_before=["human_review"]  # Pause before this node
)

# Run until interrupt
config = {"configurable": {"thread_id": "1"}}
app.invoke(initial_state, config)

# Get state, show to human
state = app.get_state(config)
print("Review this:", state.values)

# Update state with human input
app.update_state(config, {"approved": True})

# Continue
app.invoke(None, config)
```

**Use cases:**
- Content moderation
- High-stakes decisions
- Quality control
- Learning from humans

### Feature 6: Error Handling & Retries

#### Pattern 1: Node-level Try-Catch

```python
def robust_node(state):
    try:
        result = risky_operation(state["data"])
        return {
            "result": result,
            "error": None,
            "status": "success"
        }
    except Exception as e:
        logging.error(f"Error in node: {e}")
        return {
            "result": None,
            "error": str(e),
            "status": "failed"
        }
```

#### Pattern 2: Retry Loop

```python
class RetryState(TypedDict):
    attempts: int
    max_attempts: int
    error: str
    result: any

def should_retry(state):
    if state["error"] and state["attempts"] < state["max_attempts"]:
        return "retry"
    elif state["error"]:
        return "fail"
    else:
        return "success"

graph.add_conditional_edges(
    "processor",
    should_retry,
    {
        "retry": "processor",  # Try again
        "success": "next_step",
        "fail": "error_handler"
    }
)
```

#### Pattern 3: Exponential Backoff

```python
import time

def node_with_backoff(state):
    attempt = state["attempts"]
    
    try:
        result = api_call()
        return {"result": result, "error": None}
    except Exception as e:
        # Exponential backoff: 1s, 2s, 4s, 8s...
        sleep_time = 2 ** attempt
        time.sleep(sleep_time)
        
        return {
            "error": str(e),
            "attempts": attempt + 1
        }
```

---

# PART 2: PRACTICAL CODE EXAMPLES

## 11. COMPLETE CODE EXAMPLES

### Example 1: Simple Linear Chatbot

**Use case:** Basic conversation with no branching

```python
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage

# Initialize LLM
llm = ChatOpenAI(model="gpt-4")

# Define chatbot node
def chatbot(state: MessagesState):
    # Add system message if first turn
    messages = state["messages"]
    if len(messages) == 1:
        messages = [
            SystemMessage(content="You are a helpful assistant."),
            *messages
        ]
    
    response = llm.invoke(messages)
    return {"messages": [response]}

# Build graph
graph = StateGraph(MessagesState)
graph.add_node("chatbot", chatbot)
graph.add_edge(START, "chatbot")
graph.add_edge("chatbot", END)

# Compile
app = graph.compile()

# Run
result = app.invoke({
    "messages": [("user", "Hello! How are you?")]
})

print(result["messages"][-1].content)
```

### Example 2: Intent-Based Routing

**Use case:** Route to different handlers based on user intent

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal
from langchain_openai import ChatOpenAI

class RouterState(TypedDict):
    messages: list
    intent: str
    response: str

# Classify intent
def classify_intent(state: RouterState):
    llm = ChatOpenAI(model="gpt-4")
    
    prompt = f"""Classify the intent of this message.
    Options: weather, news, general_chat, math
    
    Message: {state['messages'][-1]}
    
    Respond with only the intent category."""
    
    intent = llm.invoke(prompt).content.strip().lower()
    return {"intent": intent}

# Handler nodes
def weather_handler(state: RouterState):
    # Mock weather API
    response = "The weather is sunny and 72°F!"
    return {"response": response}

def news_handler(state: RouterState):
    # Mock news API
    response = "Today's top story: LangGraph releases new features!"
    return {"response": response}

def math_handler(state: RouterState):
    # Simple calculator
    try:
        result = eval(state['messages'][-1])
        response = f"Result: {result}"
    except:
        response = "I couldn't calculate that."
    return {"response": response}

def general_chat(state: RouterState):
    llm = ChatOpenAI(model="gpt-4")
    response = llm.invoke(state['messages']).content
    return {"response": response}

# Router function
def route(state: RouterState) -> Literal["weather", "news", "math", "chat"]:
    intent = state["intent"]
    if intent == "weather":
        return "weather"
    elif intent == "news":
        return "news"
    elif intent == "math":
        return "math"
    else:
        return "chat"

# Build graph
graph = StateGraph(RouterState)

# Add nodes
graph.add_node("classifier", classify_intent)
graph.add_node("weather", weather_handler)
graph.add_node("news", news_handler)
graph.add_node("math", math_handler)
graph.add_node("chat", general_chat)

# Add edges
graph.add_edge(START, "classifier")
graph.add_conditional_edges(
    "classifier",
    route,
    {
        "weather": "weather",
        "news": "news",
        "math": "math",
        "chat": "chat"
    }
)

# All handlers go to END
graph.add_edge("weather", END)
graph.add_edge("news", END)
graph.add_edge("math", END)
graph.add_edge("chat", END)

# Compile and run
app = graph.compile()
result = app.invoke({
    "messages": ["What's the weather like?"],
    "intent": "",
    "response": ""
})

print(result["response"])
```

### Example 3: ReAct Agent with Tools

**Use case:** Agent that reasons and uses tools iteratively

```python
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI
from langchain_core.tools import tool

# Define tools
@tool
def get_weather(location: str) -> str:
    """Get current weather for a location"""
    # Mock API call
    return f"Weather in {location}: Sunny, 72°F"

@tool
def calculator(expression: str) -> str:
    """Calculate a mathematical expression"""
    try:
        result = eval(expression)
        return f"Result: {result}"
    except Exception as e:
        return f"Error: {e}"

@tool
def search_web(query: str) -> str:
    """Search the web for information"""
    # Mock search
    return f"Search results for '{query}': LangGraph is a framework..."

# Create tool list
tools = [get_weather, calculator, search_web]

# Create LLM with tool binding
llm = ChatOpenAI(model="gpt-4").bind_tools(tools)

# Define agent node
def agent(state: MessagesState):
    """Main reasoning node"""
    messages = state["messages"]
    
    # Add system message if first turn
    if not any(isinstance(m, SystemMessage) for m in messages):
        messages = [
            SystemMessage(content="""You are a helpful assistant with access to tools.
            Use tools when needed to answer questions accurately.
            Always explain your reasoning."""),
            *messages
        ]
    
    response = llm.invoke(messages)
    return {"messages": [response]}

# Create routing function
def should_continue(state: MessagesState) -> str:
    """Decide if we need to use tools or can end"""
    last_message = state["messages"][-1]
    
    # If LLM makes a tool call, route to tools
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    
    # Otherwise end
    return "end"

# Build graph
workflow = StateGraph(MessagesState)

# Add nodes
workflow.add_node("agent", agent)
workflow.add_node("tools", ToolNode(tools))

# Add edges
workflow.add_edge(START, "agent")
workflow.add_conditional_edges(
    "agent",
    should_continue,
    {
        "tools": "tools",
        "end": END
    }
)
workflow.add_edge("tools", "agent")  # Loop back after tool use

# Compile
app = workflow.compile()

# Run
result = app.invoke({
    "messages": [
        HumanMessage(content="What's the weather in SF? Also, what is 15 * 24?")
    ]
})

# Print conversation
for msg in result["messages"]:
    if hasattr(msg, "content") and msg.content:
        print(f"{msg.__class__.__name__}: {msg.content}\n")
```

### Example 4: Multi-Agent Supervisor System

**Use case:** Supervisor coordinates specialized worker agents

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal
from langchain_openai import ChatOpenAI

class SupervisorState(TypedDict):
    messages: list
    task: str
    next_worker: str
    results: list

# Worker agent nodes
def research_agent(state: SupervisorState):
    """Specializes in research tasks"""
    task = state["task"]
    # Simulate research
    result = f"Research completed: {task}\nFound 3 relevant papers..."
    return {
        "results": state["results"] + [f"Research: {result}"],
        "next_worker": "supervisor"
    }

def coding_agent(state: SupervisorState):
    """Specializes in coding tasks"""
    task = state["task"]
    # Simulate coding
    result = f"Code generated for: {task}\n```python\ndef solution(): pass```"
    return {
        "results": state["results"] + [f"Coding: {result}"],
        "next_worker": "supervisor"
    }

def writing_agent(state: SupervisorState):
    """Specializes in writing tasks"""
    task = state["task"]
    # Simulate writing
    result = f"Document written for: {task}\nIntroduction: ..."
    return {
        "results": state["results"] + [f"Writing: {result}"],
        "next_worker": "supervisor"
    }

# Supervisor node
def supervisor(state: SupervisorState):
    """Decides which worker to route to or if task is complete"""
    llm = ChatOpenAI(model="gpt-4")
    
    system_prompt = """You are a supervisor managing three workers:
    - research_agent: For research and information gathering
    - coding_agent: For programming and code generation
    - writing_agent: For documentation and content creation
    
    Based on the task and any completed work, decide:
    - Which worker to use next, OR
    - If the task is complete (respond with FINISH)
    
    Task: {task}
    Completed work: {results}
    
    Respond with ONLY: research_agent, coding_agent, writing_agent, or FINISH"""
    
    prompt = system_prompt.format(
        task=state["task"],
        results="\n".join(state["results"]) if state["results"] else "None yet"
    )
    
    response = llm.invoke(prompt)
    next_worker = response.content.strip().lower()
    
    return {"next_worker": next_worker}

# Routing function
def route_to_worker(
    state: SupervisorState
) -> Literal["research", "coding", "writing", "end"]:
    next_worker = state["next_worker"]
    
    routing_map = {
        "research_agent": "research",
        "coding_agent": "coding",
        "writing_agent": "writing",
        "finish": "end"
    }
    
    return routing_map.get(next_worker, "end")

# Build graph
graph = StateGraph(SupervisorState)

# Add all nodes
graph.add_node("supervisor", supervisor)
graph.add_node("research", research_agent)
graph.add_node("coding", coding_agent)
graph.add_node("writing", writing_agent)

# Add edges
graph.add_edge(START, "supervisor")
graph.add_conditional_edges(
    "supervisor",
    route_to_worker,
    {
        "research": "research",
        "coding": "coding",
        "writing": "writing",
        "end": END
    }
)

# Workers report back to supervisor
graph.add_edge("research", "supervisor")
graph.add_edge("coding", "supervisor")
graph.add_edge("writing", "supervisor")

# Compile
app = graph.compile()

# Run
result = app.invoke({
    "messages": [],
    "task": "Research Python async programming, write code examples, and create documentation",
    "next_worker": "",
    "results": []
})

print("Final results:")
for r in result["results"]:
    print(f"- {r}\n")
```

### Example 5: Agentic RAG with Smart Retrieval

**Use case:** Agent decides when to retrieve documents

```python
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from typing import TypedDict

# Sample documents for knowledge base
docs = [
    Document(page_content="LangGraph is a framework for building stateful, multi-agent applications."),
    Document(page_content="Nodes in LangGraph are functions that process and update state."),
    Document(page_content="Edges in LangGraph define transitions between nodes."),
    Document(page_content="StateGraph is the primary graph type for custom state schemas."),
    Document(page_content="MessagesState is optimized for conversational applications."),
]

# Create vector store
vectorstore = Chroma.from_documents(
    docs,
    OpenAIEmbeddings()
)

class RAGState(TypedDict):
    messages: list
    question: str
    context: str
    needs_retrieval: bool
    answer: str

# Node 1: Decide if retrieval is needed
def decide_retrieval(state: RAGState):
    """Use LLM to decide if we need to retrieve documents"""
    llm = ChatOpenAI(model="gpt-4")
    
    prompt = f"""You are an AI assistant with access to a knowledge base about LangGraph.
    
    Question: {state['question']}
    
    Do you need to retrieve information from the knowledge base to answer this question?
    Respond with only YES or NO."""
    
    response = llm.invoke(prompt).content.strip().upper()
    needs_retrieval = response == "YES"
    
    return {"needs_retrieval": needs_retrieval}

# Node 2: Retrieve documents
def retrieve_docs(state: RAGState):
    """Retrieve relevant documents from vector store"""
    query = state["question"]
    docs = vectorstore.similarity_search(query, k=3)
    
    # Combine doc content
    context = "\n\n".join([doc.page_content for doc in docs])
    
    return {"context": context, "needs_retrieval": False}

# Node 3: Generate response
def generate_response(state: RAGState):
    """Generate answer with or without context"""
    llm = ChatOpenAI(model="gpt-4")
    
    if state.get("context"):
        prompt = f"""Use the following context to answer the question.
        
Context: {state['context']}

Question: {state['question']}

Answer based on the context:"""
    else:
        prompt = state['question']
    
    response = llm.invoke(prompt).content
    return {"answer": response}

# Router
def route_after_decision(state: RAGState) -> str:
    return "retrieve" if state["needs_retrieval"] else "generate"

# Build graph
workflow = StateGraph(RAGState)

workflow.add_node("decide", decide_retrieval)
workflow.add_node("retrieve", retrieve_docs)
workflow.add_node("generate", generate_response)

workflow.add_edge(START, "decide")
workflow.add_conditional_edges(
    "decide",
    route_after_decision,
    {"retrieve": "retrieve", "generate": "generate"}
)
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)

# Compile
app = workflow.compile()

# Run
result = app.invoke({
    "messages": [],
    "question": "What are nodes in LangGraph?",
    "context": "",
    "needs_retrieval": False,
    "answer": ""
})

print(f"Answer: {result['answer']}")
```

### Example 6: Loop with Exit Condition

**Use case:** Iterative refinement until goal met

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict

class LoopState(TypedDict):
    value: int
    iterations: int
    max_iterations: int
    target: int
    result: str

def increment(state: LoopState):
    """Increment value"""
    new_value = state["value"] + 2
    new_iterations = state["iterations"] + 1
    
    return {
        "value": new_value,
        "iterations": new_iterations
    }

def finalize(state: LoopState):
    """Create final result"""
    return {
        "result": f"Reached {state['value']} in {state['iterations']} iterations"
    }

def should_continue(state: LoopState) -> str:
    """Decide whether to continue loop"""
    if state["value"] >= state["target"]:
        return "done"
    elif state["iterations"] >= state["max_iterations"]:
        return "timeout"
    else:
        return "continue"

# Build graph
graph = StateGraph(LoopState)

graph.add_node("increment", increment)
graph.add_node("finalize", finalize)

graph.add_edge(START, "increment")
graph.add_conditional_edges(
    "increment",
    should_continue,
    {
        "continue": "increment",  # Loop back
        "done": "finalize",
        "timeout": "finalize"
    }
)
graph.add_edge("finalize", END)

# Compile
app = graph.compile()

# Run
result = app.invoke({
    "value": 0,
    "iterations": 0,
    "max_iterations": 20,
    "target": 10,
    "result": ""
})

print(result["result"])
```

### Example 7: Checkpointing & State Recovery

**Use case:** Save and resume workflows

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.sqlite import SqliteSaver
from typing import TypedDict
import time

class CheckpointState(TypedDict):
    step: int
    data: list
    processed: int

def step1(state: CheckpointState):
    time.sleep(1)  # Simulate work
    return {
        "step": 1,
        "data": state["data"] + ["Step 1 complete"],
        "processed": state["processed"] + 1
    }

def step2(state: CheckpointState):
    time.sleep(1)
    return {
        "step": 2,
        "data": state["data"] + ["Step 2 complete"],
        "processed": state["processed"] + 1
    }

def step3(state: CheckpointState):
    time.sleep(1)
    return {
        "step": 3,
        "data": state["data"] + ["Step 3 complete"],
        "processed": state["processed"] + 1
    }

# Build graph
graph = StateGraph(CheckpointState)
graph.add_node("step1", step1)
graph.add_node("step2", step2)
graph.add_node("step3", step3)

graph.add_edge(START, "step1")
graph.add_edge("step1", "step2")
graph.add_edge("step2", "step3")
graph.add_edge("step3", END)

# Compile with checkpointing
memory = SqliteSaver.from_conn_string(":memory:")
app = graph.compile(checkpointer=memory)

# First run
print("Starting workflow...")
config = {"configurable": {"thread_id": "workflow-123"}}
result = app.invoke({
    "step": 0,
    "data": [],
    "processed": 0
}, config)

print(f"Completed: {result['data']}")
print(f"Processed {result['processed']} steps")

# Get checkpoint state
state_snapshot = app.get_state(config)
print(f"\nCheckpoint state: {state_snapshot.values}")

# Get history
print("\nWorkflow history:")
for i, state in enumerate(app.get_state_history(config)):
    print(f"  Checkpoint {i}: Step {state.values.get('step', 0)}")

# Resume from checkpoint (if needed)
# result2 = app.invoke(None, config)
```

### Example 8: Streaming for Real-Time Updates

**Use case:** Show progress to users in real-time

```python
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
import time

llm = ChatOpenAI(model="gpt-4", streaming=True)

def chatbot(state: MessagesState):
    response = llm.invoke(state["messages"])
    return {"messages": [response]}

graph = StateGraph(MessagesState)
graph.add_node("chatbot", chatbot)
graph.add_edge(START, "chatbot")
graph.add_edge("chatbot", END)

app = graph.compile()

# Stream mode: "values" - Full state after each node
print("=== Streaming Values ===")
for chunk in app.stream({"messages": [HumanMessage(content="Count to 5")]}):
    print(chunk)
    print("---")

# Stream mode: "updates" - Only node outputs
print("\n=== Streaming Updates ===")
for chunk in app.stream(
    {"messages": [HumanMessage(content="Say hello")]},
    stream_mode="updates"
):
    print(chunk)

# For token-by-token streaming (works with streaming LLMs)
print("\n=== Token Streaming ===")
for chunk in app.stream(
    {"messages": [HumanMessage(content="Write a haiku")]},
    stream_mode="messages"
):
    if hasattr(chunk, 'content'):
        print(chunk.content, end="", flush=True)
```

### Example 9: Parallel Tool Execution

**Use case:** Run multiple tools simultaneously for speed

```python
from langgraph.graph import StateGraph, START, END
from typing import TypedDict
import time
import random

class ParallelState(TypedDict):
    query: str
    results: dict

def tool1(state: ParallelState):
    """Simulate API call 1"""
    time.sleep(random.uniform(0.5, 1.5))
    return {"results": {"weather": "Sunny, 72°F"}}

def tool2(state: ParallelState):
    """Simulate API call 2"""
    time.sleep(random.uniform(0.5, 1.5))
    return {"results": {"news": "Markets up 2%"}}

def tool3(state: ParallelState):
    """Simulate API call 3"""
    time.sleep(random.uniform(0.5, 1.5))
    return {"results": {"stock": "AAPL: $150.00"}}

def aggregator(state: ParallelState):
    """Combine all results"""
    results = state["results"]
    combined = " | ".join([f"{k}: {v}" for k, v in results.items()])
    return {"results": {"final": combined}}

# Build graph with parallel execution
graph = StateGraph(ParallelState)

graph.add_node("tool1", tool1)
graph.add_node("tool2", tool2)
graph.add_node("tool3", tool3)
graph.add_node("aggregator", aggregator)

# All tools execute in parallel from START
graph.add_edge(START, "tool1")
graph.add_edge(START, "tool2")
graph.add_edge(START, "tool3")

# All converge to aggregator
graph.add_edge("tool1", "aggregator")
graph.add_edge("tool2", "aggregator")
graph.add_edge("tool3", "aggregator")

graph.add_edge("aggregator", END)

app = graph.compile()

# Time the execution
start = time.time()
result = app.invoke({"query": "Get all data", "results": {}})
elapsed = time.time() - start

print(f"Completed in {elapsed:.2f} seconds (would be ~3s if sequential)")
print(f"Results: {result['results']['final']}")
```

### Example 10: Human-in-the-Loop Approval

**Use case:** Pause for human approval on sensitive actions

```python
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.sqlite import SqliteSaver
from typing import TypedDict

class ApprovalState(TypedDict):
    request: str
    analysis: str
    risk_level: str
    approved: bool
    action_taken: str

def analyze_request(state: ApprovalState):
    """Analyze risk level of request"""
    request = state["request"].lower()
    
    # Simple risk assessment
    if "delete" in request or "remove" in request:
        risk = "high"
    elif "update" in request or "modify" in request:
        risk = "medium"
    else:
        risk = "low"
    
    return {
        "analysis": f"Risk assessment: {risk}",
        "risk_level": risk
    }

def execute_action(state: ApprovalState):
    """Execute the approved action"""
    if state["approved"]:
        action = f"✓ Executed: {state['request']}"
    else:
        action = f"✗ Rejected: {state['request']}"
    
    return {"action_taken": action}

def route_by_risk(state: ApprovalState) -> str:
    """Route based on risk level"""
    if state["risk_level"] == "low":
        # Auto-approve low risk
        return "auto_approve"
    else:
        # High/medium risk needs human review
        return "human_review"

# Build graph
graph = StateGraph(ApprovalState)

graph.add_node("analyze", analyze_request)
graph.add_node("execute", execute_action)

graph.add_edge(START, "analyze")
graph.add_conditional_edges(
    "analyze",
    route_by_risk,
    {
        "auto_approve": "execute",
        "human_review": "execute"  # Will interrupt before this
    }
)
graph.add_edge("execute", END)

# Compile with interrupt for human review
memory = SqliteSaver.from_conn_string(":memory:")
app = graph.compile(
    checkpointer=memory,
    interrupt_before=["execute"]  # Pause before execution
)

# Scenario 1: Low risk (auto-approved)
print("=== Low Risk Request ===")
config1 = {"configurable": {"thread_id": "req-1"}}
result1 = app.invoke({
    "request": "view user profile",
    "analysis": "",
    "risk_level": "",
    "approved": True,
    "action_taken": ""
}, config1)
print(result1["action_taken"])

# Scenario 2: High risk (needs approval)
print("\n=== High Risk Request ===")
config2 = {"configurable": {"thread_id": "req-2"}}
result2 = app.invoke({
    "request": "delete all user data",
    "analysis": "",
    "risk_level": "",
    "approved": False,
    "action_taken": ""
}, config2)

# Get state at interruption
state = app.get_state(config2)
print(f"Paused for review: {state.values['analysis']}")
print(f"Risk level: {state.values['risk_level']}")

# Human reviews and approves/rejects
human_decision = False  # Rejected by human

# Update state with human decision
app.update_state(config2, {"approved": human_decision})

# Resume execution
result2 = app.invoke(None, config2)
print(f"After human review: {result2['action_taken']}")
```

---

## 12. QUICK REFERENCE & CHEAT SHEETS

### Essential Imports

```python
# Core LangGraph
from langgraph.graph import StateGraph, MessagesState, START, END

# For messages
from langchain_core.messages import (
    SystemMessage,
    HumanMessage,
    AIMessage,
    ToolMessage
)

# For tools
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode

# For LLMs
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic

# For checkpointing
from langgraph.checkpoint.sqlite import SqliteSaver

# For typing
from typing import TypedDict, Annotated, Literal
import operator
```

### Basic Graph Template

```python
# 1. Define state
class MyState(TypedDict):
    field1: str
    field2: int

# 2. Define nodes
def node1(state: MyState) -> dict:
    return {"field1": "updated"}

def node2(state: MyState) -> dict:
    return {"field2": state["field2"] + 1}

# 3. Build graph
graph = StateGraph(MyState)
graph.add_node("node1", node1)
graph.add_node("node2", node2)

# 4. Add edges
graph.add_edge(START, "node1")
graph.add_edge("node1", "node2")
graph.add_edge("node2", END)

# 5. Compile
app = graph.compile()

# 6. Run
result = app.invoke({"field1": "", "field2": 0})
```

### Conditional Edge Template

```python
def router(state: MyState) -> str:
    """Return name of next node"""
    if condition:
        return "node_a"
    else:
        return "node_b"

graph.add_conditional_edges(
    "decision_node",
    router,
    {
        "node_a": "actual_node_a",
        "node_b": "actual_node_b"
    }
)
```

### Common Patterns Cheat Sheet

**Simple Chain:**
```
START → Node1 → Node2 → Node3 → END
```

**Conditional Branch:**
```
           ┌→ Option A → END
START → Decision
           └→ Option B → END
```

**Loop:**
```
START → Process → Check → (back to Process or END)
```

**Parallel + Aggregate:**
```
       ┌→ Tool1 ┐
START ─┼→ Tool2 ─┼→ Combine → END
       └→ Tool3 ┘
```

**ReAct Agent:**
```
START → Agent → (use tool?) → Tools → Agent → ... → END
```

### State Patterns

**Basic State:**
```python
class BasicState(TypedDict):
    messages: list
    value: int
```

**With Reducers:**
```python
class ReducerState(TypedDict):
    messages: Annotated[list, operator.add]
    counter: Annotated[int, operator.add]
```

**MessagesState:**
```python
from langgraph.graph import MessagesState

class ChatState(MessagesState):
    # Inherits: messages: Annotated[list, add_messages]
    user_id: str
```

### Tool Pattern

```python
from langchain_core.tools import tool

@tool
def my_tool(param: str) -> str:
    """Tool description for LLM"""
    # Tool logic
    return result

# Bind to LLM
llm_with_tools = llm.bind_tools([my_tool])

# Use ToolNode for execution
from langgraph.prebuilt import ToolNode
tool_node = ToolNode([my_tool])
```

---

## 13. TROUBLESHOOTING & BEST PRACTICES

### Common Issues & Solutions

#### Issue 1: State Not Updating

**Problem:**
```python
# Wrong - mutating state
def bad_node(state):
    state["field"] = "value"
    return state
```

**Solution:**
```python
# Right - returning updates
def good_node(state):
    return {"field": "value"}
```

#### Issue 2: Conditional Edges Not Working

**Problem:** Router returns wrong key

```python
# Mapping expects exact keys
{"continue": "node_x", "end": END}

# Router returns wrong case
def router(state):
    return "Continue"  # ❌ Should be "continue"
```

**Solution:**
```python
def router(state):
    return "continue"  # ✅ Exact match
```

#### Issue 3: Messages Not Appending

**Problem:** Not using add_messages reducer

**Solution:**
```python
from langgraph.graph import MessagesState

class MyState(MessagesState):
    # Now has: messages: Annotated[list, add_messages]
    pass
```

#### Issue 4: Infinite Loop

**Problem:** No exit condition

```python
# Bad - loops forever
def should_continue(state):
    return "continue"  # Always loops!
```

**Solution:**
```python
def should_continue(state):
    if state["iterations"] >= 10:
        return "end"  # Exit condition
    return "continue"
```

#### Issue 5: Tool Calls Not Working

**Problem:** Not binding tools to LLM

**Solution:**
```python
llm = ChatOpenAI(model="gpt-4")
llm_with_tools = llm.bind_tools([tool1, tool2])  # Must bind
```

### Best Practices Summary

#### State Design
✅ Keep state minimal - only necessary fields
✅ Use TypedDict for type safety
✅ Choose appropriate reducers
✅ Document each field
✅ Version your schema for changes

❌ Don't store functions in state
❌ Don't include sensitive data
❌ Don't make state too complex
❌ Don't use mutable defaults

#### Node Design
✅ Single responsibility per node
✅ Return partial state updates
✅ Handle errors gracefully
✅ Add logging for debugging
✅ Keep nodes pure when possible

❌ Don't mutate state directly
❌ Don't make nodes too large
❌ Don't hide side effects
❌ Don't ignore error cases

#### Edge Design
✅ Use fixed edges for linear flows
✅ Use conditional for branching
✅ Always provide exit conditions
✅ Keep routing logic simple
✅ Use meaningful route names

❌ Don't create infinite loops
❌ Don't use random routing
❌ Don't make complex nested logic
❌ Don't forget edge cases

#### Graph Design
✅ Start simple, add complexity gradually
✅ Test nodes independently
✅ Use subgraphs for modularity
✅ Enable checkpointing for long workflows
✅ Document the flow

❌ Don't over-engineer initially
❌ Don't skip testing
❌ Don't ignore error handling
❌ Don't forget about monitoring

### Performance Tips

✅ Use parallel execution when possible
✅ Stream results for better UX
✅ Implement caching for expensive operations
✅ Set timeouts for external calls
✅ Batch operations when appropriate

❌ Don't block unnecessarily
❌ Don't fetch more data than needed
❌ Don't ignore rate limits
❌ Don't skip resource cleanup

### Security Considerations

✅ Validate all user input
✅ Sanitize data before tool calls
✅ Use environment variables for secrets
✅ Implement rate limiting
✅ Log security-relevant events

❌ Don't log sensitive data
❌ Don't trust user input
❌ Don't hardcode credentials
❌ Don't expose internal errors to users

---

## FINAL SUMMARY & KEY TAKEAWAYS

### The 5 Core Principles

1. **STATE** - The data flowing through your system
   - Shared across nodes
   - Updated via reducers
   - Checkpointed for recovery

2. **NODES** - The operations on that data
   - Functions that transform state
   - Each has one clear purpose
   - Return partial updates

3. **EDGES** - The flow control
   - Fixed for linear sequences
   - Conditional for branching
   - Always include exits

4. **PATTERNS** - Reusable architectures
   - ReAct for tool usage
   - RAG for knowledge
   - Supervisor for coordination

5. **FEATURES** - Advanced capabilities
   - Checkpointing for reliability
   - Streaming for UX
   - Parallelization for speed

### Learning Path

**Week 1: Foundations**
- Build simple linear workflows
- Understand state management
- Master fixed edges

**Week 2: Intermediate**
- Add conditional routing
- Implement tool usage
- Create ReAct agents

**Week 3: Advanced**
- Multi-agent systems
- Memory management
- Production patterns

**Week 4: Expert**
- Custom reducers
- Subgraphs
- Performance optimization

### Resources for Continued Learning

**Official Documentation:**
- LangGraph: https://langchain-ai.github.io/langgraph/
- LangChain: https://python.langchain.com/

**Practice Projects:**
1. Customer service chatbot with escalation
2. Research assistant with RAG
3. Code review system with multiple agents
4. Workflow automation platform
5. Question-answering with sources

### Remember

- Start simple and iterate
- Test each component independently
- Use checkpointing for reliability
- Monitor and log everything
- Keep user experience in mind

**LangGraph gives you the power to build sophisticated AI applications. Master these fundamentals, and you'll be able to create production-ready agentic systems!**

---

*End of Complete LangGraph Master Notes*
