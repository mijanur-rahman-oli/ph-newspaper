// src/components/news/FeaturedGrid.tsx
import { NewsCard } from './NewsCard';

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  thumbnail: string;
  category: string;
  metrics: { views: number };
  createdAt: Date | string;
}

interface FeaturedGridProps {
  news: NewsItem[];
}

export function FeaturedGrid({ news }: FeaturedGridProps) {
  if (news.length === 0) return null;

  const [featured, ...rest] = news;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <NewsCard
          _id={featured._id}
          title={featured.title}
          content={featured.content}
          thumbnail={featured.thumbnail}
          category={featured.category}
          views={featured.metrics.views}
          createdAt={featured.createdAt}
          variant="featured"
        />
      </div>
      <div className="grid grid-cols-1 gap-6">
        {rest.slice(0, 2).map((item) => (
          <NewsCard
            key={item._id}
            _id={item._id}
            title={item.title}
            content={item.content}
            thumbnail={item.thumbnail}
            category={item.category}
            views={item.metrics.views}
            createdAt={item.createdAt}
          />
        ))}
      </div>
    </div>
  );
}