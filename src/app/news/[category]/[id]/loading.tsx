import { DetailPageSkeleton } from '../../../../components/ui/LoadingSkeleton';

export default function NewsDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <DetailPageSkeleton />
    </div>
  );
}