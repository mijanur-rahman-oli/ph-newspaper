'use client';

import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
  _id: string;
  title: string;
  category: string;
  thumbnail: string;
  views: number;
  createdAt: string;
}

interface DistrictModalProps {
  isOpen: boolean;
  onClose: () => void;
  district: string | null;
  news: NewsItem[];
}

export default function DistrictModal({ isOpen, onClose, district, news }: DistrictModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !district) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{district}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {news.length} news {news.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {news.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No news articles available for this district.</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {news.map((item) => (
                <Link
                  key={item._id}
                  href={`/news/${item.category.toLowerCase()}/${item._id}`}
                  className="block group"
                  onClick={onClose}
                >
                  <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0 mt-1" />
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {item.category}
                        </span>
                        <span>{item.views.toLocaleString()} views</span>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <Link
            href={`/saradesh/${district.toLowerCase()}`}
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
            onClick={onClose}
          >
            View All {district} News
          </Link>
        </div>
      </div>
    </div>
  );
}