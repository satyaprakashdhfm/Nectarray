# **Docker**

* **Concepts**: Containers, Images, Volumes, Networks.
* **Commands**:

  * `docker build`, `docker run`, `docker ps`, `docker stop`, `docker rm`, `docker exec -it`.
  * `docker-compose up/down` for multi-container apps.
* **Use Cases**:

  * Local development environments.
  * Microservices packaging.
  * Testing Kubernetes YAML manifests before production.
* **Example**:

  ```bash
  docker run -d -p 8080:80 nginx
  docker exec -it container_id bash
  ```

 

## Docker Architecture and Requirements

Docker requires Linux kernel features to run containers. On Windows, Docker integrates with WSL2 to provide a real Linux kernel. Docker containers are process-based and specific to applications, unlike VMs which create separate OS instances.

**Core Linux Features Used by Docker:**
- **Namespaces**: Provide isolation for processes, networks, filesystems
- **Cgroups**: Control resource allocation (CPU, memory, I/O)  
- **UnionFS/OverlayFS**: Layered filesystem for efficient storage

**Docker Engine Behavior:**
- Starts when containers are running
- Remains idle but running when no containers are active
- Only stops when Docker service itself is stopped

## Linux Kernel Features

### Namespaces
Isolate different aspects of the system. Each namespace type serves a specific purpose:

**Namespace Types:**
- **PID**: Isolates process IDs
- **NET**: Separate network stack (IP, interfaces)
- **MNT**: Isolates filesystem mount points
- **UTS**: Isolates hostname and domain name
- **IPC**: Isolates inter-process communication
- **USER**: Isolates user/group IDs
- **CGROUP**: Limits CPU, memory, I/O access
- **TIME**: Isolates time settings

### Cgroups (Control Groups)
Control and limit resource usage for processes:

**Resource Controllers:**
- **cpu**: Limits CPU usage
- **memory**: Controls RAM allocation
- **blkio**: Controls disk I/O speed
- **cpuset**: Assigns specific CPU cores
- **devices**: Restricts hardware access
- **net_cls/net_prio**: Network traffic control
- **pids**: Limits process creation
- **freezer**: Suspend/resume processes

### OverlayFS (Union Filesystem)
Combines multiple layers into a single virtual filesystem:

**Layer Structure:**
- **LowerDir**: Read-only base layers from image
- **UpperDir**: Writable layer for runtime changes
- **MergedDir**: Combined view of all layers
- **WorkDir**: Temporary workspace for operations

**Copy-on-Write Behavior:**
- Files are copied from lower to upper layer when modified
- Original layers remain unchanged
- Efficient storage through layer sharing

## Docker Images and Containers

### Docker Images
Immutable blueprints containing:
- **Layers**: Read-only segments from Dockerfile instructions
- **Base Image**: Starting image (ubuntu, alpine, etc.)
- **Filesystem Snapshot**: Complete file structure
- **Metadata**: Configuration, environment variables, exposed ports
- **Build Cache**: Cached layers for faster rebuilds

**Base Image Types:**
- **Minimal**: alpine, busybox, scratch
- **General Purpose**: ubuntu, debian, fedora
- **Language-Specific**: python:3.9-slim, node:18-slim
- **Security-Hardened**: distroless, ubi

### Docker Containers
Runtime instances with:
- **Writable Layer**: Top layer capturing runtime changes
- **Runtime State**: Active processes, environment
- **Container ID/Name**: Unique identifiers
- **Resource Limits**: CPU, memory, network constraints
- **Network Settings**: Container-specific networking
- **Logs**: Runtime output and events

### Image vs Container Comparison

**Shared Foundations:**
- Same read-only layers and filesystem
- Identical metadata and configuration
- Same base environment setup

**Key Differences:**
- **Images**: Immutable, static blueprints stored on disk
- **Containers**: Dynamic instances with writable layer and runtime state
- **Persistence**: Images permanent, container changes ephemeral unless committed

## Dockerfile Instructions

**Essential Instructions:**
- **FROM**: Specifies base image
- **RUN**: Executes commands during build
- **COPY**: Copies files from host to image
- **WORKDIR**: Sets working directory
- **ENV**: Sets environment variables
- **EXPOSE**: Documents port usage
- **CMD**: Default command when container starts
- **ENTRYPOINT**: Configures container as executable

**Additional Instructions:**
- **ADD**: Like COPY but supports URLs and archives
- **ARG**: Build-time variables
- **LABEL**: Adds metadata
- **USER**: Sets user for subsequent operations
- **VOLUME**: Creates mount points
- **HEALTHCHECK**: Defines health monitoring

**COPY Options:**
- `--from`: Copy from build stage
- `--chown`: Set file ownership
- `--chmod`: Set permissions
- `--exclude`: Exclude file patterns

## Docker Repository Concepts

**Repository Terminology:**
- **Repository**: Collection of related images under one name
- **Image Tag**: Version label (latest, v1.0, stable)
- **Image ID**: Unique SHA256 hash for image content
- **Repo Digest**: Content-addressable identifier in registry
- **Build Context**: Directory containing Dockerfile and related files

## Container Management Commands

**Basic Operations:**
```bash
docker run <image>              # Create and start container
docker run -d <image>           # Run in background
docker run -it <image> bash     # Interactive with shell
docker stop <container>         # Stop running container
docker start <container>        # Start stopped container
docker restart <container>      # Restart container
docker rm <container>          # Remove container
docker logs <container>        # View container logs
docker exec -it <container> bash # Access running container
```

**Image Operations:**
```bash
docker images                   # List all images
docker pull <image>            # Download image
docker push <image>            # Upload image
docker rmi <image>             # Remove image
docker build -t <tag> .        # Build image from Dockerfile
docker history <image>         # Show image layers
docker inspect <image>         # Detailed image information
```

**System Cleanup:**
```bash
docker system prune           # Remove unused data
docker container prune        # Remove stopped containers
docker image prune           # Remove unused images
docker volume prune          # Remove unused volumes
docker network prune         # Remove unused networks
```

## Docker Compose

**Purpose**: Define and manage multi-container applications using YAML files.

**Common Keywords:**
- **version**: Compose file format version
- **services**: Container definitions
- **image**: Specifies container image
- **build**: Build from Dockerfile
- **ports**: Port mapping between host and container
- **volumes**: Persistent storage and bind mounts
- **environment**: Environment variables
- **depends_on**: Service dependencies
- **networks**: Custom networking
- **restart**: Restart policies

**Compose Commands:**
```bash
docker-compose up              # Start services
docker-compose up --build      # Rebuild and start
docker-compose down            # Stop and remove services
docker-compose logs           # View service logs
docker-compose ps             # List running services
```

## Configuration Management

**Configuration Approaches:**
- **Build-time**: Copy config files into image with COPY
- **Runtime**: Mount external config files as volumes
- **Environment Variables**: Pass settings via ENV or docker run -e

**Volume Mounting Benefits:**
- Same image, different configurations per container
- No need to rebuild images for config changes
- Separation of code and configuration

## Storage and Volumes

**Volume Types:**
- **Named Volumes**: Docker-managed persistent storage
- **Bind Mounts**: Direct host directory mapping
- **Anonymous Volumes**: Temporary storage for container lifetime

**Volume Commands:**
```bash
docker volume ls               # List volumes
docker volume create <name>    # Create named volume
docker volume inspect <name>   # Volume details
docker volume rm <name>       # Remove volume
```

## Networking

Docker provides isolated networking for containers:

**Network Types:**
- **Bridge**: Default network for single host
- **Host**: Use host's network directly
- **None**: No networking
- **Custom**: User-defined networks for service discovery

**Network Commands:**
```bash
docker network ls              # List networks
docker network create <name>   # Create network
docker network inspect <name>  # Network details
docker network connect <network> <container>  # Connect container
```

## Container Dependencies

**Dependency Types:**
- **Functional**: Service stops working without dependency
- **Operational**: Service continues running but fails to operate correctly

**Example**: Sensor container operationally depends on gateway. It keeps retrying connection but remains running when gateway is down.

## Troubleshooting Common Issues

**Port Conflicts:**
```bash
sudo lsof -i :4840            # Check what's using port 4840
sudo fuser -k 4840/tcp        # Kill processes on port 4840
```

**Complete Cleanup:**
```bash
docker stop $(docker ps -aq) && docker system prune -a --volumes -f
```

**Network Issues:**
- Check container can reach other services
- Install network tools: `apt-get install iputils-ping mosquitto-clients`
- Verify DNS resolution between containers

**Container Access:**
```bash
docker exec -it <container> sh    # Access running container
docker restart <container> && docker exec -it <container> bash
```

## Best Practices

**Image Building:**
- Use multi-stage builds for smaller images
- Minimize layers by combining RUN commands
- Use .dockerignore to exclude unnecessary files
- Choose appropriate base images (alpine for size, ubuntu for compatibility)

**Container Management:**
- Use health checks to monitor container status
- Implement proper logging with structured output
- Set resource limits to prevent resource exhaustion
- Use volumes for persistent data

**Security:**
- Run containers as non-root users when possible
- Keep base images updated
- Use security-hardened base images for production
- Limit container capabilities and access

**Development Workflow:**
- Use Docker Compose for multi-service development
- Mount source code as volumes for live development
- Separate configuration from application code
- Use environment-specific compose files

---
---

# **Kubernetes (K8s)**

* **Core Concepts**: Pods, Services, Deployments, Namespaces, Volumes, ConfigMaps, Secrets
* **Commands**:
  * kubectl apply, kubectl get, kubectl describe, kubectl delete, kubectl exec
  * kubectl create, kubectl scale, kubectl rollout
* **Use Cases**:
  * Container orchestration and management
  * Microservices architecture
  * Auto-scaling and load balancing
  * Rolling deployments and rollbacks
* **Example**:
  ```bash
  kubectl apply -f deployment.yaml
  kubectl get pods -o wide
  kubectl exec -it pod-name -- /bin/bash
  ```

## Kubernetes Architecture and Overview

Kubernetes (K8s) is an open-source system for automating deployment, scaling, and management of containerized applications. It groups containers into logical units for easy management and discovery. A Kubernetes cluster consists of a control plane plus worker nodes that run containerized applications.

**Core Architecture Components:**
- **Control Plane**: Manages cluster state and orchestration
- **Worker Nodes**: Run application workloads
- **etcd**: Distributed key-value store for cluster state
- **API Server**: Central management entity
- **Scheduler**: Assigns pods to nodes
- **Controller Manager**: Manages cluster controllers

**Kubernetes Benefits:**
- **Declarative Configuration**: Define desired state, K8s maintains it
- **Self-healing**: Automatically replaces failed containers
- **Horizontal Scaling**: Scale applications up/down automatically
- **Service Discovery**: Built-in load balancing and networking
- **Rolling Updates**: Zero-downtime deployments
- **Resource Management**: Efficient resource allocation

## Control Plane Components

### API Server (kube-apiserver)
**Purpose**: Central management component that exposes Kubernetes API
**Functions**:
- Validates and configures API objects
- Authentication and authorization
- Admission control
- Serves REST operations
- Frontend to cluster's shared state

### etcd
**Purpose**: Consistent, highly-available key-value store
**Functions**:
- Stores all cluster data
- Source of truth for cluster state
- Backup and restore capabilities
- Distributed consensus using Raft algorithm

### Scheduler (kube-scheduler)
**Purpose**: Assigns pods to nodes based on resource requirements
**Factors Considered**:
- Resource requirements (CPU, memory)
- Hardware/software constraints
- Affinity/anti-affinity specifications
- Data locality
- Workload interference

### Controller Manager (kube-controller-manager)
**Purpose**: Runs controller processes that regulate cluster state
**Controllers Include**:
- **Node Controller**: Monitors node health
- **Job Controller**: Manages one-off tasks
- **EndpointSlice Controller**: Manages network endpoints
- **ServiceAccount Controller**: Creates default ServiceAccounts

### Cloud Controller Manager
**Purpose**: Links cluster to cloud provider APIs
**Functions**:
- Node management
- Route management
- Service load balancer management
- Volume management

## Worker Node Components

### Kubelet
**Purpose**: Primary node agent that communicates with API server
**Responsibilities**:
- Registers node with cluster
- Manages pod lifecycle
- Mounts volumes
- Runs container health checks
- Reports node and pod status

### Container Runtime
**Purpose**: Software responsible for running containers
**Supported Runtimes**:
- **containerd**: Industry-standard container runtime
- **CRI-O**: Lightweight container runtime for Kubernetes
- **Docker Engine**: Via dockershim (deprecated)

### Kube-proxy
**Purpose**: Network proxy maintaining network rules on nodes
**Functions**:
- Implements Services concept
- Handles load balancing
- Manages iptables/IPVS rules
- Enables service discovery

## Core Kubernetes Objects

### Pods
Pods are the smallest deployable units in Kubernetes. A Pod is a group of one or more containers with shared storage and network resources.

**Pod Characteristics**:
- Share the same network namespace (IP address)
- Share storage volumes
- Scheduled together on same node
- Scale together as a unit
- Ephemeral by nature

**Pod Lifecycle**:
- **Pending**: Pod accepted but not yet scheduled
- **Running**: Pod bound to node, containers created
- **Succeeded**: All containers terminated successfully
- **Failed**: All containers terminated, at least one failed
- **Unknown**: Pod state cannot be determined

### Deployments
**Purpose**: Manage stateless applications with declarative updates
**Features**:
- Rolling updates and rollbacks
- Replica management
- Pod template versioning
- Scaling capabilities
- Update strategies (RollingUpdate, Recreate)

**Deployment Strategies**:
- **RollingUpdate**: Gradual replacement (default)
- **Recreate**: Terminate all, then create new
- **Blue-Green**: Switch traffic between versions
- **Canary**: Route small traffic percentage to new version

### Services
**Purpose**: Expose applications running on Pods with stable network identities and load balancing

**Service Types**:
- **ClusterIP**: Internal cluster access only (default)
- **NodePort**: Exposes service on each node's IP
- **LoadBalancer**: Creates external load balancer
- **ExternalName**: Maps service to DNS name
- **Headless**: Direct pod access without load balancing

### ReplicaSets
**Purpose**: Ensures specified number of pod replicas are running
**Functions**:
- Maintains desired replica count
- Replaces failed pods
- Scales pods up/down
- Usually managed by Deployments

### StatefulSets
**Purpose**: Manages stateful applications with stable identities
**Features**:
- Stable network identities
- Ordered deployment and scaling
- Stable persistent storage
- Ordered rolling updates

**Use Cases**:
- Databases (MySQL, PostgreSQL)
- Distributed systems (Kafka, Cassandra)
- Applications requiring stable hostnames

### DaemonSets
**Purpose**: Ensures one pod runs on each node
**Use Cases**:
- Log collection (Fluentd, Filebeat)
- Monitoring agents (Node Exporter)
- Network plugins
- Storage daemons

### Jobs and CronJobs
**Jobs**: Run pods to completion for one-time tasks
**CronJobs**: Run jobs on schedule (like cron)

**Job Types**:
- **Non-parallel Jobs**: Single pod completion
- **Parallel Jobs with Fixed Count**: Specific number of completions
- **Parallel Jobs with Work Queue**: Process items from queue

## Configuration Management

### ConfigMaps
**Purpose**: Store non-confidential configuration data in key-value pairs
**Usage Methods**:
- Environment variables
- Command-line arguments
- Configuration files in volumes

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "mongodb://localhost:27017"
  debug_mode: "true"
```

### Secrets
**Purpose**: Store sensitive information (passwords, tokens, keys)
**Secret Types**:
- **Opaque**: Arbitrary user-defined data (default)
- **kubernetes.io/service-account-token**: Service account token
- **kubernetes.io/dockercfg**: Docker registry credentials
- **kubernetes.io/tls**: TLS certificate and key

**Security Features**:
- Base64 encoded (not encrypted by default)
- Stored in etcd
- Only sent to nodes running pods that need them
- Stored in tmpfs (memory) on nodes

## Storage in Kubernetes

### Volumes
**Purpose**: Provide persistent storage that outlives container restarts
**Volume Types**:
- **emptyDir**: Temporary storage, deleted when pod removed
- **hostPath**: Mount directory from node filesystem
- **nfs**: Network File System mount
- **persistentVolumeClaim**: Claims storage from PersistentVolume

### Persistent Volumes (PV)
**Purpose**: Cluster-wide storage resources provisioned by administrator
**Properties**:
- Independent of pod lifecycle
- Can be statically or dynamically provisioned
- Have access modes (ReadWriteOnce, ReadOnlyMany, ReadWriteMany)
- Reclaim policies (Retain, Delete, Recycle)

### Persistent Volume Claims (PVC)
**Purpose**: Request for storage by users
**Binding Process**:
1. User creates PVC with specific requirements
2. Kubernetes finds matching PV or creates one dynamically
3. PVC binds to PV
4. Pod uses PVC to access storage

### Storage Classes
**Purpose**: Define different types of storage with provisioners
**Dynamic Provisioning**: Automatically creates PVs when PVCs are created

## Networking in Kubernetes

### Cluster Networking Requirements
- All pods can communicate without NAT
- All nodes can communicate with all pods
- Pod sees same IP as others see it

### Network Plugins (CNI)
**Popular CNI Plugins**:
- **Flannel**: Simple overlay network
- **Calico**: Network policy and routing
- **Weave**: Mesh networking
- **Cilium**: eBPF-based networking and security

### Ingress
**Purpose**: Manages external access to services, typically HTTP/HTTPS
**Features**:
- Load balancing
- SSL termination
- Name-based virtual hosting
- Path-based routing

**Ingress Controllers**:
- NGINX Ingress Controller
- Traefik
- HAProxy Ingress
- AWS ALB Ingress Controller

### Network Policies
**Purpose**: Define rules for pod-to-pod communication
**Policy Types**:
- **Ingress**: Controls incoming traffic to pods
- **Egress**: Controls outgoing traffic from pods

## Namespaces and Resource Management

### Namespaces
**Purpose**: Virtual clusters within physical cluster for resource isolation
**Default Namespaces**:
- **default**: Default namespace for objects
- **kube-system**: System components
- **kube-public**: Public resources accessible to all users
- **kube-node-lease**: Node heartbeat information

### Resource Quotas
**Purpose**: Limit resource consumption per namespace
**Resources Controlled**:
- CPU and memory requests/limits
- Number of objects (pods, services, etc.)
- Persistent volume claims
- Load balancers

### Limit Ranges
**Purpose**: Define min/max resource constraints for individual objects
**Constraints**:
- Default resource requests/limits
- Min/max CPU and memory
- Storage requests

## kubectl Command Reference

### Basic Commands
```bash
# Cluster information
kubectl cluster-info
kubectl get nodes
kubectl get namespaces

# Apply configurations
kubectl apply -f file.yaml
kubectl apply -f directory/
kubectl apply -k kustomization/

# Get resources
kubectl get pods
kubectl get services
kubectl get deployments
kubectl get all

# Describe resources (detailed info)
kubectl describe pod pod-name
kubectl describe service service-name
kubectl describe node node-name

# Delete resources
kubectl delete pod pod-name
kubectl delete -f file.yaml
kubectl delete deployment deployment-name
```

### Pod Management
```bash
# Create and manage pods
kubectl run nginx --image=nginx
kubectl get pods -o wide
kubectl logs pod-name
kubectl logs -f pod-name  # Follow logs

# Execute commands in pods
kubectl exec -it pod-name -- /bin/bash
kubectl exec pod-name -- ls /app

# Port forwarding
kubectl port-forward pod/pod-name 8080:80
kubectl port-forward service/service-name 8080:80

# Copy files to/from pods
kubectl cp file.txt pod-name:/tmp/
kubectl cp pod-name:/tmp/file.txt ./file.txt
```

### Deployment Management
```bash
# Create deployments
kubectl create deployment nginx --image=nginx
kubectl scale deployment nginx --replicas=5

# Update deployments
kubectl set image deployment/nginx nginx=nginx:1.20
kubectl rollout status deployment/nginx
kubectl rollout history deployment/nginx
kubectl rollout undo deployment/nginx

# Autoscaling
kubectl autoscale deployment nginx --cpu-percent=50 --min=1 --max=10
```

### Service Management
```bash
# Create services
kubectl expose deployment nginx --port=80 --type=ClusterIP
kubectl expose deployment nginx --port=80 --type=NodePort
kubectl expose deployment nginx --port=80 --type=LoadBalancer

# Get service information
kubectl get services
kubectl get endpoints
```

### Debugging and Troubleshooting
```bash
# Resource usage
kubectl top nodes
kubectl top pods

# Events and logs
kubectl get events
kubectl logs -f deployment/app-name
kubectl logs -f -l app=my-app  # Follow logs by label

# Debugging pods
kubectl describe pod pod-name
kubectl get pod pod-name -o yaml
kubectl exec -it pod-name -- /bin/sh

# Network debugging
kubectl exec -it pod-name -- nslookup service-name
kubectl exec -it pod-name -- wget -qO- service-name
```

### Configuration and Context
```bash
# Context management
kubectl config get-contexts
kubectl config use-context context-name
kubectl config set-context --current --namespace=namespace-name

# View configurations
kubectl config view
kubectl get configmaps
kubectl get secrets
```

## YAML Manifest Structure

### Basic Pod Manifest
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.20
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

### Deployment Manifest
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.20
        ports:
        - containerPort: 80
```

### Service Manifest
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
```

## Resource Management and Optimization

### Resource Requests and Limits
**Requests**: Minimum resources guaranteed to container
**Limits**: Maximum resources container can use

```yaml
resources:
  requests:
    memory: "64Mi"
    cpu: "250m"      # 0.25 CPU cores
  limits:
    memory: "128Mi"
    cpu: "500m"      # 0.5 CPU cores
```

### Quality of Service (QoS) Classes
- **Guaranteed**: Requests = Limits for all containers
- **Burstable**: At least one container has requests < limits
- **BestEffort**: No requests or limits specified

### Horizontal Pod Autoscaler (HPA)
**Purpose**: Automatically scale pod replicas based on metrics
**Metrics**:
- CPU utilization
- Memory utilization
- Custom metrics (queue length, request rate)

### Vertical Pod Autoscaler (VPA)
**Purpose**: Automatically adjusts CPU and memory requests/limits
**Modes**:
- **Off**: Only provides recommendations
- **Initial**: Sets requests on pod creation
- **Auto**: Continuously updates requests and restarts pods

### Cluster Autoscaler
**Purpose**: Automatically adjusts cluster size based on pod resource needs
**Functions**:
- Adds nodes when pods can't be scheduled
- Removes nodes when underutilized

## Security in Kubernetes

### Role-Based Access Control (RBAC)
**Components**:
- **Roles**: Define permissions within namespace
- **ClusterRoles**: Define cluster-wide permissions
- **RoleBindings**: Bind roles to subjects within namespace
- **ClusterRoleBindings**: Bind cluster roles to subjects cluster-wide

**Subjects**:
- Users
- Groups
- ServiceAccounts

### Service Accounts
**Purpose**: Provide identity for processes running in pods
**Features**:
- Each namespace has default ServiceAccount
- Can be bound to roles for specific permissions
- Automatically mount tokens in pods

### Pod Security Standards
**Security Levels**:
- **Privileged**: Unrestricted policy (most permissive)
- **Baseline**: Minimally restrictive, prevents known privilege escalations
- **Restricted**: Heavily restricted, follows pod hardening best practices

### Network Policies
**Default Behavior**: All pods can communicate with each other
**Policy Types**:
- **Ingress**: Controls incoming traffic
- **Egress**: Controls outgoing traffic

## Monitoring and Logging

### Built-in Monitoring
**Metrics Server**: Collects resource usage metrics (CPU, memory)
**Usage**:
```bash
kubectl top nodes
kubectl top pods
kubectl top pods --containers
```

### Popular Monitoring Solutions
- **Prometheus + Grafana**: Metrics collection and visualization
- **ELK Stack**: Elasticsearch, Logstash, Kibana for logging
- **Jaeger**: Distributed tracing
- **Fluentd**: Log collection and forwarding

### Health Checks
**Probes**:
- **Liveness Probe**: Restarts container if unhealthy
- **Readiness Probe**: Removes pod from service if not ready
- **Startup Probe**: Delays other probes during startup

**Probe Types**:
- HTTP GET requests
- TCP Socket connections
- Command execution

## Best Practices

### Resource Management
- Always set resource requests and limits
- Use namespaces to organize resources
- Implement resource quotas and limit ranges
- Monitor resource usage regularly

### Security
- Use RBAC to control access
- Never run containers as root
- Regularly update images and scan for vulnerabilities
- Use network policies to restrict communication
- Enable audit logging

### Configuration Management
- Use ConfigMaps and Secrets for configuration
- Avoid hardcoding values in manifests
- Version control all manifests
- Use Helm or Kustomize for template management

### High Availability
- Run multiple replicas of critical applications
- Spread pods across multiple nodes using anti-affinity
- Use liveness and readiness probes
- Implement proper backup and disaster recovery

### Development Workflow
- Use namespaces to separate environments
- Implement CI/CD pipelines for deployments
- Use GitOps practices for configuration management
- Test manifests in staging before production

## Common Troubleshooting Scenarios

### Pod Issues
```bash
# Pod stuck in Pending
kubectl describe pod pod-name  # Check events
kubectl get events --sort-by=.metadata.creationTimestamp

# Pod CrashLoopBackOff
kubectl logs pod-name --previous  # Previous container logs
kubectl describe pod pod-name     # Check restart reason

# Pod not receiving traffic
kubectl get endpoints service-name  # Check if pod is in endpoints
kubectl describe service service-name  # Verify selector matches
```

### Resource Issues
```bash
# Node resource pressure
kubectl describe node node-name
kubectl top node node-name

# Pod eviction
kubectl get events | grep Evicted
kubectl describe pod evicted-pod-name
```

### Network Issues
```bash
# Service discovery problems
kubectl exec -it pod-name -- nslookup service-name
kubectl exec -it pod-name -- nslookup service-name.namespace.svc.cluster.local

# Connectivity testing
kubectl run test-pod --image=busybox -it --rm -- /bin/sh
# Inside pod: wget -qO- service-name:port
```

### Storage Issues
```bash
# PVC binding problems
kubectl describe pvc pvc-name
kubectl get pv  # Check available volumes
kubectl describe storageclass storage-class-name

# Volume mount issues
kubectl describe pod pod-name  # Check volume mount events
kubectl exec -it pod-name -- ls -la /mount/path
```

## Advanced Topics

### Custom Resource Definitions (CRDs)
**Purpose**: Extend Kubernetes API with custom resources
**Components**:
- CRD: Defines new resource type
- Custom Controller: Manages custom resource lifecycle
- Operator: Combines CRDs with controllers for application management

### Operators
**Purpose**: Automate application lifecycle management
**Popular Operators**:
- PostgreSQL Operator
- Redis Operator
- Prometheus Operator
- Istio Operator

### Service Mesh
**Purpose**: Manage service-to-service communication
**Features**:
- Traffic management
- Security (mTLS)
- Observability
- Policy enforcement

**Popular Service Meshes**:
- Istio
- Linkerd
- Consul Connect
- AWS App Mesh

### Multi-cluster Management
**Approaches**:
- Cluster federation
- Multi-cluster services
- Cross-cluster resource sharing
- Disaster recovery across clusters

This comprehensive guide covers all essential Kubernetes concepts, commands, and best practices needed for effective container orchestration and management.
