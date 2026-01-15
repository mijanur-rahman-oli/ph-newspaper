// src/components/news/BreakingNews.tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react'; // More subtle warning icon

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
  const containerRef = useRef<HTMLDivElement>(null);

  // Optional: Pause on hover (better UX)
  useEffect(() => {
    const container = containerRef.current;
    const marquee = marqueeRef.current;
    if (!container || !marquee) return;

    const pause = () => {
      marquee.style.animationPlayState = 'paused';
    };
    const resume = () => {
      marquee.style.animationPlayState = 'running';
    };

    container.addEventListener('mouseenter', pause);
    container.addEventListener('mouseleave', resume);

    return () => {
      container.removeEventListener('mouseenter', pause);
      container.removeEventListener('mouseleave', resume);
    };
  }, []);

  if (news.length === 0) return null;

  return (
    <div className="bg-red-700 text-white text-sm font-medium">
      <div 
        ref={containerRef}
        className="max-w-[1480px] mx-auto px-5 lg:px-8 relative overflow-hidden"
      >
        <div className="flex items-center h-10">
          {/* Left label - more restrained */}
          <div className="flex items-center gap-2.5 pr-6 border-r border-red-500/40 whitespace-nowrap">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold tracking-wide uppercase">Breaking</span>
          </div>

          {/* Marquee content */}
          <div className="flex-1 overflow-hidden">
            <div 
              ref={marqueeRef}
              className="inline-flex items-center gap-12 animate-marquee whitespace-nowrap"
            >
              {news.map((item) => (
                <Link
                  key={item._id}
                  href={`/news/${item.category.toLowerCase()}/${item._id}`}
                  className="hover:underline hover:underline-offset-2 transition-all duration-200"
                >
                  {item.title}
                </Link>
              ))}

              {/* Duplicate for seamless infinite scroll */}
              {news.map((item) => (
                <Link
                  key={`dup-${item._id}`}
                  href={`/news/${item.category.toLowerCase()}/${item._id}`}
                  className="hover:underline hover:underline-offset-2 transition-all duration-200"
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