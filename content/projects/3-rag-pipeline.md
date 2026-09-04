Pick a document set you actually care about — a textbook, your college regulations, a library's docs, a set of policies. Twenty or more documents.

**Build**

- Ingestion: load, chunk, embed, store. pgvector, Chroma or Qdrant — your choice, justified in the README.
- Retrieval: dense search at minimum. Hybrid and a reranker earn marks.
- Generation: an answer that cites its sources by number, and refuses when the sources do not contain the answer.

**The marked part is the evaluation.** Write 20 or more questions with the chunk that should answer each, and report `recall@5`. Then improve something — heading context in chunks, hybrid search, a reranker — and report the number again.

A README that says "it works well" scores nothing here. A README that says "recall@5 went from 0.55 to 0.80 after adding heading context to chunks" scores everything.
