export function SectionSkeleton() {
  return <div className="h-10 w-56 animate-pulse rounded-full bg-black/5" />;
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[2rem] border border-black/5 bg-white p-4 shadow-sm">
          <div className="aspect-[4/3] animate-pulse rounded-[1.4rem] bg-black/5" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded-full bg-black/5" />
          <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-black/5" />
          <div className="mt-2 h-3 w-5/6 animate-pulse rounded-full bg-black/5" />
          <div className="mt-5 h-10 w-full animate-pulse rounded-full bg-black/5" />
        </div>
      ))}
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="content-shell grid gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="h-[460px] animate-pulse rounded-[2rem] bg-white/70" />
      <div className="space-y-4">
        <div className="h-6 w-40 animate-pulse rounded-full bg-black/5" />
        <div className="h-12 w-full animate-pulse rounded-full bg-black/5" />
        <div className="h-4 w-full animate-pulse rounded-full bg-black/5" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-black/5" />
        <div className="h-16 w-full animate-pulse rounded-[1.5rem] bg-black/5" />
      </div>
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/70 p-8 text-center">
      <p className="font-display text-2xl font-semibold text-[#20303d]">{title}</p>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

export function ErrorState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-8 text-center text-rose-900">
      <p className="font-display text-2xl font-semibold">{title}</p>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6">{description}</p>
    </div>
  );
}
