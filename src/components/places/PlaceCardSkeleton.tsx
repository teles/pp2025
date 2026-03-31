export function PlaceCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-dark-800">
      {/* Image area */}
      <div className="aspect-square bg-dark-700 animate-pulse" />
      {/* Content */}
      <div className="flex flex-col gap-2 p-3">
        <div className="h-3.5 w-3/4 rounded-full bg-white/10 animate-pulse" />
        <div className="h-3 w-1/2 rounded-full bg-white/5 animate-pulse" />
        <div className="mt-2 flex gap-1">
          <div className="h-5 w-14 rounded-full bg-white/5 animate-pulse" />
          <div className="h-5 w-10 rounded-full bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
