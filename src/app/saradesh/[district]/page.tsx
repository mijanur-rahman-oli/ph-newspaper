import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '../../../lib/db/connection';
import News from '../../../lib/db/models/News';
import { BANGLADESH_DISTRICTS } from '../../../lib/data/districts';
import { NewsCard } from '../../../components/news/NewsCard';
import CategoryChart from '../../../components/charts/CategoryChart';
import { MapPin, TrendingUp, Newspaper, ChevronRight, Home } from 'lucide-react';
import { Metadata } from 'next';

// This ensures Netlify doesn't crash during the pre-build phase
export const dynamic = 'force-dynamic';

interface PageProps {
  params: { district: string };
  searchParams: { sort?: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // SAFETY FIX: Check if district exists before calling charAt
  const districtSlug = params?.district || '';
  const districtName = districtSlug 
    ? districtSlug.charAt(0).toUpperCase() + districtSlug.slice(1) 
    : 'District';
  
  return {
    title: `${districtName} News - PH Newspaper`,
    description: `Latest news and updates from ${districtName} district. Browse local stories, breaking news, and regional coverage.`,
    openGraph: {
      title: `${districtName} District News`,
      description: `Latest news from ${districtName}, Bangladesh`,
    },
  };
}

export async function generateStaticParams() {
  return BANGLADESH_DISTRICTS.map((district) => ({
    district: district.name.toLowerCase(),
  }));
}

async function getDistrictData(districtName: string, sort: string) {
  await connectDB();

  if (!districtName) return null;

  const district = BANGLADESH_DISTRICTS.find(
    (d) => d.name.toLowerCase() === districtName.toLowerCase()
  );

  if (!district) {
    return null;
  }

  let sortQuery: any = { createdAt: -1 };
  if (sort === 'popular') {
    sortQuery = { 'metrics.views': -1, createdAt: -1 };
  }

  const [news, categoryStats, totalViews, breakingCount] = await Promise.all([
    News.find({ 'location.district': district.name })
      .sort(sortQuery)
      .lean(),

    News.aggregate([
      { $match: { 'location.district': district.name } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { _id: 0, category: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]),

    News.aggregate([
      { $match: { 'location.district': district.name } },
      { $group: { _id: null, total: { $sum: '$metrics.views' } } },
    ]),

    News.countDocuments({
      'location.district': district.name,
      'metrics.isBreaking': true,
    }),
  ]);

  return {
    district,
    news: JSON.parse(JSON.stringify(news)),
    categoryStats,
    totalViews: totalViews[0]?.total || 0,
    breakingCount,
    totalArticles: news.length,
  };
}

export default async function DistrictDetailPage({ params, searchParams }: PageProps) {
  const sort = searchParams?.sort || 'latest';
  const districtParam = params?.district;

  if (!districtParam) {
    notFound();
  }

  const data = await getDistrictData(districtParam, sort);

  if (!data) {
    notFound();
  }

  const { district, news, categoryStats, totalViews, breakingCount, totalArticles } = data;

  const newsByCategory = news.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

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
            <Link href="/saradesh" className="hover:text-blue-600">Sara Desh</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{district.name}</span>
          </nav>
        </div>
      </div>

      {/* District Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-6 h-6" />
                <span className="text-blue-200">{district.division} Division</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{district.name}</h1>
              <p className="text-blue-100 text-lg">
                District News & Updates
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Newspaper className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalArticles}</div>
                <div className="text-sm text-gray-600">Total Articles</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalViews.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Newspaper className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{categoryStats.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{breakingCount}</div>
                <div className="text-sm text-gray-600">Breaking News</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">News Distribution by Category</h2>
          <CategoryChart data={categoryStats} />
        </div>
      </div>

      {/* News Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All News Articles</h2>
          <div className="flex gap-2">
            <Link
              href={`/saradesh/${districtParam}?sort=latest`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sort === 'latest'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Latest
            </Link>
            <Link
              href={`/saradesh/${districtParam}?sort=popular`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                sort === 'popular'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Popular
            </Link>
          </div>
        </div>

        {news.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No News Available
            </h3>
            <p className="text-gray-600">
              There are no news articles from {district.name} at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item: any) => (
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
        )}
      </div>
    </div>
  );
}