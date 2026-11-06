# Knowledge base

The admin panel's **Knowledge base** (sidebar → Knowledge base) — the whole
of the old `NOTES` repository, kept here so that repository can go.
Admin only, and separate from the Academy's notes: no student route reads it.

| Folder        | What it is                                                                |
| ------------- | ------------------------------------------------------------------------- |
| `source/`     | The archive, file for file: every notebook, image, PDF, dataset and code project. **This is the source of truth.** |
| `notes/`      | Generated. One markdown note per notebook, text file, code project or folder of files. |
| `media/`      | Generated. Every image (plot outputs, pasted attachments, image files) and saved HTML report, named by content hash. |
| `index.json`  | Generated. Subjects → sections (the folders) → notes, for the rail.       |

## Adding or changing notes

1. Put the `.ipynb` (or `.txt`, `.md`, a folder, a PDF…) somewhere in `source/`.
   A new top-level folder also needs an entry in `SUBJECTS` at the top of
   `scripts/build-knowledge.py` (the script stops and says so if one is missing).
2. Run `npm run build:knowledge`.
3. Commit `source/` and the regenerated `notes/`, `media/` and `index.json` together.

Never edit `notes/`, `media/` or `index.json` by hand — the next build
replaces them.

## What was carried over (Nov 2026)

- All 154 files of `NOTES`, except 11 `.ipynb_checkpoints` copies that were
  byte-for-byte identical to their notebook. Checkpoints that differ are kept
  and shown under "Earlier versions (checkpoints)".
- Three credentials hard-coded in notebooks were replaced with `REDACTED_…`
  placeholders (a Google API key in `6_LLM_Distillation.ipynb`, a Hugging Face
  token in `3.security_llm.ipynb` and `4.rag+rlfh+finetune.ipynb`, and a Neo4j
  password in `RAG_With_Knowledge_graph(Neo4j).ipynb`). Nothing else changed.
- Every embedded image (261 in notebooks and checkpoints) and every image file
  (23) is shown in a note. Five images the notes link to on other websites are
  still linked there rather than copied.
