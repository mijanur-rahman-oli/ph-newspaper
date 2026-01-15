
// src/components/news/NewsCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';

interface NewsCardProps {
  _id: string;
  title: string;
  content: string;
  thumbnail: string;
  category: string;
  views: number;
  createdAt: Date | string;
  variant?: 'default' | 'featured' | 'compact';
}

export function NewsCard({
  _id,
  title,
  content,
  thumbnail,
  category,
  views,
  createdAt,
  variant = 'default',
}: NewsCardProps) {
  const href = `/news/${category.toLowerCase()}/${_id}`;
  
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      if (diffHours < 1) return 'Just now';
      return `${diffHours}h ago`;
    }
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (variant === 'featured') {
    return (
      <Link href={href} className="group block">
        <div className="relative h-96 rounded-xl overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-sm font-medium mb-3">
              {category}
            </span>
            <h2 className="text-3xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
              {title}
            </h2>
            <p className="text-gray-200 line-clamp-2 mb-3">{content}</p>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className="group flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
        <div className="relative w-24 h-20 flex-shrink-0 rounded overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>{formatDate(createdAt)}</span>
            <span>•</span>
            <span>{views.toLocaleString()} views</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative h-48">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-4">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mb-2">
            {category}
          </span>
          <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{content}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}