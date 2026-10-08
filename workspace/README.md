# Workspace runner

Runs Claude Code sessions for the **Workspace** tab in the admin panel. The
tab is the screen; this is what runs the terminals.

## In the cloud (normal use)

The **Workspace** service on Railway, built from the `Dockerfile` here (root
directory `workspace/`), with a volume at `/data`.

- **Start / Stop**: the tab's Start wakes the service; Stop closes every
  session, and Railway puts the service to sleep when it goes quiet, which
  costs nothing. Sessions nobody is watching are closed after 30 minutes
  (`WORKSPACE_IDLE_MINUTES`), so a forgotten Stop does not run up a bill.
- **Repos**: every repo the `GITHUB_TOKEN` can see. A repo is cloned onto the
  volume the first time a session opens it. **Own copy** starts a session
  with `--worktree`, so parallel sessions in one repo use separate branches.
- **Claude sign-in**: one for every session and repo, kept on the volume.
  Press **Sign in** in the tab once, open the sign-in page it shows, choose
  Continue with Google, and paste the code back into the box under the
  terminal.
- **Updates**: Claude Code is installed on the volume and `claude update`
  runs at every start and every six hours while idle.
- **Cards**: Claude Code's hooks (`hook.mjs`) report each step back, which is
  how a card shows Working, Needs you or Done. They send only the tool name,
  file name or command, and the prompt; never file contents.

### Variables

On the **Workspace** service:

| Name | What |
| --- | --- |
| `WORKSPACE_SECRET` | Shared with the Web service; verifies the passes it signs. The runner refuses to start without it. |
| `GITHUB_TOKEN` | A fine-grained GitHub token: Contents read and write (and Pull requests, for PRs). Private repos and pushes need it. |
| `WORKSPACE_IDLE_MINUTES` | Optional, default 30. |

On the **Web** service: `WORKSPACE_URL` (the Workspace service's domain) and
the same `WORKSPACE_SECRET`.

### Who can reach it

It is on the internet, so every socket needs a pass: signed by the website
with `WORKSPACE_SECRET`, good for one minute, and only issued to an admin who
is fully signed in (Google, an address on `ADMIN_EMAILS`, and the code emailed
for that session). It also only accepts the site's own origin. Hook reports
are accepted only from inside the container, with a per-run secret.

## On this PC (development)

```
npm run workspace
```

Listens on `127.0.0.1:4100` only, with the repos in the folder above this one.
With `npm run dev` and no `WORKSPACE_URL`, the tab connects to it.
