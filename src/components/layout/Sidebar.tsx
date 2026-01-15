'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '../../lib/utils/constants';
import { ChevronRight } from 'lucide-react';

interface CategoryCount {
  category: string;
  count: number;
}

interface SidebarProps {
  categoryCounts?: CategoryCount[];
}

export default function Sidebar({ categoryCounts = [] }: SidebarProps) {
  const pathname = usePathname();

  const countMap = new Map(categoryCounts.map(c => [c.category, c.count]));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
      <h3 className="text-xl font-bold mb-4 pb-2 border-b">Categories</h3>
      <ul className="space-y-2">
        <li>
          <Link
            href="/news"
            className={`flex items-center justify-between px-3 py-2 rounded transition-colors ${
              pathname === '/news' || pathname === '/'
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span>All News</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </li>
        {CATEGORIES.map((category) => {
          const isActive = pathname === `/news/${category.toLowerCase()}`;
          const count = countMap.get(category) || 0;
          
          return (
            <li key={category}>
              <Link
                href={`/news/${category.toLowerCase()}`}
                className={`flex items-center justify-between px-3 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span>{category}</span>
                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}