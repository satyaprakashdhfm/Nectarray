# Brand fonts

The site is designed for **Anthropic Sans** and **Anthropic Serif**. Those are
licensed typefaces and are deliberately not committed to this repository.

Until the real files are added, the type stack falls through to two close
open-source stand-ins loaded from Google Fonts in `src/app/layout.tsx`:

| Role  | Intended face   | Current stand-in  |
| ----- | --------------- | ----------------- |
| Sans  | Anthropic Sans  | Schibsted Grotesk |
| Serif | Anthropic Serif | Source Serif 4    |

## Switching to the real fonts

1. Drop the `woff2` files into this folder, named exactly:

   ```
   AnthropicSans-Regular.woff2
   AnthropicSans-Medium.woff2
   AnthropicSans-Bold.woff2
   AnthropicSerif-Regular.woff2
   AnthropicSerif-Italic.woff2
   ```

2. Uncomment the `@font-face` block at the top of `src/app/globals.css`.

That is the whole change. `"Anthropic Sans"` and `"Anthropic Serif"` already
sit first in `--font-sans` / `--font-serif`, so every heading and paragraph
picks them up automatically and the stand-ins become the fallback.

3. Optional: once the real files are in, you can delete the two
   `next/font/google` imports in `src/app/layout.tsx` to drop the extra
   network request.

> Make sure your licence covers web embedding for the domain you deploy to
> before shipping the files — they are served publicly from `/fonts`.
