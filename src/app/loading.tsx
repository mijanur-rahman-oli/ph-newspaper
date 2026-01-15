import { NewsListSkeleton } from '../components/ui/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
      <NewsListSkeleton />
    </div>
  );
}