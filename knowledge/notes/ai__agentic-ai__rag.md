# RAG & Agentic AI Knowledge Base

## 1. Knowledge Base Fundamentals

### 1.1 Purpose
- Stores structured + unstructured data for AI reasoning
- Reduces hallucinations by grounding responses in verified facts
- Enables retrieval + generation hybrid systems

### 1.2 Types of Knowledge Bases

| Type | Audience | Content | Purpose |
|------|----------|---------|---------|
| **Internal** | Employees | Policies, procedures, training, internal docs | Onboarding, troubleshooting, knowledge sharing |
| **External** | Customers | FAQs, guides, tutorials, troubleshooting | Self-service, reduce support tickets |
| **Hybrid** | Both | Combined resources with access controls | Consistency while protecting sensitive data |
| **Structured** | Any | Categorized, tagged, hierarchical | Easy navigation for large data volumes |
| **Unstructured** | Any | Free-form articles, notes | Evolving content, search-dependent |
| **AI-Powered** | Any | Any format + ML/NLP | Instant answers, suggestions, continuous learning |

### 1.3 Evolution Path
1. **Traditional DB**: Structured queries, no semantic understanding
2. **Search Engines**: Keyword matching, no context awareness
3. **RAG**: Reactive retrieval + LLM generation
4. **Agentic KB**: Proactive reasoning substrate with memory

---

## 2. RAG Comparison

### 2.1 Traditional RAG vs Agentic RAG

| Aspect | Traditional RAG | Agentic RAG |
|--------|----------------|-------------|
| **Nature** | Reactive retrieval | Proactive reasoning |
| **Query** | Single-pass | Multi-step iteration |
| **Decision** | Pre-defined logic | Autonomous agents |
| **Memory** | Stateless | Episodic learning |
| **Planning** | Direct retrieval | Plan → Retrieve → Reason |
| **Tools** | None | APIs, calculators, external systems |
| **Self-Correction** | No | Self-reflection, quality evaluation |

### 2.2 Traditional RAG Pipeline (5 Stages)
1. **Ingest**: Load documents (PDFs, APIs, databases)
2. **Chunk**: Split into 500-1500 token segments
3. **Embed**: Text → numerical vectors (e.g., 1536D)
4. **Store**: Vector database (Pinecone, ChromaDB, FAISS)
5. **Generate**: Query + retrieved context → LLM answer

### 2.3 Traditional RAG Limitations
- **Equal weighting**: All sources treated uniformly
- **Similarity ≠ Relevance**: Top-K assumes closeness = importance
- **Static queries**: Single pass, no refinement
- **Reactive only**: Retrieves when prompted, not proactive
- **No reasoning**: Cannot plan or make decisions

### 2.4 Agentic RAG Workflow (6 Stages)
1. **Submit**: User query → Orchestrator
2. **Retrieve**: KB + external storage + APIs
3. **Process**: Specialized agents (refinement, ranking, tools)
4. **Generate**: Orchestrator synthesizes outputs
5. **Iterate**: Re-retrieve if quality insufficient
6. **Deliver**: Final answer to user

### 2.5 Agentic RAG Features
- **Query Rewriting**: Agent reformulates for precision
- **Multi-Hop**: Sequential retrieval across sources
- **Recursive**: Revisits retrieval when gaps found
- **Tool Integration**: APIs, calculators, external systems
- **Self-Reflection**: Evaluates own outputs, self-corrects

### 2.6 Agentic RAG Types

| Type | Mechanism | Use Case |
|------|-----------|----------|
| **Router RAG** | Routes queries to specialized retrievers/models | Multi-domain systems (legal + medical + technical) |
| **Query Planner RAG** | Decomposes complex queries into sub-tasks | "Compare X across 3 countries over 5 years" |
| **Adaptive RAG** | Dynamically adjusts retrieval strategy based on query complexity | Simple facts vs complex research |
| **Speculative RAG** | Generates multiple hypotheses, selects best evidence-backed version | Research analysis, hypothesis testing |
| **Self-Reflective RAG** | Evaluates output quality, triggers re-retrieval if needed | High-stakes decisions, quality assurance |

**Answer to your question**: **Speculative RAG** - generates multiple hypotheses and selects the most coherent, evidence-backed version.

---

## 3. Chunking

### 3.1 Strategies

| Strategy | Method | Best For |
|----------|--------|----------|
| **Fixed-Size** | Uniform 500-1500 tokens | Structured docs |
| **Recursive** | Paragraph→sentence→word hierarchy | Narrative text |
| **Semantic** | Embedding-based topic shifts | Research papers |
| **Document-Based** | Structural markers (headings) | Technical docs |
| **Agent-Aware** | Persona-specific granularity | Multi-agent systems |

### 3.2 Agent-Aware Chunking
- **Planner**: 1500 tokens (high-level overviews)
- **Developer**: 800 tokens (detailed implementations)
- **Executive**: 300 tokens (concise summaries)

**Metadata**:
```json
{
  "agent_role": ["architect", "planner"],
  "knowledge_type": "conceptual",
  "confidence_level": "high"
}
```

### 3.3 Size Guidelines
- **FAQs**: 200-400 tokens
- **Reports**: 800-1200 tokens
- **Overlap**: 10-20% for continuity
- **Limit**: Stay below model max (e.g., 8000 → use 1500)

### 3.4 Code Example

```python
def agent_aware_chunks(text, category, persona):
    docs = []
    lines = text.strip().splitlines()
    
    # SOP: Step-by-step chunks
    if lines and lines[0].startswith("SOP"):
        docs.append(Document(
            page_content=lines[0],
            metadata={"persona": persona, "section": "header"}
        ))
        for line in lines[1:]:
            docs.append(Document(
                page_content=line,
                metadata={"persona": persona, "section": "step"}
            ))
    # Normal: Recursive chunking
    else:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=250, 
            chunk_overlap=20
        )
        for chunk in splitter.split_text(text):
            docs.append(Document(
                page_content=chunk,
                metadata={"persona": persona, "category": category}
            ))
    
    return docs
```

---

## 4. Embeddings & Indexing

### 4.1 Embedding Models

| Model | Dimensions | Max Tokens | Use Case |
|-------|-----------|------------|----------|
| **text-embedding-3-small** | 1536 | 8191 | Cost-effective |
| **text-embedding-3-large** | 3072 | 8191 | Higher accuracy |
| **Cohere multilingual** | 1024 | 4096 | Cross-language |

### 4.2 Vector Databases

| Database | Type | Best For |
|----------|------|----------|
| **Pinecone** | Managed | Production scale |
| **ChromaDB** | Lightweight | Prototyping |
| **FAISS** | Library | Custom implementations |

### 4.3 Storage Strategy

**Single Store + Filters**: Same domain, different personas
```python
retriever = vectorstore.as_retriever(
    search_kwargs={"k": 5, "filter": {"agent_role": "developer"}}
)
```

**Multiple Stores**: Separate purposes (support, API, compliance)
```python
# Create stores per category
stores = {}
sources = [
    (PRODUCT_MANUAL, "procedural", "support"),
    (API_DOCS, "operational", "engineer"),
]

for text, category, persona in sources:
    docs = agent_aware_chunks(text, category, persona)
    if category not in stores:
        stores[category] = FAISS.from_documents(docs, embeddings)
    else:
        stores[category].add_documents(docs)
```

---

## 5. Retrieval

### 5.1 Retrieval Methods

**Similarity Search**: Cosine similarity, Euclidean distance
- Good for semantic understanding
- Poor with exact constraints (dates, IDs)

**Hybrid Search**: Vector + Keyword (BM25) + Metadata
```python
score = 0.65 × vector_score + 0.35 × keyword_score
```
- Best for enterprise applications
- Balances semantic + exact matching

**MMR (Max Marginal Relevance)**: Balance relevance + diversity
```python
λ × Similarity(q, doc) - (1-λ) × max Similarity(doc, selected)
```

### 5.2 Retrieval Parameters
- **top_k**: Planner=3-5, Developer=5-8, Researcher=10-20
- **score_threshold**: High precision=0.75-0.85, Balanced=0.65-0.75
- **fetch_k**: 2-4× top_k for re-ranking

### 5.3 Advanced Retrieval Techniques

**Query Rewriting**
```
Original: "GDPR data storage rules"
Context: Compliance officer, cloud domain, previous encryption question
Rewritten: "GDPR Article 32 encryption requirements for cloud storage in healthcare"
```

**Multi-Hop Retrieval**
```
Query: "GDPR implications for healthcare cloud storage"
Hop 1: GDPR rules (declarative KB)
Hop 2: Healthcare compliance (regulatory KB)
Hop 3: Cloud security (technical KB)
Synthesize: Combined answer
```

**Recursive Retrieval**
```
Query: "Calculate tax liability"
Retrieval 1: Federal tax regulations
Gap: Missing rental income rules
Retrieval 2: Rental income taxation
Gap: Missing foreign income rules
Retrieval 3: Foreign income taxation
Final: Complete calculation
```

### 5.4 Retrieval Patterns
- **As-Tool**: On-demand when confidence < threshold
- **As-Step**: Mandatory at workflow stage (compliance)
- **As-Decision**: Agent decides based on meta-reasoning

### 5.5 Intelligent Techniques

**Self-Query**: Natural language → Structured query
```sql
SELECT * FROM standards 
WHERE category='ISO' AND year>=2023 AND topic='cloud security'
```

**Context-Aware Filters**: Dynamic based on conversation
```python
Turn 1: domain='AI', year>=2020
Turn 2: domain='AI', topic='RL', year>=2020
Turn 3: domain='AI', topic='RL', year>=2024
```

**Persona-Based**: Adapts to user role
- Compliance: Legal docs only, high confidence, citations required
- Developer: Technical specs, code examples, medium-high confidence

### 5.6 Retrieval Policies per Persona
```python
{
  "planner": {"top_k": 3, "type": "conceptual", "confidence": "medium"},
  "developer": {"top_k": 5, "type": "technical", "confidence": "high"},
  "executive": {"top_k": 2, "type": "summarized", "confidence": "high"}
}
```

### 5.7 Multi-Hop Code Example

```python
def retrieve(query, hop):
    if hop == 1:
        cats = ["semantic", "procedural"]
        q = query
    elif hop == 2:
        cats = ["semantic", "procedural", "operational"]
        # Multi-hop: LLM expands query
        q = llm.invoke(f"Expand query: {query}").content
    else:
        cats = ["semantic", "procedural", "operational", "episodic"]
        q = query
    
    results = []
    for cat in cats:
        docs = stores[cat].similarity_search(q, k=4)
        for d in docs:
            d.metadata["source_cat"] = cat
        results.extend(docs)
    
    return results
```

---

## 6. Evaluation

### 6.1 Retrieval Evaluation Metrics

| Metric | Formula | Target | Meaning |
|--------|---------|--------|---------|
| **Precision** | P = TP / (TP + FP) | >0.7 | Accuracy of results |
| **Recall** | R = TP / (TP + FN) | >0.8 | Coverage of relevant docs |
| **F1** | F1 = 2 × (P × R) / (P + R) | >0.75 | Harmonic mean |
| **MRR** | MRR = (1/|Q|) × Σ(1/rank_i) | >0.8 | Mean reciprocal rank |
| **NDCG** | NDCG = DCG / IDCG | >0.8 | Normalized discounted cumulative gain |

**Where:**
- TP = True Positives (relevant docs retrieved)
- FP = False Positives (irrelevant docs retrieved)  
- FN = False Negatives (relevant docs not retrieved)
- Q = Set of queries
- rank_i = Position of first relevant result for query i

**NDCG Components:**
- DCG = Σ (2^rel_i - 1) / log₂(i + 1) [actual ranking]
- IDCG = Σ (2^rel_i - 1) / log₂(i + 1) [ideal ranking]
- rel_i = Relevance score of item at position i

### 6.2 Generation Evaluation Metrics

**BLEU (Bilingual Evaluation Understudy)**
- Compares n-grams between generated and reference text
- **Formula**: 
  ```
  BLEU = BP × exp(Σ(i=1 to N) w_i × log p_i)
  
  BP (Brevity Penalty) = {
    1                    if c > r
    exp(1 - r/c)        if c ≤ r
  }
  
  p_i = (Σ Count_clip(n-gram)) / (Σ Count(n-gram))
  ```
  - BP = Brevity penalty (penalizes short outputs)
  - c = Length of candidate translation
  - r = Length of reference translation
  - w_i = Weight for n-gram precision of order i (typically 1/N)
  - p_i = Modified n-gram precision score of order i
  - N = Maximum n-gram order (usually 4)
  - Count_clip = Minimum of n-gram count in candidate and max reference count
- Higher score = closer match to reference (0-1 scale)
- Limitation: Focuses on n-gram overlap, ignores semantics

**ROUGE (Recall-Oriented Understudy for Gisting Evaluation)**
- Emphasizes recall: how much reference content is in generated text
- **Variants & Formulas**:
  ```
  ROUGE-N = Σ(n-gram ∈ Ref) Count_match(n-gram) / Σ(n-gram ∈ Ref) Count(n-gram)
  
  ROUGE-L = LCS(X,Y) / length(reference)
  
  ROUGE-L_F1 = (1+β²) × R_lcs × P_lcs / (R_lcs + β² × P_lcs)
  ```
  - ROUGE-N: N-gram overlap (N=1 for unigrams, N=2 for bigrams)
  - ROUGE-L: Longest Common Subsequence (LCS) based
  - Count_match = Number of overlapping n-grams
  - R_lcs = LCS / reference_length (recall)
  - P_lcs = LCS / candidate_length (precision)
  - β = Balance parameter (typically β²=1)
- Better at content overlap than BLEU
- Limitation: Still lacks semantic understanding

**METEOR (Metric for Evaluation of Translation with Explicit Ordering)**
- Combines word-level matching with syntactic/semantic similarity
- **Formula**:
  ```
  METEOR = (1 - Penalty) × F_mean
  
  F_mean = (P × R) / (α × P + (1-α) × R)
  
  Penalty = γ × (chunks / matches)^θ
  ```
  - P = Precision (matched unigrams / candidate length)
  - R = Recall (matched unigrams / reference length)
  - α = Weight for precision vs recall (typically 0.9, favoring recall)
  - chunks = Number of matched word groups
  - matches = Total matched unigrams
  - γ = Penalty coefficient (typically 0.5)
  - θ = Penalty exponent (typically 3)
  - Matching includes: exact, stem, synonym, paraphrase
- Uses stemming and synonymy databases
- More robust than BLEU and ROUGE
- Considers meaning beyond exact matches

**Semantic Similarity Metrics**
- **Word Mover's Distance (WMD)**: Measures semantic distance
  ```
  WMD(d1, d2) = min Σ T_ij × c(i,j)
  ```
  - T_ij = Transport flow from word i to word j
  - c(i,j) = Euclidean distance between word embeddings
  - Lower WMD = more similar documents
  
- **Semantic Textual Similarity (STS)**: Evaluates meaning alignment
  ```
  STS = cosine_similarity(embed(text1), embed(text2))
  
  cosine_similarity = (A · B) / (||A|| × ||B||)
  ```
  - Score range: -1 to 1 (1 = identical meaning)
  - Uses sentence/document embeddings (BERT, Sentence-BERT)
  
- Goes beyond syntax to understand relationships

### 6.3 RAGAS Metrics

| Metric | Measurement | Target | Code Syntax |
|--------|-------------|--------|-------------|
| **Context Precision** | Relevance of retrieved chunks | >0.8 | `context_precision.score(dataset)` |
| **Context Recall** | Ground truth captured | >0.9 | `context_recall.score(dataset)` |
| **Faithfulness** | Answer grounded in context | 1.0 | `faithfulness.score(dataset)` |
| **Answer Relevance** | Answer addresses query | >0.8 | `answer_relevancy.score(dataset)` |
| **Answer Correctness** | Factual accuracy | >0.9 | `answer_correctness.score(dataset)` |

**RAGAS Code Example**:
```python
from ragas import evaluate
from ragas.metrics import (
    context_precision,
    context_recall,
    faithfulness,
    answer_relevancy
)

# Prepare dataset
dataset = {
    "question": ["What is RAG?"],
    "answer": ["RAG combines retrieval with generation"],
    "contexts": [["RAG stands for Retrieval Augmented Generation"]],
    "ground_truth": ["RAG is a technique that retrieves documents"]
}

# Evaluate
result = evaluate(
    dataset,
    metrics=[
        context_precision,
        context_recall,
        faithfulness,
        answer_relevancy
    ]
)

print(f"Context Precision: {result['context_precision']}")
print(f"Faithfulness: {result['faithfulness']}")
```

### 6.4 Combined Metrics
- **Context Precision**: Relevance of retrieved documents to query
- **Context Recall**: Extent relevant information is captured
- **Faithfulness**: Accuracy of response vs retrieved documents
- **Response Relevancy**: Relevance of response to original query

### 6.5 Domain-Specific Considerations
- **Medical RAG**: Factual accuracy, patient safety metrics
- **Legal RAG**: Citation accuracy, precedent relevance
- **Financial RAG**: Regulatory compliance, numerical accuracy
- **User Studies**: Real user feedback for qualitative insights

---

## 7. Human-in-the-Loop (HITL)

### 7.1 When Required
- High stakes (medical, financial, legal)
- Low AI confidence (<0.7)
- Ethical sensitivity
- Regulatory compliance

### 7.2 Intervention Points
- **Planning**: Validate AI plan before execution
- **Execution**: Approve high-risk actions in real-time
- **Validation**: Audit outputs for correctness

### 7.3 Design Patterns

**Approval Gate**: Mandatory human approval
```python
if risk_score >= 0.7 or confidence <= 0.7:
    interrupt({"message": "Approval Required", "evidence": evidence})
    human_decision = get_input()
```

**Feedback Loop**: Human corrections improve model
```python
ai_response = generate()
feedback = human_review(ai_response)
store_feedback(query, ai_response, feedback)
if feedback["corrections"]:
    final = feedback["corrections"]
```

**Escalation**: Route uncertain cases to experts
```python
if confidence < 0.7 or ethics_flag:
    escalate_to_expert({
        "reason": "Low confidence",
        "urgency": calculate_urgency(),
        "context": prepare_context()
    })
```

---

## 8. LangGraph Integration

### 8.1 KB as LangGraph Node
```
START → Planner → KB_Node → Reasoner → END
                     ↑
              (if insufficient)
                     ↓
              KB_Node (refined)
```
- KB decides if retrieval needed
- Selects policy based on persona
- Attaches results + metadata to state
- Routes to next node

### 8.2 Interrupt Mechanism

**Check for Interrupt**:
```python
result = app.invoke(state, config)

if "__interrupt__" in result:
    # Workflow paused
    data = result["__interrupt__"]
    print(data["question"])
else:
    # Workflow completed
    print(result["answer"])
```

**Interrupt Node**:
```python
def review_node(state):
    interrupt(value={
        "question": "Approve?",
        "draft": state["answer"],
        "confidence": state["confidence"]
    })
    return state
```

### 8.3 Resume with Command

**Binary Approval**:
```python
if user_input == "yes":
    result = app.invoke(Command(resume={"needs_hop": False}), config)
else:
    result = app.invoke(Command(resume={"needs_hop": True}), config)
```

**Edit State**:
```python
edited = input("Edit answer: ")
result = app.invoke(
    Command(resume={
        "answer": edited,
        "human_approved": True
    }), 
    config
)
```

**Multi-Choice**:
```python
choice = int(input("Select option (1-3): ")) - 1
result = app.invoke(
    Command(resume={
        "selected": options[choice],
        "index": choice
    }), 
    config
)
```

### 8.4 Complete Workflow Example

```python
from langgraph.graph import StateGraph
from langgraph.types import interrupt
from typing import TypedDict

class State(TypedDict):
    query: str
    hop: int
    context: str
    answer: str
    needs_hop: bool

def planner_node(state):
    subs = llm.invoke(f"Split into sub-questions: {state['query']}").content
    return {"subs": subs.splitlines()}

def kb_node(state):
    docs = []
    for sub in state["subs"]:
        docs.extend(retrieve(sub, state["hop"]))
    return {"context": "\n".join(d.page_content for d in docs)}

def analyst_node(state):
    res = llm.invoke(f"Answer using context:\nQuery: {state['query']}\nContext: {state['context']}").content
    needs_hop = "needs_hop" in res.lower()
    return {"answer": res, "needs_hop": needs_hop}

def human_node(state):
    return interrupt({
        "question": "Approve escalation?",
        "draft_answer": state["answer"]
    })

def routing_node(state):
    if state["needs_hop"] and state["hop"] < 3:
        return "inc_hop"
    if state["needs_hop"]:
        return "human"
    return "final"

# Build graph
graph = StateGraph(State)
graph.add_node("planner", planner_node)
graph.add_node("kb", kb_node)
graph.add_node("analyst", analyst_node)
graph.add_node("human", human_node)

graph.set_entry_point("planner")
graph.add_edge("planner", "kb")
graph.add_edge("kb", "analyst")
graph.add_conditional_edges("analyst", routing_node, 
    {"inc_hop": "inc_hop", "human": "human", "final": "final"})

app = graph.compile(checkpointer=MemorySaver())

# Execute with HITL
config = {"configurable": {"thread_id": "thread1"}}
result = app.invoke({
    "query": "Design password reset API",
    "hop": 1,
    "context": "",
    "answer": "",
    "needs_hop": False
}, config)

# Handle interrupt
if "__interrupt__" in result:
    data = result["__interrupt__"]
    print(f"Question: {data['question']}")
    print(f"Draft: {data['draft_answer']}")
    
    user_input = input("Approve? (yes/no): ")
    
    if user_input == "yes":
        result = app.invoke(Command(resume={"needs_hop": False}), config)
    else:
        result = app.invoke(Command(resume={"needs_hop": True}), config)

print(f"Final Answer: {result['answer']}")
```

---

## 9. Knowledge Base Architecture

### 9.1 Six Layers
1. **Data Sources**: Documents, APIs, graphs, logs
2. **Ingestion**: Agent-aware chunking + metadata + embeddings
3. **Storage**: Vector DBs + hybrid indexes + graph DBs
4. **Retrieval**: Persona-aware policies + contextual handling
5. **Reasoning**: Goal-driven + planning + LangGraph integration
6. **Feedback**: Episodic memory + policy updates + learning

### 9.2 Operational Metadata
```json
{
  "agent_role": ["architect", "planner"],
  "knowledge_type": "conceptual",
  "confidence_level": "high",
  "usage_policy": "global",
  "technical_depth": "overview",
  "compliance_required": false
}
```

### 9.3 Five Knowledge Types

| Type | Content | Enables |
|------|---------|---------|
| **Declarative** | Facts | Answering |
| **Procedural** | Instructions | Planning |
| **Episodic** | Experiences | Learning |
| **Semantic** | Relationships | Reasoning |
| **Operational** | Interfaces | Acting |

---

## 10. Knowledge Graphs

### 10.1 Why Needed
- **Vector DB limits**: No explicit relationships, cannot verify reasoning chains
- **Graph enables**: Causality (A→B), hierarchy (is-a), dependencies (requires)

### 10.2 Relationship Types
- **is-a**: Dog is-a Animal
- **part-of**: Wheel part-of Car
- **interacts-with**: Drug-A interacts-with Drug-B
- **causes**: Virus causes Disease
- **requires**: Feature-X requires Module-Y

### 10.3 Hybrid Architecture
```
Query → Vector Search → Extract Entities → Graph Traversal → Synthesize
```

**Benefits**:
- Semantic understanding + explicit relationships
- Reduced hallucinations (graph verification)
- Multi-hop reasoning
- Explainable reasoning paths

### 10.4 Use Cases

**Root Cause (IT)**:
```
Vector: Error logs
Graph: Server → hosts → API → depends_on → Database → requires → Network
Inference: Network failure caused cascade
```

**Compliance (Banking)**:
```
Vector: AML regulations
Graph: Transaction-X → subject_to → AML-Rule-Y → requires → KYC-Check-Z
Validation: Check all steps present
```

**Medical Diagnosis**:
```
Vector: Treatment guidelines
Graph: Diabetes → contraindicated → Drug-A
      High-BP → requires → Drug-B
      Drug-A → interacts_with → Drug-B → causes → Side-Effect-X
Recommendation: Alternative treatment
```

---

## Key Principles

1. **KB Classification**: Choose type (internal/external/hybrid/structured/unstructured/AI-powered) based on audience and content
2. **Chunking**: Align with persona needs, not arbitrary size
3. **Metadata**: Enable routing, filtering, policy enforcement
4. **Hybrid Search**: Vector + keyword + metadata for precision
5. **Retrieval Policies**: Tailor top_k and filters per agent
6. **Multi-Hop**: Sequential retrieval for complex reasoning
7. **Evaluation**: Combine retrieval metrics (Precision, Recall, MRR, NDCG) with generation metrics (BLEU, ROUGE, METEOR) and RAGAS
8. **HITL**: Mandatory checkpoints for high-stakes decisions
9. **KB as Node**: First-class workflow component in LangGraph
10. **Knowledge Types**: All five types (declarative, procedural, episodic, semantic, operational) needed for autonomy

```python
from typing import List, Dict, TypedDict
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_aws import ChatBedrockConverse, BedrockEmbeddings
from langgraph.graph import StateGraph
from langgraph.types import interrupt

# -----------------------------
# Knowledge Sources
# -----------------------------

PRODUCT_MANUAL = """Product Manual v1.2
Login requires email and password.
Password reset sends OTP via email.
Sessions expire after 24 hours.
Account lock occurs after 5 failed attempts.
Two-factor authentication (2FA) can be enabled in Settings.
Admins can impersonate users with audit trail.
Mobile app caches tokens for 12 hours.
API rate limit: 100 requests per minute per key.
Error E-401 indicates invalid token.
Error E-403 indicates permission denied.
Error E-429 indicates throttling due to rate limit.
"""

SOP_RESET = """SOP: Password Reset
Step 1: Verify user identity via registered email.
Step 2: Trigger OTP and wait for confirmation.
Step 3: Ensure account is not locked; unlock if needed.
Step 4: Check rate limits if multiple resets requested.
Step 5: Verify device clock drift if OTP mismatch occurs.
Step 6: Suggest 2FA re-enrollment if account compromised.
Step 7: Log all actions for audit compliance.
"""

KNOWN_ISSUES = """Known Issues
Issue KI-07: OTP emails delayed by 2–3 minutes during peak hours.
Issue KI-12: Mobile token cache not clearing on logout.
Issue KI-19: Account lock persists after password update.
Workaround: Admin unlock resolves KI-19.
Monitor: Rate-limit spikes during peak hours.
"""

API_QUICKSTART = """API Quickstart
POST /v1/auth/reset → triggers OTP for password reset.
GET /v1/auth/session → returns active sessions.
Header X-API-KEY required for all requests.
Returns E-401 for invalid token.
Returns E-429 when rate limited.
Ensure HTTPS for all API calls.
"""

GLOSSARY = """Glossary
OTP: One-time password for user confirmation.
2FA: Two-factor authentication for account security.
Rate limit: Maximum allowed requests per minute.
Account lock: Security hold after repeated login failures.
Session token: Temporary credential for active sessions.
"""

# -----------------------------
# LLM and Embeddings
# -----------------------------

embeddings_model = BedrockEmbeddings(
    model_id="amazon.titan-embed-text-v1",
    region_name="us-east-1",
)

llm = ChatBedrockConverse(
    model_id="amazon.nova-lite-v1:0",
    region_name="us-east-1",
    temperature=0.4,
    max_tokens=200,
)

# -----------------------------
# Persona-aware chunking
# PURE preprocessing only
# no DB logic, no retrieval logic, no hop logic
# SOP logic only changes chunk SHAPE
# -----------------------------

def agent_aware_chunks(text: str, category: str, persona: str):
    lines = text.strip().splitlines()
    docs: List[Document] = []

    # if there is no SOP then normal chunking applies
    if lines and lines[0].startswith("SOP"):
        docs.append(
            Document(
                page_content=lines[0],
                # metadata can be extremely rich or very small
                # depends on retrieval strategy
                metadata={
                    "persona": persona,
                    "category": category,
                    "section": "header",
                },
            )
        )
        for line in lines[1:]:
            docs.append(
                Document(
                    page_content=line,
                    metadata={
                        "persona": persona,
                        "category": category,
                        "section": "step",
                    },
                )
            )
    else:
        splitter = RecursiveCharacterTextSplitter(chunk_size=250, chunk_overlap=20)
        for chunk in splitter.split_text(text):
            docs.append(
                Document(
                    page_content=chunk,
                    metadata={
                        "persona": persona,
                        "category": category,
                        "section": "text",
                    },
                )
            )
    return docs

# -----------------------------
# Stores
# Exercise-2 uses CATEGORY-BASED STORES
# PRODUCT_MANUAL behaves like procedural knowledge
# -----------------------------

stores: Dict[str, FAISS] = {}

sources = [
    (PRODUCT_MANUAL, "procedural", "support"),
    (SOP_RESET, "procedural", "support"),
    (KNOWN_ISSUES, "episodic", "support"),
    (API_QUICKSTART, "operational", "engineer"),
    (GLOSSARY, "semantic", "research"),
]

# direct ingestion into stores
# kd_docs is optional scaffolding and intentionally skipped
for text, category, persona in sources:
    docs = agent_aware_chunks(text, category, persona)
    if category not in stores:
        stores[category] = FAISS.from_documents(docs, embeddings_model)
    else:
        stores[category].add_documents(docs)

# -----------------------------
# Retrieval
# Exercise-2 logic
# hop controls reasoning depth
# -----------------------------

def retrieve(query: str, hop: int):
    # hop 1 → understand meaning and rules
    # hop 2 → confirm mechanics and APIs
    # hop 3 → validate using historical issues

    if hop == 1:
        cats = ["semantic", "procedural"]
        q = query

    elif hop == 2:
        cats = ["semantic", "procedural", "operational"]
        # multi-hop reasoning happens here
        # LLM output feeds next retrieval
        q = llm.invoke(
            f"Expand this query using technical ontology:\n{query}"
        ).content

    else:
        cats = ["semantic", "procedural", "operational", "episodic"]
        q = query

    results: List[Document] = []
    for cat in cats:
        docs = stores[cat].similarity_search(q, k=4)
        for d in docs:
            d.metadata["source_cat"] = cat
        results.extend(docs)
    return results
    # this is category-based retrieval
    # if we had a single DB instead,
    # we would use as_retriever + metadata filter like below
    # def kb_agent(state: ContractState):
    #     persona = "compliance"
    #     top_k = 8
    #     retriever = vectorstore.as_retriever(
    #         search_kwargs={
    #             "k": top_k,
    #             "filter": {"agent_role": persona,"domain": "contracts"}})
    #     evidence = []
    #     for clause in state["review_plan"]:
    #         docs = retriever.invoke(clause)
    #         evidence.extend(docs)
    #     return {"evidence": evidence}

# -----------------------------
# LangGraph State
# -----------------------------

class State(TypedDict):
    query: str
    subs: List[str]
    hop: int
    context: str
    answer: str
    needs_hop: bool

# -----------------------------
# Planner
# -----------------------------

def planner_node(state: State):
    res = llm.invoke(
        f"Split into 2–3 sub-questions:\n{state['query']}"
    ).content
    return {"subs": res.splitlines()}

# -----------------------------
# KB node
# -----------------------------

def kb_node(state: State):
    docs: List[Document] = []

    for sub in state["subs"]:
        sub = sub.strip()
        # guard against empty LLM output lines
        if not sub:
            continue

        docs.extend(retrieve(sub, state["hop"]))

    return {"context": "\n".join(d.page_content for d in docs)}


# -----------------------------
# Analyst
# -----------------------------

def analyst_node(state: State):
    res = llm.invoke(
        f"""
        Answer ONLY using the provided context.
        If the context does not answer the query, say NEEDS_HOP.

        Query: {state['query']}
        Context:
        {state['context']}
        """
    ).content

    needs_hop = (
        "needs_hop" in res.lower()
        or state["query"].lower() not in res.lower()
    )

    return {
        "answer": res,
        "needs_hop": needs_hop,
    }


# -----------------------------
# Human in the loop
# invoked only when hops exhausted
# -----------------------------

def human_node(state: State):
    return interrupt(
        {
            "question": "Evidence still ambiguous. Approve escalation or stop?",
            "draft_answer": state["answer"],
        }
    )


def increment_hop_node(state: State):
    return {"hop": state["hop"] + 1}


# -----------------------------
# Finalizer
# -----------------------------

def finalize_node(state: State):
    res = llm.invoke(
        f"Produce final clean answer:\n{state['answer']}"
    ).content
    return {"answer": res}

# -----------------------------
# Hop controller
# this is where hop ACTUALLY increases
# -----------------------------

def routing_node(state: State):
    if state["needs_hop"] and state["hop"] < 3:
        return "inc_hop"

    if state["needs_hop"]:
        return "human"

    return "final"


# -----------------------------
# Reporting Agent
# runs AFTER human decision
# produces a small audit-style report
# -----------------------------

def reporting_node(state: State):
    report = f"""
    ---- HUMAN-IN-LOOP REPORT ----
    Original Question:
    {state['query']}

    Final Answer:
    {state['answer']}

    Total Hops Used:
    {state['hop']}

    Decision Path:
    - Retrieval required: {state['needs_hop']}
    - Human intervention: Yes

    Outcome:
    Answer finalized after human validation.
    -------------------------------
    """
    return {"answer": report}

# -----------------------------
# Graph
# -----------------------------

graph = StateGraph(State)

# register nodes (IDs matter, not function names)
graph.add_node("planner", planner_node)
graph.add_node("inc_hop", increment_hop_node)
graph.add_node("kb", kb_node)
graph.add_node("report", reporting_node)
graph.add_node("analyst", analyst_node)
graph.add_node("human", human_node)
graph.add_node("final", finalize_node)

# entry point
graph.set_entry_point("planner")

# normal flow
graph.add_edge("planner", "kb")
graph.add_edge("kb", "analyst")

# decision routing (NO state mutation here)
graph.add_conditional_edges(
    "analyst",
    routing_node,
    {
        "inc_hop": "inc_hop",
        "human": "human",
        "final": "final",
    },
)

# hop increment path
graph.add_edge("inc_hop", "kb")

graph.add_edge("human", "report")
graph.add_edge("report", "final")


# compile graph
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()

app = graph.compile(checkpointer=checkpointer)


# -----------------------------
# Execute
# -----------------------------

config = {"configurable":{"thread_id":"thread1"}}
result = app.invoke(
    {# Design an agent that resets passwords safely and exposes an API for active sessions.
        "query": "who is satya?",
        "subs": [],
        "hop": 1,
        "context": "",
        "answer": "",
        "needs_hop": False,
    },config
)

result



from langgraph.types import Command

if "__interrupt__" in result:
    data = result["__interrupt__"]

    print("\n--- HUMAN REVIEW REQUIRED ---")
    print("Question :", data["question"])
    print("Draft Answer :", data["draft_answer"])
    print("----------------------------")

    user_input = input("Approve? (yes / no): ").strip().lower()

    if user_input == "yes":
        # resume and accept current answer
        result = app.invoke(
            Command(resume={"needs_hop": False}),
            config
        )

    else:
        # resume but mark as rejected (forces reporting + final)
        result = app.invoke(
            Command(resume={"needs_hop": True}),
            config
        )
```
