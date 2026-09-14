/**
 * What each kind of build looks like when it is finished, as a schematic in a
 * browser frame.
 *
 * Deliberately a wireframe and not a screenshot. A grid of real-looking sites
 * on a services page is read as a portfolio, and anything that reads as a
 * portfolio has to be actual client work with permission to show it — a
 * plausible-looking mock-up passed off as a build is just a lie with rounded
 * corners. A schematic makes the shape of the thing clear, which is the
 * question a buyer actually has ("what am I getting?"), and claims nothing.
 *
 * The address bar says yourbrand.com for the same reason: a placeholder
 * nobody can mistake for a real customer.
 *
 * Everything is divs. No images to load, it recolours with the theme, and at
 * this size a real screenshot would be an unreadable smudge anyway.
 */

/** A block of "text" — the wireframe's only real primitive. */
function Bar({ w = "w-full", h = "h-2", tone = "bg-ink/10" }: Bar) {
  return <span className={`block rounded-full ${w} ${h} ${tone}`} />;
}
type Bar = { w?: string; h?: string; tone?: string };

/** A panel: the wireframe's other primitive. */
function Box({ className = "", children }: Panel) {
  return (
    <div className={`border-line/70 bg-surface rounded-md border ${className}`}>
      {children}
    </div>
  );
}
type Panel = { className?: string; children?: React.ReactNode };

function Portfolio() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="bg-brand/70 h-3 w-10 rounded" />
        <div className="flex gap-1.5">
          <Bar w="w-6" h="h-1.5" />
          <Bar w="w-6" h="h-1.5" />
          <Bar w="w-6" h="h-1.5" />
        </div>
      </div>
      <Box className="flex flex-1 flex-col justify-center gap-2 p-4">
        <Bar w="w-3/5" h="h-3.5" tone="bg-ink/25" />
        <Bar w="w-2/5" h="h-3.5" tone="bg-ink/25" />
        <Bar w="w-4/5" h="h-1.5" />
        <span className="bg-brand/70 mt-1 h-4 w-16 rounded-full" />
      </Box>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((n) => (
          <Box key={n} className="space-y-1.5 p-2">
            <span className="bg-ink/8 block h-8 rounded" />
            <Bar w="w-3/4" h="h-1.5" />
          </Box>
        ))}
      </div>
    </div>
  );
}

function Commerce() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="bg-brand/70 h-3 w-8 rounded" />
        <Box className="h-4 flex-1" />
        <span className="bg-ink/15 size-4 rounded" />
      </div>
      <div className="grid flex-1 grid-cols-4 gap-2">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
          <Box key={n} className="flex flex-col gap-1 p-1.5">
            <span className="bg-ink/8 block flex-1 rounded" />
            <Bar w="w-full" h="h-1" />
            <Bar w="w-1/2" h="h-1" tone="bg-brand/60" />
          </Box>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="flex h-full gap-2">
      <div className="flex w-[18%] flex-col gap-1.5">
        <span className="bg-brand/70 h-2.5 w-full rounded" />
        {[0, 1, 2, 3].map((n) => (
          <Bar key={n} h="h-1.5" />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((n) => (
            <Box key={n} className="space-y-1 p-2">
              <Bar w="w-1/2" h="h-1" />
              <Bar w="w-3/4" h="h-2.5" tone="bg-ink/25" />
            </Box>
          ))}
        </div>
        <Box className="flex flex-1 items-end gap-1.5 p-2">
          {[40, 65, 30, 80, 55, 70, 45, 90].map((h, n) => (
            <span
              key={n}
              className="bg-brand/60 flex-1 rounded-t-sm"
              style={{ height: `${h}%` }}
            />
          ))}
        </Box>
      </div>
    </div>
  );
}

function Platform() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="bg-brand/70 h-3 w-8 rounded" />
        <Bar w="w-10" h="h-1.5" />
        <Bar w="w-10" h="h-1.5" />
        <span className="bg-ink/15 ml-auto size-4 rounded-full" />
      </div>
      <Box className="flex-1 overflow-hidden">
        <div className="border-line/70 bg-mist flex items-center gap-2 border-b px-2 py-1.5">
          <Bar w="w-1/4" h="h-1" />
          <Bar w="w-1/5" h="h-1" />
          <Bar w="w-1/6" h="h-1" />
        </div>
        {[0, 1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="border-line/50 flex items-center gap-2 border-b px-2 py-[0.3rem] last:border-0"
          >
            <span className="bg-ink/12 size-2.5 shrink-0 rounded-full" />
            <Bar w="w-1/3" h="h-1" />
            <Bar w="w-1/5" h="h-1" />
            <span
              className={`ml-auto h-2 w-6 rounded-full ${n % 2 ? "bg-brand/50" : "bg-ink/10"}`}
            />
          </div>
        ))}
      </Box>
    </div>
  );
}

function Agent() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="bg-brand/70 size-4 rounded-full" />
        <Bar w="w-16" h="h-1.5" />
      </div>
      <Box className="flex flex-1 flex-col gap-2 p-2.5">
        <span className="bg-ink/8 ml-auto block h-5 w-1/2 rounded-lg rounded-br-sm" />
        <div className="bg-brand/15 mr-auto w-3/5 space-y-1 rounded-lg rounded-bl-sm p-1.5">
          <Bar h="h-1" tone="bg-brand/50" />
          <Bar w="w-3/4" h="h-1" tone="bg-brand/50" />
        </div>
        <span className="bg-ink/8 ml-auto block h-4 w-2/5 rounded-lg rounded-br-sm" />
        <div className="bg-brand/15 mr-auto w-1/2 space-y-1 rounded-lg rounded-bl-sm p-1.5">
          <Bar h="h-1" tone="bg-brand/50" />
        </div>
      </Box>
      <Box className="flex items-center gap-2 p-1.5">
        <Bar w="w-1/3" h="h-1.5" />
        <span className="bg-brand/70 ml-auto size-4 rounded-full" />
      </Box>
    </div>
  );
}

function Mobile() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="border-line bg-surface flex h-full w-[38%] flex-col gap-1.5 rounded-[0.85rem] border-2 p-1.5">
        <span className="bg-ink/15 mx-auto h-1 w-6 rounded-full" />
        <span className="bg-brand/70 h-2.5 w-10 rounded" />
        {[0, 1, 2].map((n) => (
          <Box key={n} className="flex items-center gap-1.5 p-1.5">
            <span className="bg-ink/10 size-5 shrink-0 rounded" />
            <span className="flex-1 space-y-1">
              <Bar h="h-1" />
              <Bar w="w-2/3" h="h-1" />
            </span>
          </Box>
        ))}
        <div className="border-line/70 mt-auto flex justify-around border-t pt-1.5">
          {[0, 1, 2, 3].map((n) => (
            <span
              key={n}
              className={`size-2.5 rounded ${n === 0 ? "bg-brand/70" : "bg-ink/12"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Keyed off the category's icon, which is already unique per build. */
const MOCKS: Record<string, { url: string; body: () => React.ReactElement }> = {
  layout: { url: "yourbrand.com", body: Portfolio },
  cart: { url: "yourbrand.com/shop", body: Commerce },
  gauge: { url: "app.yourbrand.com/overview", body: Dashboard },
  layers: { url: "app.yourbrand.com", body: Platform },
  bot: { url: "yourbrand.com/assistant", body: Agent },
  smartphone: { url: "yourbrand.com", body: Mobile },
};

export function SiteMock({ kind }: { kind: string }) {
  const mock = MOCKS[kind] ?? MOCKS.layout;
  const Body = mock.body;

  return (
    <div
      className="border-line bg-mist overflow-hidden rounded-xl border shadow-[0_18px_40px_-24px_rgba(14,27,38,0.35)]"
      aria-hidden
    >
      <div className="border-line bg-surface flex items-center gap-2 border-b px-3 py-2">
        <span className="flex gap-1.5">
          <span className="bg-ink/15 size-2 rounded-full" />
          <span className="bg-ink/15 size-2 rounded-full" />
          <span className="bg-ink/15 size-2 rounded-full" />
        </span>
        <span className="border-line bg-mist text-ink-faint ml-1 flex-1 truncate rounded-md border px-2.5 py-1 font-mono text-[0.625rem]">
          {mock.url}
        </span>
      </div>
      <div className="bg-canvas aspect-[16/10] p-3">
        <Body />
      </div>
    </div>
  );
}
