# short:

- unix commands & bash scripting
- git
- docker
- vagrant with servers setups
    - unix server settings
    - iac of apache http server setup with vagrant provision (single file for full setup of website)
    - wordpress lamp stakc setup
    - apache tomcat server setup
- json vs yaml uses:
    - YAML (YAML Ain't Markup Language) is a human-readable data serialization standard commonly used for configuration files and data exchange between applications.(know writable)
    - JSON (JavaScript Object Notation) is a lightweight, text-based data interchange format that uses human-readable syntax to store and transmit data objects consisting of key-value pairs and arrays.(know readable)
- project:
    - nginx server , tomcat , nfs service(centralised storage) , rabbitMQ(queuing agent(message broker)), mssql , memcache(cache service for database), Elastic Search.
    - doing all these form vagrant is another part
- aws :

# **Unix Commands & Bash Scripting**

* **Basic Commands**: `ls`, `cd`, `pwd`, `cp`, `mv`, `rm`, `cat`, `grep`, `find`, `chmod`, `chown`, `ps`, `top`, `kill`, `df`, `du`.
* **Process & Service Management**: `systemctl start/stop/restart/status`, `journalctl`, `netstat`, `ss`.
* **Networking**: `ping`, `curl`, `wget`, `scp`, `ssh`.
* **Bash Scripting**:

  * Variables, loops, conditionals, functions.
  * Automation of server tasks (log rotation, backups, monitoring).
  * Example:

    ```bash
    #!/bin/bash
    for file in *.log; do
      echo "Archiving $file"
      gzip $file
    done
    ```

---
---

**Version Control Overview**

Version control tracks file changes over time, allows collaboration, and provides rollback to any point.

**Two Main Systems:**

* **Git** – Distributed, local-first, flexible branching and merging.
* **TFVC** – Centralized, server-controlled, no pull requests, strict check-ins.

| Feature           | Git                        | TFVC                 |
| ----------------- | -------------------------- | -------------------- |
| Storage           | Distributed (local copies) | Central server       |
| Change model      | Commit locally → Push      | Check-out → Check-in |
| Visibility        | After push                 | After check-in       |
| Permissions       | Repo-level                 | Server-level         |
| Pull Requests     | Yes                        | No native PRs        |
| Branching         | Fast & common              | Rare, heavier        |
| Conflict handling | Manual merges              | File locks           |
| History           | Full local history         | Centralized          |
| Offline work      | Yes                        | No                   |

---

**1. Configuration & Help**

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --list
git help <command>
```

---

**2. Repo Setup**

```bash
git init                     # New repo
git clone <url>              # Copy existing repo
git status                   # View current state
```

---

**3. Staging Area**

```bash
git add <file>               # Stage file
git add .                    # Stage all
git reset <file>             # Unstage file (keep edits)
git restore --staged <file>  # Modern unstage
```

---

**4. Committing & Logs**

```bash
git commit -m "message"
git commit -am "msg"         # Stage + commit tracked files
git log --oneline --graph    # Compact history
git diff                     # Unstaged changes
git diff --staged            # Staged vs commit
```

---

**5. .gitignore**

```bash
# Example
node_modules/
*.log
.env
```

---

**6. Remote Operations**

```bash
git remote -v
git remote add origin <url>
git push -u origin main
git fetch origin
git pull origin main
git push origin <branch>
```

**Tip:**
Use SSH or Personal Access Tokens instead of passwords.

---

**7. Branching & Merging**


*Merge* preserves history and shows exactly when branches diverged.
*Rebase* rewrites history to look like you developed in a straight line — cleaner, but more dangerous if used on shared branches.


```bash
git branch
git branch <name>
git checkout <name>
git checkout -b <name>       # Create + switch
git merge <branch>           # Merge branch
git rebase <branch>          # Replay commits linearly
git branch -d <name>         # Delete local
git push origin --delete <name>  # Delete remote
```


---

**8. Stash & Temporary Work**

```bash
git stash                    # Save uncommitted changes
git stash list
git stash apply              # Apply but keep stash
git stash pop                # Apply and remove
```

---

**9. Inspecting History**

```bash
git show <commit>            # View commit details
git blame <file>             # Line-by-line author
git tag <tag>                # Mark versions
git tag -d <tag>             # Delete tag
```

---

**10. Undoing & Recovery & deleting**


1. **Undo local edits:**
   `git restore <file>` → removes local changes and restores the last committed version.


* `restore` = It discards local modifications and replaces the file with the last committed version.So it’s like: “Undo my edits in this file.”
* `reset` = undo `git add` (unstage file).


2. **Unstage a file (before commit):**
   `git restore --staged <file>` → removes file from staging area but keeps your edits.

3. **Undo a specific commit (safe):**
   `git revert <commit-hash>` → creates a new commit that undoes changes from the target commit.

4. **Reset repository to an older commit (dangerous):**
   `git reset --hard <commit-hash>` → moves HEAD to an old commit and deletes all newer local changes.

   * **Soft:** keeps staged changes.
   * **Mixed:** keeps local changes but unstaged.
   * **Hard:** removes everything after that commit.



5. **View all HEAD movements:**
   `git reflog` → shows complete history of HEAD changes (even deleted commits).

6. **Remove tracked files:**
   `git rm <file>` → deletes file from working directory and stages the deletion.
   `git rm --cached <file>` → stops tracking file but keeps it locally (use before `.gitignore`).

7. **Clean up untracked files:**
   `git clean -n` → preview which untracked files will be deleted.
   `git clean -f` → delete untracked files (force).
   `git clean -fd` → delete untracked files and directories.
   `git clean -fx` → delete ignored + untracked files (use with care).



**Use Case:**
Lost commits after reset?
→ `git reflog`, find commit ID, then `git checkout <id>` or `git branch rescue <id>`

---

**11. Cherry-Pick & Squash (Hard Exam Tricks)**

```bash
git cherry-pick <commit-id>       # Apply single commit from another branch
git rebase -i HEAD~3              # Interactive squash last 3 commits
```

1. **Cherry-pick specific commit:** `git cherry-pick <commit-hash>` → applies that exact commit to your current branch.
2. **Pick multiple commits:** `git cherry-pick <hash1> <hash2>` → adds selected commits one by one.
3. **Fix conflicts if any:** `git status`, resolve manually, then `git cherry-pick --continue`.
4. **Squash commits into one:**
   Suppose you made 3 small commits — typo fix, rename, final fix.
   Run `git rebase -i HEAD~3` → Git shows your last 3 commits in an editor.
   Keep the first as `pick`, change the rest to `squash` (or `s`).
5. **Finish squash:**
   Git merges those 3 commits into one.
   It’ll ask you to edit the commit message → write one clean message.
   Now when you do `git log`, you’ll see only **one commit** instead of three.

---

**12. Detached HEAD & Safety**

If you see “detached HEAD”:

1. **View HEAD:** `cat .git/HEAD` → shows where HEAD is pointing.
2. **Check current branch:** `git status` → shows “on branch main” or similar.
3. **Go to specific commit (detached HEAD):** `git checkout <commit-hash>`
4. **Create branch from detached HEAD:** `git switch -c new-branch`
5. **Return to normal branch:** `git checkout main`


```bash
git switch -c new-branch          # Save your commits safely
```

---

**13. Typical GitHub Workflow**

```bash
git clone <repo>
git checkout -b feature-x
# work, then
git add . && git commit -m "msg"
git push -u origin feature-x
# create Pull Request
git pull origin main
```

---

**14. Real-World Fix Example (Push Failure)**

1. `git init`
2. `git remote add origin <url>`
3. `git add . && git commit -m "Initial commit"`
4. If push fails → use SSH or token auth.
5. To sync with remote:

   ```bash
   git fetch origin
   git merge origin/main
   ```

---

**15. Advanced Safety Commands**

```bash
git commit --amend --no-edit      # Add forgotten file to last commit 
git commit --amend -m "just a small change in commit message"
git filter-repo --path secret.txt --invert-paths  # Delete secret from all history
git log --stat                    # Commit details with file stats
```

# **Vagrant with Server Setups**

*Core Concept (IaC)*

* Vagrantfile defines reproducible environments.
* Consistent environments across dev/staging/prod.
* Integrated with Git for versioned infrastructure.

*Unix Server Settings*

* User management, SSH, firewall rules.
* Automated provisioning with shell scripts.

*Server Provisioning Examples*

* **Apache HTTP Server**

  ```bash
  sudo apt install apache2 -y
  sudo systemctl start apache2
  echo "<h1>Apache Running</h1>" | sudo tee /var/www/html/index.html
  ```
* **WordPress LAMP Setup**

  * Linux + Apache + MySQL + PHP.
  * WordPress deployed on top.

  ```bash
  sudo apt install lamp-server^ -y
  wget https://wordpress.org/latest.tar.gz
  tar -xzf latest.tar.gz
  sudo mv wordpress/* /var/www/html/
  ```
* **Apache Tomcat** – Java web apps, servlet container.
* **Nginx** – Reverse proxy, load balancer.
* **Database Servers**: MySQL, PostgreSQL, MSSQL.
* **Cache**: Memcache, Redis.
* **Messaging**: RabbitMQ.
* **Storage**: NFS centralized storage.
* **Search**: ElasticSearch.

*Advanced DevOps with Vagrant*

* **Multi-Machine Architectures** (web, db, cache in one topology).
* **CI/CD Pipelines**: `vagrant up && vagrant provision && vagrant destroy`.
* **Configuration Management**: Integrate with Ansible, Chef, Puppet.
* **Container Orchestration Testing**: Docker + Kubernetes.
* **Monitoring**: ELK stack, Prometheus, Grafana.
* **Security**: Firewall rules, Vault secrets management.
* **Cloud Testing**: Validate Terraform, AWS/GCP/Azure configs locally.

-------------------------**PIPELINE SERVIES**----------------------------

| Aspect | Jenkins | GitHub Actions |
|--------|---------|----------------|
| **Same Goal** | **Automate build, test, deploy workflows** | **Automate build, test, deploy workflows** |
| **But Hosting** | Self-hosted (your servers) | Cloud-hosted (by GitHub) |
| **But Setup** | Install & configure | Ready to use |
| **But Config** | Jenkinsfile (Groovy) | YAML workflows |
| **But Platform** | Any Git provider | GitHub only |
| **But Runners** | Your own infrastructure | GitHub's or self-hosted |
| **But Cost** | Free + your server costs | Free tier + usage billing |
| **But Ecosystem** | 1000+ plugins | Marketplace actions |
| **But Complexity** | Steep learning curve | Easier to start |
| **But Control** | Full customization | Limited to GitHub features |

**Same goal: CI/CD automation. Different execution approaches.**

# Jenkins Core Working Guide

## Core Vocabulary

**Pipeline**: Code-defined workflow (Jenkinsfile)
**Job**: Unit of work that gets executed
**Build**: Single execution of a job
**Node/Agent**: Machine that executes builds
**Stage**: Logical group of steps
**Step**: Individual action/command
**Workspace**: Directory where build runs
**Artifact**: Files produced by build

## Pipeline Structure

```groovy
pipeline {
    agent any
    environment { }
    stages {
        stage('name') {
            steps { }
        }
    }
    post { }
}
```

## Agent Block
**What**: Specifies where pipeline runs

```groovy
agent any                    // Any available node
agent none                   // No default agent
agent { label 'linux' }     // Specific labeled node
agent { docker 'node:16' }   // Inside Docker container
```

## Environment Block
**What**: Sets variables for entire pipeline

```groovy
environment {
    APP_NAME = 'myapp'
    VERSION = "${BUILD_NUMBER}"
    DB_CREDS = credentials('db-password')
}
```

## Stages Block
**What**: Contains all pipeline stages

```groovy
stages {
    stage('Build') {
        steps {
            sh 'npm install'
        }
    }
    stage('Test') {
        steps {
            sh 'npm test'
        }
    }
}
```

## Steps
**What**: Individual commands inside stage

```groovy
steps {
    sh 'echo "Shell command"'
    echo "Jenkins echo"
    script {
        // Groovy code here
        def result = sh(returnStdout: true, script: 'whoami').trim()
    }
}
```

## When Conditions
**What**: Controls when stage executes

```groovy
when {
    branch 'main'                           // Specific branch
    environment name: 'DEPLOY', value: 'yes'
    allOf { branch 'main'; environment name: 'ENV', value: 'prod' }
    anyOf { branch 'main'; branch 'develop' }
    not { branch 'feature/*' }
}
```

## Parallel Stages
**What**: Run stages simultaneously

```groovy
stage('Tests') {
    parallel {
        stage('Unit') {
            steps { sh 'npm run test:unit' }
        }
        stage('Integration') {
            steps { sh 'npm run test:integration' }
        }
    }
}
```

## Script Block
**What**: Run Groovy code for complex logic

```groovy
script {
    def version = sh(returnStdout: true, script: 'git tag').trim()
    if (version.contains('v1')) {
        echo "Version 1 detected"
    }
    env.CUSTOM_VAR = 'value'
}
```

## Post Block
**What**: Actions after pipeline completion

```groovy
post {
    always { 
        cleanWs()  // Always clean workspace
    }
    success { 
        echo 'Build succeeded!' 
    }
    failure { 
        emailext to: 'team@company.com', subject: 'Build Failed'
    }
}
```

## File Operations

```groovy
// Read file
def content = readFile('config.txt')

// Write file  
writeFile file: 'output.txt', text: 'Hello'

// Check file exists
if (fileExists('package.json')) {
    echo "Package.json found"
}

// Archive artifacts
archiveArtifacts artifacts: 'dist/*.jar', fingerprint: true
```

## Credentials
**What**: Secure access to passwords, keys, tokens

```groovy
withCredentials([
    usernamePassword(credentialsId: 'github-creds', 
                     usernameVariable: 'USER', 
                     passwordVariable: 'PASS')
]) {
    sh 'git clone https://$USER:$PASS@github.com/user/repo.git'
}

// Or in environment
environment {
    DB_PASSWORD = credentials('db-password')
}
```

## Built-in Variables

```groovy
${BUILD_NUMBER}     // Current build number
${JOB_NAME}        // Job name
${WORKSPACE}       // Current workspace path
${BUILD_URL}       // URL to this build
${GIT_COMMIT}      // Git commit hash
${BRANCH_NAME}     // Git branch name (multibranch)
${CHANGE_ID}       // Pull request number
```

## Docker in Pipeline

```groovy
stage('Docker Build') {
    steps {
        script {
            def image = docker.build("myapp:${BUILD_NUMBER}")
            docker.withRegistry('https://registry.com', 'registry-creds') {
                image.push()
                image.push('latest')
            }
        }
    }
}
```

## Complete Example

```groovy
pipeline {
    agent any
    
    environment {
        APP_NAME = 'myapp'
        DOCKER_REGISTRY = 'myregistry.com'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/user/repo.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm run test:unit'
                    }
                }
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
            }
        }
        
        stage('Deploy') {
            when { branch 'main' }
            steps {
                script {
                    def image = docker.build("${APP_NAME}:${BUILD_NUMBER}")
                    image.push()
                }
                sh 'kubectl apply -f k8s/'
            }
        }
    }
    
    post {
        always {
            publishTestResults testResultsPattern: 'test-results.xml'
            archiveArtifacts artifacts: 'dist/**', fingerprint: true
            cleanWs()
        }
        failure {
            emailext (
                to: 'team@company.com',
                subject: "Failed: ${JOB_NAME} - ${BUILD_NUMBER}",
                body: "Build failed. Check: ${BUILD_URL}"
            )
        }
    }
}
```

## Common Patterns

**Multi-environment Deploy**:
```groovy
stage('Deploy') {
    steps {
        script {
            if (env.BRANCH_NAME == 'main') {
                sh 'deploy-prod.sh'
            } else {
                sh 'deploy-staging.sh'
            }
        }
    }
}
```

**Conditional Steps**:
```groovy
steps {
    script {
        if (fileExists('Dockerfile')) {
            sh 'docker build -t myapp .'
        } else {
            sh 'npm run build'
        }
    }
}
```

**Error Handling**:
```groovy
steps {
    script {
        try {
            sh 'risky-command'
        } catch (Exception e) {
            echo "Command failed: ${e.getMessage()}"
            currentBuild.result = 'UNSTABLE'
        }
    }
}
```

# GitHub Actions Core Working Guide

## Core Vocabulary

**Workflow**: Automated process defined in YAML file
**Action**: Reusable unit of code (pre-built or custom)
**Job**: Set of steps that run on same runner
**Step**: Individual task within a job
**Runner**: Server that executes workflows (GitHub-hosted or self-hosted)
**Event**: Trigger that starts workflow (push, PR, schedule)
**Context**: Information about workflow run, job, step

## Workflow Structure

```yaml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Hello World"
```

## Workflow File Location
**What**: YAML files in `.github/workflows/` directory

```
.github/
  workflows/
    ci.yml
    deploy.yml
    test.yml
```

## Events (Triggers)
**What**: What starts the workflow

```yaml
# Single event
on: push

# Multiple events
on: [push, pull_request]

# Event with filters
on:
  push:
    branches: [main, develop]
    paths: ['src/**']
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:  # Manual trigger
```

## Jobs
**What**: Collection of steps that run on same runner

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps: []
  
  test:
    runs-on: ubuntu-latest
    needs: build  # Wait for build job
    steps: []
  
  deploy:
    runs-on: ubuntu-latest
    needs: [build, test]  # Wait for both
    steps: []
```

## Runners
**What**: Environment where jobs execute

```yaml
runs-on: ubuntu-latest     # GitHub-hosted Ubuntu
runs-on: windows-latest    # GitHub-hosted Windows
runs-on: macos-latest      # GitHub-hosted macOS
runs-on: self-hosted       # Your own runner
runs-on: [self-hosted, linux, x64]  # Labels
```

## Steps
**What**: Individual tasks in a job

```yaml
steps:
  # Use pre-built action
  - uses: actions/checkout@v4
  
  # Run shell command
  - run: echo "Hello World"
  
  # Step with name
  - name: Install dependencies
    run: npm install
  
  # Multi-line command
  - run: |
      echo "Line 1"
      echo "Line 2"
```

## Actions (uses)
**What**: Reusable code blocks

```yaml
steps:
  # Checkout code
  - uses: actions/checkout@v4
  
  # Setup Node.js
  - uses: actions/setup-node@v4
    with:
      node-version: '18'
      cache: 'npm'
  
  # Custom action with inputs
  - uses: docker/build-push-action@v5
    with:
      context: .
      push: true
      tags: myapp:latest
```

## Environment Variables
**What**: Variables available to steps

```yaml
env:
  NODE_ENV: production
  API_KEY: ${{ secrets.API_KEY }}

jobs:
  build:
    env:
      BUILD_ENV: staging
    steps:
      - run: echo $NODE_ENV
      - run: echo $BUILD_ENV
        env:
          STEP_VAR: local  # Step-level env var
```

## Secrets
**What**: Encrypted variables for sensitive data

```yaml
steps:
  - run: echo ${{ secrets.API_KEY }}
  - uses: docker/login-action@v3
    with:
      username: ${{ secrets.DOCKER_USERNAME }}
      password: ${{ secrets.DOCKER_PASSWORD }}
```

## Conditions
**What**: Control when jobs/steps run

```yaml
jobs:
  deploy:
    if: github.ref == 'refs/heads/main'
    steps:
      - run: deploy.sh

  test:
    steps:
      - run: npm test
        if: success()  # Only if previous steps succeeded
      
      - run: cleanup.sh
        if: always()  # Always run
```

## Matrix Strategy
**What**: Run job with multiple configurations

```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
```

## Outputs
**What**: Pass data between jobs/steps

```yaml
jobs:
  build:
    outputs:
      version: ${{ steps.get-version.outputs.version }}
    steps:
      - id: get-version
        run: echo "version=1.2.3" >> $GITHUB_OUTPUT
  
  deploy:
    needs: build
    steps:
      - run: echo "Deploying version ${{ needs.build.outputs.version }}"
```

## Artifacts
**What**: Files to persist between jobs or download

```yaml
steps:
  # Upload artifacts
  - uses: actions/upload-artifact@v4
    with:
      name: build-files
      path: dist/
  
  # Download artifacts (different job)
  - uses: actions/download-artifact@v4
    with:
      name: build-files
      path: ./build
```

## Context Variables
**What**: Built-in information about workflow run

```yaml
steps:
  - run: echo "Event: ${{ github.event_name }}"
  - run: echo "Ref: ${{ github.ref }}"
  - run: echo "SHA: ${{ github.sha }}"
  - run: echo "Actor: ${{ github.actor }}"
  - run: echo "Repo: ${{ github.repository }}"
  - run: echo "Run ID: ${{ github.run_id }}"
  - run: echo "Job: ${{ job.status }}"
  - run: echo "Runner OS: ${{ runner.os }}"
```

## Complete CI/CD Example

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm test
      
      - uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: coverage/

  build:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
    steps:
      - uses: actions/checkout@v4
      
      - uses: docker/setup-buildx-action@v3
      
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=ref,event=branch
            type=sha
      
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: [test, build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - run: echo "Deploying ${{ needs.build.outputs.image-tag }}"
      - run: kubectl set image deployment/app app=${{ needs.build.outputs.image-tag }}
```

## Common Patterns

**Branch-based Deploy**:
```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: deploy-staging.sh

- name: Deploy to production  
  if: github.ref == 'refs/heads/main'
  run: deploy-prod.sh
```

**Cache Dependencies**:
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-npm-${{ hashFiles('package-lock.json') }}
    restore-keys: ${{ runner.os }}-npm-
```

**Parallel Jobs**:
```yaml
jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build:frontend
  
  backend:
    runs-on: ubuntu-latest  
    steps:
      - run: npm run build:backend
```

**Multi-step Setup**:
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-python@v4
    with:
      python-version: '3.9'
  - run: pip install -r requirements.txt
  - run: python -m pytest
```

## Reusable Workflows
**What**: Share workflows across repositories

```yaml
# .github/workflows/reusable-deploy.yml
on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
    secrets:
      deploy-token:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying to ${{ inputs.environment }}"
```

```yaml
# Use reusable workflow
jobs:
  deploy:
    uses: ./.github/workflows/reusable-deploy.yml
    with:
      environment: production
    secrets:
      deploy-token: ${{ secrets.DEPLOY_TOKEN }}
```

## Custom Actions
**What**: Create your own reusable actions

```yaml
# action.yml
name: 'My Custom Action'
description: 'Does something useful'
inputs:
  input-name:
    description: 'Input description'
    required: true
runs:
  using: 'node16'
  main: 'index.js'
```

## Debugging
**What**: Tools to troubleshoot workflows

```yaml
steps:
  - run: echo "Debug info"
    env:
      ACTIONS_STEP_DEBUG: true
  
  - run: |
      echo "Event: ${{ toJson(github.event) }}"
      echo "Context: ${{ toJson(github) }}"
```

---
----

-------------------------**Infrastructure automation**----------------

| Aspect | Terraform | Ansible |
|--------|-----------|---------|
| **Same Goal** | **Infrastructure automation** | **Infrastructure automation** |
| **But Purpose** | Infrastructure provisioning | Configuration management |
| **But What** | Creates/destroys resources | Configures existing resources |
| **But When** | Before servers exist | After servers exist |
| **But Language** | HCL (HashiCorp Language) | YAML playbooks |
| **But State** | Tracks infrastructure state | Stateless execution |
| **But Approach** | Declarative (what you want) | Procedural (how to do it) |
| **But Connection** | API calls to cloud providers | SSH/WinRM to servers |
| **But Idempotent** | Yes (via state management) | Yes (via modules) |
| **But Use Case** | "Build the datacenter" | "Configure the servers" |

**Same goal: Infrastructure automation. Different phases of the process.**

**Example workflow:**
1. **Terraform**: Create 3 EC2 instances with load balancer
2. **Ansible**: Install nginx, deploy app, configure monitoring on those instances

They're often used **together**, not as alternatives.

# Terraform Core Working Guide

## Core Vocabulary

**Infrastructure as Code (IaC)**: Define infrastructure using code files
**Resource**: Infrastructure component (VM, database, network)
**Provider**: Plugin that manages specific platform (AWS, Azure, GCP)
**State**: Current infrastructure tracking file
**Plan**: Preview of changes before applying
**Apply**: Execute the planned changes
**Destroy**: Remove all managed infrastructure
**Module**: Reusable group of resources

## Configuration Language (HCL)

```hcl
# Basic syntax
resource "aws_instance" "web" {
  ami           = "ami-12345"
  instance_type = "t2.micro"
  
  tags = {
    Name = "WebServer"
  }
}
```

## Core Workflow

```bash
terraform init     # Initialize working directory
terraform plan     # Preview changes
terraform apply    # Execute changes
terraform destroy  # Remove all resources
```

## Providers
**What**: Plugins that interact with cloud platforms

```hcl
# Configure provider
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}
```

## Resources
**What**: Infrastructure components you want to create

```hcl
# AWS EC2 instance
resource "aws_instance" "web" {
  ami           = "ami-12345"
  instance_type = "t2.micro"
  key_name      = "my-key"
  
  tags = {
    Name        = "WebServer"
    Environment = "prod"
  }
}

# Security Group
resource "aws_security_group" "web_sg" {
  name = "web-security-group"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

## Data Sources
**What**: Reference existing infrastructure

```hcl
# Get existing VPC
data "aws_vpc" "default" {
  default = true
}

# Get latest AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-20.04-amd64-server-*"]
  }
}

# Use data in resource
resource "aws_instance" "web" {
  ami    = data.aws_ami.ubuntu.id
  vpc_id = data.aws_vpc.default.id
}
```

## Variables
**What**: Parameterize your configuration

```hcl
# Define variable
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "environment" {
  description = "Environment name"
  type        = string
}

# Use variable
resource "aws_instance" "web" {
  instance_type = var.instance_type
  
  tags = {
    Environment = var.environment
  }
}
```

**Set variables:**
```bash
# Command line
terraform apply -var="environment=prod"

# Variables file (terraform.tfvars)
environment = "production"
instance_type = "t2.small"

# Environment variables
export TF_VAR_environment="prod"
```

## Outputs
**What**: Return values from your configuration

```hcl
output "instance_ip" {
  description = "Public IP of instance"
  value       = aws_instance.web.public_ip
}

output "instance_dns" {
  value = aws_instance.web.public_dns
}
```

**Access outputs:**
```bash
terraform output
terraform output instance_ip
```

## State File
**What**: Tracks what Terraform manages

```hcl
# terraform.tfstate (automatically created)
# Maps configuration to real-world resources
# NEVER edit manually
# Store remotely for teams:

terraform {
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-west-2"
  }
}
```

## Local Values
**What**: Computed values used multiple times

```hcl
locals {
  common_tags = {
    Project     = "MyApp"
    Environment = var.environment
    Owner       = "DevOps Team"
  }
  
  name_prefix = "${var.project}-${var.environment}"
}

resource "aws_instance" "web" {
  tags = local.common_tags
}
```

## Resource Dependencies
**What**: Control resource creation order

```hcl
# Implicit dependency (automatic)
resource "aws_instance" "web" {
  subnet_id = aws_subnet.public.id  # Depends on subnet
}

# Explicit dependency
resource "aws_instance" "web" {
  depends_on = [aws_security_group.web_sg]
}
```

## Count and For Each
**What**: Create multiple similar resources

```hcl
# Count (indexed)
resource "aws_instance" "web" {
  count         = 3
  ami           = "ami-12345"
  instance_type = "t2.micro"
  
  tags = {
    Name = "web-${count.index}"
  }
}

# For each (named)
variable "instances" {
  default = {
    web1 = "t2.micro"
    web2 = "t2.small"
  }
}

resource "aws_instance" "web" {
  for_each      = var.instances
  ami           = "ami-12345"
  instance_type = each.value
  
  tags = {
    Name = each.key
  }
}
```

## Conditionals
**What**: Create resources conditionally

```hcl
resource "aws_instance" "web" {
  count = var.create_instance ? 1 : 0
  ami   = "ami-12345"
}

# Conditional values
resource "aws_instance" "web" {
  instance_type = var.environment == "prod" ? "t2.large" : "t2.micro"
}
```

## Modules
**What**: Reusable groups of resources

```hcl
# Module structure
modules/
  vpc/
    main.tf
    variables.tf
    outputs.tf

# Use module
module "vpc" {
  source = "./modules/vpc"
  
  cidr_block = "10.0.0.0/16"
  environment = var.environment
}

# Access module outputs
resource "aws_instance" "web" {
  subnet_id = module.vpc.public_subnet_id
}
```

## Functions
**What**: Built-in functions for data transformation

```hcl
# String functions
upper(var.name)
lower(var.name)
join(",", var.list)
split(",", var.string)

# Collection functions
length(var.list)
concat(var.list1, var.list2)
contains(var.list, "value")

# Date/time
timestamp()
formatdate("YYYY-MM-DD", timestamp())

# Example usage
resource "aws_instance" "web" {
  tags = {
    Name = upper(var.instance_name)
    Date = formatdate("YYYY-MM-DD", timestamp())
  }
}
```

## Lifecycle Rules
**What**: Control resource behavior

```hcl
resource "aws_instance" "web" {
  ami           = "ami-12345"
  instance_type = "t2.micro"
  
  lifecycle {
    create_before_destroy = true  # Create new before destroying old
    prevent_destroy       = true  # Prevent accidental deletion
    ignore_changes       = [ami]  # Ignore AMI changes
  }
}
```

## Complete Example

```hcl
# variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
}

variable "instance_count" {
  description = "Number of instances"
  type        = number
  default     = 2
}

# main.tf
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

# Data sources
data "aws_vpc" "default" {
  default = true
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
  
  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-20.04-amd64-server-*"]
  }
}

# Local values
locals {
  common_tags = {
    Project     = "WebApp"
    Environment = var.environment
  }
}

# Security Group
resource "aws_security_group" "web" {
  name = "${var.environment}-web-sg"
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = local.common_tags
}

# EC2 Instances
resource "aws_instance" "web" {
  count                  = var.instance_count
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.environment == "prod" ? "t2.medium" : "t2.micro"
  vpc_security_group_ids = [aws_security_group.web.id]
  
  user_data = <<-EOF
    #!/bin/bash
    apt update
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
  EOF
  
  tags = merge(local.common_tags, {
    Name = "${var.environment}-web-${count.index + 1}"
  })
}

# outputs.tf
output "instance_ips" {
  description = "Public IP addresses"
  value       = aws_instance.web[*].public_ip
}

output "security_group_id" {
  description = "Security group ID"
  value       = aws_security_group.web.id
}
```

## Common Commands

```bash
# Initialize
terraform init

# Validate syntax
terraform validate

# Format code
terraform fmt

# Plan changes
terraform plan
terraform plan -out=plan.tfplan

# Apply changes
terraform apply
terraform apply plan.tfplan
terraform apply -auto-approve

# Destroy resources
terraform destroy
terraform destroy -auto-approve

# Show current state
terraform show
terraform state list

# Import existing resource
terraform import aws_instance.web i-1234567890abcdef0

# Refresh state
terraform refresh
```

## Best Practices

**File Organization:**
```
project/
├── main.tf          # Main configuration
├── variables.tf     # Input variables
├── outputs.tf       # Output values
├── terraform.tfvars # Variable values
└── versions.tf      # Provider requirements
```

**State Management:**
- Use remote state (S3, Terraform Cloud)
- Enable state locking
- Never edit state manually
- Backup state files

**Code Structure:**
- Use modules for reusable components
- Keep resources logically grouped
- Use meaningful names and tags
- Add descriptions to variables

**Security:**
- Store secrets in variables, not hardcoded
- Use least privilege IAM policies
- Enable encryption for sensitive resources
- Don't commit .tfvars files with secrets

# Ansible Core Working Guide

## Core Vocabulary

**Playbook**: YAML file defining tasks to run
**Task**: Single action to perform (install package, copy file)
**Module**: Pre-built unit that performs specific action
**Inventory**: List of target servers/hosts
**Host**: Target machine where tasks run
**Role**: Reusable collection of tasks, files, templates
**Handler**: Task that runs when notified by another task
**Facts**: System information gathered from hosts
**Idempotent**: Running multiple times produces same result

## Basic Structure

```yaml
# playbook.yml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  tasks:
    - name: Install nginx
      package:
        name: nginx
        state: present
```

## Inventory
**What**: Defines target hosts

```ini
# inventory.ini
[webservers]
web1.example.com
web2.example.com
192.168.1.10

[databases]
db1.example.com ansible_user=admin
db2.example.com ansible_port=2222

[production:children]
webservers
databases
```

```yaml
# inventory.yml (YAML format)
all:
  children:
    webservers:
      hosts:
        web1.example.com:
        web2.example.com:
    databases:
      hosts:
        db1.example.com:
          ansible_user: admin
```

## Playbook Structure
**What**: Main configuration file

```yaml
---
- name: Playbook description
  hosts: target_hosts
  become: yes                    # Run as sudo
  vars:                         # Variables
    app_name: myapp
  tasks:                        # List of tasks
    - name: Task description
      module_name:
        parameter: value
```

## Common Modules
**What**: Pre-built actions you can use

```yaml
# Package management
- name: Install package
  package:
    name: nginx
    state: present

# Specific package managers
- name: Install via apt
  apt:
    name: nginx
    state: latest
    update_cache: yes

- name: Install via yum
  yum:
    name: httpd
    state: present

# File operations
- name: Copy file
  copy:
    src: /local/file.txt
    dest: /remote/file.txt
    mode: '0644'
    owner: www-data

- name: Create file from template
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    backup: yes

# Service management
- name: Start and enable service
  service:
    name: nginx
    state: started
    enabled: yes

# User management
- name: Create user
  user:
    name: webapp
    shell: /bin/bash
    groups: sudo
    append: yes

# Command execution
- name: Run shell command
  shell: echo "Hello World" > /tmp/hello.txt

- name: Run command
  command: ls -la /home
```

## Variables
**What**: Store and reuse values

```yaml
# In playbook
vars:
  app_name: myapp
  app_port: 8080

# In separate file (group_vars/webservers.yml)
nginx_port: 80
app_user: webapp

# Use variables
- name: Install {{ app_name }}
  package:
    name: "{{ app_name }}"

- name: Create app directory
  file:
    path: "/opt/{{ app_name }}"
    state: directory
```

**Variable precedence (high to low):**
1. Command line: `-e "var=value"`
2. Task vars
3. Play vars
4. Host vars
5. Group vars

## Conditionals
**What**: Run tasks based on conditions

```yaml
- name: Install apache (RedHat family)
  yum:
    name: httpd
    state: present
  when: ansible_os_family == "RedHat"

- name: Install apache (Debian family)
  apt:
    name: apache2
    state: present
  when: ansible_os_family == "Debian"

# Multiple conditions
- name: Install development tools
  package:
    name: gcc
    state: present
  when: 
    - ansible_os_family == "RedHat"
    - env == "development"
```

## Loops
**What**: Repeat tasks with different values

```yaml
# Simple list
- name: Install packages
  package:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - git
    - vim

# List of dictionaries
- name: Create users
  user:
    name: "{{ item.name }}"
    shell: "{{ item.shell }}"
  loop:
    - { name: alice, shell: /bin/bash }
    - { name: bob, shell: /bin/zsh }

# Loop with variables
- name: Create directories
  file:
    path: "{{ item }}"
    state: directory
  loop: "{{ app_directories }}"
```

## Handlers
**What**: Tasks that run when notified

```yaml
tasks:
  - name: Copy nginx config
    template:
      src: nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    notify: restart nginx

  - name: Install nginx
    package:
      name: nginx
      state: present
    notify: restart nginx

handlers:
  - name: restart nginx
    service:
      name: nginx
      state: restarted
```

## Facts
**What**: System information automatically gathered

```yaml
# Use facts
- name: Show OS info
  debug:
    msg: "OS: {{ ansible_distribution }} {{ ansible_distribution_version }}"

- name: Install package based on OS
  package:
    name: "{{ 'httpd' if ansible_os_family == 'RedHat' else 'apache2' }}"
    state: present

# Custom facts
- name: Set custom fact
  set_fact:
    app_version: "1.2.3"

- name: Use custom fact
  debug:
    msg: "App version is {{ app_version }}"
```

## Templates
**What**: Dynamic files using Jinja2

```jinja2
# nginx.conf.j2
server {
    listen {{ nginx_port }};
    server_name {{ ansible_hostname }};
    
    location / {
        proxy_pass http://localhost:{{ app_port }};
    }
}
```

```yaml
# Use template
- name: Configure nginx
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/sites-available/{{ app_name }}
  vars:
    nginx_port: 80
    app_port: 3000
```

## Roles
**What**: Organized, reusable collections

```
roles/
  webserver/
    tasks/
      main.yml          # Main tasks
    handlers/
      main.yml          # Handlers
    templates/
      nginx.conf.j2     # Templates
    files/
      index.html        # Static files
    vars/
      main.yml          # Variables
    defaults/
      main.yml          # Default variables
```

```yaml
# roles/webserver/tasks/main.yml
---
- name: Install nginx
  package:
    name: nginx
    state: present

- name: Copy config
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: restart nginx

# Use role in playbook
- name: Configure web servers
  hosts: webservers
  roles:
    - webserver
```

## Error Handling
**What**: Handle failures and retries

```yaml
- name: Download file
  get_url:
    url: http://example.com/file.tar.gz
    dest: /tmp/file.tar.gz
  ignore_errors: yes

- name: Risky task
  shell: /path/to/risky/command
  register: result
  failed_when: result.rc != 0 and result.rc != 2

- name: Task with retry
  uri:
    url: http://api.example.com/health
  retries: 5
  delay: 10
  until: result.status == 200
```

## Complete Example

```yaml
# site.yml
---
- name: Deploy web application
  hosts: webservers
  become: yes
  vars:
    app_name: myapp
    app_port: 3000
    app_user: webapp
    
  tasks:
    - name: Update package cache
      package:
        update_cache: yes
      when: ansible_os_family == "Debian"
    
    - name: Install required packages
      package:
        name: "{{ item }}"
        state: present
      loop:
        - nginx
        - git
        - nodejs
        - npm
    
    - name: Create application user
      user:
        name: "{{ app_user }}"
        shell: /bin/bash
        create_home: yes
    
    - name: Create app directory
      file:
        path: "/opt/{{ app_name }}"
        state: directory
        owner: "{{ app_user }}"
        group: "{{ app_user }}"
        mode: '0755'
    
    - name: Clone application repository
      git:
        repo: https://github.com/user/myapp.git
        dest: "/opt/{{ app_name }}"
        version: main
      become_user: "{{ app_user }}"
      notify: restart app
    
    - name: Install npm dependencies
      npm:
        path: "/opt/{{ app_name }}"
      become_user: "{{ app_user }}"
    
    - name: Configure nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/sites-available/{{ app_name }}
      notify: restart nginx
    
    - name: Enable nginx site
      file:
        src: /etc/nginx/sites-available/{{ app_name }}
        dest: /etc/nginx/sites-enabled/{{ app_name }}
        state: link
      notify: restart nginx
    
    - name: Start and enable services
      service:
        name: "{{ item }}"
        state: started
        enabled: yes
      loop:
        - nginx
        - "{{ app_name }}"

  handlers:
    - name: restart nginx
      service:
        name: nginx
        state: restarted
    
    - name: restart app
      service:
        name: "{{ app_name }}"
        state: restarted
```

## Common Commands

```bash
# Run playbook
ansible-playbook site.yml

# Specify inventory
ansible-playbook -i inventory.ini site.yml

# Run specific tags
ansible-playbook site.yml --tags "config,deploy"

# Skip tags
ansible-playbook site.yml --skip-tags "database"

# Check syntax
ansible-playbook site.yml --syntax-check

# Dry run (don't make changes)
ansible-playbook site.yml --check

# Run on specific hosts
ansible-playbook site.yml --limit webservers

# Run with extra variables
ansible-playbook site.yml -e "env=production"

# Ad-hoc commands
ansible all -i inventory.ini -m ping
ansible webservers -m shell -a "uptime"
ansible databases -m package -a "name=mysql-server state=present" --become
```

## Ansible Vault
**What**: Encrypt sensitive data

```bash
# Create encrypted file
ansible-vault create secrets.yml

# Edit encrypted file
ansible-vault edit secrets.yml

# Encrypt existing file
ansible-vault encrypt vars.yml

# Decrypt file
ansible-vault decrypt vars.yml

# Run playbook with vault
ansible-playbook site.yml --ask-vault-pass
ansible-playbook site.yml --vault-password-file vault-pass.txt
```

```yaml
# Use encrypted variables
- name: Deploy with secrets
  hosts: webservers
  vars_files:
    - secrets.yml
  tasks:
    - name: Configure database
      template:
        src: db.conf.j2
        dest: /etc/app/db.conf
      vars:
        db_password: "{{ vault_db_password }}"
```

## Best Practices

**File Organization:**
```
project/
├── site.yml              # Main playbook
├── inventory/
│   ├── production
│   └── staging
├── group_vars/
│   ├── all.yml
│   └── webservers.yml
├── host_vars/
├── roles/
└── files/
```

**Writing Tasks:**
- Use descriptive names
- Make tasks idempotent
- Use modules instead of shell/command when possible
- Group related tasks
- Use handlers for service restarts

**Variables:**
- Use meaningful variable names
- Keep secrets in vault
- Use defaults in roles
- Group variables logically

**Testing:**
- Use `--check` mode for dry runs
- Test on staging first
- Use `ansible-lint` for code quality
- Validate templates before deployment
