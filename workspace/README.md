# Workspace runner

Runs Claude Code sessions on this PC for the **Workspace** tab in the admin
panel (`/admin/workspace`). The tab is the screen; this is what actually runs
the terminals.

## Start it

From the Nectarray folder:

```
npm run workspace
```

The first run installs its own dependencies. Leave the window open while you
work: closing it (or Ctrl+C) closes every session.

Then open the Workspace tab, on https://nectarray.com/admin/workspace or on
http://localhost:3000/admin/workspace while `npm run dev` is running. If
Chrome asks whether the site may reach apps on this device, choose **Allow**.

## What it does

- **Repos**: every git repo in the folder above this one (`E:\Users\satya3479\Projects`).
  **Connect a repo** clones a GitHub link into that folder.
- **Sessions**: each one is a real `claude` in its own terminal. **Own copy**
  starts it with `--worktree`, so parallel sessions in one repo work on separate
  branches and never edit the same files.
- **Cards**: Claude Code's hooks (`hook.mjs`) report each step back here, which
  is how a card shows Working, Needs you or Done. The hooks send only the tool
  name, the file name or command, and the prompt, never file contents.
- **Sign-in**: shared with Claude Code everywhere on this PC. **Sign in** runs
  `claude auth login`, which opens claude.ai in the browser (Continue with
  Google works there).
- **Updates**: `claude update` runs when the runner starts and every six hours
  while no session is open. **Update now** runs it right away.
- **Voice**: hold **Hold to talk** in the tab, speak, let go. The words are typed
  into that session's prompt; **Send** submits them (or tick **Send right away**).
  It uses the browser's speech recognition, so it needs Chrome or Edge.

## Safety

It listens only on `127.0.0.1:4100`, never on the network, and accepts
connections only from nectarray.com and localhost:3000. Add another origin with
`WORKSPACE_ORIGINS=https://example.com`. Other settings: `WORKSPACE_ROOT` (the
repos folder) and `WORKSPACE_PORT` (default 4100; the tab expects 4100).
