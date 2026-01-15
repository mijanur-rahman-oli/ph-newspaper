import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import connectDB from '../../../../lib/db/connection';
import News from '../../../../lib/db/models/News';
import { RelatedNews } from '../../../../components/news/RelatedNews';
import { incrementViews } from '../../../../app/news/action';
import { Clock, Eye, MapPin, ChevronRight, Home } from 'lucide-react';
import { Metadata } from 'next';
import ShareButtons from './ShareButtons';

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    await connectDB();
    const news = await News.findById(id).lean();
    
    if (!news) {
      return {
        title: 'News Not Found',
      };
    }

    const description = news.content.substring(0, 160) + '...';

    return {
      title: `${news.title} - PH Newspaper`,
      description,
      openGraph: {
        title: news.title,
        description,
        images: [{ url: news.thumbnail }],
        type: 'article',
        publishedTime: news.createdAt.toISOString(),
      },
      twitter: {
        card: 'summary_large_image',
        title: news.title,
        description,
        images: [news.thumbnail],
      },
    };
  } catch (error) {
    return {
      title: 'News Not Found',
    };
  }
}

async function getNewsDetail(id: string) {
  await connectDB();

  const news = await News.findById(id).lean();
  
  if (!news) {
    return null;
  }

  const relatedNews = await News.find({
    category: news.category,
    _id: { $ne: news._id },
  })
    .sort({ createdAt: -1 })
    .limit(4)
    .lean();

  return {
    news: JSON.parse(JSON.stringify(news)),
    relatedNews: JSON.parse(JSON.stringify(relatedNews)),
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { id, category } = await params;
  const data = await getNewsDetail(id);

  if (!data) {
    notFound();
  }

  const { news, relatedNews } = data;
  
  // Increment views (fire and forget)
  incrementViews(id);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
              <Home className="w-4 h-4" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/news" className="hover:text-blue-600">News</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/news/${news.category.toLowerCase()}`} className="hover:text-blue-600">
              {news.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium line-clamp-1">{news.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Category Badge */}
        <Link
          href={`/news/${news.category.toLowerCase()}`}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors mb-4"
        >
          {news.category}
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          {news.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6 pb-6 border-b">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDate(news.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {news.metrics.views.toLocaleString()} views
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {news.location.district}, {news.location.division}
          </span>
        </div>

        {/* Featured Image */}
        <div className="relative w-full h-96 md:h-[500px] rounded-xl overflow-hidden mb-8">
          <Image
            src={news.thumbnail}
            alt={news.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          {news.content.split('\n\n').map((paragraph: string, index: number) => (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Share Buttons */}
        <div className="border-t border-b py-6 mb-8">
          <ShareButtons title={news.title} newsId={id} />
        </div>

        {/* Location Info */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Location
          </h3>
          <p className="text-gray-700">
            This news is from <strong>{news.location.district}</strong> district in{' '}
            <strong>{news.location.division}</strong> division.
          </p>
          <Link
            href={`/saradesh/${news.location.district.toLowerCase()}`}
            className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium"
          >
            View all news from {news.location.district} →
          </Link>
        </div>
      </article>

      {/* Related News */}
      <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50">
        <RelatedNews news={relatedNews} currentId={id} />
      </div>
    </div>
  );
}