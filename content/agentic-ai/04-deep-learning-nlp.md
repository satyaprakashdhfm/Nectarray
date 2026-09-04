The last of the overview lessons, and the one that connects to everything
after it. Deep learning gets a page; NLP gets a page; **embeddings** get the
rest, because embeddings are the piece the agentic half of the course is built
on.

No computer vision. It is a fine subject and it is not this course.

## Neural networks, briefly

A neural network is a stack of matrix multiplications with a non-linear
function between them. That is genuinely it.

```
input → [weights × input + bias] → activation → ... → output
```

Training is: make a prediction, measure how wrong it was (the loss), work out
which direction each weight should move to reduce it (backpropagation), take a
small step (gradient descent), repeat.

| Term | What it means |
| --- | --- |
| Epoch | One pass over the training data |
| Batch | How many rows before updating the weights |
| Learning rate | How big a step to take — the setting that matters most |
| Loss | The number being minimised |
| Activation | The non-linearity; without it the whole stack collapses to one matrix |

Why "deep" wins on text and images: each layer builds features from the layer
below, so you do not have to invent the features yourself. For a table of 20
columns, gradient boosting usually beats it — don't reach for a network
because it sounds more advanced.

## Transformers, and why attention

The idea that unlocked modern NLP: instead of reading a sentence one word at a
time, look at every word's relationship with every other word, in parallel.
That is attention. Every model you will use in the rest of this course — the
LLM, the embedding model, the reranker — is a transformer.

Two shapes worth telling apart:

- **Encoder** models (BERT-style) read the whole input and produce a
  representation. Good for classification, similarity, retrieval, reranking.
- **Decoder** models (GPT-style) generate the next token, over and over. Good
  for writing, answering, reasoning, calling tools.

Retrieval uses the first kind. The agent is the second kind. You will be using
both at once.

## Tokens

Models do not see characters or words; they see tokens — subword pieces.

```
"unbelievable"  →  ["un", "believ", "able"]
```

Roughly 4 characters per token in English, fewer for Indian languages, which is
why the same paragraph costs more in Telugu than in English. Everything is
priced and limited in tokens: the context window, the bill, the latency.

```python
# Rough is fine for planning
tokens = len(text) / 4
```

## Embeddings

An embedding is a list of numbers — say 768 or 1536 of them — that represents
a piece of text's *meaning*. Two texts about the same thing land near each
other, even with no words in common.

```python
"how do I reset my password"
"I forgot my login details"
```

No shared content words. Very close embeddings. That is the whole trick, and
it is why search built on embeddings finds things keyword search misses.

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")   # small, fast, runs locally
vectors = model.encode(["how do I reset my password",
                        "I forgot my login details"])
vectors.shape          # (2, 384)
```

Closeness is measured by cosine similarity — the angle between two vectors,
from -1 to 1:

```python
import numpy as np

def cosine(a, b):
    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))

cosine(vectors[0], vectors[1])     # ~0.6 — clearly related
```

Most embedding models return unit-length vectors, in which case the dot
product *is* the cosine and you can skip the division. Check your model's card
before assuming it.

Four things that catch people out:

1. **Vectors from different models are not comparable.** Change the embedding
   model and you must re-embed everything you stored.
2. **Some models want an instruction prefix** (`"query: "` / `"passage: "`).
   Read the model card; using the wrong prefix quietly degrades results.
3. **Dimension is a trade-off**, not a quality score. 384 dimensions retrieve
   nearly as well as 1536 for most corpora, at a quarter of the storage.
4. **Long text embeds badly.** A whole 40-page document averaged into one
   vector means nothing specific. This is why chunking exists, and it is the
   first thing the next lesson deals with.

## The NLP tasks you will actually meet

| Task | Approach today |
| --- | --- |
| Classification (topic, sentiment, intent) | Prompt an LLM, or fine-tune a small encoder if volume is high |
| Named entity extraction | Prompt an LLM with a JSON schema |
| Summarisation | Prompt an LLM |
| Semantic search | Embeddings + a vector store |
| Question answering over your documents | Retrieval, then an LLM — the next lesson |
| Translation | Prompt an LLM |

Notice how many rows say "prompt an LLM". Ten years of specialised pipelines
collapsed into one interface. What is left — and what this course is actually
about — is everything *around* that call: what you put in the prompt, where it
came from, what the model is allowed to do with it, and how you know it
worked.

## Where the rest of the course goes

You now have the two pieces the agentic half needs:

- **Embeddings**, so a machine can find the right paragraph out of ten
  thousand.
- **Decoder models**, so it can use that paragraph to answer.

Put them together and you have retrieval-augmented generation. Give the model
tools and a loop, and you have an agent. Both are next.

---

**Practice.** Project 2 finishes the data-science half. Everything after this
is agents.
