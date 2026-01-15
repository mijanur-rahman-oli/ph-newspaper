// src/components/news/NewsList.tsx
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

interface NewsListProps {
  news: NewsItem[];
  title?: string;
}

export function NewsList({ news, title = 'Latest News' }: NewsListProps) {
  if (news.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No news articles found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
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