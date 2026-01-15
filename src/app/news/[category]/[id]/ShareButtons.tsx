// src/app/news/[category]/[id]/ShareButtons.tsx
'use client';

import { useState } from 'react';
import { Facebook, Twitter, Link2, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  newsId: string;
}

export default function ShareButtons({ title, newsId }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const url = typeof window !== 'undefined' ? window.location.href : '';
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Share this article</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={shareOnFacebook}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Facebook className="w-5 h-5" />
          Facebook
        </button>
        <button
          onClick={shareOnTwitter}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
        >
          <Twitter className="w-5 h-5" />
          Twitter
        </button>
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}