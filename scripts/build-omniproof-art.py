"""
Draws the Omniproof covers and diagrams as SVG, into public/omniproof/<slug>/.

    python scripts/build-omniproof-art.py

Every picture is drawn here from shapes and text in the site's brand colours,
so they stay sharp at any size, weigh a few kilobytes, and can be changed by
editing a number rather than reopening a design tool. Covers are 1200x630 on
the dark ground; diagrams are 1200 wide on white, to sit inside an article.
"""

from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent / "public" / "omniproof"

INK = "#0e1b26"
SOFT = "#4a5a67"
FAINT = "#8795a1"
LINE = "#dfe6ec"
MIST = "#f4f7f9"
BRAND = "#1fa5de"
BRAND_DEEP = "#147fae"
BRAND_SOLID = "#10688f"
BRAND_WASH = "#e9f6fd"
LEAF = "#7ed957"
LEAF_DEEP = "#4c9c2e"
LEAF_WASH = "#eefae7"
AMBER = "#f5a44a"
AMBER_DEEP = "#b86b12"
AMBER_WASH = "#fdf3e6"
NIGHT = "#0b1720"
FONT = "'Segoe UI', Inter, 'Helvetica Neue', Arial, sans-serif"
MONO = "'Cascadia Code', Consolas, 'SFMono-Regular', Menlo, monospace"


def t(x, y, text, size=20, fill=INK, weight=400, anchor="start", family=FONT, extra=""):
    return (
        f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" '
        f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" {extra}>'
        f"{escape(text)}</text>"
    )


def rect(x, y, w, h, fill, rx=12, stroke=None, sw=2, extra=""):
    s = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{s} {extra}/>'


def arrow(x1, y1, x2, y2, color=SOFT, width=2.5, dash=False):
    d = ' stroke-dasharray="7 6"' if dash else ""
    return (
        f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" '
        f'stroke-width="{width}" marker-end="url(#arrow-{color[1:]})"{d}/>'
    )


def markers(*colors):
    return "".join(
        f'<marker id="arrow-{c[1:]}" viewBox="0 0 10 10" refX="9" refY="5" '
        f'markerWidth="7" markerHeight="7" orient="auto-start-reverse">'
        f'<path d="M0 0 L10 5 L0 10 z" fill="{c}"/></marker>'
        for c in colors
    )


def svg(w, h, body, title, defs=""):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" role="img" aria-label="{escape(title)}">'
        f"<title>{escape(title)}</title><defs>{defs}</defs>{body}</svg>\n"
    )


# ---------------------------------------------------------------------------
#  Covers
# ---------------------------------------------------------------------------

TAGS = {
    "ai": ("Agentic AI", LEAF),
    "software": ("Software", BRAND),
    "academy": ("Academy", AMBER),
    "marketing": ("Marketing", "#e86fa8"),
}


def cover(slug, service, lines, art, alt):
    label, accent = TAGS[service]
    defs = (
        '<radialGradient id="g1" cx="0.15" cy="0.1" r="0.7">'
        f'<stop offset="0" stop-color="{BRAND}" stop-opacity="0.35"/>'
        f'<stop offset="1" stop-color="{BRAND}" stop-opacity="0"/></radialGradient>'
        '<radialGradient id="g2" cx="0.9" cy="0.95" r="0.6">'
        f'<stop offset="0" stop-color="{accent}" stop-opacity="0.28"/>'
        f'<stop offset="1" stop-color="{accent}" stop-opacity="0"/></radialGradient>'
        '<pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">'
        '<path d="M46 0H0V46" fill="none" stroke="#ffffff" stroke-opacity="0.05"/></pattern>'
        + markers("#ffffff", LEAF, BRAND, AMBER)
    )
    chip_w = 26 + len(label) * 11
    body = [
        rect(0, 0, 1200, 630, NIGHT, rx=0),
        rect(0, 0, 1200, 630, "url(#grid)", rx=0),
        rect(0, 0, 1200, 630, "url(#g1)", rx=0),
        rect(0, 0, 1200, 630, "url(#g2)", rx=0),
        rect(64, 72, chip_w, 38, accent, rx=19, extra='fill-opacity="0.16"'),
        t(64 + chip_w / 2, 97, label.upper(), 15, accent, 700, "middle", extra='letter-spacing="1.5"'),
    ]
    y = 190
    for line in lines:
        body.append(t(64, y, line, 52, "#ffffff", 700))
        y += 64
    body.append(t(64, 566, "nectarray.com/omniproof", 18, "#ffffff", 500, extra='fill-opacity="0.45"'))
    body.append(f'<g transform="translate(640 60)">{art}</g>')
    write(slug, "cover.svg", svg(1200, 630, "".join(body), alt, defs))


def glass(x, y, w, h, rx=18):
    return rect(x, y, w, h, "#ffffff", rx, "#ffffff", 1.5, 'fill-opacity="0.06" stroke-opacity="0.18"')


def art_jev():
    out = []
    for i, (w, o) in enumerate([(150, 0.9), (190, 0.7), (130, 0.55), (170, 0.4)]):
        out.append(rect(10, 70 + i * 62, w, 38, "#ffffff", 10, extra=f'fill-opacity="{o * 0.25}"'))
    out.append(arrow(215, 190, 262, 190, "#ffffff"))
    out.append(
        '<polygon points="330,120 390,155 390,225 330,260 270,225 270,155" '
        f'fill="{LEAF}" fill-opacity="0.2" stroke="{LEAF}" stroke-width="3"/>'
    )
    out.append(t(330, 198, "Jev", 30, "#ffffff", 700, "middle"))
    rows = [("urgent", 0.99, LEAF), ("billing", 0.12, BRAND), ("angry", 0.87, AMBER)]
    for i, (name, p, c) in enumerate(rows):
        yy = 80 + i * 110
        out.append(arrow(392, 190, 420, yy + 30, "#ffffff"))
        out.append(glass(425, yy, 130, 62, 14))
        out.append(t(440, yy + 26, name, 16, "#ffffff", 600))
        out.append(rect(440, yy + 38, 100, 8, "#ffffff", 4, extra='fill-opacity="0.15"'))
        out.append(rect(440, yy + 38, 100 * p, 8, c, 4))
    out.append(t(300, 440, "typed answers, with probabilities", 16, "#ffffff", 400, "middle", extra='fill-opacity="0.6"'))
    return "".join(out)


def box(x, y, w, h, title, sub=None, fill=MIST, stroke=LINE, tc=INK, size=20):
    out = [rect(x, y, w, h, fill, 14, stroke, 2)]
    if sub:
        out.append(t(x + w / 2, y + h / 2 - 4, title, size, tc, 700, "middle"))
        out.append(t(x + w / 2, y + h / 2 + 22, sub, 15, SOFT, 400, "middle"))
    else:
        out.append(t(x + w / 2, y + h / 2 + 7, title, size, tc, 700, "middle"))
    return "".join(out)


def diagram(slug, h, body, alt):
    defs = markers(SOFT, BRAND_DEEP, LEAF_DEEP, AMBER_DEEP)
    write(slug, "diagram.svg", svg(1200, h, rect(0, 0, 1200, h, "#ffffff", 0) + body, alt, defs))


def d_jev():
    b = []
    b.append(rect(40, 150, 250, 200, MIST, 14, LINE, 2))
    b.append(t(60, 186, "Request", 20, INK, 700))
    b.append(t(60, 222, "state:", 15, FAINT, 600, family=MONO))
    b.append(t(60, 246, "a support ticket", 16, INK))
    b.append(t(60, 284, "questions:", 15, FAINT, 600, family=MONO))
    b.append(t(60, 306, "urgent · billing · angry", 16, INK))
    b.append(arrow(292, 250, 355, 250))
    b.append('<polygon points="435,170 505,210 505,290 435,330 365,290 365,210" fill="#eefae7" stroke="#4c9c2e" stroke-width="3"/>')
    b.append(t(435, 245, "Jev", 26, INK, 700, "middle"))
    b.append(t(435, 272, "all in parallel", 14, SOFT, 400, "middle"))
    answers = [("urgent", 0.97), ("billing", 0.08), ("angry", 0.55)]
    for i, (n, p) in enumerate(answers):
        y = 140 + i * 80
        b.append(arrow(507, 250, 560, y + 30))
        b.append(rect(565, y, 210, 60, "#ffffff", 12, LINE, 2))
        b.append(t(583, y + 26, n, 16, INK, 600, family=MONO))
        b.append(t(757, y + 26, f"{p:.2f}", 16, INK, 700, "end", family=MONO))
        c = LEAF_DEEP if p >= 0.7 or p <= 0.3 else AMBER_DEEP
        b.append(rect(583, y + 38, 174, 8, MIST, 4))
        b.append(rect(583, y + 38, 174 * p, 8, c, 4))
    for y in (170, 250, 330):
        b.append(f'<line x1="777" y1="{y}" x2="795" y2="{y}" stroke="{SOFT}" stroke-width="2.5"/>')
    b.append(f'<line x1="795" y1="170" x2="795" y2="330" stroke="{SOFT}" stroke-width="2.5"/>')
    b.append(arrow(795, 250, 845, 250))
    b.append('<polygon points="930,180 1010,250 930,320 850,250" fill="#fdf3e6" stroke="#b86b12" stroke-width="3"/>')
    b.append(t(930, 245, "sure?", 18, INK, 700, "middle"))
    b.append(t(930, 268, "≥ 0.7 or ≤ 0.3", 13, SOFT, 400, "middle"))
    b.append(arrow(930, 180, 930, 110, LEAF_DEEP))
    b.append(box(820, 40, 220, 66, "Your code acts", None, LEAF_WASH, LEAF_DEEP, size=18))
    b.append(t(945, 150, "yes", 15, LEAF_DEEP, 700))
    b.append(arrow(930, 320, 930, 390, AMBER_DEEP))
    b.append(box(820, 394, 220, 66, "Ask a large LLM", None, AMBER_WASH, AMBER_DEEP, size=18))
    b.append(t(945, 365, "no", 15, AMBER_DEEP, 700))
    b.append(t(40, 470, "Most decisions take the cheap path. Only the uncertain ones pay for a frontier model.", 16, SOFT))
    diagram("jev-langchain-decision-model", 500, "".join(b), "Jev decision flow")


def write(slug, name, content):
    folder = ROOT / slug
    folder.mkdir(parents=True, exist_ok=True)
    (folder / name).write_text(content, encoding="utf-8", newline="\n")


COVERS = [
    ("jev-langchain-decision-model", "ai", ["Jev in LangChain", "Fast, typed decisions", "for your agents"], art_jev, "Messages entering Jev and leaving as typed answers with probabilities"),
]

if __name__ == "__main__":
    for slug, service, lines, art, alt in COVERS:
        cover(slug, service, lines, art(), alt)
    for draw in (d_jev,):
        draw()
    print(f"wrote {len(list(ROOT.rglob('*.svg')))} SVGs to {ROOT}")
