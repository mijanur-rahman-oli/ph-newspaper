// src/components/news/RelatedNews.tsx
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

interface RelatedNewsProps {
  news: NewsItem[];
  currentId: string;
}

export function RelatedNews({ news, currentId }: RelatedNewsProps) {
  const filtered = news.filter(item => item._id !== currentId).slice(0, 4);

  if (filtered.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Related News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
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