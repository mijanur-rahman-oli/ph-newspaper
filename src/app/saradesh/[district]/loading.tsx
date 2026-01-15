import { NewsListSkeleton } from '../../../components/ui/LoadingSkeleton';

export default function DistrictLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-64 bg-gray-200 rounded-lg mb-8 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
      <div className="h-80 bg-gray-200 rounded-lg mb-8 animate-pulse" />
      <NewsListSkeleton />
    </div>
  );
}