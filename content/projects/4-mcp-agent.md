Pick something with real state: a SQLite database, a task list, a filesystem folder, an API you have a key for.

**Build the server**

- Three or more tools, with descriptions written for the model — including at least one that says when *not* to use it
- One resource (a schema, a config, a reference document)
- One prompt template
- Runs over stdio, and works in the MCP Inspector

**Build the agent**

- Connects to your server, lists the tools, runs a real task end to end
- Caps its iterations
- Returns a useful message on a tool failure rather than raising

**One tool must refuse.** Something destructive or out of bounds — deleting, spending, sending. Show it declining, and say in the README what would have to be true for it to proceed.

Include a transcript of a working run.
