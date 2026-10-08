# The Workspace service on Railway: the runner (server.mjs) and the tools a
# Claude Code session needs to work on a repo. Root directory: workspace/.
#
# Everything that has to survive a redeploy lives on the volume at /data:
#   /data/repos  the cloned repos
#   /data/home   HOME: Claude Code's sign-in, settings and conversations, git config
#   /data/tools  npm's global prefix, where Claude Code is installed, so its
#                own updates are kept too
FROM node:22-bookworm

# git and build tools come with the image; add ripgrep, jq, and the GitHub
# CLI so Claude can open pull requests.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ripgrep jq less procps ca-certificates curl \
 && install -m 0755 -d /etc/apt/keyrings \
 && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg -o /etc/apt/keyrings/githubcli-archive-keyring.gpg \
 && chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
 && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list \
 && apt-get update && apt-get install -y --no-install-recommends gh \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# node-pty compiles here (Linux has no prebuilt binary); .npmrc is left out
# on purpose, it only matters on Windows.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY server.mjs hook.mjs cloud-start.sh ./

ENV WORKSPACE_CLOUD=1 \
    WORKSPACE_ROOT=/data/repos \
    HOME=/data/home \
    NPM_CONFIG_PREFIX=/data/tools \
    PATH=/data/tools/bin:$PATH \
    PORT=8080

EXPOSE 8080
CMD ["sh", "/app/cloud-start.sh"]
