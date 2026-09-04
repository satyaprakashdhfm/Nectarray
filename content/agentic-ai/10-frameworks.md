There are a lot of agent frameworks. They differ less than their documentation
suggests — every one of them is the loop from lesson five, plus opinions about
state, tools and deployment.

This lesson is a map, so you can read a job description or a codebase and know
what you are looking at.

## The landscape

| Framework | Language | Made by | Its actual argument |
| --- | --- | --- | --- |
| **LangGraph** | Python, TS | LangChain | State machines, checkpointing, human-in-the-loop |
| **OpenAI Agents SDK** | Python, TS | OpenAI | Small, few concepts, handoffs and guardrails built in |
| **Vercel AI SDK** | TypeScript | Vercel | The web front end — streaming UI, one API across providers |
| **AutoGen** | Python, .NET | Microsoft | Conversations between multiple agents |
| **Semantic Kernel** | C#, Python, Java | Microsoft | Enterprise .NET, plugins and planners |
| **Azure AI Foundry Agent Service** | any (REST) | Microsoft | Managed agents on Azure, with Azure identity and networking |
| **CrewAI** | Python | CrewAI | Role-playing crews with a task list |
| **LlamaIndex** | Python, TS | LlamaIndex | Retrieval first; agents built around a strong index |
| **Pydantic AI** | Python | Pydantic | Type safety and validation as the organising idea |

### LangGraph

Covered in lesson seven. Choose it for branching flows, durable state,
approval steps and inspectability. The cost is concepts — state, reducers,
checkpointers — that a simple agent does not need.

### OpenAI Agents SDK

Deliberately small. Agents, tools, handoffs, guardrails, sessions, tracing.

```python
from agents import Agent, Runner, function_tool

@function_tool
def get_student(student_id: int) -> dict:
    """Look up one student by id."""
    return db.one("SELECT * FROM students WHERE student_id = %s", student_id)

support = Agent(
    name="Support",
    instructions="Answer questions about enrolments. Always use the tools.",
    tools=[get_student],
)

result = await Runner.run(support, "What course is student 42 on?")
```

Provider-agnostic despite the name — it speaks to other providers through a
compatibility layer. A good default when you want an agent and not an
architecture. Handoffs are its multi-agent story: one agent transfers the
conversation to another that is better suited.

### Vercel AI SDK

TypeScript, and the answer to a different question: how do I put this in a web
page? Streaming, `useChat`, tool calls that render as UI, one interface across
providers.

```ts
import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const { text } = await generateText({
  model: google("gemini-3.6-flash"),
  tools: {
    getStudent: tool({
      description: "Look up one student by id.",
      inputSchema: z.object({ studentId: z.number() }),
      execute: async ({ studentId }) => db.one(studentId),
    }),
  },
  prompt: "What course is student 42 on?",
});
```

If you have read the grading route in this platform, that is this SDK. It pairs
naturally with a Python service doing the heavy retrieval — TypeScript at the
edge, Python where the data is, is an extremely common split.

### AutoGen

Microsoft's multi-agent library: agents that talk to each other in a group,
with a manager deciding who speaks. Genuinely good when the problem is
adversarial or collaborative — a writer and a critic, a coder and a reviewer.

Expensive, because every exchange is a model call, and hard to debug for the
same reason. Try one agent first.

### Semantic Kernel and Azure AI Foundry

The Microsoft enterprise line. Semantic Kernel is the SDK — plugins, planners,
first-class C#. Azure AI Foundry Agent Service is the managed runtime: agents
that live in Azure with Azure identity, private networking, content filters and
the compliance paperwork that comes with them.

You will meet these where the company is already on Azure. That is usually the
whole reason they were chosen, and it is a perfectly good one.

### Azure RAG

Azure AI Search is the retrieval half: hybrid search (keyword + vector) and
semantic reranking as managed features, integrated with Foundry. Everything in
the RAG lesson maps onto it directly — chunking, hybrid, reranking — with the
pieces provided rather than assembled.

Worth knowing because "RAG on Azure" appears in a lot of Indian job
descriptions, and it is the same ideas behind a portal.

## How to choose

Ask three questions, in order:

**What language is the rest of the system in?** A Python agent bolted onto a
TypeScript product, or the reverse, costs more than any framework difference.

**Does the flow branch or loop?** No — any of them, pick the smallest. Yes —
LangGraph, or write the loop yourself.

**Does it need to survive a restart, or wait for a human?** That narrows it
sharply: LangGraph with a checkpointer, or a managed service that does it for
you.

Then, and only then, look at the framework's own arguments.

## What actually transfers

Frameworks churn. Roughly every eighteen months the popular one changes. What
does not change:

- The loop: model proposes, your code executes, results go back in.
- Tool descriptions are prompts, and vague ones are the usual bug.
- Context is a budget you spend deliberately.
- Retrieval quality dominates answer quality.
- Evaluation is the difference between a demo and a system.
- Anything irreversible needs a human, or a very good reason.

Learn those and any framework is a weekend. Learn a framework without them and
you can build a demo and not a product.

## A warning about demos

An agent that works in a notebook is perhaps a fifth of the work. The rest:
what happens when a tool times out; what happens when the model returns
malformed JSON; what it costs at a thousand users; how you find out it broke;
how you stop it emailing a customer twice.

No framework does that part for you. The next lesson is that part.

---

**Next.** Getting an agent into production without it becoming somebody's
incident.
