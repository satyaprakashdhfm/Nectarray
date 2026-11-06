# Operating System Concepts

## 1. System Architecture & Boot Process

### Hardware to Software Stack
```
Hardware → Kernel (OS) → File System & Desktop GUI & Network
```

### Boot Process Components
| Component | Example Device | Purpose |
|-----------|----------------|---------|
| Bootloader (GRUB) | /dev/sda1 | Loads kernel + initrd |
| Kernel | /boot/vmlinuz | Core of the OS |
| Initrd/Initramfs | /boot/initrd.img | Helps mount root filesystem |
| Root filesystem | /dev/sda2 | Actual Linux system files |
| Swap (optional) | /dev/sda3 | Extra virtual memory |

### Storage Device Naming
- **sda** = SCSI Disk A (entire disk)
- **sda1, sda2, sda3** = Partitions on that disk
- Example Layout:
  ```
  sda      -> Entire disk 
  ├─ sda1 -> /boot partition 
  ├─ sda2 -> Linux root `/` 
  └─ sda3 -> swap area
  ```

## 2. Standards & Compatibility

### POSIX (Portable Operating System Interface)
**Purpose**: Ensure portability and compatibility between Unix-like systems

| Category | Features / Examples |
|----------|-------------------|
| System APIs | fork(), exec(), wait(), open(), read(), write() |
| Shell & Scripting | /bin/sh, scripting rules, command substitution |
| Utilities & Commands | ls, cat, grep, awk, sed, cp, mv, find |
| Threads | POSIX Threads (pthreads): mutexes, condition variables |
| Signals & IPC | kill(), signal(), pipe(), mmap(), semaphores |
| Filesystem & I/O | File descriptors, hierarchical FS, symbolic links |
| File Permissions | Classic rwx model (user/group/others) |
| Process Control | Process groups, sessions, setuid(), nice() |

### SUS (Single UNIX Specification)
**Purpose**: Define what it means to be a "UNIX®" operating system

| Aspect | POSIX | SUS |
|--------|-------|-----|
| Owner | IEEE | The Open Group |
| Goal | Portability of Unix-like APIs | Define and certify true UNIX® systems |
| Scope | Core APIs, shell, utilities | POSIX + extra utilities + branding |
| Certification | Not required | Mandatory for UNIX® branding |

### OS Compliance Matrix
| OS | POSIX Compliance | SUS Certified | Trademarked UNIX® |
|----|-----------------|---------------|-------------------|
| Unix (AIX, HP-UX, Solaris) | ✅ Yes | ✅ Yes | ✅ Yes |
| macOS | ✅ Yes | ✅ Yes | ✅ Yes |
| Linux | ⚠️ Partial | ❌ No | ❌ No |
| Windows | ❌ No | ❌ No | ❌ No |

## 3. Virtualization Technologies

### Types of Virtualization
| Type | Description | Example Tools |
|------|-------------|---------------|
| Hardware Virtualization | Virtualizing physical hardware | Hyper-V, KVM, VMware, VirtualBox |
| OS-Level Virtualization | Sharing single OS kernel | Docker, LXC |
| Application Virtualization | Running apps isolated from host | Wine, App-V |

### Hypervisor Types
| Type | Description | Example Products |
|------|-------------|------------------|
| Type 1 | Bare Metal - runs directly on hardware | Microsoft Hyper-V, VMware ESXi, KVM, Xen |
| Type 2 | Hosted - runs on top of an OS | VirtualBox, VMware Workstation, QEMU |

### Virtualization Comparison Matrix
| Software | Type | Requires Hypervisor | OS Kernel Used | Runs On |
|----------|------|-------------------|----------------|---------|
| Hyper-V | Hardware Virtualization | ✅ Yes | Real Kernel (Guest) | Windows Pro/Enterprise |
| VirtualBox | Hardware Virtualization | ✅ Yes | Real Kernel (Guest) | Windows/Linux/macOS |
| WSL 1 | System Call Translation | ❌ No | Windows NT Kernel | Windows 10+ |
| WSL 2 | Lightweight VM | ✅ Yes (Hyper-V) | Real Linux Kernel | Windows 10+ |
| Docker Desktop | OS-Level/Container | ✅ Yes | Shared Linux Kernel | Windows 10+ |

## 4. Development Environments

### Environment Types Comparison
| Environment | Hardware Access | File System | Network | GUI |
|-------------|----------------|-------------|---------|-----|
| **Dual Boot** | Direct | Separate (ext4) | Same IP (different boots) | Full DE |
| **Virtual Machine** | Virtual | Separate (ext4) | Different IP | Full GUI |
| **WSL 1** | Shared | Shared (NTFS) | Same IP | Needs X Server |
| **WSL 2** | Virtual | Separate (ext4 VHD) | Same IP | Needs X Server |
| **Containers** | Shared Kernel | Layered (UnionFS) | Isolated namespaces | Headless |

### Container Architecture
```
Hardware → Kernel(OS) → Container Runtime (Docker) → 
Namespaces (Process/Network/FS isolation) → 
Cgroups (Resource limits) → 
UnionFS (Layered file system) → 
Containerized Application
```

## 5. Process Management

### Process States & System Calls
- **Process Creation**: fork(), exec(), wait()
- **Process Control**: setuid(), nice(), process scheduling
- **Inter-Process Communication**: pipe(), mmap(), semaphores, message queues
- **Signal Handling**: kill(), signal(), alarm()

### Process Monitoring Tools
| Tool | Type | Features |
|------|------|----------|
| ps | Static snapshot | Simple process listing |
| htop | Real-time interactive | Process monitoring, sorting, killing |
| top | Real-time basic | Continuously updating, less interactive |

## 6. File Systems & Permissions

### File System Hierarchy
| Directory | Purpose |
|-----------|---------|
| /boot | Kernel files, bootloader |
| /home | User home directories |
| /etc | Configuration files |
| /var | Variable data (logs, caches) |
| /usr | User programs and libraries |
| /tmp | Temporary files |
| /dev | Device files |
| /proc | Process information |

### Hidden Directories (.folders)
| Folder | Purpose |
|--------|---------|
| .m2 | Maven config and local repository |
| .bashrc | Shell startup script |
| .git | Git repository metadata |
| .config | App settings (GNOME, VS Code, etc.) |
| .cache | App caches |
| .local | App installs, user data |
| .ssh | SSH keys and configs |

### File Permissions System
#### Permission Structure (ls -l output)
| Position | Meaning | Example (drwxr-xr-x) |
|----------|---------|---------------------|
| 1st char | File type | d (Directory), - (File), l (Link) |
| 2-4 | Owner Permissions | rwx (Read, Write, Execute) |
| 5-7 | Group Permissions | r-x (Read, No Write, Execute) |
| 8-10 | Others Permissions | r-x (Read, No Write, Execute) |

#### Permission Values
| Symbol | Meaning | Octal Value |
|--------|---------|-------------|
| r | Read | 4 |
| w | Write | 2 |
| x | Execute | 1 |
| - | No permission | 0 |

#### Common Permission Combinations
| Command | Octal | Permissions | Use Case |
|---------|-------|-------------|----------|
| chmod 777 | 777 | rwxrwxrwx | Full access for everyone |
| chmod 755 | 755 | rwxr-xr-x | Executable files, directories |
| chmod 644 | 644 | rw-r--r-- | Regular files |
| chmod 600 | 600 | rw------- | Private files |
| chmod 400 | 400 | r-------- | Read-only files |

## 7. Networking & Services

### Network Configuration
- **Interface Management**: ip a, ifconfig
- **Connection Testing**: ping, netstat -tulnp
- **Service Management**: systemctl (systemd)

### Service Management (systemd)
- **systemd**: Main system and service manager
- **systemctl**: Command-line tool to control systemd
- **Common Commands**:
  - `systemctl start service`
  - `systemctl stop service`
  - `systemctl enable service` (auto-start at boot)
  - `systemctl status service`

---
