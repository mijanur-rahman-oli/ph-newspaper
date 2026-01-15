import * as dotenv from 'dotenv';
import * as path from 'path';
import mongoose from 'mongoose';

// =====================
// Load Environment Files
// =====================
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

console.log('📁 Looking for .env files...');
console.log('   .env.local path:', envLocalPath);
console.log('   .env path:', envPath);

dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });

// =====================
// Validate Environment
// =====================
const MONGODB_URI_RAW = process.env.MONGODB_URI;

console.log('\n🔍 Environment Variables:');
console.log('   MONGODB_URI:', MONGODB_URI_RAW ? '✅ Loaded' : '❌ Missing');

if (!MONGODB_URI_RAW) {
  console.error('\n❌ ERROR: MONGODB_URI not found!');
  console.error('Please add this to .env.local:\n');
  console.error('MONGODB_URI=mongodb+srv://username:password@cluster/db\n');
  process.exit(1);
}

// ✅ Type-safe constant (THIS fixes your build error)
const MONGODB_URI: string = MONGODB_URI_RAW;

if (MONGODB_URI.includes('mongodb+srv://')) {
  console.log('   Type: MongoDB Atlas ✅');
} else if (
  MONGODB_URI.includes('localhost') ||
  MONGODB_URI.includes('127.0.0.1')
) {
  console.log('   Type: Local MongoDB ⚠️');
}

console.log(
  '   Connection preview:',
  MONGODB_URI.substring(0, 45) + '...'
);

// =====================
// Imports AFTER env load
// =====================
import News from '../lib/db/models/News';
import { BANGLADESH_DISTRICTS } from '../lib/data/districts';
import type { NewsCategory } from '../types';

// =====================
// Sample Data
// =====================
interface CategoryData {
  category: NewsCategory;
  titles: string[];
  content: string;
}

const sampleNews: CategoryData[] = [
  {
    category: 'Politics',
    titles: [
      'Parliament Session Discusses New Agricultural Policy',
      'Local Government Elections Announced for Next Month',
      'Prime Minister Inaugurates Infrastructure Project',
    ],
    content:
      'In a significant development, political leaders gathered to address pressing matters affecting the nation.',
  },
  {
    category: 'Sports',
    titles: [
      'District Cricket Team Wins Regional Championship',
      'Local Football Academy Produces National Players',
      'Young Athletes Break Records at State Competition',
    ],
    content:
      'The sports community celebrated remarkable achievements as talented athletes demonstrated exceptional skills.',
  },
  {
    category: 'Entertainment',
    titles: [
      'Film Festival Showcases Local Talent This Weekend',
      'Traditional Music Concert Attracts Thousands',
      'New Cultural Center Opens to Public',
    ],
    content:
      'Cultural enthusiasts gathered for a spectacular celebration of arts and entertainment.',
  },
  {
    category: 'Business',
    titles: [
      'New Industrial Park Creates Jobs for Local Residents',
      'Technology Hub Attracts International Investment',
      'Agricultural Export Reaches Record Levels',
    ],
    content:
      'Economic indicators show promising growth as new businesses establish operations in the area.',
  },
  {
    category: 'Technology',
    titles: [
      'Smart City Initiative Launches Digital Services',
      'Local Startup Develops Innovative Mobile App',
      'High-Speed Internet Reaches Rural Communities',
    ],
    content:
      'Technological advancement continues to transform daily life through innovative solutions.',
  },
  {
    category: 'Health',
    titles: [
      'New Hospital Wing Expands Healthcare Services',
      'Free Medical Camp Serves Thousands of Patients',
      'Vaccination Drive Achieves Target Coverage',
    ],
    content:
      'Healthcare providers delivered essential medical services to communities in need.',
  },
  {
    category: 'Education',
    titles: [
      'Schools Receive Modern Computer Laboratories',
      'Scholarship Program Benefits Underprivileged Students',
      'University Launches New Research Center',
    ],
    content:
      'Educational institutions continue to enhance learning opportunities for students.',
  },
  {
    category: 'Crime',
    titles: [
      'Police Arrest Drug Trafficking Syndicate Members',
      'Cyber Crime Unit Recovers Stolen Digital Assets',
      'Community Watch Program Reduces Local Incidents',
    ],
    content:
      'Law enforcement agencies successfully addressed security concerns.',
  },
];

// =====================
// Seed Function
// =====================
async function seedDatabase() {
  try {
    console.log('\n🌐 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');

    const dbName = mongoose.connection.db?.databaseName;
    console.log('📦 Database:', dbName);

    console.log('\n🧹 Clearing existing news...');
    const deleted = await News.deleteMany({});
    console.log(`   Deleted ${deleted.deletedCount} articles`);

    console.log('\n📰 Creating 80 news articles...');
    const newsToInsert = [];

    for (let i = 0; i < 80; i++) {
      const district =
        BANGLADESH_DISTRICTS[
          Math.floor(Math.random() * BANGLADESH_DISTRICTS.length)
        ];
      const categoryData = sampleNews[i % sampleNews.length];
      const title =
        categoryData.titles[
          Math.floor(Math.random() * categoryData.titles.length)
        ];

      const contentRepeat = Math.floor(Math.random() * 3) + 2;
      const content = Array(contentRepeat)
        .fill(categoryData.content)
        .join(' ');

      newsToInsert.push({
        title: `${title} in ${district.name}`,
        content,
        thumbnail: `https://picsum.photos/seed/${i}/800/600`,
        category: categoryData.category,
        location: {
          division: district.division,
          district: district.name,
        },
        metrics: {
          views: Math.floor(Math.random() * 5000),
          isBreaking: Math.random() > 0.85,
        },
        createdAt: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
        ),
      });
    }

    // Ensure breaking news
    newsToInsert[0].metrics.isBreaking = true;
    newsToInsert[1].metrics.isBreaking = true;
    newsToInsert[2].metrics.isBreaking = true;

    console.log('💾 Inserting articles...');
    const inserted = await News.insertMany(newsToInsert);
    console.log(`✅ Inserted ${inserted.length} articles`);

    const total = await News.countDocuments();
    console.log(`📊 Total articles: ${total}`);

    console.log('\n✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ ERROR during seeding');
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// =====================
// Run Seeder
// =====================
seedDatabase();
