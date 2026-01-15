import connectDB from '../../lib/db/connection';
import News from '../../lib/db/models/News';
import { BreakingNews } from '../../components/news/BreakingNews';
import { FeaturedGrid } from '../../components/news/FeaturedGrid';
import { NewsList } from '../../components/news/NewsList';
import Sidebar from '../../components/layout/Sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Latest News - PH Newspaper',
  description: 'Stay updated with the latest breaking news from Bangladesh.',
};

async function getNewsData() {
  console.log('🔍 Starting to fetch news data...');
  
  try {
    await connectDB();
    console.log('✅ Database connected');

    // Check total count first
    const totalCount = await News.countDocuments();
    console.log(`📊 Total news in database: ${totalCount}`);

    if (totalCount === 0) {
      console.log('⚠️ No news found in database!');
      return {
        breakingNews: [],
        featuredNews: [],
        latestNews: [],
        categoryCounts: [],
        totalCount: 0,
      };
    }

    const [breakingNews, featuredNews, latestNews, categoryCounts] = await Promise.all([
      News.find({ 'metrics.isBreaking': true })
        .select('_id title category')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean()
        .then(data => {
          console.log(`📰 Breaking news found: ${data.length}`);
          return data;
        }),

      News.find()
        .sort({ 'metrics.views': -1, createdAt: -1 })
        .limit(3)
        .lean()
        .then(data => {
          console.log(`⭐ Featured news found: ${data.length}`);
          return data;
        }),

      News.find()
        .sort({ createdAt: -1 })
        .skip(3)
        .limit(12)
        .lean()
        .then(data => {
          console.log(`📋 Latest news found: ${data.length}`);
          return data;
        }),

      News.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { _id: 0, category: '$_id', count: 1 } },
      ]).then(data => {
        console.log(`📂 Categories found: ${data.length}`);
        return data;
      }),
    ]);

    return {
      breakingNews: JSON.parse(JSON.stringify(breakingNews)),
      featuredNews: JSON.parse(JSON.stringify(featuredNews)),
      latestNews: JSON.parse(JSON.stringify(latestNews)),
      categoryCounts,
      totalCount,
    };
  } catch (error) {
    console.error('❌ Error fetching news:', error);
    return {
      breakingNews: [],
      featuredNews: [],
      latestNews: [],
      categoryCounts: [],
      totalCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export default async function NewsPage() {
  const data = await getNewsData();
  const { breakingNews, featuredNews, latestNews, categoryCounts, totalCount, error } = data;

  console.log('📄 Rendering news page with:', {
    breaking: breakingNews.length,
    featured: featuredNews.length,
    latest: latestNews.length,
    categories: categoryCounts.length,
    total: totalCount,
  });

  // Debug output in development
  if (process.env.NODE_ENV === 'development' && totalCount === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-900 mb-4">⚠️ No News Found</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Total news in database:</strong> {totalCount}</p>
            {error && <p className="text-red-600"><strong>Error:</strong> {error}</p>}
            <p className="mt-4"><strong>Solution:</strong> Run the seeder to populate the database:</p>
            <pre className="bg-gray-800 text-white p-3 rounded mt-2">npm run seed</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {breakingNews.length > 0 && <BreakingNews news={breakingNews} />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-12">
            {featuredNews.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-6">Featured Headlines</h2>
                <FeaturedGrid news={featuredNews} />
              </section>
            )}

            {latestNews.length > 0 ? (
              <section>
                <NewsList news={latestNews} title="Latest News" />
              </section>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No news articles found. Please run the seeder.</p>
              </div>
            )}
          </div>

          <aside className="lg:col-span-1">
            <Sidebar categoryCounts={categoryCounts} />
          </aside>
        </div>
      </div>
    </>
  );
}