# Python Programming Fundamentals

## Agenda
1. Subjects worth keeping in mind
2. What is Programming?
3. Programming Languages
4. Compiled vs Interpreted Languages
5. Python Execution Flow
6. Getting around: the terminal and Python
7. Installing Python
8. Virtual Environment
9. Installing JupyterLab
10. First Program
11. Understanding Functions

## Subjects worth keeping in mind

You do not need all of computer science to write Python, but four subjects
keep turning up for the rest of your career in IT — in interviews, in design
discussions, and on the day something is slow and nobody knows why. Twenty-five
topics each: not a reading list for this week, but the map of what "core CS"
means when a company asks for it.

| Subject | Main core concepts |
| --- | --- |
| **Computer Organization and Architecture (COA)** | Computer system organization: CPU, memory, I/O and storage · Instruction Set Architecture and machine instructions · x86/x86-64 architecture · Binary, hexadecimal and number representations · Integer, signed-number and floating-point representation · ASCII, Unicode, UTF-8, UTF-16 and UTF-32 · Bits, bytes, words and memory addressing · CPU registers and their roles · General-purpose, instruction-pointer, control and SIMD registers · Instruction cycle: fetch, decode, execute and write-back · Clock cycles, frequency and instruction latency · CPU pipelines and hazards · Instruction-level parallelism and superscalar execution · Cache memory: L1, L2 and L3 · RAM, memory hierarchy and locality · Buses and CPU-memory communication · ALU, control unit and datapath · Branch prediction and speculative execution · Multicore CPUs and parallel execution · SIMD/vector processing and AVX · GPU architecture and CPU vs GPU execution · FLOPs, throughput and memory bandwidth · Interrupts, DMA and I/O organization · Virtualization and hardware acceleration · Power, thermal limits and processor performance trade-offs |
| **Operating Systems & Unix (OS)** | OS purpose, components and kernel · Hardware-to-software stack · Boot process: firmware, bootloader, kernel and initramfs · Processes, PIDs and process states · fork, exec and wait system calls · CPU scheduling and context switching · Threads and multithreading · IPC: pipes, shared memory, semaphores and message queues · Synchronization, race conditions and deadlocks · Virtual memory and memory management · Paging and page tables · File systems and storage organization · Linux/Unix file-system hierarchy · Files, directories, links and file descriptors · Linux permissions, ownership and chmod · Users, groups, sudo and privileges · Bash and shell scripting · Environment variables and PATH · Essential Unix commands and pipelines · systemd and service management · Linux networking and service inspection · Logs, monitoring and troubleshooting · Virtual machines and hypervisors · Containers, namespaces and cgroups · POSIX, SSH and Linux administration |
| **Computer Networks (CN)** | Networking fundamentals and communication models · OSI and TCP/IP models · IP addressing: IPv4, IPv6, public/private, static/dynamic IP · MAC addresses and IP vs MAC · Subnetting, CIDR and address planning · ARP, ICMP and network discovery · Ethernet, switching and MAC tables · Routers, switches, gateways, hubs and topologies · LAN, WAN, VLAN and broadcast/collision domains · TCP vs UDP · Ports, sockets and client-server communication · DNS hierarchy, resolution and record types · DHCP and default gateway · HTTP/HTTPS, methods, status codes, cookies, sessions and CORS · SSH, SFTP and remote access · NAT, PAT and port forwarding · Firewalls, DMZ, proxies and reverse proxies · TLS, certificates and secure communication · VPN and secure connectivity · Wi-Fi, Bluetooth, 5G and wireless basics · Latency, bandwidth, throughput, packet loss and jitter · Network troubleshooting: ping, traceroute, nslookup/dig, netstat/ss, curl · Wireshark and packet analysis · CDN, caching and load balancing · Cloud, edge and basic IoT networking |
| **Database Management Systems (DBMS)** | Database fundamentals and DBMS architecture · Relational data model · Tables, rows, columns and data types · Primary, foreign, candidate and unique keys · Constraints and data integrity · SQL: SELECT, INSERT, UPDATE, DELETE · Filtering, sorting, grouping and aggregates · JOINs · Subqueries, CTEs and views · Database schemas and namespaces · Normalization: 1NF, 2NF, 3NF · Indexes and B-tree concepts · Query execution and optimization · Transactions and ACID · Concurrency and isolation levels · Locks and deadlocks · Stored procedures, functions and triggers · Roles, privileges and access control · Row-Level Security and policies · Password hashing and cryptographic extensions · PostgreSQL architecture and administration basics · OLTP vs OLAP · ETL vs ELT · NoSQL: document, key-value, wide-column and graph · Redis, search engines, vector databases and modern data platforms |

---

## What is Programming?

Programming is the process of giving instructions to a computer to solve a problem.

## Programming Languages
- Low-level
- High-level

Examples: C, C++, Java, Python, JavaScript

## Compiled vs Interpreted

Compiled: C, C++, Go

Interpreted: Python, JavaScript

Python compiles to bytecode and runs on the Python Virtual Machine (PVM).

## Python Execution Flow

Python Code (.py) → Bytecode (.pyc) → Python Virtual Machine → Output

You can watch this happen. Compile a file by hand and then go looking for the
bytecode it produced:

```bash
python -m py_compile tyu.py
find . -name "tyu*.pyc"
```

The `.pyc` turns up under `__pycache__/`. You never have to think about it —
Python writes and reuses it on its own — but it is worth seeing once, because
it is the difference between "Python is slow because it is interpreted" and
knowing what actually runs.


---

## Getting around: the terminal and Python

Whatever you end up doing in IT, you will spend part of every day in a
terminal — on your own machine, over SSH on a server, or inside a container
where there is no file manager to click. These ten commands are most of what
that comes to, and they are worth knowing by hand.

Python can do all of the same things, and that half matters too: a shell
command is what you type once, and the Python version is what you write when
it has to happen a thousand times, or on a schedule, or on a filename you
will not know until the program runs.

| What you want | In the terminal | In Python |
| --- | --- | --- |
| Where am I? | `pwd` | `import os` → `os.getcwd()` |
| What is in here? | `ls` | `os.listdir(".")` |
| Go to another folder | `cd folder_name` | `os.chdir("folder_name")` |
| Make a folder | `mkdir folder_name` | `os.makedirs("folder_name", exist_ok=True)` |
| Make an empty file | `touch file.py` | `open("file.py", "a").close()` |
| Copy a file | `cp source destination` | `import shutil` → `shutil.copy("source", "destination")` |
| Move or rename | `mv old_name new_name` | `os.rename("old_name", "new_name")` |
| Delete a file | `rm file.py` | `os.remove("file.py")` |
| Does this exist? | `ls file.py` | `os.path.exists("file.py")` |
| Clear the screen | `clear` | `os.system("clear")` |

Two more with no real Python equivalent, because they are about the terminal
itself rather than the files: `history` shows what you have already run, and
pressing the up arrow walks back through it.

On Windows, `dir` stands in for `ls` and `cls` for `clear`. The Python column
does not change — that is rather the point of it.

> `os` and `shutil` are part of the standard library, so there is nothing to
> install. Modern code often uses `pathlib` instead — `Path(".").iterdir()`,
> `Path("file.py").exists()` — which reads better once you are comfortable.
> Either is fine for now.

---

Use these steps for **Windows**.

---

## Step 1: Download Python

* Open your browser.
* Go to **[https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/)**
* Click **Download Python 3.x.x**.

---

## Step 2: Run the Installer

Double-click the downloaded `.exe` file.

### Very Important

Before clicking **Install Now**, check:

✅ **Add Python to PATH**

This allows you to run Python from Command Prompt.

Then click:

**Install Now**

Wait until installation completes.

---

## Step 3: Verify Installation

Open **Command Prompt** (`Win + R` → `cmd`).

Run:

```cmd
python --version
```

Example:

```text
Python 3.14.0
```

Also verify `pip`:

```cmd
pip --version
```

Example:

```text
pip 25.x.x
```

---

## Step 4: Create a Project Folder

```cmd
mkdir PythonCourse
cd PythonCourse
```

---

## Step 5: Create a Virtual Environment

```cmd
python -m venv .venv
```

You should now see:

```text
PythonCourse
│
├── .venv
```

---

## Step 6: Activate the Virtual Environment

### Command Prompt

```cmd
.venv\Scripts\activate
```

### PowerShell

```powershell
.venv\Scripts\Activate.ps1
```

If successful, you'll see:

```text
(.venv) C:\Users\YourName\PythonCourse>
```

Now that it exists and is active, it is worth looking inside it once.

For a Python virtual environment (`.venv`), the main folders are:

| Folder/File    | Purpose                                                                                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **bin/**       | Contains the executables for the virtual environment, such as `python`, `pip`, `jupyter`, and the activation scripts (`activate`, `Activate.ps1`). This is the folder you use most often.                      |
| **lib/**       | Stores the installed Python packages (`site-packages`) and the Python standard library files used by the virtual environment.                                                                                  |
| **include/**   | Contains C/C++ header files needed when compiling Python extensions or native modules. Usually empty unless building packages with C extensions.                                                               |
| **etc/**       | Stores configuration files for some installed tools. For example, Jupyter configuration may be placed here.                                                                                                    |
| **share/**     | Contains shared resources such as documentation, icons, schemas, templates, localization files, and Jupyter assets.                                                                                            |
| **lib64/**     | On 64-bit Linux, this usually points to `lib/` (often as a symbolic link). It exists for compatibility with software expecting a `lib64` directory.                                                            |
| **pyvenv.cfg** | The configuration file for the virtual environment. It records information such as the base Python installation, whether system packages are available, and the Python version used to create the environment. |

Inside **`bin/`**, you'll commonly see:

| File            | Purpose                                                 |
| --------------- | ------------------------------------------------------- |
| `python`        | Python interpreter for this virtual environment.        |
| `pip`           | Installs and manages Python packages.                   |
| `activate`      | Activates the virtual environment in Bash/Zsh.          |
| `Activate.ps1`  | Activates the virtual environment in PowerShell.        |
| `activate.fish` | Activation script for the Fish shell.                   |
| `activate.csh`  | Activation script for C Shell (`csh`/`tcsh`).           |
| `jupyter`       | Starts Jupyter.                                         |
| `jupyter-lab`   | Starts JupyterLab.                                      |
| `ipython`       | Starts the enhanced interactive Python shell (IPython). |

A simple way to explain it to students is:

```text
.venv/
├── bin/          → Programs & commands
├── lib/          → Installed Python libraries
├── include/      → C/C++ header files
├── etc/          → Configuration files
├── share/        → Shared resources
├── lib64/        → 64-bit library link
└── pyvenv.cfg    → Virtual environment configuration
```

This mental model is usually enough for beginners.

---

## Step 7: Upgrade pip

```cmd
python -m pip install --upgrade pip
```

---

## Step 8: Install Jupyter

```cmd
pip install jupyterlab notebook ipykernel
```

---

## Step 9: Register the Environment

```cmd
python -m ipykernel install --user --name=.venv --display-name="Python (.venv)"
```

---

## Step 10: Start JupyterLab

```cmd
jupyter lab
```

Your browser will automatically open JupyterLab.

---

## Step 11: Create Your First Notebook

* Click **Python (.venv)**.
* Rename the notebook.
* Start writing Python code.

---

## Step 12: Close Everything

Stop Jupyter:

Press:

```text
Ctrl + C
```

Then deactivate the virtual environment:

```cmd
deactivate
```

---

### Folder Structure

```text
PythonCourse/
│
├── .venv/
│   ├── Scripts/
│   ├── Lib/
│   ├── Include/
│   └── pyvenv.cfg
│
└── your_file.py
```

This workflow is the standard setup used for Python development on Windows.

---

## Useful Jupyter Shortcuts
- Shift+Enter : Run Cell
- Tab : Auto Complete
- Shift+Tab : Function Signature
- function? : Documentation
- function?? : Source (if available)

```python
print('Hello, World!')
```

## Understanding Functions
For every function ask:
1. Input?
2. Logic?
3. Output?

```python
name='Python'
print(len(name))
print(type(len(name)))
```

## Homework
- Install Python
- Install Jupyter
- Create a virtual environment
- Run your first notebook
- Practice print(), len(), type()
