/**
 * Claude Code runs this for each hook event in a Workspace session (see
 * writeHooks in server.mjs) and passes the event as JSON on stdin. It sends
 * the runner the few fields a session card needs and nothing else: no file
 * contents, no command output.
 *
 * Silent and always exits 0, so it can never block or change what Claude
 * does. Outside a Workspace session it does nothing at all.
 */
const session = process.env.NECTARRAY_WS_SESSION;
const port = process.env.NECTARRAY_WS_PORT;
const secret = process.env.NECTARRAY_WS_SECRET;

if (session && port && secret) {
  let raw = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) raw += chunk;

  try {
    const e = JSON.parse(raw);
    const input = e.tool_input ?? {};
    const text = (value, max = 200) =>
      typeof value === "string" ? value.slice(0, max) : undefined;
    const body = {
      session,
      event: e.hook_event_name,
      tool: e.tool_name,
      input: {
        command: text(input.command),
        description: text(input.description),
        file: text(input.file_path ?? input.notebook_path),
        pattern: text(input.pattern),
        url: text(input.url),
        query: text(input.query),
      },
      prompt: text(e.prompt, 400),
      message: text(e.message, 300),
      kind: e.notification_type,
      cwd: e.cwd,
      claudeSession: e.session_id,
    };
    await fetch(`http://127.0.0.1:${port}/hook`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-workspace-secret": secret,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(1500),
    });
  } catch {
    // The card misses one update; Claude carries on regardless.
  }
}
process.exit(0);
