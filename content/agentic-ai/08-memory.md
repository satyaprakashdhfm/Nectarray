"Memory" in an agent is four different problems wearing one word. Separating
them is most of the design work, because each has a different lifetime, a
different store and a different failure.

| Kind | Lives for | Holds |
| --- | --- | --- |
| Working memory | One turn | The prompt actually sent to the model |
| Session memory | One conversation | The message history |
| Long-term memory | Forever, per user | Facts worth carrying between conversations |
| Retrieval | Forever, shared | Documents — the previous lesson |

An LLM is stateless. Every call sends everything it is allowed to know. "The
model remembers" is always shorthand for "we sent it again".

## Working memory: the context window

The prompt has a budget. Spend it deliberately, in this order:

1. System prompt — small, fixed
2. Long-term facts about this user — small
3. Retrieved documents — the largest slice, and the most valuable
4. Recent conversation — recent, not all
5. The current question

The failure is silent and gradual: history grows, retrieved documents get
squeezed out to fit, answers get worse, nobody notices because nothing errors.
Budget it explicitly.

```python
BUDGET = 100_000

def build_prompt(system, facts, documents, history, question):
    used = tokens(system) + tokens(facts) + tokens(question)
    documents = fit(documents, BUDGET * 0.5)          # reserve half
    used += tokens(documents)
    history = fit_from_end(history, BUDGET - used)    # newest first
    return assemble(system, facts, documents, history, question)
```

Also worth knowing: models attend best to the beginning and end of a long
context and worst to the middle. Put the retrieved passages and the question
near the end, not buried in the middle of a long history.

## Session memory

The message list for one conversation. Three strategies, and you will use the
third:

**Keep everything.** Correct until it is not. Fine for short conversations,
fails on long ones — cost grows with the square of the turns, since every turn
re-sends all previous ones.

**Sliding window.** Keep the last N turns. Cheap, predictable, and it forgets
the customer's name from turn one.

**Summarise and window.** Keep the last N turns verbatim; replace everything
older with a running summary.

```python
def compact(messages, keep=10):
    if len(messages) <= keep + 4:
        return messages
    old, recent = messages[:-keep], messages[-keep:]
    summary = llm.invoke(
        "Summarise this conversation. Keep names, ids, decisions, numbers "
        "and anything the user asked us to remember. Drop pleasantries.\n\n"
        + render(old)
    ).content
    return [{"role": "system", "content": f"Earlier: {summary}"}] + recent
```

The summarisation prompt is doing the work. "Keep names, ids, decisions and
numbers" is what stops it summarising away the order number the whole
conversation is about.

If you are using LangGraph, a checkpointer gives you session memory already —
the thread state is the history. You still need the compaction.

## Long-term memory

Facts worth carrying into the *next* conversation. Not the transcript — the
distilled version.

```sql
CREATE TABLE user_memory (
  id         bigserial PRIMARY KEY,
  user_id    uuid NOT NULL,
  kind       text NOT NULL,         -- 'preference' | 'fact' | 'decision'
  content    text NOT NULL,
  source     text,                  -- which conversation it came from
  embedding  vector(768),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX ON user_memory (user_id, kind);
CREATE INDEX ON user_memory USING hnsw (embedding vector_cosine_ops);
```

Two ways in. **Explicit**: the user says "remember that I prefer evening
classes" and you write a row — reliable, and the user knows what you kept.
**Extracted**: after each conversation, ask a model what is worth keeping —
more useful, and it will occasionally store something wrong or something the
user would rather you had not.

Whichever you use:

- **Retrieve, do not dump.** A user with 200 remembered facts cannot have all
  of them in every prompt. Embed them and retrieve the relevant handful, the
  same way you retrieve documents.
- **Expire things.** "Wants a callback on Tuesday" is worthless on Wednesday.
  Set `expires_at` when you write it.
- **Handle contradiction.** New information supersedes old. Without a rule for
  this you accumulate "prefers morning classes" *and* "prefers evening
  classes" and the model picks one at random.
- **Let people see and delete it.** Both because it is the decent thing and
  because it is what the law requires in most places you will operate.

## Users, sessions and threads

Three identifiers, and conflating them is a real bug that leaks real data:

```
user_id      the person            — long-term memory keys off this
session_id   one conversation      — message history keys off this
thread_id    one agent run         — checkpointer keys off this
```

One user has many sessions. One session may have several threads. Every
memory read must be filtered by `user_id`, and that filter belongs in the
database — a row-level security policy, not an `if` statement in application
code that someone will forget on the one code path that matters.

```sql
CREATE POLICY memory_own ON user_memory
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

If you have been following the SQL half of this course, this is the same
mechanism protecting your own dashboard right now.

## Chat history worth storing

```sql
CREATE TABLE messages (
  id           bigserial PRIMARY KEY,
  session_id   uuid NOT NULL,
  user_id      uuid NOT NULL,
  role         text NOT NULL,       -- user | assistant | tool
  content      text NOT NULL,
  tool_calls   jsonb,
  tokens_in    integer,
  tokens_out   integer,
  latency_ms   integer,
  model        text,
  created_at   timestamptz DEFAULT now()
);
```

Store the token counts, the latency and the model. Three months in, someone
will ask what this costs per conversation and which model answered a
complaint, and if you did not write it down at the time there is no way back
to it.

## What to remember

- The model is stateless; memory is something you assemble every call.
- Budget the context window, and reserve the retrieval slice first.
- Summarise old turns, keep recent ones verbatim.
- Long-term memory is retrieved, expired and contradiction-resolved — not
  dumped.
- Enforce the user filter in the database, not the application.

---

**Next.** MCP: how a tool stops being your code and becomes something any
agent can use.
