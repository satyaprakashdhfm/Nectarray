#!/usr/bin/env python3
"""
Builds the admin Knowledge base from the archive in knowledge/source/.

    python3 scripts/build-knowledge.py

knowledge/source/ is the source of truth: the old NOTES repository, copied in
whole (notebooks, code, PDFs, images, datasets). This script turns it into
what the admin panel reads:

    knowledge/index.json   subjects -> sections -> notes, for the rail
    knowledge/notes/*.md   one markdown note per notebook / text file / folder
    knowledge/media/*      every image (and embedded HTML report) pulled out
                           of the notebooks, named by content hash

The markdown is the same dialect the academy notes use (GFM, fenced code,
`result` fences for output) plus math and raw HTML, which notebooks lean on.
Links into media and the archive are written as `kb-media:<file>` and
`kb-file:<path>`; the page swaps them for the panel's real (secret) address
at render time, so nothing here depends on where the panel lives.

Nothing is dropped. Anything that cannot be shown on the page (widget state,
JavaScript outputs) is still in the original notebook, and every note links
to its original for download. Run with --check to fail if any local image a
notebook refers to could not be found.

To add notes later: drop the .ipynb (or folder) into knowledge/source/, add
a SUBJECTS entry if it is a new top-level folder, and run this again.
"""

from __future__ import annotations

import base64
import html as htmllib
import hashlib
import json
import mimetypes
import os
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "knowledge"
SRC = ROOT / "source"
NOTES = ROOT / "notes"
MEDIA = ROOT / "media"

# Top-level entries of the archive -> subject. Order here is rail order.
SUBJECTS = [
    {
        "slug": "ai",
        "title": "Artificial Intelligence",
        "short": "AI",
        "blurb": "Data preprocessing, statistics, machine learning, deep learning, computer vision, NLP and LLMs, multimodal models and agentic AI.",
        "paths": ["18CSC305J-Artificial intellegence"],
    },
    {
        "slug": "core-cs",
        "title": "Core Computer Science",
        "short": "Core CS",
        "blurb": "Operating systems, computer organisation, computer networks, DBMS, theory of computation and compiler design.",
        "paths": ["18CSE......... - ComputerScienceConcepts"],
    },
    {
        "slug": "languages",
        "title": "Languages & DSA",
        "short": "Languages",
        "blurb": "Bash, SQL, Python, Java, JavaScript, HTML/CSS, data structures and algorithms, and graph engineering.",
        "paths": ["Languages"],
    },
    {
        "slug": "web",
        "title": "Web Development",
        "short": "Web",
        "blurb": "How the web works, browsers, APIs, Java, Python and JavaScript frameworks, microservices and Web3.",
        "paths": ["Web"],
    },
    {
        "slug": "software",
        "title": "Software Development & System Design",
        "short": "System design",
        "blurb": "Software engineering practice and system design.",
        "paths": ["Software Development & SystemDesign.ipynb"],
    },
    {
        "slug": "devops",
        "title": "DevOps & Cloud",
        "short": "DevOps",
        "blurb": "Cloud, Docker and Kubernetes, tooling, and AI/ML ops.",
        "paths": ["Devops"],
    },
    {
        "slug": "big-data",
        "title": "Big Data & Streaming",
        "short": "Big data",
        "blurb": "Big data overview and processing engines.",
        "paths": ["18CSE489T - Bigdata & streaming analytics"],
    },
    {
        "slug": "aptitude",
        "title": "Aptitude",
        "short": "Aptitude",
        "blurb": "Quantitative aptitude and reasoning.",
        "paths": ["Aptitude.ipynb"],
    },
    {
        "slug": "placement",
        "title": "Placement Works",
        "short": "Placement",
        "blurb": "Placement rounds, take-home assignments and the question papers that came with them.",
        "paths": ["PLACEMENT_WORKS"],
    },
    {
        "slug": "misc",
        "title": "Miscellaneous",
        "short": "Misc",
        "blurb": "Shared images the notebooks use, the Jupyter markdown cheat sheet, and loose notes.",
        "paths": ["assets", "temparaory"],
    },
]

# Nicer titles than the file names give, by archive path.
TITLES = {
    "18CSE......... - ComputerScienceConcepts/18CSC203J-COA.ipynb": "Computer Organisation & Architecture (18CSC203J)",
    "18CSE......... - ComputerScienceConcepts/18CSC205J-OS.ipynb": "Operating Systems (18CSC205J)",
    "18CSE......... - ComputerScienceConcepts/18CSC302J-CN.ipynb": "Computer Networks (18CSC302J)",
    "18CSE......... - ComputerScienceConcepts/18CSC303J-dbms.ipynb": "DBMS (18CSC303J)",
    "18CSC305J-Artificial intellegence/models_vocabulary.ipynb": "Models vocabulary",
    "18CSC305J-Artificial intellegence/0.DATA PREPROCESSIN/NOTES_EDA.ipynb": "EDA notes",
    "18CSC305J-Artificial intellegence/0.DATA PREPROCESSIN/NOTES_STATICS.ipynb": "Statistics notes",
    "18CSC305J-Artificial intellegence/0.DATA PREPROCESSIN/python_libraries.ipynb": "Python libraries",
    "18CSC305J-Artificial intellegence/1.ML/NOTES_ML.ipynb": "Machine learning notes",
    "18CSC305J-Artificial intellegence/1.ML/1.ML REGRESSION/2.ML CLASSIFICATION/Notes_ML.ipynb": "Classification notes",
    "18CSC305J-Artificial intellegence/1.ML/1.ML REGRESSION/2.ML CLASSIFICATION/BEST--logistic regression.ipynb": "Logistic regression (best version)",
    "18CSC305J-Artificial intellegence/4.DL/DLnotes.ipynb": "Deep learning notes",
    "18CSC305J-Artificial intellegence/4.DL/EDA_DL.ipynb": "Deep learning EDA",
    "18CSC305J-Artificial intellegence/5.CV/cnn_eda.ipynb": "CNN EDA",
    "18CSC305J-Artificial intellegence/5.CV/cnn_notes.ipynb": "CNN notes",
    "18CSC305J-Artificial intellegence/5.CV/Object_detection_of_chair_without_using_pretrained_ml|dl|cnn_models.ipynb": "Chair detection without pretrained models",
    "18CSC305J-Artificial intellegence/6.NLP/NLP Notes.ipynb": "NLP notes",
    "18CSC305J-Artificial intellegence/6.NLP/NLP-NOTEBOOKS/3.security_llm.ipynb": "LLM security",
    "18CSC305J-Artificial intellegence/6.NLP/NLP-NOTEBOOKS/4.rag+rlfh+finetune.ipynb": "RAG, RLHF & fine-tuning",
    "18CSC305J-Artificial intellegence/6.NLP/NLP-NOTEBOOKS/RAG_With_Knowledge_graph(Neo4j).ipynb": "RAG with a knowledge graph (Neo4j)",
    "18CSC305J-Artificial intellegence/7.MULTIMODELS/Models_architecture.ipynb": "Model architectures",
    "18CSC305J-Artificial intellegence/agentic_AI/rag.ipynb": "RAG",
    "18CSC305J-Artificial intellegence/agentic_AI/langchain.ipynb": "LangChain",
    "18CSC305J-Artificial intellegence/agentic_AI/langgraph.ipynb": "LangGraph",
    "18CSC305J-Artificial intellegence/agentic_AI/ai_invoice_auditor.txt": "AI invoice auditor",
    "Devops/ai&ml_ops.ipynb": "AI & ML ops",
    "Devops/docker&k8s.ipynb": "Docker & Kubernetes",
    "Devops/cloud.ipynb": "Cloud",
    "Devops/tools.ipynb": "Tools",
    "Devops/Notes.ipynb": "DevOps notes",
    "Languages/0.bash_scripting.ipynb": "Bash scripting",
    "Languages/2. PYTHON.ipynb": "Python",
    "Languages/4.1 html-css.ipynb": "HTML & CSS",
    "Languages/4. javascript.ipynb": "JavaScript",
    "Languages/6.ADVANCE_DSA(Graph_engineering).ipynb": "Advanced DSA (graph engineering)",
    "Web/Web_overview.ipynb": "Web overview",
    "Web/4.api.ipynb": "APIs",
    "Web/browser.ipynb": "Browsers",
    "Web/python_frameworks/fastapi.ipynb": "FastAPI",
    "Web/python_frameworks/MicroServices.ipynb": "Microservices",
    "Web/Js_frameworks/nodejs.ipynb": "Node.js",
    "Web/Js_frameworks/reactjs.ipynb": "React",
    "18CSE489T - Bigdata & streaming analytics/Big_data_overview.ipynb": "Big data overview",
    "PLACEMENT_WORKS/factwise_answer.ipynb": "Factwise — answer",
    "PLACEMENT_WORKS/factwise_problem_django.txt": "Factwise — problem (Django)",
    "PLACEMENT_WORKS/DSA.ipynb": "DSA practice",
    "assets/jupyternotebooksyntax.txt": "Jupyter markdown & equation syntax",
    "temparaory": "Loose notes (memory & DNS troubleshooting)",
}

NOTEBOOK = ".ipynb"
TEXT_EXT = {".txt", ".md", ".py", ".json", ".sql", ".sh", ".js", ".ts", ".java", ".yaml", ".yml", ".toml", ".cfg", ".ini", ".html", ".css"}
IMAGE_EXT = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp"}
FENCE_LANG = {".py": "python", ".json": "json", ".sql": "sql", ".sh": "bash", ".js": "javascript", ".ts": "typescript", ".java": "java", ".yaml": "yaml", ".yml": "yaml", ".html": "html", ".css": "css", ".txt": "text", ".toml": "text", ".cfg": "text", ".ini": "text"}

ANSI = re.compile(r"\x1b\[[0-9;?]*[ -/]*[@-~]")
warnings: list[str] = []
missing_images: list[str] = []


# ------------------------------------------------------------------ helpers


def natural_key(name: str):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r"(\d+)", name)]


def slugify(text: str) -> str:
    text = text.lower().replace("&", " and ")
    text = re.sub(r"\.ipynb$", "", text)
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "note"


def pretty(name: str) -> str:
    """'4.rag+rlfh+finetune.ipynb' -> 'RAG + RLHF + finetune'-ish, kept honest."""
    stem = name
    while stem.lower().endswith(NOTEBOOK):
        stem = stem[: -len(NOTEBOOK)]
    stem = re.sub(r"\.(txt|md|py|pdf|docx)$", "", stem, flags=re.I)
    stem = re.sub(r"^\s*\d+(\.\d+)*\s*[._\-)]?\s*", "", stem) or stem
    stem = stem.replace("_", " ").replace("+", " + ").strip()
    stem = re.sub(r"\s+", " ", stem)
    return stem[:1].upper() + stem[1:] if stem else name


def section_label(name: str) -> str:
    """Folder name -> section heading in the rail."""
    label = pretty(name)
    known = {
        "DATA PREPROCESSIN": "Data preprocessing",
        "ML": "Machine learning",
        "ML REGRESSION": "Regression",
        "ML CLASSIFICATION": "Classification",
        "ML CLUSTRING": "Clustering",
        "DL": "Deep learning",
        "CV": "Computer vision",
        "NLP": "NLP",
        "NLP-NOTEBOOKS": "NLP notebooks",
        "MULTIMODELS": "Multimodal models",
        "Agentic AI": "Agentic AI",
        "Python frameworks": "Python frameworks",
        "Js frameworks": "JavaScript frameworks",
        "Images": "Images",
        "Kernels": "Kernels",
    }
    return known.get(label, label)


def fence(body: str, lang: str = "", meta: str = "") -> str:
    longest = max((len(m) for m in re.findall(r"`{3,}", body)), default=2)
    ticks = "`" * max(3, longest + 1)
    info = (lang + (" " + meta if meta else "")).strip()
    return f"{ticks}{info}\n{body.rstrip(chr(10))}\n{ticks}"


def joined(value) -> str:
    return "".join(value) if isinstance(value, list) else (value or "")


def store_bytes(data: bytes, ext: str) -> str:
    digest = hashlib.sha256(data).hexdigest()[:20]
    name = f"{digest}{ext}"
    target = MEDIA / name
    if not target.exists():
        target.write_bytes(data)
    return name


def store_file(path: Path) -> str:
    return store_bytes(path.read_bytes(), path.suffix.lower() or ".bin")


def kb_file(rel: str) -> str:
    return "kb-file:" + urllib.parse.quote(rel)


# Every file in the archive, by basename, for images referenced by an old
# absolute path (/workspaces/ML--DL--NOTES/...) that no longer exists.
BY_NAME: dict[str, list[Path]] = {}


def index_names():
    for p in SRC.rglob("*"):
        if p.is_file():
            BY_NAME.setdefault(p.name.lower(), []).append(p)


def resolve_local(ref: str, base_dir: Path) -> Path | None:
    ref = urllib.parse.unquote(ref.strip().strip("'\"")).split("?")[0].split("#")[0]
    if not ref:
        return None
    candidates = []
    if not ref.startswith("/"):
        candidates.append(base_dir / ref)
    # /workspaces/ML--DL--NOTES/<rest> was the old codespace path of this
    # very archive's AI folder.
    m = re.search(r"ML--DL--NOTES/(.+)$", ref)
    if m:
        candidates.append(SRC / "18CSC305J-Artificial intellegence" / m.group(1))
        candidates.append(SRC / m.group(1))
    for c in candidates:
        if c.is_file():
            return c
    hits = BY_NAME.get(Path(ref).name.lower(), [])
    return hits[0] if len(hits) >= 1 else None


remote_cache: dict[str, str | None] = {}


def fetch_remote(url: str) -> str | None:
    """Keeps a copy of an image the notes link to on the web, if it is still there."""
    if url in remote_cache:
        return remote_cache[url]
    name = None
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (knowledge-base archiver)"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            ctype = resp.headers.get("Content-Type", "").split(";")[0].strip()
            data = resp.read()
        if ctype.startswith("image/") and data:
            ext = mimetypes.guess_extension(ctype) or Path(urllib.parse.urlparse(url).path).suffix or ".img"
            if ext == ".jpe":
                ext = ".jpg"
            name = store_bytes(data, ext)
    except Exception as exc:  # noqa: BLE001 - any failure just keeps the link
        warnings.append(f"remote image not archived ({exc.__class__.__name__}): {url}")
    remote_cache[url] = name
    return name


IMG_MD = re.compile(r"(!\[[^\]]*\]\()\s*(<[^>]+>|[^)\s]+)((?:\s+\"[^\"]*\")?\s*\))")
IMG_HTML = re.compile(r"(<img\b[^>]*?\bsrc\s*=\s*)(\"[^\"]*\"|'[^']*'|[^\s>]+)", re.I | re.S)


def rewrite_images(text: str, base_dir: Path, attachments: dict, where: str) -> str:
    def target(ref: str) -> str | None:
        raw = ref.strip("<>").strip().strip("'\"")
        if raw.startswith("attachment:"):
            key = urllib.parse.unquote(raw[len("attachment:") :])
            bundle = attachments.get(key)
            if not bundle:
                missing_images.append(f"{where}: attachment {key}")
                return None
            for mime, data in bundle.items():
                if mime.startswith("image/"):
                    ext = mimetypes.guess_extension(mime) or ".png"
                    if mime == "image/svg+xml":
                        payload = joined(data).encode()
                    else:
                        payload = base64.b64decode(joined(data))
                    return "kb-media:" + store_bytes(payload, ".jpg" if ext == ".jpe" else ext)
            return None
        if raw.startswith("data:"):
            return None  # already inline; leave it
        if re.match(r"^https?://", raw) or raw.startswith("//"):
            url = "https:" + raw if raw.startswith("//") else raw
            if re.search(r"\.(png|jpe?g|gif|svg|webp)(\?|$)|d\.pr/i/|figure-html", url, re.I) and "colab-badge" not in url:
                name = fetch_remote(url)
                return "kb-media:" + name if name else None
            return None
        local = resolve_local(raw, base_dir)
        if local is None:
            missing_images.append(f"{where}: {raw}")
            return None
        return "kb-media:" + store_file(local)

    def md(m):
        new = target(m.group(2))
        return f"{m.group(1)}{new}{m.group(3)}" if new else m.group(0)

    def html(m):
        new = target(m.group(2))
        return f'{m.group(1)}"{new}"' if new else m.group(0)

    text = IMG_MD.sub(md, text)
    return IMG_HTML.sub(html, text)


FENCE_LINE = re.compile(r"^\s{0,3}(`{3,}|~{3,})")
INLINE_CODE = re.compile(r"(`+)(.+?)\1", re.S)
TEX_DISPLAY = re.compile(r"\\\[(.+?)\\\]", re.S)
TEX_INLINE = re.compile(r"\\\((.+?)\\\)", re.S)


def jupyter_markdown(text: str) -> str:
    r"""
    A markdown cell, made to read the same on one long page as it did in
    its own cell in Jupyter:

    - A fence left open at the end of a cell is closed there. Jupyter
      parses each cell alone, so it never noticed; on a page of many cells
      it would swallow everything after it.
    - MathJax's \( ... \) and \[ ... \] delimiters become $ ... $ and
      $$ ... $$, the ones the page's math renderer reads. Code is left alone.
    """
    out: list[str] = []
    prose: list[str] = []
    open_fence: str | None = None

    def flush():
        if not prose:
            return
        chunk = "\n".join(prose)
        spans: list[str] = []

        def keep(m):
            spans.append(m.group(0))
            return f"\x00{len(spans) - 1}\x00"

        chunk = INLINE_CODE.sub(keep, chunk)
        chunk = TEX_DISPLAY.sub(lambda m: f"$${m.group(1)}$$", chunk)
        chunk = TEX_INLINE.sub(lambda m: f"${m.group(1).strip()}$", chunk)
        chunk = re.sub(r"\x00(\d+)\x00", lambda m: spans[int(m.group(1))], chunk)
        out.extend(chunk.split("\n"))
        prose.clear()

    for line in text.split("\n"):
        m = FENCE_LINE.match(line)
        if open_fence is None:
            if m:
                flush()
                open_fence = m.group(1)
                out.append(line)
            else:
                prose.append(line)
        else:
            out.append(line)
            closer = line.strip()
            if m and set(closer) == {open_fence[0]} and len(closer) >= len(open_fence):
                open_fence = None
    flush()
    if open_fence is not None:
        out.append(open_fence)
    return "\n".join(out)


# ------------------------------------------------------------------ notes
#
# A notebook is turned into notes the way the academy lessons are written,
# not dumped cell by cell: prose, then a program and what it prints as one
# card (a fence followed by an ```output fence), then any figure it drew.
# What only a notebook needs — tracebacks, warnings, install logs, widget
# placeholders, `<Figure size …>` reprs, Colab plumbing — is left out of the
# page. The notebook itself stays in knowledge/source/ as the backup.

# Reprs that stand in for a figure or a widget and say nothing on a page.
NOISE = re.compile(
    r"^\s*(<Figure size|<matplotlib[.\s]|\[<matplotlib|<Axes|<AxesSubplot|<seaborn\.|"
    r"Text\(\d|<BarContainer|<IPython\.|HBox\(|VBox\(|FloatProgress\(|IntProgress\(|"
    r"<Response \[|<generator object|<function |<module |<built-in method)"
)
# Lines that only set a notebook up.
SETUP_LINE = re.compile(
    r"^\s*(%matplotlib|%load_ext|%config|%%capture|%reload_ext|%autoreload|"
    r"from google\.colab import \w+\s*$|drive\.mount\(|warnings\.filterwarnings\()"
)
INSTALL_LINE = re.compile(r"^\s*[!%](pip3?|conda|apt(-get)?|npm|uv)\s+(install|-q|update)\b")
COLAB_BADGE = re.compile(r"<a\b[^>]*>\s*<img\b[^>]*colab-badge[^>]*>\s*</a>|\[!\[Open In Colab\][^\n]*", re.I | re.S)

MAX_OUTPUT_LINES = 16
MAX_TABLE_ROWS = 10


def clean_text(text: str) -> str:
    """Program output as a terminal would have left it, trimmed if long."""
    text = ANSI.sub("", text)
    # A progress bar rewrites its line with \r; only the last state stays.
    text = "\n".join(line.split("\r")[-1] for line in text.split("\n"))
    lines = text.rstrip().split("\n")
    if len(lines) > MAX_OUTPUT_LINES:
        cut = len(lines) - 13
        lines = lines[:10] + [f"… ({cut} more lines)"] + lines[-3:]
    return "\n".join(lines).strip("\n")


class _Tables(HTMLParser):
    """Rows of the first <table> in a piece of HTML (a pandas DataFrame)."""

    def __init__(self):
        super().__init__()
        self.depth = 0
        self.done = False
        self.head: list[list[str]] = []
        self.body: list[list[str]] = []
        self.row: list[str] | None = None
        self.cell: list[str] | None = None
        self.in_head = False

    def handle_starttag(self, tag, attrs):
        if self.done:
            return
        if tag == "table":
            self.depth += 1
        elif self.depth == 1:
            if tag == "thead":
                self.in_head = True
            elif tag == "tr":
                self.row = []
            elif tag in ("td", "th"):
                self.cell = []

    def handle_endtag(self, tag):
        if self.done:
            return
        if tag == "table":
            self.depth -= 1
            if self.depth == 0:
                self.done = True
        elif self.depth == 1:
            if tag == "thead":
                self.in_head = False
            elif tag in ("td", "th") and self.cell is not None and self.row is not None:
                self.row.append(" ".join("".join(self.cell).split()))
                self.cell = None
            elif tag == "tr" and self.row is not None:
                (self.head if self.in_head else self.body).append(self.row)
                self.row = None

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)


def table_md(html: str) -> str | None:
    parser = _Tables()
    parser.feed(html)
    rows = parser.head + parser.body
    if not rows:
        return None
    header = parser.head[0] if parser.head else rows[0]
    body = parser.body if parser.head else rows[1:]
    width = max(len(r) for r in [header, *body])
    # pandas puts the index name in a second header row; fold it in.
    if len(parser.head) > 1 and parser.head[1] and parser.head[1][0] and not header[0]:
        header = [parser.head[1][0], *header[1:]]

    def line(cells):
        cells = [c.replace("|", "\\|") for c in cells] + [""] * (width - len(cells))
        return "| " + " | ".join(cells) + " |"

    out = [line(header), "|" + "---|" * width]
    shown = body[:MAX_TABLE_ROWS]
    out += [line(r) for r in shown]
    if len(body) > len(shown):
        out.append(line([f"… {len(body) - len(shown)} more rows"]))
    return "\n".join(out)


def html_text(html: str) -> str:
    html = re.sub(r"<(script|style)\b.*?</\1>", "", html, flags=re.S | re.I)
    html = re.sub(r"<br\s*/?>|</p>|</div>|</li>|</tr>", "\n", html, flags=re.I)
    return htmllib.unescape(re.sub(r"<[^>]+>", "", html))


def cell_outputs(outputs: list, where: str) -> tuple[str, list[str]]:
    """What a code cell printed, and the figures/tables it showed."""
    printed: list[str] = []
    shown: list[str] = []
    for out in outputs:
        kind = out.get("output_type")
        if kind == "stream":
            if out.get("name") == "stderr":
                continue  # warnings and progress logs
            printed.append(joined(out.get("text")))
            continue
        if kind == "error":
            continue  # a traceback is a notebook's business, not the notes'
        data = out.get("data") or {}
        image = next((m for m in ("image/png", "image/jpeg", "image/gif", "image/webp") if m in data), None)
        if image:
            ext = {"image/png": ".png", "image/jpeg": ".jpg", "image/gif": ".gif", "image/webp": ".webp"}[image]
            name = store_bytes(base64.b64decode(joined(data[image])), ext)
            shown.append(f"![Figure](kb-media:{name})")
        elif "image/svg+xml" in data:
            name = store_bytes(joined(data["image/svg+xml"]).encode(), ".svg")
            shown.append(f"![Figure](kb-media:{name})")
        elif "text/html" in data:
            html = joined(data["text/html"])
            if "srcdoc=" in html:
                continue  # a whole saved report page (pandas-profiling)
            table = table_md(html) if "<table" in html.lower() else None
            if table:
                shown.append(table)
            else:
                text = html_text(html).strip()
                if text and not NOISE.match(text):
                    printed.append(text + "\n")
        elif "text/markdown" in data:
            shown.append(joined(data["text/markdown"]))
        elif "text/latex" in data:
            latex = joined(data["text/latex"]).strip()
            shown.append(latex if latex.startswith("$") else f"$$\n{latex}\n$$")
        elif "text/plain" in data:
            text = joined(data["text/plain"])
            if text.strip() and not NOISE.match(text):
                printed.append(text.rstrip("\n") + "\n")
    return clean_text("".join(printed)), shown


def code_cell_md(src: str, outputs: list, lang: str, where: str) -> list[str]:
    lines = [l for l in src.rstrip().split("\n") if not SETUP_LINE.match(l)]
    code = "\n".join(lines).strip("\n")
    if not code.strip():
        return []
    body = [l for l in code.split("\n") if l.strip()]
    if all(INSTALL_LINE.match(l) for l in body):
        # An install cell reads as the command to run, without its log.
        return [fence("\n".join(re.sub(r"^\s*[!%]", "", l) for l in body), "bash")]
    printed, shown = cell_outputs(outputs, where)
    parts = [fence(code, lang)]
    if printed:
        # Directly after the program, so the page joins the two into one
        # card with Code and Output tabs, as in the academy notes.
        parts[0] += "\n" + fence(printed, "output")
    return parts + shown


def notebook_md(path: Path, rel: str) -> str:
    raw = path.read_text(encoding="utf-8", errors="replace")
    if not raw.strip():
        return ""
    nb = json.loads(raw)
    meta = nb.get("metadata", {})
    lang = (meta.get("language_info", {}).get("name") or meta.get("kernelspec", {}).get("language") or "python").lower()
    lang = {"java": "java", "javascript": "javascript", "typescript": "typescript"}.get(lang, "python" if "python" in lang else lang)

    parts: list[str] = []
    for i, cell in enumerate(nb.get("cells", [])):
        where = f"{rel} cell {i}"
        src = joined(cell.get("source"))
        kind = cell.get("cell_type")
        if kind == "markdown":
            text = COLAB_BADGE.sub("", src).strip()
            if text:
                parts.append(jupyter_markdown(rewrite_images(text, path.parent, cell.get("attachments") or {}, where)))
        elif kind == "code":
            parts.extend(code_cell_md(src, cell.get("outputs", []), lang, where))
        elif src.strip():  # raw cell: plain text in the notes
            parts.append(src.strip())
    return ("\n\n".join(p.strip("\n") for p in parts) + "\n") if parts else ""


def text_md(path: Path) -> str:
    text = path.read_text(encoding="utf-8", errors="replace")
    ext = path.suffix.lower()
    if ext == ".md" or (ext == ".txt" and text.lstrip().startswith("#")):
        return text
    return fence(text, FENCE_LANG.get(ext, "text"))


def docx_md(path: Path) -> str:
    with tempfile.TemporaryDirectory() as tmp:
        try:
            out = subprocess.run(
                ["pandoc", str(path), "-t", "gfm", "--wrap=none", f"--extract-media={tmp}"],
                capture_output=True, text=True, check=True,
            ).stdout
        except Exception as exc:  # noqa: BLE001
            warnings.append(f"{path.name}: docx not converted ({exc})")
            return ""
        def swap(m):
            p = Path(m.group(2))
            return f"{m.group(1)}kb-media:{store_file(p)}{m.group(3)}" if p.is_file() else m.group(0)
        out = re.sub(r"(!\[[^\]]*\]\()([^)\s]+)(\))", swap, out)
        out = re.sub(r'(<img[^>]*src=")([^"]+)(")', swap, out)
        return out


def human(size: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024 or unit == "GB":
            return f"{size:.0f} {unit}" if unit == "B" else f"{size:.1f} {unit}"
        size /= 1024
    return str(size)


def file_entry(path: Path) -> str:
    """How a loose file shows on a Files page."""
    rel = path.relative_to(SRC).as_posix()
    ext = path.suffix.lower()
    size = path.stat().st_size
    link = f"[{path.name}]({kb_file(rel)}) · {human(size)}"
    if ext in IMAGE_EXT:
        return f"### {path.name}\n\n![{path.name}](kb-media:{store_file(path)})\n\n{link}"
    if ext == ".pdf":
        return f"### {path.name}\n\n{link}\n\n<iframe src=\"{kb_file(rel)}\" title=\"{path.name}\" class=\"kb-pdf\" loading=\"lazy\"></iframe>"
    if ext == ".docx":
        body = docx_md(path)
        return f"### {path.name}\n\n{link}\n\n{body}".rstrip()
    if size == 0:
        return f"### {path.name}\n\nEmpty file in the archive (a placeholder for notes not yet written)."
    if ext in TEXT_EXT or ext == "":
        try:
            path.read_text(encoding="utf-8")
            return f"### {path.name}\n\n{link}\n\n{text_md(path)}"
        except UnicodeDecodeError:
            pass
    return f"### {path.name}\n\n{link}"


def project_md(folder: Path) -> str:
    """A code project (a folder holding .py files): every file, in tree order."""
    files = sorted((p for p in folder.rglob("*") if p.is_file()), key=lambda p: natural_key(p.relative_to(folder).as_posix()))
    tree = "\n".join(p.relative_to(folder).as_posix() for p in files)
    parts = [
        f"A code project, {len(files)} files. Every file is below, and each name downloads the original.",
        fence(tree, "text", 'title="Files"'),
    ]
    for p in files:
        rel_in = p.relative_to(folder).as_posix()
        rel = p.relative_to(SRC).as_posix()
        link = f"[{rel_in}]({kb_file(rel)}) · {human(p.stat().st_size)}"
        try:
            text = p.read_text(encoding="utf-8")
            lang = FENCE_LANG.get(p.suffix.lower(), "text")
            body = fence(text, lang, f'title="{rel_in}"') if text.strip() else "_Empty file._"
            parts.append(f"## {rel_in}\n\n{link}\n\n{body}")
        except UnicodeDecodeError:
            parts.append(f"## {rel_in}\n\n{link}\n\nBinary file (a SQLite database) — download to open it.")
    return "\n\n".join(parts) + "\n"


# ------------------------------------------------------------------ walk


def is_project(folder: Path) -> bool:
    """A folder of source code (it holds .py files and no notebooks) reads as one note."""
    files = [p for p in folder.iterdir() if p.is_file()]
    return any(p.suffix == ".py" for p in files) and not any(p.suffix == NOTEBOOK for p in files)


def build():
    if NOTES.exists():
        shutil.rmtree(NOTES)
    if MEDIA.exists():
        shutil.rmtree(MEDIA)
    NOTES.mkdir(parents=True)
    MEDIA.mkdir(parents=True)
    index_names()

    claimed = {p for s in SUBJECTS for p in s["paths"]}
    for entry in SRC.iterdir():
        if entry.name not in claimed:
            sys.exit(f"Not in any subject: {entry.name} — add it to SUBJECTS")

    subjects_out = []
    used_ids: set[str] = set()
    count = 0

    for subject in SUBJECTS:
        sections: list[dict] = []

        def add(section: str, title: str, slug_parts: list[str], body: str, source: str | None, kind: str):
            nonlocal count
            note_id = "/".join([subject["slug"], *[slugify(s) for s in slug_parts]])
            base, n = note_id, 2
            while note_id in used_ids:
                note_id = f"{base}-{n}"
                n += 1
            used_ids.add(note_id)
            file = note_id.replace("/", "__") + ".md"
            (NOTES / file).write_text(body, encoding="utf-8")
            sec = next((s for s in sections if s["title"] == section), None)
            if sec is None:
                sec = {"title": section, "notes": []}
                sections.append(sec)
            title = TITLES.get(source or "", title)
            sec["notes"].append({"id": note_id, "title": title, "file": file, "kind": kind, "source": source})
            count += 1

        def walk(folder: Path, crumbs: list[str], slug_parts: list[str]):
            section = " › ".join(crumbs) if crumbs else subject["title"]
            entries = sorted(folder.iterdir(), key=lambda p: (p.is_dir(), natural_key(p.name)))
            loose: list[Path] = []
            for p in entries:
                rel = p.relative_to(SRC).as_posix()
                if p.is_dir():
                    if p.name == ".ipynb_checkpoints":
                        continue  # Jupyter's autosaves: in the archive, not on the site
                    elif is_project(p):
                        add(section, f"{p.name} (code project)", [*slug_parts, p.name], project_md(p), rel, "project")
                    else:
                        walk(p, [*crumbs, section_label(p.name)], [*slug_parts, p.name])
                elif p.suffix.lower() == NOTEBOOK:
                    body = notebook_md(p, rel)
                    if body.strip():  # an empty notebook is not a note
                        add(section, pretty(p.name), [*slug_parts, p.name], body, rel, "note")
                elif p.suffix.lower() in {".txt", ".md"} or (p.suffix == "" and p.stat().st_size > 0 and folder == SRC):
                    add(section, pretty(p.name), [*slug_parts, p.name], text_md(p), rel, "text")
                else:
                    loose.append(p)
            if loose:
                title = "Files" if crumbs else f"Files — {subject['title']}"
                body = "\n\n".join(file_entry(p) for p in loose) + "\n"
                add(section, title, [*slug_parts, "files"], body, None, "files")

        for top in subject["paths"]:
            p = SRC / top
            if p.is_dir():
                walk(p, [], [])
            elif p.suffix.lower() == NOTEBOOK:
                body = notebook_md(p, top)
                if body.strip():
                    add(subject["title"], pretty(p.name), [p.name], body, top, "note")
            else:
                add(subject["title"], pretty(p.name) if p.suffix else "Temporary notes", [p.name], text_md(p), top, "text")

        subjects_out.append({k: subject[k] for k in ("slug", "title", "short", "blurb")} | {"sections": sections})

    (ROOT / "index.json").write_text(json.dumps({"subjects": subjects_out}, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")

    media = list(MEDIA.iterdir())
    print(f"{count} notes in {len(subjects_out)} subjects, {len(media)} media files ({human(sum(p.stat().st_size for p in media))})")
    for w in warnings:
        print("warning:", w)
    for m in missing_images:
        print("MISSING IMAGE:", m)
    if "--check" in sys.argv and missing_images:
        sys.exit(1)


if __name__ == "__main__":
    build()
