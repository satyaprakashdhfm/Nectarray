# Knowledge base

The admin panel's **Knowledge base** (sidebar → Knowledge base): study notes
by subject, written up from the old `NOTES` repository so that repository
can go. Admin only, and separate from the Academy's notes: no student route
reads it.

The site shows **notes, not notebooks.** They are written the way the
academy lessons are — prose, code and its output as one card with tabs,
figures, tables, math — and every diagram and plot is kept. The notebooks
themselves are only the backup in `source/`; the site never serves them.

| Folder        | What it is                                                                |
| ------------- | ------------------------------------------------------------------------- |
| `source/`     | The backup, file for file: every notebook, image, PDF, dataset and code project. **This is the source of truth.** |
| `notes/`      | Generated. One markdown note per notebook, text file, code project or folder of files, in the academy's format. |
| `media/`      | Generated. Every image (plots, pasted diagrams, image files), named by content hash. |
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

- All 154 files of `NOTES` are in `source/`, except 11 `.ipynb_checkpoints`
  copies that were byte-for-byte identical to their notebook. The checkpoints
  that differ are kept there too, but are not turned into notes.
- Turning a notebook into notes leaves out what only a notebook needs:
  tracebacks, warnings, install logs, widget placeholders, Colab setup,
  saved HTML report pages. Long printouts are cut to their first and last
  lines and DataFrames to their first rows. Two notebooks that were empty
  (`Web/3.Web3.ipynb`, `…/2.ML CLASSIFICATION/Untitled.ipynb`) have no note.
- Three credentials hard-coded in notebooks were replaced with `REDACTED_…`
  placeholders (a Google API key in `6_LLM_Distillation.ipynb`, a Hugging Face
  token in `3.security_llm.ipynb` and `4.rag+rlfh+finetune.ipynb`, and a Neo4j
  password in `RAG_With_Knowledge_graph(Neo4j).ipynb`). Nothing else changed.
- Every image in the notebooks (181) and every image file (23) is shown in
  a note. Two images that exist only in old checkpoint versions stay in
  `source/`. Five images the notes link to on other websites are
  still linked there rather than copied.
