# Bash & Linux Commands

## 1. Command Structure & Syntax

| Symbol / Command | Name                        | Purpose                             | Example                               | Output (for `sample.txt` with some text)                                          |
|------------------|-----------------------------|-------------------------------------|---------------------------------------|-----------------------------------------------------------------------------------|
| \|               | Pipe                        | Pass output to another command      | `ls \| grep .txt`                     | Lists only `.txt` files                                                           |
| **wc**           | Word Count                  | Counts lines, words, and characters | `wc sample.txt`                       | `3  10  57 sample.txt` → (3 lines, 10 words, 57 characters)                       |
| >                | Redirection (Output)        | Redirect output to file (overwrite) | `echo "Hello" > file.txt`             | Creates/overwrites `file.txt` with “Hello”                                        |
| >>               | Redirection (Append)        | Redirect output to file (append)    | `echo "World" >> file.txt`            | Adds “World” to the end of `file.txt`                                             |
| <                | Redirection (Input)         | Take input from file                | `sort < file.txt`                     | Sorts lines inside `file.txt`                                                     |
| 2>               | Error Redirection           | Redirect error output               | `command 2> error.log`                | Saves error messages to `error.log`                                               |
| &>               | Redirect All Output         | Redirect stdout & stderr            | `command &> output.log`               | Saves both output and errors                                                      |
| ;                | Command Separator           | Run commands sequentially           | `pwd; ls; whoami`                     | Runs one after another                                                            |
| &&               | Logical AND                 | Run second if first succeeds        | `mkdir test && cd test`               | Creates and moves into `test` if success                                          |
| \|\|             | Logical OR                  | Run second if first fails           | `ping server \|\| echo "Server down"` | Prints “Server down” if ping fails                                                |
| &                | Background Process          | Run command in background           | `sleep 60 &`                          | Runs sleep in background                                                          |
| $( )             | Command Substitution        | Store command output                | `DATE=$(date)`                        | Saves date in variable `DATE`                                                     |
| \`command\`      | Legacy Command Substitution | Same as $(), older syntax           | ``DATE=`date```                       | Same as above                                                                     |
| " "              | Double Quotes               | Allow variable expansion            | `echo "Today is $DATE"`               | Expands and prints actual date                                                    |
| ' '              | Single Quotes               | Treat literally, no expansion       | `echo 'Today is $DATE'`               | Prints text as-is                                                                 |
| \\               | Escape Character            | Escape special characters           | `echo \"Hello\"`                      | Prints `"Hello"`                                                                  |
| *                | Wildcard                    | Match zero or more characters       | `ls *.txt`                            | Lists all `.txt` files                                                            |
| ?                | Wildcard                    | Match exactly one character         | `ls file?.txt`                        | Matches `file1.txt`, `file2.txt` etc.                                             |
| []               | Character Set               | Match any character inside          | `ls file[123].txt`                    | Matches file1.txt, file2.txt, file3.txt                                           |
| {}               | Brace Expansion             | Expand to multiple values           | `echo {a,b,c}.txt`                    | Outputs `a.txt b.txt c.txt`                                                       |
| ~                | Home Directory              | Represents home directory           | `cd ~/Documents`                      | Goes to Documents folder                                                          |
| #                | Comment                     | Mark line as comment                | `# This is a comment`                 | No output, just a note                                                            |
| $                | Variable Prefix             | Access variable values              | `echo $HOME`                          | Prints home directory path                                                        |
| !                | History Expansion           | Repeat previous commands            | `!25`                                 | Runs command number 25                                                            |


## 2. File & Directory Operations

### Navigation & Listing
```bash
# Directory navigation
pwd                    # Show current directory
cd /path/to/dir       # Change directory
cd ..                 # Move one step back
cd ~                  # Go to home directory
cd -                  # Go to previous directory

# File listing with options
ls                    # Basic listing
ls -l                 # Long format (detailed)
ls -a                 # Show hidden files
ls -la                # Long format + hidden files
ls -lah               # Long format + hidden + human readable sizes
ls -R                 # Recursive listing
ls -t                 # Sort by modification time
ls -S                 # Sort by size
ls -r                 # Reverse order
ls -i                 # Show inode numbers
ls -d                 # List directories themselves
ls -F                 # Append type indicators
ls -1                 # One file per line
```

### File Operations
```bash
# Creating files and directories
touch file.txt        # Create empty file
mkdir new_dir         # Create directory
mkdir -p parent/child # Create parent directories if needed

# Copying and moving
cp file1 file2        # Copy file
cp -r dir1 dir2       # Copy directory recursively
cp -p file1 file2     # Preserve file attributes ## **File Attributes:**Metadata including timestamps (access/modification/change times), ownership (user/group), permissions (read/write/execute), file size, inode number, and file type.
## **`cp -p` vs regular `cp`:** Regular `cp` creates file with current timestamp and your ownership; `cp -p` preserves original file's timestamps, ownership, and permissions.
mv file1 file2        # Move/rename file
mv dir1 dir2          # Move/rename directory

# Deleting
rm file.txt           # Delete file
rm -r directory       # Delete directory (ask permission)
rm -rf directory      # Delete directory forcefully
rmdir empty_dir       # Remove empty directory

# File viewing
cat file.txt          # Display entire file
less file.txt         # Page-by-page viewing
head file.txt         # First 10 lines
head -n 20 file.txt   # First 20 lines
tail file.txt         # Last 10 lines
tail -f file.txt      # Follow file changes (logs)
```

### Permission Symbols Legend
- **u** → User (Owner)
- **g** → Group  
- **o** → Others
- **a** → All (u, g, o combined)
- **+** → Add permission
- **-** → Remove permission
- **=** → Set exact permission

### File Permissions & Ownership
```bash
# Permission changes (Symbolic)
chmod u+x file.sh     # Add execute for user
chmod g-w file.txt    # Remove write for group
chmod o+r file.txt    # Add read for others
chmod ugo+rwx file    # Full permissions for all
chmod a+x file        # Execute for all (a = all)

# Permission changes (Octal)
chmod 777 file.sh     # Full permissions (rwxrwxrwx)
chmod 755 script.sh   # rwxr-xr-x
chmod 644 document    # rw-r--r--
chmod 600 private     # rw-------
chmod 400 readonly    # r--------

# Ownership changes
chown user:group file # Change owner and group
chown user file       # Change owner only
chown -R user:group dir/ # Change recursively
```



## 3. Text Processing & Search

### Text Viewing & Editing

```bash
# Text editors
nano file.txt         # Beginner-friendly editor
vim file.txt          # Advanced editor
code file.txt         # VS Code (if installed)

# Nano shortcuts:
# Ctrl+X → Exit, Ctrl+S → Save, Ctrl+K → Cut line, Ctrl+U → Paste

# Vim basics:
# ESC → Normal Mode, i → Insert Mode
# :wq → Save & Exit, :q! → Quit without saving
# dd → Delete line, yy → Copy line, p → Paste
# x  → Delete character under cursor (like Backspace)
# u  → Undo last change
# Ctrl+r → Redo undone change
# h / j / k / l → Move left / down / up / right
# 0 / $ → Jump to start / end of line
# gg / G → Jump to top / bottom of file
# /word → Search forward for "word"
# n / N → Next / previous search result
# v → Start visual selection mode
# :set number → Show line numbers
```


### Search & Pattern Matching


* **grep** – Search text for patterns
* **find** – Locate files and directories
* **sed** – Stream editor for text manipulation
* **awk** – Pattern scanning and text processing
* **wc** – Count lines, words, and characters
* **cut** – Extract specific columns or characters
* **sort** – Arrange lines alphabetically or numerically
* **uniq** – Remove or count duplicate lines


```bash
# grep - Search in files
grep "pattern" file.txt           # Basic search
grep -i "pattern" file.txt        # Case insensitive
grep -r "pattern" /directory      # Recursive search
grep -n "pattern" file.txt        # Show line numbers
grep -v "pattern" file.txt        # Invert match (exclude)
grep -c "pattern" file.txt        # Count matches
grep -l "pattern" *.txt           # List files with matches

# find - Search files and directories
find /path -name "*.txt"          # Find by name
find /path -type f                # Find files only
find /path -type d                # Find directories only
find /path -size +100M            # Find large files
find /path -mtime -7              # Modified in last 7 days
find /path -name "*.log" -delete  # Find and delete
```

```bash
# sed - Stream editor (edit text on the fly)
sed 's/old/new/g' file.txt        # Replace all occurrences
sed -i 's/old/new/g' file.txt     # Edit file in place
sed -n '1,5p' file.txt            # Print lines 1–5
sed '/pattern/d' file.txt         # Delete lines with pattern
```

```bash
# awk - Pattern scanning and data extraction
awk '{print $1, $3}' file.txt     # Print 1st and 3rd columns
awk -F',' '{print $1}' file.csv   # Use comma as delimiter
awk '/error/ {print}' file.txt    # Print lines with "error"
awk '{sum += $2} END {print sum}' file.txt  # Sum column 2
```

```bash
# wc - Word, line, and character count
wc file.txt                       # Show lines, words, and characters
wc -l file.txt                     # Count lines
wc -w file.txt                     # Count words
wc -m file.txt                     # Count characters
```

```bash
# cut - Extract columns or characters
cut -d',' -f1 file.csv             # Extract first column (CSV)
cut -c1-10 file.txt                # Extract first 10 characters
cut -f2 file.txt                   # Extract 2nd tab-delimited field
```

```bash
# sort — Sort lines of text files

**1.**
You have a log file `access.log` with thousands of IP addresses.
How do you find the **top 5 most frequent IPs**?

**Answer:**

```bash
cat access.log | sort | uniq -c | sort -nr | head -5
```

---

**2.**
You have a CSV `sales.csv` where column 3 has the sales amount.
How do you sort it **numerically by that column** in descending order?

**Answer:**

```bash
sort -t "," -k3nr sales.csv
```

---

**3.**
You have a file `students.txt` with names that may repeat.
How do you find only the names that occur **more than once**?

**Answer:**

```bash
sort students.txt | uniq -d
```

---

**4.**
From a system log file `syslog`, you want to see **how many times each error type** occurred.
Each line starts with the error code.

**Answer:**

```bash
cut -d " " -f1 syslog | sort | uniq -c | sort -nr
```

---

**5.**
You have a file `files.txt` listing file sizes with suffixes (K, M, G).
How do you sort them **in ascending order of actual size**?

**Answer:**

```bash
sort -h files.txt
```

sort file.txt                      # Alphabetical (default)
sort -n file.txt                   # Numeric sort (1 < 2 < 10)
sort -r file.txt                   # Reverse order
sort -u file.txt                   # Unique + sorted (remove duplicates)
sort -f file.txt                   # Ignore case while sorting
sort -h file.txt                   # Sort human-readable sizes (1K, 2M, etc.)
sort -k 2 file.txt                 # Sort by 2nd column
sort -t ":" -k3 file.txt           # Use ':' as delimiter, sort by 3rd field
sort -M file.txt                   # Sort by month names (Jan, Feb, etc.)
sort -c file.txt                   # Check if file is already sorted
sort -o sorted.txt file.txt        # Output sorted result to another file

# Combine with uniq — remove duplicate lines after sorting
sort file.txt | uniq               # Sort first, then remove exact duplicates
sort file.txt | uniq -c            # Count occurrences of unique lines
sort file.txt | uniq -d            # Show only duplicate lines
sort file.txt | uniq -u            # Show only unique (non-repeated) lines

# Practical Examples
sort -t "," -k2n employees.csv     # Sort CSV by 2nd column numerically  
sort -k5 -r -h file.txt            # Sort by 5th column, reverse, human-readable sizes  
sort file.txt | uniq | sort -r     # Remove duplicates, then reverse sort

```

```bash
# uniq - Remove or count duplicates
uniq file.txt                      # Remove adjacent duplicates
uniq -c file.txt                   # Count occurrences
uniq -d file.txt                   # Show only duplicates
```

---

```bash
# 1. Count lines that contain “error”
grep "error" sample.txt | wc -l

# 2. Show unique words in file
cat sample.txt | tr ' ' '\n' | sort | uniq

# 3. Show top 5 most frequent words
cat sample.txt | tr ' ' '\n' | sort | uniq -c | sort -nr | head -5

# 4. Find all lines with “fail” and show their line numbers
grep -n "fail" sample.txt

# 5. Count total characters in lines with “info”
grep "info" sample.txt | wc -m

# 6. Show only first 10 lines containing “user”
grep "user" sample.txt | head -10

# 7. Count unique IPs (example log)
awk '{print $1}' sample.txt | sort | uniq | wc -l

# 8. Show top 3 most repeated IPs
awk '{print $1}' sample.txt | sort | uniq -c | sort -nr | head -3

# 9. Find lines with “error” and replace “critical” with “CRITICAL”
grep "error" sample.txt | sed 's/critical/CRITICAL/g'

# 10. Display line numbers of lines containing “login”
grep -n "login" sample.txt | cut -d: -f1

# 11. Find files containing “config” in current directory
grep -rl "config" .

# 12. Show lines 5–10 containing “warning”
sed -n '5,10p' sample.txt | grep "warning"

# 13. Show total number of lines not containing “success”
grep -v "success" sample.txt | wc -l

# 14. Count lines with more than 50 characters
awk 'length($0) > 50' sample.txt | wc -l

# 15. Show words on line 10 only
sed -n '10p' sample.txt | tr ' ' '\n'

# 16. Find all `.log` files and count lines containing “error”
find . -name "*.log" -exec grep -c "error" {} \;

# 17. Combine two filters: lines with “user” but not “admin”
grep "user" sample.txt | grep -v "admin"

# 18. Extract column 2 from lines containing “process”
grep "process" sample.txt | awk '{print $2}'

# 19. Sort by second column numerically (e.g., CPU usage)
awk '{print $2}' sample.txt | sort -n

# 20. Count total words in lines with “debug”
grep "debug" sample.txt | wc -w
```



## 4. Process Management

### Process Monitoring
```bash
# Process listing
ps                    # Current shell processes
ps aux                # All processes (detailed)
ps -ef                # All processes (different format)
ps aux | grep python  # Find Python processes

# Real-time monitoring
top                   # Basic real-time process monitor
htop                  # Enhanced interactive monitor
watch -n 1 'ps aux'  # Refresh command every second
```

### Process Control
```bash
# Starting processes
./script.sh          # Run script in foreground
./script.sh &         # Run in background
nohup ./script.sh &   # Run detached from terminal
disown -h %1          # Detach background job

# Killing processes
kill PID              # Terminate process (SIGTERM)
kill -9 PID           # Force kill (SIGKILL)
killall process_name  # Kill by name
pkill -f pattern      # Kill by pattern match

# Job control
jobs                  # List background jobs
fg %1                 # Bring job 1 to foreground
bg %1                 # Send job 1 to background
```

## 5. System Information & Monitoring

### System Information
```bash
# OS and system info
uname -a              # Kernel and system info
lsb_release -a        # OS version details
cat /etc/os-release   # OS information
hostnamectl           # Hostname and OS info
whoami                # Current username
id                    # User ID and groups
groups $USER          # User's groups

# Hardware information
lscpu                 # CPU information
lsmem                 # Memory information
lsblk                 # Block devices
lsusb                 # USB devices
lspci                 # PCI devices
```

### System Monitoring
```bash
# Memory and disk usage
free -h               # Memory usage (human readable)
df -h                 # Disk usage by filesystem
du -sh *              # Size of each item in current dir
du -sh folder         # Size of specific folder

# System performance
htop                  # Interactive system monitor
top                   # Basic system monitor
watch -n 1 nvidia-smi # Monitor GPU (NVIDIA)
iostat                # I/O statistics
iotop                 # I/O usage by process
```

### Network Information
```bash
# Network interfaces and connections
ip a                  # Show all network interfaces
ifconfig              # Alternative interface display
netstat -tulnp        # Show open ports and connections
ss -tulnp             # Modern alternative to netstat
ping google.com       # Test connectivity
```

#### netstat Options Explained
- **-t**: TCP connections
- **-u**: UDP connections  
- **-l**: Listening ports only
- **-n**: Numerical addresses (no DNS resolution)
- **-p**: Show process ID and name

## 6. Package Management & Services

### APT Package Manager (Debian/Ubuntu)
```bash
# Package operations
sudo apt update                    # Update package index
sudo apt upgrade                   # Upgrade installed packages
sudo apt install package_name     # Install package
sudo apt remove package_name      # Remove package
sudo apt purge package_name       # Remove package + config
sudo apt autoremove               # Remove unused dependencies
sudo apt search keyword           # Search for packages
sudo apt show package_name        # Show package info
```

### Service Management (systemd)
```bash
# Service control
sudo systemctl start service_name     # Start service
sudo systemctl stop service_name      # Stop service
sudo systemctl restart service_name   # Restart service
sudo systemctl reload service_name    # Reload configuration
sudo systemctl enable service_name    # Enable at boot
sudo systemctl disable service_name   # Disable at boot
sudo systemctl status service_name    # Check service status

# System control
sudo systemctl reboot             # Restart system
sudo systemctl poweroff          # Shutdown system
systemctl list-units             # List all units
systemctl list-units --failed    # List failed units
```

## 7. Environment & Variables

### Environment Variables
```bash
# Viewing variables
echo $HOME            # Show home directory
echo $PATH            # Show executable paths
echo $USER            # Show current user
env                   # Show all environment variables
printenv              # Alternative to env

# Setting variables
export VAR_NAME="value"              # Set environment variable
echo 'export PATH="$PATH:/new/path"' >> ~/.bashrc  # Add to PATH
source ~/.bashrc                     # Reload bash configuration

# Common environment operations
export JAVA_HOME="/usr/lib/jvm/java-11"
export PATH="$PATH:$JAVA_HOME/bin"
```

### Shell Configuration
```bash
# Configuration files
~/.bashrc             # Bash configuration (non-login shells)
~/.bash_profile       # Bash configuration (login shells)  
~/.profile            # Generic shell configuration
/etc/bash.bashrc      # System-wide bash configuration

# Reloading configuration
source ~/.bashrc      # Apply changes immediately
. ~/.bashrc           # Alternative syntax for source
```

Perfect — you’re referring to **positional variables (`$1`, `$2`, etc.)** and then **common environment variables** as a continuation of your previous environment section.

Here’s a neatly polished, fresher-to-medium level version that blends smoothly with your previous notes:

---

### Positional & Special Variables

```bash
# Inside a shell script, these represent command-line arguments
$0   → Name of the script
$1   → First argument (P1)
$2   → Second argument (P2)
$#   → Number of arguments passed
$@   → All arguments as a list
$*   → All arguments as a single string
$$   → PID (Process ID) of current shell
$!   → PID of last background command
$?   → Exit status of last command (0 = success)
```

Example:

```bash
#!/bin/bash
echo "Script name: $0"
echo "First arg (P1): $1"
echo "Second arg (P2): $2"
echo "Total args: $#"
echo "All args: $@"
```

Run:

```bash
bash test.sh hello linux
```

Output:

```
Script name: test.sh
First arg (P1): hello
Second arg (P2): linux
Total args: 2
All args: hello linux
```


```bash
$HOME       → User’s home directory
$USER       → Current username
$PATH       → Search path for executables
$PWD        → Current working directory
$SHELL      → Default shell path
$LANG       → System language/locale
$HOSTNAME   → System host name
$LOGNAME    → Login name
$EDITOR     → Default editor (like vim, nano)
$RANDOM     → Random number each call
$PS1        → Shell prompt format
$MAIL       → Mail storage path
$UID        → User ID number
```

Example:

```bash
echo $HOME
echo $PATH
echo $USER
echo $PWD
```

Output Example:

```
/home/satya
/usr/local/bin:/usr/bin:/bin:/usr/local/sbin
satya
/home/satya
```

---

### Pro Tip

* Positional variables (`$1`, `$2`, etc.) are **temporary per script run**.
* Environment variables (`$PATH`, `$HOME`, etc.) are **global for the shell session**.
* Use `export` to make a shell variable available to sub-shells.

---

Would you like me to extend this next into **conditional statements (if, elif, else)** — that’s usually the next scripting layer after variable handling.


## 8. File Transfer & Remote Access

### SSH (Secure Shell)
```bash
# Basic SSH connection
ssh username@server_ip            # Connect to remote server
ssh -p 2222 user@server          # Connect on different port

# SSH key management
ssh-keygen -t rsa -b 4096 -C "email@example.com"  # Generate key pair
ssh-copy-id user@server_ip       # Copy public key to server
ssh-add ~/.ssh/private_key       # Add key to SSH agent

# SSH configuration
~/.ssh/config                    # SSH client configuration
~/.ssh/authorized_keys           # Authorized public keys
~/.ssh/known_hosts              # Known server fingerprints
```

### File Transfer
```bash
# SCP (Secure Copy)
scp file.txt user@server:/remote/path      # Copy file to server
scp user@server:/remote/file.txt ./        # Copy file from server
scp -r folder user@server:/remote/path     # Copy directory

# RSYNC (Advanced synchronization)
rsync -av source/ destination/             # Archive mode, verbose
rsync -av --delete source/ dest/           # Delete extra files
rsync -av user@server:/remote/ ./local/    # Remote synchronization

# wget & curl (Download files)
wget http://example.com/file.zip           # Download file
wget -r http://example.com/                # Recursive download
curl -O http://example.com/file.zip        # Download with curl
curl -L http://example.com/redirect        # Follow redirects
```

## 9. Text Streams & Redirection

### Input/Output Redirection
```bash
# Output redirection
command > file.txt              # Redirect stdout (overwrite)
command >> file.txt             # Redirect stdout (append)
command 2> error.log            # Redirect stderr
command 2>&1                    # Redirect stderr to stdout
command &> all_output.log       # Redirect both stdout and stderr
command | tee file.txt          # Write to file AND display

# Input redirection
command < input.txt             # Take input from file
command <<< "string"            # Here string
command << EOF                  # Here document
line 1
line 2
EOF
```

### Pipe Operations
```bash
# Basic piping
ls | grep .txt                  # Filter ls output
ps aux | grep python            # Find Python processes
cat file.txt | sort | uniq      # Chain multiple commands

# Advanced piping
ls -la | awk '{print $9, $5}'   # Extract filename and size
netstat -tulnp | grep :80       # Find processes on port 80
dmesg | tail -20                # Last 20 kernel messages
```

## 10. Archives & Compression

### TAR (Tape Archive)
```bash
# Creating archives
tar -cvf archive.tar files/         # Create tar archive
tar -czvf archive.tar.gz files/     # Create compressed archive (gzip)
tar -cjvf archive.tar.bz2 files/    # Create compressed archive (bzip2)

# Extracting archives
tar -xvf archive.tar                # Extract tar archive
tar -xzvf archive.tar.gz            # Extract gzip compressed
tar -xjvf archive.tar.bz2           # Extract bzip2 compressed
tar -xvf archive.tar -C /target/    # Extract to specific directory

# TAR options:
# c = create, x = extract, v = verbose, f = file
# z = gzip, j = bzip2, t = list contents
```

### Other Compression Tools
```bash
# ZIP/UNZIP
zip -r archive.zip folder/          # Create zip archive
unzip archive.zip                   # Extract zip archive
unzip -l archive.zip                # List contents without extracting

# GZIP/GUNZIP
gzip file.txt                       # Compress file (creates file.txt.gz)
gunzip file.txt.gz                  # Decompress file
zcat file.txt.gz                    # View compressed file content
```

## 11. Scheduled Tasks & Automation

### Cron Jobs
```bash
# Cron management
crontab -e                          # Edit user's crontab
crontab -l                          # List current cron jobs
crontab -r                          # Remove all cron jobs
sudo crontab -u username -e         # Edit another user's crontab

# Cron time format: minute hour day month dayofweek command
# Examples:
0 2 * * *     /path/to/script.sh    # Daily at 2:00 AM
*/15 * * * *  /path/to/script.sh    # Every 15 minutes
0 0 1 * *     /path/to/script.sh    # First day of every month
0 9 * * 1-5   /path/to/script.sh    # 9 AM on weekdays
```

### Background Processes
```bash
# Process control
nohup command &                     # Run detached from terminal
disown -h %1                        # Detach job from shell
screen -S session_name              # Create named screen session
tmux new-session -d -s session      # Create detached tmux session

# Process monitoring
jobs                                # List background jobs
ps aux | grep process_name          # Find specific process
pgrep -f pattern                    # Find process by pattern
```

## 12. Python Integration & Development

### Python Environment Management
```bash
# Virtual environments
python3 -m venv myenv               # Create virtual environment
source myenv/bin/activate           # Activate environment
deactivate                          # Deactivate environment
pip install package                 # Install package in venv
pip freeze > requirements.txt       # Export dependencies
pip install -r requirements.txt     # Install from requirements

# Python execution
python3 script.py                   # Run Python script
python3 -m module                   # Run module as script
python3 -m http.server 8000         # Start HTTP server
python3 -c "print('Hello')"         # Execute Python code
```

### Development Tools
```bash
# FastAPI development
uvicorn main:app --reload --host 0.0.0.0 --port 8000
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > output.log 2>&1 &

# Process management for development
ps aux | grep uvicorn               # Find uvicorn processes
kill <PID>                          # Stop development server
```

## 13. Common Troubleshooting & System Maintenance

### System Diagnostics
```bash
# Log viewing
journalctl                          # View systemd logs
journalctl -u service_name         # View logs for specific service
journalctl -f                       # Follow logs in real-time
tail -f /var/log/syslog            # Follow system log
dmesg                              # View kernel messages
dmesg | tail -20                   # Last 20 kernel messages
```

### File System Checks
```bash
# Disk operations
lsblk                               # List block devices
fdisk -l                            # List disk partitions
mount                               # Show mounted filesystems
df -h                               # Disk usage by filesystem
du -sh * | sort -hr                 # Largest directories first
```

### Performance Troubleshooting
```bash
# Resource usage
top -p PID                          # Monitor specific process
iostat -x 1                         # I/O statistics every second
iotop                               # I/O usage by process
nethogs                             # Network usage by process
```

## 14. Security & User Management

### User Management
```bash
# User operations
sudo useradd -m username            # Create user with home directory
sudo usermod -aG group username     # Add user to group
sudo passwd username                # Change user password
sudo deluser username               # Delete user
groups username                     # Show user's groups
id username                         # Show user ID and groups

# Permission troubleshooting
sudo chown -R user:group directory  # Change ownership recursively
sudo chmod -R 755 directory         # Change permissions recursively
```

### Security Commands
```bash
# SSH security
sudo systemctl status ssh           # Check SSH service
sudo nano /etc/ssh/sshd_config     # Edit SSH configuration
sudo systemctl restart ssh          # Restart SSH service

# Firewall (UFW - Uncomplicated Firewall)
sudo ufw enable                     # Enable firewall
sudo ufw allow 22                   # Allow SSH
sudo ufw allow 80                   # Allow HTTP
sudo ufw status                     # Check firewall status
```

Perfect, bro. Here’s your next clean continuation — formatted exactly like your previous Linux notes, same indentation and clarity.

---
---
---


**15. Shell Scripting Essentials**

A shell script is a text file containing a series of Linux commands executed in sequence.
It automates repetitive tasks and system operations.

```bash
#!/bin/bash
# sample.sh
echo "Welcome to Shell Scripting"
```

Make it executable:

```bash
chmod +x sample.sh
./sample.sh
```

---

**16. Variables, Operators, and Arrays**

Variables store and manipulate data in shell scripts.
Remember: **no spaces** around the `=` sign.

```bash
name="Satya"
echo $name
```

**Types of Variables:**

1. **Local Variables** – Exist only within the current shell/session.
2. **Environment Variables** – Available to all child processes.
3. **Shell Variables** – Special built-in variables (like `$PWD`, `$HOME`).
4. **Readonly Variables** – Cannot be changed after assignment.

   ```bash
   readonly pi=3.14
   echo $pi
   pi=22/7   # Error: readonly variable
   ```
5. **Unsetting Variables** – Deletes a variable.

   ```bash
   unset name
   echo $name   # No output
   ```

**System Variables (Predefined by Shell):**

```bash
echo $HOME     # Home directory
echo $USER     # Logged-in username
echo $PWD      # Current directory
```

**Arithmetic Operations:**
Use `$(( ))` for arithmetic expressions.

```bash
a=10
b=3
echo $((a + b))   # Addition
echo $((a - b))   # Subtraction
echo $((a * b))   # Multiplication
echo $((a / b))   # Division (integer)
echo $((a % b))   # Modulus
```

**String Operations:**

```bash
str="Hello World"
echo ${#str}              # Length of string → 11
echo ${str:0:5}           # Substring → Hello
echo ${str/World/Bash}    # Replace 'World' with 'Bash'
```

**Array Variables:**
Arrays store multiple values in a single variable.
Use parentheses `()` and space-separated values.

```bash
fruits=("apple" "banana" "mango")
echo ${fruits[0]}         # Access first element → apple
echo ${fruits[@]}         # Print all elements
echo ${#fruits[@]}        # Number of elements → 3
```

**Add / Update / Remove Elements:**

```bash
fruits[3]="grape"         # Add new element
fruits[1]="orange"        # Update element
unset fruits[2]           # Remove element
echo ${fruits[@]}         # apple orange grape
```

Arrays are useful for looping over lists, processing multiple filenames, or storing grouped data — making your shell scripts far more flexible and efficient.

Ah, got it — you don’t just want logical ones; you want **every category of operator** (Arithmetic, Relational, Logical, String, and File Test) shown in *all possible syntaxes* — meaning how each one can be written using normal modern style (`$(( ))`, `[[ ]]`, `&&`, etc.) **and** traditional shell forms (`expr`, `-a`, `-o`, test brackets `[ ]`).

Here’s the complete, clean version for **Operators and all their usage forms**:

---

**17. Operators (All Forms and Usages)**

Operators in shell scripting are used for arithmetic, comparison, logical control, string checks, and file testing.
Each can be expressed in multiple ways:

---

**1. Arithmetic Operators**
Used for numeric calculations.

```bash
a=10
b=3

# Modern (recommended)
echo $((a + b))      # Addition → 13
echo $((a - b))      # Subtraction → 7
echo $((a * b))      # Multiplication → 30
echo $((a / b))      # Division → 3
echo $((a % b))      # Modulus → 1

# Traditional (using expr)
expr $a + $b
expr $a - $b
expr $a \* $b
expr $a / $b
expr $a % $b
```

---

**2. Relational Operators**
Used for numeric comparison inside `[ ]` or `[[ ]]`.

```bash
a=5
b=10

# Using test brackets [ ]
[ $a -eq $b ]   # Equal
[ $a -ne $b ]   # Not equal
[ $a -gt $b ]   # Greater than
[ $a -lt $b ]   # Less than
[ $a -ge $b ]   # Greater than or equal to
[ $a -le $b ]   # Less than or equal to

# Using [[ ]] (preferred, modern)
[[ $a -eq $b ]]
[[ $a -lt $b ]]
[[ $a -gt $b ]]

# Using expr
expr $a = $b
expr $a \> $b
expr $a \< $b
```

---

**3. Logical Operators**
Used to combine or invert conditions.

```bash
a=5
b=8

# Modern symbolic form (preferred)
[ $a -lt 10 ] && [ $b -gt 5 ]    # AND (both true)
[ $a -lt 10 ] || [ $b -gt 20 ]   # OR (any one true)
! [ $a -eq $b ]                  # NOT (negation)

# Traditional (older)
[ $a -lt 10 -a $b -gt 5 ]        # AND using -a
[ $a -lt 10 -o $b -gt 20 ]       # OR using -o
! [ $a -eq $b ]                  # NOT same as modern

# Modern [[ form ]]
[[ $a -lt 10 && $b -gt 5 ]]
[[ $a -lt 10 || $b -gt 20 ]]
[[ ! $a -eq $b ]]
```

---

**4. String Operators**
Used to compare or test strings.

```bash
str1="Hello"
str2="World"

# Basic test
[ $str1 = $str2 ]       # Equal
[ $str1 != $str2 ]      # Not equal
[ -z $str1 ]            # True if string is empty
[ -n $str1 ]            # True if string is not empty

# With [[ ]]
[[ $str1 == $str2 ]]
[[ $str1 != $str2 ]]
[[ -z $str1 ]]
[[ -n $str1 ]]

# Using expr
expr "$str1" = "$str2"
expr "$str1" != "$str2"
```

---

**5. File Test Operators**
Used to check file type, existence, or permissions.

```bash
file="data.txt"
dir="myfolder"

# File properties
[ -e $file ]   # File exists
[ -f $file ]   # Regular file
[ -d $dir ]    # Directory

# File permissions
[ -r $file ]   # Readable
[ -w $file ]   # Writable
[ -x $file ]   # Executable

# Modern [[ form ]]
[[ -e $file && -r $file ]]
[[ -d $dir || -f $file ]]
```

---

**6. Combined Example (All Together):**

```bash
a=5
b=10
file="test.sh"

if [[ $a -lt $b && -f $file && -n $USER ]]
then
  echo "All conditions true"
else
  echo "Condition failed"
fi
```

---

**Quick Summary Table**

| Type       | Modern Form            | Traditional Form    | Example                     |
| ---------- | ---------------------- | ------------------- | --------------------------- |
| Arithmetic | `$((a + b))`           | `expr $a + $b`      | 13                          |
| Relational | `[[ $a -lt $b ]]`      | `[ $a -lt $b ]`     | true/false                  |
| Logical    | `&&, \|\|, !`          | `-a, -o, !`         | `[ $a -lt 10 -a $b -gt 5 ]` |
| String     | `[[ $str1 == $str2 ]]` | `[ $str1 = $str2 ]` | true/false                  |
| File Test  | `[[ -f file ]]`        | `[ -f file ]`       | true/false                  |

---

**5. File Test Operators:**
Used to check file type and permissions.

```bash
[ -e file.txt ]   # File exists
[ -f file.txt ]   # Regular file
[ -d dir ]        # Directory
[ -r file.txt ]   # Readable
[ -w file.txt ]   # Writable
[ -x file.txt ]   # Executable
```

---

In short:

* Use `$(( ))` for modern arithmetic (cleaner, faster).
* Use `expr` for backward compatibility or inline evaluation in older shells.

---

**17. Input / Output & Redirection**

Used to control input, output, and data flow.

```bash
echo "Enter name:"
read name
echo "Welcome, $name"
```

Redirections:
#!/bin/bash
# sample.sh
echo "Welcome to Shell Scripting"
```bash
echo "Data" > file.txt      # Overwrite file
echo "More Data" >> file.txt # Append to file
cat < file.txt              # Read file as input
```

Pipe connects multiple commands:

```bash
ls | grep ".txt"
```

---

**18. Conditional Statements**

Used for decision-making with `if`, `elif`, and `else`.

```bash
if [ $a -gt $b ]; then
  echo "a is greater"
elif [ $a -eq $b ]; then
  echo "Equal"
else
  echo "b is greater"
fi
```

File checks:

```bash
[ -f file.txt ] && echo "File exists"
[ -d folder ] && echo "Directory exists"
```

Common test options:

```
-e file  → Exists
-f file  → Regular file
-d file  → Directory
-z str   → String is empty
-n str   → String is not empty
```

---

**19. Loops**

Used to repeat actions multiple times.

```bash
for i in 1 2 3 4 5
do
  echo "Number: $i"
done
```

While loop:

```bash
count=1
while [ $count -le 5 ]
do
  echo "Count: $count"
  ((count++))
done
```

Until loop:

```bash
num=1
until [ $num -gt 3 ]
do
  echo "Num: $num"
  ((num++))
done
```

select loop:

```bash
#!/bin/bash

echo "Choose your favorite fruit:"
select fruit in Apple Banana Mango Exit
do
  case $fruit in
    Apple)
      echo "You chose Apple!" ;;
    Banana)
      echo "You chose Banana!" ;;
    Mango)
      echo "You chose Mango!" ;;
    Exit)
      echo "Goodbye!"
      break ;;
    *)
      echo "Invalid option, try again." ;;
  esac
done

```

- substitution:
In shell scripting, **substitution** means replacing something (like a variable, command, or arithmetic expression) with its evaluated value before the command runs.

There are **three main types** of substitution:

**1. Variable Substitution**
Used to access variable values.

```bash
name="Satya"
echo "Hello, $name"      # → Hello, Satya
echo "Length: ${#name}"  # → 5
```

**2. Command Substitution**
Used to store the output of a command into a variable or use it directly.

```bash
today=$(date)             # modern syntax
echo "Today is: $today"

# or old style
today=`date`
echo "Today is: $today"
```

- list of common **escape sequences** used in shell scripting (mainly with `echo -e` or `printf`):

```bash
\n   → New line  
\t   → Horizontal tab  
\v   → Vertical tab  
\r   → Carriage return (moves cursor to line start)  
\b   → Backspace (deletes one character)  
\a   → Alert (bell sound)  
\\   → Backslash itself  
\"   → Double quote  
\'   → Single quote  
\c   → Suppress further output (in echo)
```

Example:

```bash
echo -e "Hello\tWorld\nHow are you?"
```

Output:

```
Hello   World
How are you?
```

Use `echo -e` or `printf` to make these sequences work — plain `echo` often won’t interpret them.

Ah, got it — you’re asking about **quoting mechanisms** in shell scripting, which are part of how metacharacters behave.

In Bash, **quoting** controls whether the shell treats characters as special (metacharacters) or as plain text.
There are **three main quoting mechanisms** and one **escape method**.

---

**1. Single Quotes `' '` — Strong Quoting**
Everything inside single quotes is treated literally.
No variable expansion, no command substitution, nothing special.

```bash
echo 'Today is $(date)'     # prints: Today is $(date)
echo 'My name is $USER'     # prints: My name is $USER
```

---

**2. Double Quotes `" "` — Weak Quoting**
Preserves most characters literally **except** `$`, `` ` ``, and `\`.
So variables and commands inside double quotes still get expanded.

```bash
echo "My name is $USER"     # expands variable
echo "Today is $(date)"     # expands command
```

---

**3. Backslash `\` — Escape Character**
Used to **escape** (protect) a single character from interpretation.

```bash
echo \$HOME      # prints: $HOME
echo \"Hello\"   # prints: "Hello"
```

---

**4. Backquotes `` `command` `` — Command Substitution (Old Style)**
Replaced by `$(command)` in modern scripts, but still valid.

```bash
echo "Today is `date`"
```

---

**5. Combination Example**

```bash
name="Satya"
echo "Hello '$name'"      # single quotes inside → literal
echo 'Hello "$name"'      # double quotes inside → literal
echo "Hello \"$name\""    # escaped double quote inside double quotes
```

---

**Summary Table:**

| Quoting Type            | Allows Variable Expansion | Allows Command Substitution | Typical Use               |
| ----------------------- | ------------------------- | --------------------------- | ------------------------- |
| `'single'`              | ❌ No                      | ❌ No                        | Literal text              |
| `"double"`              | ✅ Yes                     | ✅ Yes                       | Normal strings            |
| `\backslash`            | Escapes one char          | ❌ No                        | Protect single characters |
| `` `cmd` `` or `$(cmd)` | ✅ Yes                     | ✅ Yes                       | Run command inline        |

Quoting is basically the shell’s grammar — it decides whether `$USER` means “expand this” or “print this as-is.”


**3. Arithmetic Substitution**
Used to perform mathematical operations.

```bash
x=10
y=5
result=$((x + y))
echo "Sum: $result"      # → Sum: 15
```

**Extra note – Parameter Substitution (Advanced form):**
You can modify or default variable values inline:

```bash
echo ${name:-"Unknown"}    # if $name is unset → "Unknown"
echo ${name:0:3}           # substring → "Sat"
```

Each substitution happens **before execution**, meaning Bash evaluates them first and then runs the resulting command.


---

**20. Functions**

- Functions group reusable logic.

```bash
greet() {
  echo "Hello, $1"
}

greet "Satya"
```

- Return values:

```bash
add() {
  return $(($1 + $2))
}

add 3 4
echo $?    # Prints 7
```

- recursive function:

```bash
factorial() {
  if [ $1 -le 1 ]; then
    echo 1
  else
    local temp=$(( $1 - 1 ))
    local result=$(factorial $temp)
    echo $(( $1 * result ))
  fi
}

factorial 5   # Output: 120
```




---

**21. Command-Line Arguments**

Access values passed to a script using `$1`, `$2`, etc.

```bash
#!/bin/bash
echo "File name: $0"
echo "First arg: $1"
echo "Second arg: $2"
echo "Total args: $#"
```

Special variables:

```
$0 → Script name
$1, $2 → Positional parameters
$# → Number of arguments
$@ → All arguments
$$ → Process ID of script
```

---

**22. String & File Handling**

```bash
basename /home/satya/file.txt   # file.txt
dirname /home/satya/file.txt    # /home/satya
wc -l file.txt                  # Count lines
wc -w file.txt                  # Count words
wc -m file.txt                  # Count characters
```

Example:

```bash
if [ -s file.txt ]; then
  echo "File is not empty"
else
  echo "File is empty"
fi
```

---

**23. Text Processing (Exam-type Commands)**

```bash
# Count words in first line
head -n 1 file.txt | wc -w

# Count letters in 10th line
sed -n '10p' file.txt | wc -m

# Print lines 5 to 10
sed -n '5,10p' file.txt

# Count lines containing "error"
grep -c "error" file.txt

# Show lines excluding "warning"
grep -v "warning" file.txt

# Show first word of each line
awk '{print $1}' file.txt

# Print line number with word count
awk '{print NR, NF}' file.txt

# Extract first column from CSV
cut -d',' -f1 file.csv

# Sort lines alphabetically
sort file.txt

# Remove duplicates
sort file.txt | uniq
```

---
---

# linux server management:
commands:
