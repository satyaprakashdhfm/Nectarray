Retrieval-augmented generation: find the right passages, put them in the
prompt, answer from them. Two sentences, and most of what people call "AI
projects" in industry.

It exists because of one hard limit — a model knows nothing about your company
and cannot be made to, cheaply. Fine-tuning teaches style and format, not
facts. Retrieval hands the model the fact at question time, with a citation,
and lets you change the answer by editing a document.

```
question → embed → search → top passages → prompt with passages → answer
```

Every serious failure of a RAG system is in the *retrieval* half. If the right
passage is not in the prompt, no model can save you.

## Chunking

You cannot embed a 40-page PDF as one vector — the meaning averages out to
nothing. So you split it. How you split decides how well the whole thing works.

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # characters, not tokens
    chunk_overlap=150,      # so a sentence spanning a boundary survives
    separators=["\n## ", "\n### ", "\n\n", "\n", ". ", " "],
)
chunks = splitter.split_text(document)
```

`RecursiveCharacterTextSplitter` tries the separators in order, so it breaks at
a heading if it can, a paragraph if it cannot, and only falls back to cutting
mid-sentence as a last resort.

What actually matters, in order:

1. **Split on structure, not length.** Headings, sections, list items. A chunk
   that starts mid-argument retrieves badly, whatever its size.
2. **Overlap.** 10–20%. Without it, the one sentence answering the question
   sits astride a boundary and neither chunk contains it whole.
3. **Keep the context in the chunk.** A chunk reading "It must be filed within
   30 days" is useless — *what* must be? Prefix each chunk with its document
   title and heading path before embedding:

```python
text = f"{doc_title} > {section_heading}\n\n{chunk}"
```

This one change, on its own, usually improves retrieval more than swapping the
embedding model.

4. **Keep metadata.** Source, page, section, date, permissions. You need it for
   citations, for filtering, and for not showing someone a document they are
   not allowed to see.

## Storing

```python
# pgvector — Postgres you already run, which is the right default
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunks (
  id        bigserial PRIMARY KEY,
  document  text NOT NULL,
  heading   text,
  content   text NOT NULL,
  metadata  jsonb NOT NULL DEFAULT '{}',
  embedding vector(768)
);

CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);
```

```sql
-- retrieval is one query
SELECT content, metadata, 1 - (embedding <=> $1) AS score
FROM chunks
WHERE metadata->>'tenant' = $2
ORDER BY embedding <=> $1
LIMIT 8;
```

`<=>` is cosine distance; the HNSW index makes it fast at scale.

| Store | When |
| --- | --- |
| **pgvector** | You already have Postgres. Filters, joins and transactions come free. Start here. |
| **Chroma** | Local prototyping, one file, no server |
| **Qdrant** | Self-hosted, strong filtering, good at scale |
| **Pinecone / managed** | You do not want to run anything |

The store is rarely the interesting decision. Chunking and reranking are.

## Hybrid search

Embeddings are weak at exactly what keyword search is strong at: product
codes, names, error numbers, rare acronyms. Searching for `ERR_4412` finds
nothing useful by meaning, because a code has no meaning.

So run both and combine:

```python
def reciprocal_rank_fusion(rankings, k=60):
    """Merge several ranked lists. Rank position only — scores from
    different systems are not comparable."""
    scores = {}
    for ranking in rankings:
        for position, doc_id in enumerate(ranking):
            scores[doc_id] = scores.get(doc_id, 0) + 1 / (k + position + 1)
    return sorted(scores, key=scores.get, reverse=True)

results = reciprocal_rank_fusion([dense_results, keyword_results])
```

In Postgres the keyword half is `tsvector` and `ts_rank`, so hybrid search
needs no second system. Hybrid beats dense-only on nearly every real corpus.

## Reranking

Retrieve broadly, then judge precisely.

The embedding search is fast because it compares pre-computed vectors, which
means it never looks at the query and the passage *together*. A cross-encoder
does exactly that, and is far more accurate — and far too slow to run over
your whole corpus.

So: retrieve 50 with embeddings, rerank those 50 properly, keep 5.

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
scored = reranker.predict([(query, c["content"]) for c in candidates])
top = [c for _, c in sorted(zip(scored, candidates), reverse=True)][:5]
```

Adding a reranker is usually the single largest quality jump available, and it
is a dozen lines. Do it before you try anything clever.

## The prompt

```python
prompt = f"""Answer the question using only the sources below.

Cite the source number in square brackets after each claim, like [2].
If the sources do not contain the answer, say "I don't have that in the
documents I can see." Do not use anything you know outside these sources.

Sources:
{chr(10).join(f"[{i}] {c['document']} > {c['heading']}\\n{c['content']}"
              for i, c in enumerate(top, 1))}

Question: {question}
"""
```

Three things doing real work: *only* the sources, cite them, and an explicit
escape hatch. Without the escape hatch the model will invent an answer rather
than admit the retrieval failed — and a confident wrong answer is worse than
no answer, because nobody checks it.

Citations are not decoration. They are how a reader verifies, and how you
debug: a wrong answer with its sources shown tells you instantly whether
retrieval or generation failed.

## Evaluating

"It seems good" is not an evaluation. Build a set of 30–50 real questions with
known answers, and measure both halves separately:

**Retrieval** — did the right chunk come back at all?

```python
def recall_at_k(results, gold_ids, k=5):
    return len(set(r["id"] for r in results[:k]) & set(gold_ids)) / len(gold_ids)
```

**Generation** — given the right chunks, was the answer right and grounded?

Score faithfulness (is every claim supported by a source?) and relevance (does
it answer the question?). RAGAS packages these; an LLM-as-judge prompt you
write yourself works nearly as well and you will understand it.

Measure retrieval first. If recall@5 is 0.6, no amount of prompt work will fix
it, and you will waste days finding that out the slow way.

## The order to fix things

When a RAG system is wrong, work down this list. It is roughly ordered by
payoff per hour:

1. Is the right chunk being retrieved at all? (measure recall)
2. Add heading context to chunks before embedding
3. Add hybrid search
4. Add a reranker
5. Re-examine chunk size and overlap
6. Only now: change the embedding model
7. Only now: change the generation model

Almost everyone tries 7 first. It almost never helps.

---

**Practice.** Project 3 is a small RAG pipeline over a document set you choose,
with a measured recall number — not a vibe.
