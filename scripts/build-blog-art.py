"""
Draws the blog's covers and diagrams as SVG, into public/blog/<slug>/.

    python scripts/build-blog-art.py

Every picture is drawn here from shapes and text in the site's brand colours,
so they stay sharp at any size, weigh a few kilobytes, and can be changed by
editing a number rather than reopening a design tool. Covers are 1200x630 on
the dark ground; diagrams are 1200 wide on white, to sit inside an article.
"""

from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent / "public" / "blog"

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
    body.append(t(64, 566, "nectarray.com/blog", 18, "#ffffff", 500, extra='fill-opacity="0.45"'))
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


def art_agent_hub():
    out = []
    cx, cy = 280, 250
    tools = [("CRM", 280, 60), ("Email", 480, 190), ("Calendar", 420, 420), ("Database", 140, 420), ("Docs", 80, 190)]
    for name, x, y in tools:
        out.append(f'<line x1="{cx}" y1="{cy}" x2="{x}" y2="{y}" stroke="#ffffff" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="6 6"/>')
    for name, x, y in tools:
        out.append(glass(x - 62, y - 26, 124, 52, 26))
        out.append(t(x, y + 6, name, 17, "#ffffff", 600, "middle"))
    out.append(f'<circle cx="{cx}" cy="{cy}" r="74" fill="{LEAF}" fill-opacity="0.18" stroke="{LEAF}" stroke-width="3"/>')
    out.append(t(cx, cy + 9, "Agent", 26, "#ffffff", 700, "middle"))
    return "".join(out)


def art_three_columns():
    out = []
    cols = [("Automation", 150, BRAND), ("Chatbot", 250, AMBER), ("Agent", 360, LEAF)]
    for i, (name, h, c) in enumerate(cols):
        x = 40 + i * 170
        out.append(rect(x, 450 - h, 130, h, c, 14, extra='fill-opacity="0.22"'))
        out.append(rect(x, 450 - h, 130, 8, c, 4))
        out.append(t(x + 65, 480, name, 18, "#ffffff", 600, "middle"))
    out.append(t(260, 60, "more judgement, more cost", 17, "#ffffff", 400, "middle", extra='fill-opacity="0.6"'))
    out.append(arrow(60, 80, 470, 80, "#ffffff"))
    return "".join(out)


def art_cost_bars():
    out = [glass(20, 30, 500, 440)]
    out.append(t(50, 80, "Quote breakdown", 20, "#ffffff", 700))
    rows = [("Design", 0.45, BRAND), ("Build", 0.95, BRAND), ("Integrations", 0.8, LEAF), ("Testing", 0.4, AMBER), ("Launch", 0.25, AMBER)]
    for i, (name, f, c) in enumerate(rows):
        y = 120 + i * 64
        out.append(t(50, y + 22, name, 16, "#ffffff", 500, extra='fill-opacity="0.8"'))
        out.append(rect(190, y + 6, 290, 22, "#ffffff", 11, extra='fill-opacity="0.08"'))
        out.append(rect(190, y + 6, 290 * f, 22, c, 11))
    out.append(t(50, 450, "₹", 30, AMBER, 700))
    return "".join(out)


def art_checklist():
    out = [glass(30, 20, 330, 450)]
    for i in range(6):
        y = 60 + i * 66
        done = i != 4
        c = LEAF if done else "#ffffff"
        out.append(rect(60, y, 30, 30, c, 8, extra=f'fill-opacity="{0.9 if done else 0.1}"'))
        if done:
            out.append(f'<path d="M67 {y + 15} l7 7 l12 -14" fill="none" stroke="{NIGHT}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>')
        out.append(rect(106, y + 8, 200 - (i % 3) * 40, 14, "#ffffff", 7, extra='fill-opacity="0.25"'))
    for i, (name, pick) in enumerate([("Company A", False), ("Company B", True), ("Company C", False)]):
        y = 90 + i * 120
        out.append(glass(390, y, 150, 80, 14))
        if pick:
            out.append(rect(390, y, 150, 80, "none", 14, LEAF, 3))
        out.append(t(465, y + 47, name, 17, "#ffffff", 600, "middle"))
    return "".join(out)


def art_crossing_lines():
    out = [glass(10, 30, 520, 430)]
    out.append(f'<line x1="60" y1="400" x2="500" y2="400" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2"/>')
    out.append(f'<line x1="60" y1="400" x2="60" y2="70" stroke="#ffffff" stroke-opacity="0.3" stroke-width="2"/>')
    out.append(f'<polyline points="60,390 200,300 340,200 490,90" fill="none" stroke="{AMBER}" stroke-width="5" stroke-linecap="round"/>')
    out.append(f'<polyline points="60,230 200,205 340,180 490,155" fill="none" stroke="{LEAF}" stroke-width="5" stroke-linecap="round"/>')
    out.append(f'<circle cx="375" cy="174" r="9" fill="#ffffff"/>')
    out.append(t(450, 80, "SaaS", 18, AMBER, 700, "end"))
    out.append(t(490, 190, "Custom", 18, LEAF, 700, "end"))
    for i, yr in enumerate(["Year 1", "Year 2", "Year 3"]):
        out.append(t(130 + i * 145, 430, yr, 15, "#ffffff", 500, "middle", extra='fill-opacity="0.6"'))
    return "".join(out)


def art_magnifier():
    out = [glass(40, 20, 300, 440, 16)]
    for i in range(9):
        out.append(rect(70, 60 + i * 42, 240 - (i % 4) * 30, 12, "#ffffff", 6, extra='fill-opacity="0.2"'))
    out.append(f'<circle cx="360" cy="300" r="120" fill="{NIGHT}" fill-opacity="0.85" stroke="{AMBER}" stroke-width="10"/>')
    out.append(f'<line x1="445" y1="385" x2="520" y2="460" stroke="{AMBER}" stroke-width="22" stroke-linecap="round"/>')
    out.append(t(360, 270, "* Terms apply:", 18, AMBER, 700, "middle"))
    out.append(t(360, 302, "attendance 85%", 16, "#ffffff", 500, "middle"))
    out.append(t(360, 330, "salary floor?", 16, "#ffffff", 500, "middle"))
    out.append(t(360, 358, "refund when?", 16, "#ffffff", 500, "middle"))
    return "".join(out)


def art_fork():
    out = []
    out.append(glass(170, 20, 200, 64, 32))
    out.append(t(270, 60, "Python + SQL", 19, "#ffffff", 700, "middle"))
    out.append(f'<path d="M270 90 C270 180 120 180 120 260" fill="none" stroke="{BRAND}" stroke-width="5"/>')
    out.append(f'<path d="M270 90 C270 180 420 180 420 260" fill="none" stroke="{LEAF}" stroke-width="5"/>')
    out.append(glass(30, 270, 180, 170))
    for i, h in enumerate([50, 90, 70, 120]):
        out.append(rect(55 + i * 36, 420 - h, 24, h, BRAND, 4))
    out.append(t(120, 470, "Analyst", 19, "#ffffff", 700, "middle"))
    out.append(glass(330, 270, 180, 170))
    nodes = [(370, 310), (370, 400), (420, 330), (420, 380), (470, 355)]
    for a in nodes[:2]:
        for b in nodes[2:4]:
            out.append(f'<line x1="{a[0]}" y1="{a[1]}" x2="{b[0]}" y2="{b[1]}" stroke="{LEAF}" stroke-opacity="0.6" stroke-width="2"/>')
    for b in nodes[2:4]:
        out.append(f'<line x1="{b[0]}" y1="{b[1]}" x2="470" y2="355" stroke="{LEAF}" stroke-opacity="0.6" stroke-width="2"/>')
    for x, y in nodes:
        out.append(f'<circle cx="{x}" cy="{y}" r="10" fill="{LEAF}"/>')
    out.append(t(420, 470, "Scientist", 19, "#ffffff", 700, "middle"))
    return "".join(out)


def art_weeks():
    out = []
    phases = [BRAND] * 5 + [LEAF] * 4 + [AMBER] * 2 + ["#ffffff"]
    for i, c in enumerate(phases):
        col, row = i % 4, i // 4
        x, y = 30 + col * 125, 60 + row * 125
        out.append(rect(x, y, 105, 105, c, 16, extra='fill-opacity="0.2"'))
        out.append(rect(x, y, 105, 105, "none", 16, c, 2))
        out.append(t(x + 52, y + 64, str(i + 1), 34, "#ffffff", 700, "middle"))
    out.append(t(270, 450, "Python · SQL · Project · Interviews", 17, "#ffffff", 500, "middle", extra='fill-opacity="0.7"'))
    return "".join(out)


def art_layers():
    out = []
    layers = [("Retargeting", 220, "#e86fa8"), ("One social channel", 300, AMBER), ("Search ads", 380, BRAND), ("Google profile + reviews", 460, LEAF)]
    for i, (name, w, c) in enumerate(layers):
        y = 70 + i * 96
        x = 270 - w / 2
        out.append(rect(x, y, w, 76, c, 14, extra='fill-opacity="0.22"'))
        out.append(rect(x, y, w, 76, "none", 14, c, 2))
        out.append(t(270, y + 46, name, 18, "#ffffff", 600, "middle"))
    return "".join(out)


def art_report():
    out = [glass(40, 20, 460, 450)]
    out.append(t(70, 70, "Monthly report", 22, "#ffffff", 700))
    rows = [("Leads", "42", LEAF), ("Cost per lead", "₹310", LEAF), ("Bookings", "18", BRAND), ("Videos made", "8", AMBER)]
    for i, (name, v, c) in enumerate(rows):
        y = 100 + i * 70
        out.append(rect(70, y, 400, 56, "#ffffff", 12, extra='fill-opacity="0.06"'))
        out.append(rect(70, y, 6, 56, c, 3))
        out.append(t(95, y + 35, name, 17, "#ffffff", 500, extra='fill-opacity="0.85"'))
        out.append(t(450, y + 36, v, 22, "#ffffff", 700, "end"))
    out.append(t(95, 420, "Reach, followers", 15, "#ffffff", 400, extra='fill-opacity="0.4"'))
    out.append(t(450, 420, "supporting", 15, "#ffffff", 400, "end", extra='fill-opacity="0.4"'))
    return "".join(out)


# ---------------------------------------------------------------------------
#  Diagrams
# ---------------------------------------------------------------------------


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


def d_agent():
    b = []
    cx, cy = 600, 270
    tools = [("CRM", "read and update leads", 210, 110), ("Pricing sheet", "look up plans", 990, 110), ("Database", "order history", 210, 430), ("Calendar", "check free slots", 990, 430)]
    for n, s, x, y in tools:
        b.append(f'<line x1="{cx}" y1="{cy}" x2="{x}" y2="{y}" stroke="{LINE}" stroke-width="3"/>')
        b.append(box(x - 130, y - 42, 260, 84, n, s, MIST))
    b.append(arrow(710, cy, 830, cy, BRAND_DEEP))
    b.append(box(836, cy - 42, 150, 84, "Approve?", "a person", AMBER_WASH, AMBER_DEEP, size=18))
    b.append(arrow(986, cy, 1040, cy, BRAND_DEEP))
    b.append(box(1044, cy - 42, 130, 84, "Email", "sent", MIST, size=18))
    b.append(f'<circle cx="{cx}" cy="{cy}" r="100" fill="{LEAF_WASH}" stroke="{LEAF_DEEP}" stroke-width="3"/>')
    b.append(t(cx, cy - 4, "Agent", 28, INK, 700, "middle"))
    b.append(t(cx, cy + 24, "model + goal", 15, SOFT, 400, "middle"))
    b.append(box(60, cy - 42, 180, 84, "Goal", "qualify and book", BRAND_WASH, BRAND, size=18))
    b.append(arrow(240, cy, 496, cy, BRAND_DEEP))
    diagram("ai-agent-development-company", 540, "".join(b), "An agent connected to its tools")


def d_compare():
    b = []
    cols = [("Automation", BRAND), ("Chatbot", AMBER), ("Agent", LEAF)]
    rows = [("Handles messy input", [0, 2, 3]), ("Takes actions in your systems", [3, 0, 3]), ("Cost to build and run", [1, 2, 3])]
    for i, (n, c) in enumerate(cols):
        x = 470 + i * 240
        b.append(rect(x, 40, 210, 64, c, 14, extra='fill-opacity="0.18"'))
        b.append(t(x + 105, 80, n, 21, INK, 700, "middle"))
    for r, (label, vals) in enumerate(rows):
        y = 130 + r * 100
        b.append(rect(40, y, 1120, 84, MIST if r % 2 == 0 else "#ffffff", 12))
        b.append(t(70, y + 49, label, 19, INK, 600))
        for i, v in enumerate(vals):
            x = 575 + i * 240
            for d in range(3):
                filled = d < v
                col = cols[i][1]
                b.append(f'<circle cx="{x - 34 + d * 34}" cy="{y + 42}" r="12" fill="{col if filled else "#ffffff"}" stroke="{col}" stroke-width="2.5"/>')
    b.append(t(70, 460, "Automation takes actions but cannot read messy input. A chatbot reads it but acts on nothing. An agent does both, at a higher cost.", 16, SOFT))
    diagram("ai-agent-vs-chatbot-vs-automation", 490, "".join(b), "Automation, chatbot and agent compared")


def d_cost():
    b = []
    parts = [("Discovery and design", 15, BRAND), ("Build", 35, BRAND_SOLID), ("Integrations and edge cases", 30, LEAF_DEEP), ("Testing", 12, AMBER), ("Launch and handover", 8, "#e86fa8")]
    x = 60
    total = 1080
    b.append(t(60, 60, "Where the money goes in a mid-sized build (illustrative)", 20, INK, 700))
    for n, pct, c in parts:
        w = total * pct / 100
        b.append(rect(x, 100, w - 4, 90, c, 10))
        b.append(t(x + (w - 4) / 2, 154, f"{pct}%", 22, "#ffffff", 700, "middle"))
        x += w
    y = 240
    for i, (n, pct, c) in enumerate(parts):
        col, row = i % 3, i // 3
        xx, yy = 60 + col * 370, y + row * 50
        b.append(rect(xx, yy - 18, 22, 22, c, 5))
        b.append(t(xx + 34, yy, n, 18, INK, 500))
    diagram("custom-software-development-cost-india", 340, "".join(b), "Breakdown of a software quote")


def d_shortlist():
    b = []
    groups = ["Their work", "How they work", "Ownership and support", "Money"]
    scores = [[2, 3, 1], [1, 3, 2], [1, 3, 3], [3, 2, 1]]
    heads = ["Company A", "Company B", "Company C"]
    for i, h in enumerate(heads):
        x = 470 + i * 240
        pick = i == 1
        b.append(rect(x, 40, 210, 64, LEAF_WASH if pick else MIST, 14, LEAF_DEEP if pick else LINE, 2))
        b.append(t(x + 105, 80, h, 20, INK, 700, "middle"))
    for r, g in enumerate(groups):
        y = 125 + r * 88
        b.append(rect(40, y, 1120, 72, MIST if r % 2 == 0 else "#ffffff", 12))
        b.append(t(70, y + 44, f"{g}", 19, INK, 600))
        b.append(t(350, y + 44, f"Q{r * 3 + 1} to {r * 3 + 3}", 16, FAINT, 600))
        for i, s in enumerate(scores[r]):
            x = 575 + i * 240
            for d in range(3):
                c = LEAF_DEEP
                b.append(f'<circle cx="{x - 30 + d * 30}" cy="{y + 36}" r="10" fill="{c if d < s else "#ffffff"}" stroke="{c}" stroke-width="2.5"/>')
    b.append(rect(40, 485, 1120, 64, "#ffffff", 12, LINE, 2))
    b.append(t(70, 524, "Total", 19, INK, 700))
    for i, total in enumerate([7, 11, 7]):
        b.append(t(575 + i * 240, 525, f"{total} / 12", 20, LEAF_DEEP if i == 1 else INK, 700, "middle"))
    diagram("choose-custom-software-development-company", 580, "".join(b), "Scoring three companies on the twelve questions")


def d_crossing():
    b = []
    x0, y0, w, h = 110, 440, 1000, 360
    top = 16.0  # lakh
    def px(m):
        return x0 + w * m / 36
    def py(v):
        return y0 - h * v / top
    for v in range(0, 17, 4):
        b.append(f'<line x1="{x0}" y1="{py(v)}" x2="{x0 + w}" y2="{py(v)}" stroke="{LINE}" stroke-width="1.5"/>')
        b.append(t(x0 - 14, py(v) + 6, f"₹{v}L", 15, FAINT, 500, "end"))
    for m in (0, 12, 24, 36):
        b.append(t(px(m), y0 + 30, "Start" if m == 0 else f"Month {m}", 15, FAINT, 500, "middle"))
    saas = " ".join(f"{px(m)},{py(0.435 * m)}" for m in range(0, 37))
    custom = " ".join(f"{px(m)},{py(8 + 0.15 * m)}" for m in range(0, 37))
    b.append(f'<polyline points="{saas}" fill="none" stroke="{AMBER_DEEP}" stroke-width="4"/>')
    b.append(f'<polyline points="{custom}" fill="none" stroke="{LEAF_DEEP}" stroke-width="4"/>')
    m = 800000 / 28500
    b.append(f'<circle cx="{px(m)}" cy="{py(0.435 * m)}" r="8" fill="{INK}"/>')
    b.append(t(px(m) + 14, py(0.435 * m) + 30, "lines cross around month 28", 15, INK, 600))
    b.append(t(px(36) - 6, py(0.435 * 36) - 12, "SaaS: ₹43,500 a month", 16, AMBER_DEEP, 700, "end"))
    b.append(t(px(1), py(8) + 30, "Custom: ₹8L build + ₹15,000 a month", 16, LEAF_DEEP, 700))
    b.append(t(60, 40, "Cumulative cost, 25 users (the worked example)", 20, INK, 700))
    diagram("custom-software-vs-off-the-shelf", 500, "".join(b), "SaaS and custom cost lines over three years")


def d_guarantee():
    b = []
    b.append(rect(60, 40, 340, 440, MIST, 14, LINE, 2))
    b.append(t(90, 90, "Placement guarantee", 22, INK, 700))
    for i in range(8):
        b.append(rect(90, 120 + i * 40, 280 - (i % 3) * 50, 12, LINE, 6))
    b.append(t(90, 455, "* terms and conditions apply", 14, FAINT, 500))
    b.append(f'<ellipse cx="190" cy="450" rx="118" ry="22" fill="none" stroke="{AMBER_DEEP}" stroke-width="3"/>')
    b.append(arrow(310, 440, 470, 300, AMBER_DEEP))
    clauses = [("Attendance rule", "what share of classes, and is it realistic?"), ("Assignment and test scores", "the thresholds you must hit"), ("Salary floor and role", "what counts as a placement"), ("Time limit", "how long after the course it lasts"), ("Refund terms", "how much, how soon, on what proof")]
    for i, (n, s) in enumerate(clauses):
        y = 50 + i * 88
        b.append(rect(480, y, 660, 72, AMBER_WASH if i % 2 == 0 else "#ffffff", 12, AMBER, 2))
        b.append(t(510, y + 32, f"{i + 1}. {n}", 19, INK, 700))
        b.append(t(510, y + 56, s, 15, SOFT))
    diagram("data-science-course-with-placement", 510, "".join(b), "The clauses of a placement guarantee")


def d_fork():
    b = []
    b.append(box(430, 30, 340, 90, "Shared foundation", "Python · SQL · statistics", BRAND_WASH, BRAND))
    b.append(f'<path d="M600 122 C600 200 300 170 300 240" fill="none" stroke="{BRAND_DEEP}" stroke-width="4" marker-end="url(#arrow-147fae)"/>')
    b.append(f'<path d="M600 122 C600 200 900 170 900 240" fill="none" stroke="{LEAF_DEEP}" stroke-width="4" marker-end="url(#arrow-4c9c2e)"/>')
    left = ["Deeper SQL", "Excel, Power BI or Tableau", "Business case questions", "Dashboards and reports"]
    right = ["Machine learning", "Experiments and testing", "LLM features and agents", "Models in production"]
    for i, s in enumerate(left):
        b.append(rect(160, 250 + i * 56, 280, 44, MIST, 10, LINE, 2))
        b.append(t(300, 278 + i * 56, s, 16, INK, 500, "middle"))
    for i, s in enumerate(right):
        b.append(rect(760, 250 + i * 56, 280, 44, MIST, 10, LINE, 2))
        b.append(t(900, 278 + i * 56, s, 16, INK, 500, "middle"))
    b.append(box(160, 490, 280, 70, "Data analyst", None, BRAND_WASH, BRAND_DEEP))
    b.append(box(760, 490, 280, 70, "Data scientist", None, LEAF_WASH, LEAF_DEEP))
    diagram("data-analytics-vs-data-science-course", 590, "".join(b), "Analyst and scientist paths from a shared start")


def d_weeks():
    b = []
    phases = [(1, 5, "Python", BRAND, BRAND_WASH, ["Basics", "Loops", "Functions", "Errors", "pandas"]), (6, 9, "SQL", LEAF_DEEP, LEAF_WASH, ["One table", "Joins", "CTEs", "Windows"]), (10, 11, "Project", AMBER_DEEP, AMBER_WASH, ["Build", "Write up"]), (12, 12, "Interviews", INK, MIST, ["Mocks"])]
    cw = 88
    x0 = 72
    for start, end, name, c, wash, topics in phases:
        x = x0 + (start - 1) * cw
        w = (end - start + 1) * cw - 8
        b.append(rect(x, 40, w, 50, c, 12))
        b.append(t(x + w / 2, 71, name, 18 if w > 100 else 13, "#ffffff", 700, "middle"))
        for k, topic in enumerate(topics):
            wx = x0 + (start - 1 + k) * cw
            b.append(rect(wx, 110, cw - 8, 150, wash, 12, c, 2))
            b.append(t(wx + (cw - 8) / 2, 150, f"W{start + k}", 20, c, 700, "middle"))
            b.append(t(wx + (cw - 8) / 2, 215, topic, 14, INK, 500, "middle"))
    b.append(t(72, 310, "Six to eight hours a week. Each block ends with something small you built.", 17, SOFT))
    diagram("python-sql-roadmap-first-data-job", 340, "".join(b), "Twelve-week Python and SQL roadmap")


def d_layers():
    b = []
    layers = [("4. Meta ads and retargeting", "once the layers below are working", 560, "#e86fa8", "#fcebf3"), ("3. One social channel, done properly", "three good posts a week", 720, AMBER_DEEP, AMBER_WASH), ("2. Search ads", "people ready to buy, right now", 880, BRAND_DEEP, BRAND_WASH), ("1. Google Business Profile and reviews", "be findable and trusted first", 1040, LEAF_DEEP, LEAF_WASH)]
    for i, (n, s, w, c, wash) in enumerate(layers):
        y = 40 + i * 100
        x = 600 - w / 2
        b.append(rect(x, y, w, 84, wash, 14, c, 2.5))
        b.append(t(600, y + 38, n, 20, INK, 700, "middle"))
        b.append(t(600, y + 64, s, 16, SOFT, 400, "middle"))
    b.append(arrow(1150, 430, 1150, 60, SOFT))
    b.append(t(1135, 250, "build upwards", 15, FAINT, 600, "middle", extra='transform="rotate(-90 1135 250)"'))
    diagram("digital-marketing-for-small-business", 460, "".join(b), "Four layers of small-business marketing")


def d_report():
    b = []
    b.append(rect(160, 30, 880, 470, MIST, 16, LINE, 2))
    b.append(t(200, 82, "Monthly report", 24, INK, 700))
    b.append(t(1000, 82, "example", 15, FAINT, 600, "end"))
    big = [("Enquiries", "42", LEAF_DEEP), ("Cost per enquiry", "₹310", LEAF_DEEP), ("Bookings", "18", BRAND_DEEP)]
    for i, (n, v, c) in enumerate(big):
        x = 200 + i * 275
        b.append(rect(x, 110, 250, 130, "#ffffff", 14, LINE, 2))
        b.append(rect(x, 110, 250, 8, c, 4))
        b.append(t(x + 24, 160, n, 17, SOFT, 600))
        b.append(t(x + 24, 214, v, 40, INK, 700))
    b.append(rect(200, 262, 800, 100, "#ffffff", 14, LINE, 2))
    b.append(t(224, 300, "What we change next month", 17, INK, 700))
    b.append(t(224, 334, "More budget to the reel that drove 60% of enquiries; pause the carousel ads.", 16, SOFT))
    small = [("Videos made", "8"), ("Reach", "38,200"), ("New followers", "310")]
    for i, (n, v) in enumerate(small):
        x = 200 + i * 275
        b.append(t(x, 410, n, 15, FAINT, 600))
        b.append(t(x, 442, v, 20, SOFT, 600))
    b.append(t(200, 480, "Supporting numbers, shown smaller on purpose.", 14, FAINT))
    diagram("social-media-marketing-agency-small-business", 530, "".join(b), "A useful monthly social media report")


def write(slug, name, content):
    folder = ROOT / slug
    folder.mkdir(parents=True, exist_ok=True)
    (folder / name).write_text(content, encoding="utf-8", newline="\n")


COVERS = [
    ("jev-langchain-decision-model", "ai", ["Jev in LangChain", "Fast, typed decisions", "for your agents"], art_jev, "Messages entering Jev and leaving as typed answers with probabilities"),
    ("ai-agent-development-company", "ai", ["Hiring an AI agent", "development company"], art_agent_hub, "An agent connected to CRM, email, calendar, database and documents"),
    ("ai-agent-vs-chatbot-vs-automation", "ai", ["Agent, chatbot", "or automation?"], art_three_columns, "Three columns labelled automation, chatbot and agent"),
    ("custom-software-development-cost-india", "software", ["What custom software", "costs in India", "in 2026"], art_cost_bars, "A quote broken into bars"),
    ("choose-custom-software-development-company", "software", ["Choosing a software", "company: 12 questions"], art_checklist, "A checklist beside a shortlist of three companies"),
    ("custom-software-vs-off-the-shelf", "software", ["Custom or", "off the shelf?"], art_crossing_lines, "Two cost lines crossing over three years"),
    ("data-science-course-with-placement", "academy", ["Placement guarantees:", "read the fine print"], art_magnifier, "A magnifying glass over the terms of a placement guarantee"),
    ("data-analytics-vs-data-science-course", "academy", ["Data analytics or", "data science first?"], art_fork, "A path splitting towards an analyst and a scientist"),
    ("python-sql-roadmap-first-data-job", "academy", ["12 weeks of Python", "and SQL to your", "first data job"], art_weeks, "Twelve numbered week blocks"),
    ("digital-marketing-for-small-business", "marketing", ["Where a small", "marketing budget", "should go first"], art_layers, "Four stacked layers of marketing spend"),
    ("social-media-marketing-agency-small-business", "marketing", ["Hiring a social", "media agency"], art_report, "A monthly marketing report card"),
]

if __name__ == "__main__":
    for slug, service, lines, art, alt in COVERS:
        cover(slug, service, lines, art(), alt)
    for draw in (d_jev, d_agent, d_compare, d_cost, d_shortlist, d_crossing, d_guarantee, d_fork, d_weeks, d_layers, d_report):
        draw()
    print(f"wrote {len(list(ROOT.rglob('*.svg')))} SVGs to {ROOT}")
