## **PromptTemplate**

* A core LangChain abstraction for structuring prompts.
* Lets you define a **template string** with placeholders (like `{product}`), then fill them dynamically at runtime.
* Useful because LLMs respond better to structured, consistent prompts instead of messy string concatenation.
* Example:

  ```python
  from langchain.prompts import PromptTemplate

  prompt = PromptTemplate(
      input_variables=["product"],
      template="Write a tagline for {product}."
  )
  print(prompt.format(product="smartwatch"))
  ```
* In real systems, PromptTemplate is critical for **standardizing prompts across pipelines**—for chatbots, knowledge assistants, or content generation tools.

---

## **Runnable (LCEL) vs LangGraph**

1. **Runnable / LCEL (LangChain Expression Language)**

   * LCEL makes LangChain components composable, like building blocks in a pipeline.
   * Each step is a **Runnable** (prompt → model → parser).
   * Encourages functional chaining: data flows through transforms.
   * Example: `prompt | llm | parser`
   * Ideal when you want **linear flows**—like passing user query → LLM → JSON output.
   * Industry use: building **ETL-like LLM workflows** (parse documents, enrich, then output summaries).

2. **LangGraph**

   * Built on top of LCEL but for **graphs instead of chains**.
   * Lets you design **state machines / DAGs (directed acyclic graphs)** where control flow depends on conditions.
   * Can implement loops, branching, memory, retries.
   * Example: Customer support bot where path depends on sentiment: positive → FAQ answer; negative → escalate to human.
   * Industry use: **multi-agent orchestration** or complex **decision trees with LLMs**.

---

Simple metaphor:

* **LCEL** = a train track, straight line, predictable stops.
* **LangGraph** = a metro map, multiple routes, branches, loops, and junctions.
 

---
---

- Langserver
- Langsmith

## Memory: 
## sessions(message History):
## hub & agent executor:
## tools (all including yt tool, serach tool, math tools, embeeding tools, indexing tools ):
## sql toolkit vs mcp : 
## stuff document chain text summarization vs map reduce summarization technique with single prompt and multiple prompt template vs refine chain summarization:
## huggingfaceXlangchain features:
##  

# LangChain Complete Guide: Level 1-3

## 🎯 Level 1: Fundamentals

### 1.1 What is LangChain?
Framework for building LLM-powered applications with composable components.

### 1.2 Installation
```bash
pip install langchain langchain-openai langchain-community
pip install python-dotenv  # for API keys
```

### 1.3 Basic Setup
```python
import os
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()
os.environ["OPENAI_API_KEY"] = "your-api-key"

# Initialize LLM
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)
```

### 1.4 Simple Chat
```python
from langchain.schema import HumanMessage, SystemMessage

messages = [
    SystemMessage(content="You are a helpful assistant"),
    HumanMessage(content="What is Python?")
]

response = llm.invoke(messages)
print(response.content)
```

### 1.5 Prompt Templates
```python
from langchain.prompts import PromptTemplate

# Basic template
template = "Tell me a {adjective} joke about {topic}"
prompt = PromptTemplate(template=template, input_variables=["adjective", "topic"])

# Generate prompt
formatted = prompt.format(adjective="funny", topic="cats")
print(formatted)
```

### 1.6 Chat Prompt Templates
```python
from langchain.prompts import ChatPromptTemplate

chat_template = ChatPromptTemplate.from_messages([
    ("system", "You are a {role}"),
    ("human", "{user_input}")
])

messages = chat_template.format_messages(
    role="travel guide",
    user_input="Best places in Japan?"
)

response = llm.invoke(messages)
```

### 1.7 Simple Chains (LCEL)
```python
from langchain_core.output_parsers import StrOutputParser

# Chain: Prompt → LLM → Output Parser
chain = prompt | llm | StrOutputParser()

result = chain.invoke({"adjective": "silly", "topic": "programmers"})
print(result)
```

---

## 🚀 Level 2: Intermediate

### 2.1 Output Parsers

**String Parser**
```python
from langchain_core.output_parsers import StrOutputParser

parser = StrOutputParser()
chain = prompt | llm | parser
```

**JSON Parser**
```python
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.pydantic_v1 import BaseModel, Field

class Joke(BaseModel):
    setup: str = Field(description="The setup of the joke")
    punchline: str = Field(description="The punchline")

parser = JsonOutputParser(pydantic_object=Joke)

prompt = PromptTemplate(
    template="Tell a joke.\n{format_instructions}",
    input_variables=[],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)

chain = prompt | llm | parser
result = chain.invoke({})
```

### 2.2 Memory

**Conversation Buffer Memory**
```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory()
memory.save_context({"input": "Hi!"}, {"output": "Hello! How can I help?"})

print(memory.load_memory_variables({}))
```

**Conversation with Memory**
```python
from langchain.chains import ConversationChain

conversation = ConversationChain(
    llm=llm,
    memory=ConversationBufferMemory()
)

print(conversation.predict(input="Hi, I'm Alice"))
print(conversation.predict(input="What's my name?"))
```

**Window Memory (Last N messages)**
```python
from langchain.memory import ConversationBufferWindowMemory

memory = ConversationBufferWindowMemory(k=2)  # Keep last 2 interactions
```

### 2.3 Document Loading & Processing

**Load Documents**
```python
from langchain_community.document_loaders import TextLoader, PyPDFLoader

# Text file
loader = TextLoader("document.txt")
docs = loader.load()

# PDF
pdf_loader = PyPDFLoader("document.pdf")
pages = pdf_loader.load_and_split()
```

**Text Splitting**
```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
    length_function=len
)

chunks = text_splitter.split_documents(docs)
```

### 2.4 Embeddings & Vector Stores

**Create Embeddings**
```python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# Initialize embeddings
embeddings = OpenAIEmbeddings()

# Create vector store
vectorstore = FAISS.from_documents(chunks, embeddings)

# Save/Load
vectorstore.save_local("faiss_index")
vectorstore = FAISS.load_local("faiss_index", embeddings)
```

**Similarity Search**
```python
query = "What is the main topic?"
results = vectorstore.similarity_search(query, k=3)

for doc in results:
    print(doc.page_content)
```

### 2.5 Retrieval QA

**Basic RAG**
```python
from langchain.chains import RetrievalQA

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever()
)

answer = qa_chain.invoke("What is the document about?")
print(answer['result'])
```

**With Custom Prompt**
```python
from langchain.prompts import PromptTemplate

template = """Use the following context to answer the question.
If you don't know, say "I don't know".

Context: {context}

Question: {question}

Answer:"""

PROMPT = PromptTemplate(template=template, input_variables=["context", "question"])

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(),
    chain_type_kwargs={"prompt": PROMPT}
)
```

### 2.6 Agents (Basic)

**Simple Agent**
```python
from langchain.agents import load_tools, initialize_agent, AgentType

# Load tools
tools = load_tools(["wikipedia", "llm-math"], llm=llm)

# Initialize agent
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Run
result = agent.run("What is the population of Tokyo in 2023?")
```

---

## 🔥 Level 3: Advanced

### 3.1 Custom Tools

**Create Custom Tool**
```python
from langchain.tools import Tool
from langchain.agents import initialize_agent

def get_word_length(word: str) -> int:
    """Returns the length of a word."""
    return len(word)

tools = [
    Tool(
        name="Word Length",
        func=get_word_length,
        description="Useful for getting the length of a word"
    )
]

agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)
```

**Using @tool Decorator**
```python
from langchain.tools import tool

@tool
def search_api(query: str) -> str:
    """Search for information using an API."""
    # Your API logic here
    return f"Results for: {query}"

tools = [search_api]
```

### 3.2 Custom Chains

**Sequential Chain**
```python
from langchain.chains import SequentialChain, LLMChain

# Chain 1: Generate synopsis
synopsis_prompt = PromptTemplate(
    input_variables=["title"],
    template="Write a synopsis for a movie titled '{title}'"
)
synopsis_chain = LLMChain(llm=llm, prompt=synopsis_prompt, output_key="synopsis")

# Chain 2: Generate review
review_prompt = PromptTemplate(
    input_variables=["synopsis"],
    template="Write a review based on this synopsis:\n{synopsis}"
)
review_chain = LLMChain(llm=llm, prompt=review_prompt, output_key="review")

# Combine
overall_chain = SequentialChain(
    chains=[synopsis_chain, review_chain],
    input_variables=["title"],
    output_variables=["synopsis", "review"]
)

result = overall_chain({"title": "The AI Revolution"})
```

**Router Chain**
```python
from langchain.chains.router import MultiPromptChain
from langchain.chains.router.llm_router import LLMRouterChain, RouterOutputParser

# Define specialized prompts
physics_template = """You are a physics expert. Answer: {input}"""
math_template = """You are a math expert. Answer: {input}"""

prompt_infos = [
    {"name": "physics", "description": "Good for physics questions", "prompt_template": physics_template},
    {"name": "math", "description": "Good for math questions", "prompt_template": math_template}
]

# Create router
destination_chains = {}
for p_info in prompt_infos:
    prompt = PromptTemplate(template=p_info['prompt_template'], input_variables=["input"])
    chain = LLMChain(llm=llm, prompt=prompt)
    destination_chains[p_info["name"]] = chain

router_chain = MultiPromptChain(...)  # Simplified
```

### 3.3 Conversational RAG

**With Chat History**
```python
from langchain.chains import ConversationalRetrievalChain

qa = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    return_source_documents=True
)

chat_history = []

# First question
result = qa({"question": "What is LangChain?", "chat_history": chat_history})
chat_history.append((result['question'], result['answer']))

# Follow-up
result = qa({"question": "Can you elaborate?", "chat_history": chat_history})
```

### 3.4 Multi-Query Retrieval

```python
from langchain.retrievers.multi_query import MultiQueryRetriever

retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(),
    llm=llm
)

# Generates multiple queries for better retrieval
docs = retriever.get_relevant_documents("What is machine learning?")
```

### 3.5 Streaming Responses

```python
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

llm = ChatOpenAI(
    temperature=0.7,
    streaming=True,
    callbacks=[StreamingStdOutCallbackHandler()]
)

chain = prompt | llm | StrOutputParser()
for chunk in chain.stream({"topic": "AI"}):
    print(chunk, end="", flush=True)
```

### 3.6 Custom Retriever

```python
from langchain.schema import BaseRetriever, Document

class CustomRetriever(BaseRetriever):
    documents: list[Document]
    
    def get_relevant_documents(self, query: str) -> list[Document]:
        # Custom retrieval logic
        return [doc for doc in self.documents if query.lower() in doc.page_content.lower()]
    
    async def aget_relevant_documents(self, query: str) -> list[Document]:
        return self.get_relevant_documents(query)

retriever = CustomRetriever(documents=chunks)
```

### 3.7 Complex Agent with Multiple Tools

```python
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper

# Setup tools
wikipedia = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())

tools = [
    wikipedia,
    search_api,  # Your custom tool
]

# Create agent
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant"),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}")
])

agent = create_openai_tools_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = agent_executor.invoke({"input": "Tell me about LangChain and search for latest news"})
```

### 3.8 Self-Querying Retriever

```python
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.base import AttributeInfo

metadata_field_info = [
    AttributeInfo(name="source", description="The source document", type="string"),
    AttributeInfo(name="page", description="The page number", type="integer"),
]

retriever = SelfQueryRetriever.from_llm(
    llm=llm,
    vectorstore=vectorstore,
    document_contents="Research papers on AI",
    metadata_field_info=metadata_field_info
)

docs = retriever.get_relevant_documents("Papers from 2023 about GPT")
```

---

## 📚 Key Concepts Summary

### LCEL (LangChain Expression Language)
```python
# Chain components with |
chain = prompt | llm | parser

# Parallel execution with RunnableParallel
from langchain_core.runnables import RunnableParallel

chain = RunnableParallel(
    joke=joke_chain,
    poem=poem_chain
)
```

### Callbacks
```python
from langchain.callbacks import StdOutCallbackHandler

chain.invoke(input_data, config={"callbacks": [StdOutCallbackHandler()]})
```

### Caching
```python
from langchain.cache import InMemoryCache
import langchain

langchain.llm_cache = InMemoryCache()
```

---

## 🎓 Best Practices

1. **Always handle errors** with try-except blocks
2. **Use environment variables** for API keys
3. **Chunk documents appropriately** (1000-2000 chars)
4. **Add metadata** to documents for better retrieval
5. **Use streaming** for better UX with long responses
6. **Monitor token usage** to control costs
7. **Test prompts** iteratively for best results
8. **Use appropriate memory** type for your use case

---

## 🔗 Common Patterns

**RAG Pipeline**
```
Load → Split → Embed → Store → Retrieve → Generate
```

**Agent Flow**
```
Input → Reasoning → Tool Selection → Tool Execution → Response
```

**Chain Types**
- `stuff`: Put all docs in prompt (simple, token-limited)
- `map_reduce`: Summarize each doc, then combine
- `refine`: Iteratively refine answer with each doc
- `map_rerank`: Score each doc's answer, return best

---

This guide covers essential LangChain concepts from basics to advanced patterns. Practice each level before moving to the next!

---
---
---
---
