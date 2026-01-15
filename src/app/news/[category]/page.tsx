import { notFound } from 'next/navigation';
import Link from 'next/link';
import connectDB from '../../../lib/db/connection';
import News from '../../../lib/db/models/News';
import { NewsCard } from '../../../components/news/NewsCard';
import Sidebar from '../../../components/layout/Sidebar';
import { CATEGORIES, ITEMS_PER_PAGE } from '../../../lib/utils/constants';
import { ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ page?: string; sort?: string }>;
}

interface CategoryNewsData {
  news: any[];
  total: number;
  totalPages: number;
  categoryCounts: { category: string; count: number }[];
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const categoryRaw = params?.category;

  if (!categoryRaw || Array.isArray(categoryRaw) || !CATEGORIES.map(c => c.toLowerCase()).includes(categoryRaw.toLowerCase())) {
    return {
      title: 'News - PH Newspaper',
      description: 'Latest news from Bangladesh',
    };
  }

  const categoryCapitalized = categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1);

  return {
    title: `${categoryCapitalized} News - PH Newspaper`,
    description: `Latest ${categoryCapitalized.toLowerCase()} news from Bangladesh.`,
    openGraph: {
      title: `${categoryCapitalized} News - PH Newspaper`,
      description: `Latest ${categoryCapitalized.toLowerCase()} news from Bangladesh`,
    },
  };
}


export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    category: category.toLowerCase(),
  }));
}

async function getCategoryNews(categoryRaw: string, page: number, sort: string): Promise<CategoryNewsData | null> {
  await connectDB();

  if (!categoryRaw || Array.isArray(categoryRaw)) return null;

  const categoryCapitalized = categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1);

  if (!CATEGORIES.includes(categoryCapitalized as any)) return null;

  const skip = (page - 1) * ITEMS_PER_PAGE;

  let sortQuery: any = { createdAt: -1 };
  if (sort === 'popular') sortQuery = { 'metrics.views': -1, createdAt: -1 };

  const [news, total, categoryCounts] = await Promise.all([
    News.find({ category: categoryCapitalized })
      .sort(sortQuery)
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .lean(),
    News.countDocuments({ category: categoryCapitalized }),
    News.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { _id: 0, category: '$_id', count: 1 } },
    ]),
  ]);

  return {
    news: JSON.parse(JSON.stringify(news)),
    total,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    categoryCounts,
  };
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : {};

  const categoryRaw = params?.category;

  if (!categoryRaw || Array.isArray(categoryRaw)) notFound();

  const page = parseInt(searchParams?.page || '1');
  const sort = searchParams?.sort || 'latest';

  const data = await getCategoryNews(categoryRaw, page, sort);
  if (!data) notFound();

  const { news, total, totalPages, categoryCounts } = data;
  const categoryName = categoryRaw.charAt(0).toUpperCase() + categoryRaw.slice(1);

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
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </nav>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-800 to-blue-950 text-white border-b border-white/5">
        <div className="max-w-[1480px] mx-auto px-6 py-6 lg:py-8">
          <div className="flex items-baseline gap-4">
            <h1 className="text-xl md:text-2xl font-medium tracking-tight">
              {categoryName}
            </h1>

            <span className="text-blue-400/50 font-light">—</span>

            <p className="text-blue-200/60 text-sm tracking-wide">
              {total.toLocaleString()} {total === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* News Grid */}
          <div className="lg:col-span-3">
            {news.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500">No articles found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link
                    href={`/news/${categoryRaw}?page=${page - 1}${sort !== 'latest' ? `&sort=${sort}` : ''}`}
                    className="flex items-center gap-1 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Link>
                )}

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;

                    return (
                      <Link
                        key={pageNum}
                        href={`/news/${categoryRaw}?page=${pageNum}${sort !== 'latest' ? `&sort=${sort}` : ''}`}
                        className={`px-4 py-2 rounded-lg transition-colors ${page === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>

                {page < totalPages && (
                  <Link
                    href={`/news/${categoryRaw}?page=${page + 1}${sort !== 'latest' ? `&sort=${sort}` : ''}`}
                    className="flex items-center gap-1 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Sidebar categoryCounts={categoryCounts} />
          </aside>
        </div>
      </div>
    </div>
  );
}
