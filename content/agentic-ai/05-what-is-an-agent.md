An agent is a loop. That is the whole idea, and everything else in this half of
the course is a detail hung off it.

```
while not done:
    response = model(conversation)
    if response asks to use a tool:
        result = run_the_tool(response.tool, response.arguments)
        conversation.append(result)
    else:
        return response
```

The model does not run anything. It emits a request — "call `search_orders`
with `{customer_id: 42}`" — and *your code* decides whether to run it, runs
it, and hands the result back. Every agent framework you will meet is a
wrapper around those ten lines, and knowing that keeps you from being confused
by any of them.

## Not everything needs an agent

| What you need | Reach for |
| --- | --- |
| Rewrite this text | One model call |
| Answer from our documents | Retrieval + one call |
| Fixed sequence of three steps | A script that calls the model three times |
| Steps and order depend on what is found | An agent |

An agent costs more, is slower, and fails in ways a straight-line script does
not. Use one when the *sequence itself* is unknown until you are in it. If you
can draw the flowchart, write the flowchart.

## Tools

A tool is a function plus a description the model can read.

```python
def get_student(student_id: int) -> dict:
    """Look up one student by their numeric id.

    Args:
        student_id: The student's id, as shown on their enrolment.
    """
    return db.query("SELECT * FROM students WHERE student_id = ?", student_id)
```

That docstring is not documentation for you — it is the prompt. The model
decides whether to call this based on the name, the description and the
parameter names, and nothing else. Vague descriptions produce a model that
calls the wrong tool, and the fix is almost always to rewrite the description
rather than to change the model.

Rules that hold across every framework:

- **Name tools for what they do**, not for what they wrap. `find_orders`, not
  `db_query_2`.
- **Say when *not* to use it.** "Use this only for orders in the last 90 days;
  for older orders use `search_archive`."
- **Keep the argument list small.** Every optional parameter is another thing
  to get wrong.
- **Return something readable.** The result goes back into the prompt, so a
  400-row JSON dump wastes the context window and buries the answer.
- **Fewer tools is better.** Past roughly ten or fifteen, accuracy drops
  noticeably. Group them, or route between smaller sets.

## Tool calling, concretely

```python
from anthropic import Anthropic          # any provider — the shape is the same

tools = [{
    "name": "get_student",
    "description": "Look up one student by their numeric id.",
    "input_schema": {
        "type": "object",
        "properties": {
            "student_id": {"type": "integer", "description": "The student's id."}
        },
        "required": ["student_id"],
    },
}]
```

The model replies with either text or a tool-use block. You run it, append the
result with the matching id, and call again. The loop continues until the model
answers in words.

The JSON Schema is doing real work: it constrains what the model can emit, so
you get `{"student_id": 42}` rather than prose you have to parse. Providers
differ in the wrapper — `tools` here, `functions` elsewhere — but all of them
are passing a schema and getting back a structured call.

## Where agents actually fail

Reading these once will save you a week:

**It loops.** Calls the same tool with the same arguments forever. Cap the
iterations — ten is usually plenty — and return a clear failure when you hit
the cap. Every production loop has this cap.

**It invents arguments.** Asked for an order it has no id for, it makes one up.
Validate arguments against the schema *and* against reality before executing,
and return a useful error the model can recover from: "No student with id 9999.
Use `search_students` by name first."

**It stops too early.** Answers from memory instead of calling the tool that
knows. Usually a prompt problem: state plainly that it must use the tools and
must not answer from prior knowledge.

**Context grows until it breaks.** Every tool result is appended. Twenty calls
in, you are re-sending everything each time — slow and expensive. Summarise
old turns, or keep only the last N results in full.

**One bad step poisons the rest.** The model reads its own previous output as
fact. A wrong lookup at step two is still being believed at step nine. This is
the strongest argument for keeping loops short and checkpointing between them.

## What to put in the system prompt

```
You are a support assistant for NectArray Academy.

Use the tools to look things up. Never answer from memory about a specific
student, payment or enrolment — always call the tool, even if you think you
know.

If a tool returns nothing, say so plainly. Do not guess an answer.
If you need information the student has not given, ask one clear question.

Keep replies under four sentences unless asked for detail.
```

Short, specific, and mostly about the boundaries. Most bad agent behaviour is
a missing sentence in this block, not a weakness in the model — try the prompt
before you try a bigger model.

## Multi-agent, and the honest advice

The pattern everyone reaches for: a planner that delegates to specialists.
Sometimes right — genuinely separate skills, or separate tool sets too large
for one context.

Usually premature. Every handoff is a place to lose information, costs a full
model call, and multiplies the ways it can go wrong. A single agent with good
tools beats three agents with vague ones nearly every time.

Start with one. Split it when you can name the specific thing one agent keeps
getting wrong that a second would fix.

## What to remember

- An agent is a loop; the model requests, your code executes.
- Tool descriptions are prompts — write them for the model.
- Cap the iterations. Always.
- Most failures are prompt failures.
- One good agent beats three vague ones.

---

**Next.** Giving the agent your documents, properly: retrieval-augmented
generation.
