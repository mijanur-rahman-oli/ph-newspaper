import { Suspense } from 'react';
import connectDB from '../../lib/db/connection';
import News from '../../lib/db/models/News';
import { BANGLADESH_DISTRICTS } from '../../lib/data/districts';
import SaraDeshClient from './SaraDeshClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sara Desh - Interactive Bangladesh News Map | PH Newspaper',
  description: 'Explore news from all 64 districts of Bangladesh on an interactive map. Find local news, breaking stories, and regional updates.',
  openGraph: {
    title: 'Sara Desh - Bangladesh News Map',
    description: 'Interactive map showing news from all districts of Bangladesh',
    type: 'website',
  },
};

async function getDistrictData() {
  await connectDB();

  const districtCounts = await News.aggregate([
    {
      $group: {
        _id: '$location.district',
        count: { $sum: 1 },
      },
    },
  ]);

  const districtMap = new Map(districtCounts.map(d => [d._id, d.count]));

  const districtData = BANGLADESH_DISTRICTS.map(district => ({
    district: district.name,
    count: districtMap.get(district.name) || 0,
    coordinates: district.coordinates as [number, number],
  })).filter(d => d.count > 0);

  return districtData;
}

async function getAllDistrictNews() {
  await connectDB();

  const news = await News.aggregate([
    {
      $sort: { createdAt: -1 },
    },
    {
      $group: {
        _id: '$location.district',
        news: {
          $push: {
            _id: { $toString: '$_id' },
            title: '$title',
            category: '$category',
            thumbnail: '$thumbnail',
            views: '$metrics.views',
            createdAt: '$createdAt',
          },
        },
      },
    },
  ]);

  const newsMap: Record<string, any[]> = {};
  news.forEach(item => {
    newsMap[item._id] = item.news.slice(0, 5);
  });

  return newsMap;
}

export default async function SaraDeshPage() {
  const [districtData, newsMap] = await Promise.all([
    getDistrictData(),
    getAllDistrictNews(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">সারা দেশ (Sara Desh)</h1>
          <p className="text-blue-100 text-lg">
            Explore news from all 64 districts of Bangladesh
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">
              {districtData.length}
            </div>
            <div className="text-gray-600 mt-1">Districts with News</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">
              {districtData.reduce((acc, d) => acc + d.count, 0)}
            </div>
            <div className="text-gray-600 mt-1">Total Articles</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round(
                districtData.reduce((acc, d) => acc + d.count, 0) / districtData.length
              )}
            </div>
            <div className="text-gray-600 mt-1">Avg. per District</div>
          </div>
        </div>

        {/* Client Component with Map */}
        <Suspense
          fallback={
            <div className="bg-white rounded-lg shadow p-8">
              <div className="animate-pulse">
                <div className="h-[600px] bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          }
        >
          <SaraDeshClient districtData={districtData} newsMap={newsMap} />
        </Suspense>

        {/* District List */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">All Districts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {BANGLADESH_DISTRICTS.map(district => {
              const count = districtData.find(d => d.district === district.name)?.count || 0;
              return (
                <a
                  key={district.name}
                  href={`/saradesh/${district.name.toLowerCase()}`}
                  className={`p-3 rounded-lg border transition-all ${
                    count > 0
                      ? 'border-blue-200 bg-blue-50 hover:bg-blue-100 hover:shadow'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <div className="font-medium text-sm">{district.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {count > 0 ? `${count} articles` : 'No articles'}
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}