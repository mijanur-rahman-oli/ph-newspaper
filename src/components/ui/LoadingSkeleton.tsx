export function NewsCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4">
        <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="h-96 bg-gray-200 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 gap-6">
        <NewsCardSkeleton />
        <NewsCardSkeleton />
      </div>
    </div>
  );
}

export function NewsListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <NewsCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="h-4 bg-gray-200 rounded w-64 mb-4" />
      
      {/* Category badge */}
      <div className="h-8 bg-gray-200 rounded w-24 mb-4" />
      
      {/* Title */}
      <div className="space-y-3 mb-4">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded w-3/4" />
      </div>
      
      {/* Meta info */}
      <div className="flex gap-4 mb-6 pb-6 border-b">
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-40" />
      </div>
      
      {/* Featured image */}
      <div className="h-96 bg-gray-200 rounded-xl mb-8" />
      
      {/* Content paragraphs */}
      <div className="space-y-3 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
      
      {/* Share buttons */}
      <div className="border-t border-b py-6 mb-8">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
        </div>
      </div>
      
      {/* Location info */}
      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <div className="h-6 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-4 bg-gray-200 rounded mb-3" />
        <div className="h-4 bg-gray-200 rounded w-48" />
      </div>
    </div>
  );
}

export function CompactNewsCardSkeleton() {
  return (
    <div className="flex gap-3 p-2 animate-pulse">
      <div className="w-24 h-20 bg-gray-200 rounded" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-32" />
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded mb-4" />
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
      <div className="text-center">
        <div className="h-8 w-32 bg-gray-200 rounded mx-auto mb-2" />
        <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg" />
        <div className="flex-1">
          <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
      <div className="h-80 bg-gray-100 rounded flex items-end justify-around p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-t animate-pulse"
            style={{
              width: '10%',
              height: `${Math.random() * 80 + 20}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}