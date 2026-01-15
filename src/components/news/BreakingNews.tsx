// src/components/news/BreakingNews.tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

interface NewsItem {
  _id: string;
  title: string;
  category: string;
}

interface BreakingNewsProps {
  news: NewsItem[];
}

export function BreakingNews({ news }: BreakingNewsProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  if (news.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold whitespace-nowrap">
            <AlertCircle className="w-5 h-5 animate-pulse" />
            <span>BREAKING NEWS</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div ref={marqueeRef} className="flex gap-8 animate-marquee">
              {news.map((item) => (
                <Link
                  key={item._id}
                  href={`/news/${item.category.toLowerCase()}/${item._id}`}
                  className="whitespace-nowrap hover:underline"
                >
                  {item.title}
                </Link>
              ))}
              {/* Duplicate for seamless loop */}
              {news.map((item) => (
                <Link
                  key={`dup-${item._id}`}
                  href={`/news/${item.category.toLowerCase()}/${item._id}`}
                  className="whitespace-nowrap hover:underline"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}