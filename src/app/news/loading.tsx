import { FeaturedSkeleton, NewsListSkeleton } from '../../components/ui/LoadingSkeleton';

export default function NewsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-12">
          <section>
            <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
            <FeaturedSkeleton />
          </section>
          <section>
            <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
            <NewsListSkeleton />
          </section>
        </div>
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}