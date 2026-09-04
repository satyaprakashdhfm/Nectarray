/**
 * A very small syntax highlighter for the code in the notes.
 *
 * Not a parser and not trying to be. It colours the four things that make a
 * block readable at a glance — comments, strings, numbers and keywords — and
 * leaves everything else alone. That is worth roughly a kilobyte; a real
 * grammar-driven highlighter is worth several hundred, which is the wrong
 * trade for a page whose job is to load fast on a hostel wifi.
 *
 * It runs in the browser rather than on the server so that only the code
 * itself travels over the wire, not a token list three times its size.
 */

export type Token = {
  k: "plain" | "comment" | "string" | "number" | "keyword";
  t: string;
};

type Spec = {
  line: string[];
  block?: [string, string];
  quotes: string[];
  /** Backslash escapes inside strings, as opposed to SQL's doubled quote. */
  escapes: boolean;
  keywords: Set<string>;
  /** SQL is written in either case and means the same thing. */
  caseless?: boolean;
};

const words = (list: string) => new Set(list.split(/\s+/).filter(Boolean));

const PYTHON: Spec = {
  line: ["#"],
  quotes: ['"""', "'''", '"', "'"],
  escapes: true,
  keywords: words(`
    def class return yield lambda if elif else for while break continue pass
    import from as with try except finally raise assert del global nonlocal
    and or not in is None True False self async await match case
  `),
};

const SQL: Spec = {
  line: ["--", "#"],
  block: ["/*", "*/"],
  quotes: ['"', "'", "`"],
  escapes: false,
  caseless: true,
  keywords: words(`
    select from where group by having order limit offset insert into values
    update set delete truncate create alter drop rename table database schema
    view index trigger procedure function primary foreign key references
    unique not null default auto_increment constraint check cascade
    join inner left right full outer cross on using union all except intersect
    distinct as and or in like between exists is case when then else end
    asc desc with over partition row rows range recursive
    begin commit rollback savepoint transaction start
    show describe desc use explain grant revoke if
    int integer bigint smallint decimal numeric float double char varchar text
    date datetime timestamp time year boolean bool blob json enum
  `),
};

const JS: Spec = {
  line: ["//"],
  block: ["/*", "*/"],
  quotes: ['"', "'", "`"],
  escapes: true,
  keywords: words(`
    const let var function return if else for while do break continue switch
    case default class extends new this super import export from as async await
    try catch finally throw typeof instanceof delete void yield
    true false null undefined interface type enum implements readonly
  `),
};

const SHELL: Spec = {
  line: ["#"],
  quotes: ['"', "'"],
  escapes: true,
  keywords: words(`
    if then fi else elif for while do done case esac function return export
    source cd echo exit sudo set unset local read
  `),
};

const SPECS: Record<string, Spec> = {
  python: PYTHON,
  py: PYTHON,
  sql: SQL,
  mysql: SQL,
  postgres: SQL,
  postgresql: SQL,
  psql: SQL,
  sqlite: SQL,
  js: JS,
  jsx: JS,
  javascript: JS,
  ts: JS,
  tsx: JS,
  typescript: JS,
  json: JS,
  bash: SHELL,
  sh: SHELL,
  shell: SHELL,
  zsh: SHELL,
  console: SHELL,
};

/** True for a character that can appear inside an identifier. */
const isWord = (ch: string) => /[A-Za-z0-9_$]/.test(ch);

export function highlight(code: string, language: string): Token[] {
  const spec = SPECS[language.toLowerCase()];
  if (!spec) return [{ k: "plain", t: code }];

  const tokens: Token[] = [];
  let plain = "";

  const flush = () => {
    if (plain) tokens.push({ k: "plain", t: plain });
    plain = "";
  };
  const push = (k: Token["k"], t: string) => {
    flush();
    tokens.push({ k, t });
  };

  let i = 0;
  while (i < code.length) {
    const rest = code.slice(i);

    // A line comment, but only where one can start: `#` inside a shell
    // string is not a comment, and we have already consumed strings whole.
    const line = spec.line.find((prefix) => rest.startsWith(prefix));
    if (line) {
      const end = code.indexOf("\n", i);
      const stop = end === -1 ? code.length : end;
      push("comment", code.slice(i, stop));
      i = stop;
      continue;
    }

    if (spec.block && rest.startsWith(spec.block[0])) {
      const close = code.indexOf(spec.block[1], i + spec.block[0].length);
      const stop = close === -1 ? code.length : close + spec.block[1].length;
      push("comment", code.slice(i, stop));
      i = stop;
      continue;
    }

    const quote = spec.quotes.find((q) => rest.startsWith(q));
    if (quote) {
      let j = i + quote.length;
      while (j < code.length) {
        if (spec.escapes && code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code.startsWith(quote, j)) {
          j += quote.length;
          // SQL doubles the quote to escape it: '' is not the end of a string.
          if (!spec.escapes && code.startsWith(quote, j)) {
            j += quote.length;
            continue;
          }
          break;
        }
        // A single-character quote never spans a line; a triple one does.
        if (quote.length === 1 && code[j] === "\n") break;
        j += 1;
      }
      push("string", code.slice(i, Math.min(j, code.length)));
      i = j;
      continue;
    }

    if (/[0-9]/.test(code[i]) && !isWord(code[i - 1] ?? " ")) {
      let j = i;
      while (j < code.length && /[0-9a-fA-FxX._]/.test(code[j])) j += 1;
      push("number", code.slice(i, j));
      i = j;
      continue;
    }

    if (/[A-Za-z_$]/.test(code[i])) {
      let j = i;
      while (j < code.length && isWord(code[j])) j += 1;
      const word = code.slice(i, j);
      const key = spec.caseless ? word.toLowerCase() : word;
      if (spec.keywords.has(key)) push("keyword", word);
      else plain += word;
      i = j;
      continue;
    }

    plain += code[i];
    i += 1;
  }

  flush();
  return tokens;
}
