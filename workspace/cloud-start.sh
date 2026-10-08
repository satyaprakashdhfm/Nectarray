#!/bin/sh
# Prepares the volume, then runs the Workspace runner. Runs on every start,
# so each step only does work the first time.
set -e

mkdir -p /data/repos /data/home /data/tools

# Claude Code on the volume: installed once, then kept current by the
# runner's `claude update` (at start and every six hours while idle).
if ! command -v claude >/dev/null 2>&1; then
  echo "Installing Claude Code…"
  npm install -g @anthropic-ai/claude-code --no-audit --no-fund
fi

# git and gh use GITHUB_TOKEN (a Railway variable) for private repos and
# pushes. The token is read from the environment each time, never written
# into a file on the volume.
git config --global credential.https://github.com.helper \
  '!f() { test "$1" = get && echo username=x-access-token && echo "password=$GITHUB_TOKEN"; }; f'
git config --global init.defaultBranch main
git config --global pull.rebase false
export GH_TOKEN="${GH_TOKEN:-$GITHUB_TOKEN}"

exec node /app/server.mjs
