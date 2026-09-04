/** The documentation shell, held in place while the lesson loads. */
export default function NotesLoading() {
  return (
    <div
      className="mx-auto grid w-full max-w-[110rem] gap-8 px-5 py-8 md:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 lg:py-10 xl:px-10"
      aria-hidden
    >
      <div className="hidden lg:block">
        <div className="bg-mist h-11 animate-pulse rounded-xl" />
        <div className="mt-7 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-mist h-9 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
      <div className="min-w-0">
        <div className="bg-mist h-12 w-3/4 animate-pulse rounded-lg" />
        <div className="bg-mist mt-4 h-5 w-1/2 animate-pulse rounded" />
        <div className="mt-10 space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="bg-mist h-4 animate-pulse rounded"
              style={{ width: `${70 + ((i * 13) % 30)}%` }}
            />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
