/** The practice workspace's frame, while its questions load. */
export default function AssignmentsLoading() {
  return (
    <div className="flex h-[calc(100dvh-125px)] flex-col" aria-hidden>
      <div className="border-line bg-canvas flex shrink-0 items-center gap-4 border-b px-4 py-2.5">
        <div className="bg-mist h-9 w-72 animate-pulse rounded-full" />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className="border-line bg-mist hidden w-[268px] shrink-0 border-r lg:block" />
        <div className="bg-night flex-1" />
        <div className="border-line bg-mist hidden w-[360px] shrink-0 border-l lg:block" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
