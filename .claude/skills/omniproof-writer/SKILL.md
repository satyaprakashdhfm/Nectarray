---
name: omniproof-writer
description: Write an Omniproof article — a five-minute read on something LLMs and people solved together in mathematics, physics, chemistry, biotechnology, economics or computer science, with its business impact, its impact on society, and the industries it lands in. Use only when the user calls /omniproof-writer.
---

# Omniproof writer

Omniproof is NectArray's science section: "The proofline of everything. Where
curiosity meets impact." Each piece explains one development from the agentic
era, where LLMs and people together pushed a field forward, and follows it out
to the industries it changes.

The input is usually a source (a video, podcast, paper, announcement) or a
topic. Read the source in full before writing. For a YouTube podcast, look for
a published transcript first (for example lexfridman.com/?p=… pages); do not
write from the title alone.

## Fields

`mathematics`, `physics`, `chemistry`, `biotech`, `economics`,
`computer-science`. One is the article's home field. The others are where it
can land.

Mathematics, and often physics, has no power of its own: it pays off when
another field picks it up. Always say where that happens.

## Length

Five minutes at most: 1,000 to 1,100 words in total, counting the "Where this
lands" lines. Check with `wc -w`. If it runs long, cut detail, not structure.

## Structure

The markdown body, in this order:

1. **Opening** (no heading, 2 short paragraphs). A concrete image or quote,
   then what happened, who did it, and where it was reported.
2. **`## What happened`** (or a sharper heading such as "What fell"). The
   results, one bold-led paragraph each, explained for a smart reader with no
   background in the field. One analogy per result at most.
3. **`## How it was actually done`**. The human and AI split: what the models
   did, what checked them, what people still had to do.
4. **`## The business impact`**. Who makes or saves money, where, and how
   soon. Separate what changes now from what is still years off. Give a rule
   a company could act on.
5. **`## The impact on society`**. Jobs, education, access, risk. Include the
   worried view as well as the hopeful one.
6. A one or two sentence close. No heading.

Do not write a "Where this lands" section in the markdown. Put it in the
data instead (below); the article page renders it and the root graph on
/omniproof draws it as links between fields.

## Facts

- Attribute every claim to its source: "the guests said", "OpenAI reported".
  Say "claims" for results not yet independently verified.
- Never invent numbers, quotes or names. Quote only words that appear in the
  source.
- If the source says a result has no near-term practical effect, say so.

## Style

Plain, direct British-leaning English, matching the rest of nectarray.com.
Short paragraphs. No hype words (revolutionary, game-changing, unlock, delve),
no "it's not X, it's Y" constructions, no rhetorical questions as section
openers, no closing one-liner that restates the article.

## Files

1. Body: `content/omniproof/<slug>.md`. Slug is kebab-case and specific.
2. Entry: add an object to the top of `OMNI_ARTICLES` in
   `src/lib/content/omniproof.ts`:
   - `title` (under 60 characters), `description` (one or two sentences),
     `date` (YYYY-MM-DD, today), `field`, `short` (leaf label in the graph,
     about 22 characters), `source` (`label`, `href`).
   - `lands`: two to four entries, `{ field, impact }`, one per other field it
     reaches. Each `impact` is one or two sentences on what changes there.
     Never list the home field.
3. Check: `npx tsc --noEmit` and `npx eslint src/lib/content/omniproof.ts`,
   then open `/omniproof` and the article to see the new leaf and links.

Report the word count and the fields it lands in when done.
