import * as dotenv from 'dotenv';
import * as path from 'path';

const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

console.log('📁 Looking for .env files...');
console.log('   .env.local path:', envLocalPath);
console.log('   .env path:', envPath);

dotenv.config({ path: envLocalPath });
dotenv.config({ path: envPath });


import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
console.log('\n🔍 Environment Variables:');
console.log('   MONGODB_URI:', MONGODB_URI ? '✅ Loaded' : '❌ Missing');

if (MONGODB_URI) {
  if (MONGODB_URI.includes('mongodb+srv://')) {
    console.log('   Type: MongoDB Atlas ✅');
  } else if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
    console.log('   Type: Local MongoDB (Wrong! Should be Atlas)');
  }
  console.log('   Connection string preview:', MONGODB_URI.substring(0, 50) + '...');
}

if (!MONGODB_URI) {
  console.error('\n ERROR: MONGODB_URI not found!');
  console.error('Please make sure .env.local exists in the project root with:');
  console.error('MONGODB_URI=mongodb+srv://...\n');
  process.exit(1);
}

import News from '../lib/db/models/News';
import { BANGLADESH_DISTRICTS } from '../lib/data/districts';
import type { NewsCategory } from '../types';

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
    content: 'In a significant development, political leaders gathered to address pressing matters affecting the nation. The comprehensive discussion covered various aspects of governance and public welfare, with stakeholders presenting detailed proposals for consideration.',
  },
  {
    category: 'Sports',
    titles: [
      'District Cricket Team Wins Regional Championship',
      'Local Football Academy Produces National Players',
      'Young Athletes Break Records at State Competition',
    ],
    content: 'The sports community celebrated remarkable achievements as talented athletes demonstrated exceptional skills. The victory marks a milestone in the region\'s sporting history, inspiring younger generations to pursue excellence in athletics.',
  },
  {
    category: 'Entertainment',
    titles: [
      'Film Festival Showcases Local Talent This Weekend',
      'Traditional Music Concert Attracts Thousands',
      'New Cultural Center Opens to Public',
    ],
    content: 'Cultural enthusiasts gathered for a spectacular celebration of arts and entertainment. The event featured performances from renowned artists and emerging talents, highlighting the rich cultural heritage of the region.',
  },
  {
    category: 'Business',
    titles: [
      'New Industrial Park Creates Jobs for Local Residents',
      'Technology Hub Attracts International Investment',
      'Agricultural Export Reaches Record Levels',
    ],
    content: 'Economic indicators show promising growth as new businesses establish operations in the area. The development is expected to boost employment opportunities and contribute significantly to regional prosperity.',
  },
  {
    category: 'Technology',
    titles: [
      'Smart City Initiative Launches Digital Services',
      'Local Startup Develops Innovative Mobile App',
      'High-Speed Internet Reaches Rural Communities',
    ],
    content: 'Technological advancement continues to transform daily life as innovative solutions address community needs. The implementation of modern infrastructure marks a significant step toward digital inclusion.',
  },
  {
    category: 'Health',
    titles: [
      'New Hospital Wing Expands Healthcare Services',
      'Free Medical Camp Serves Thousands of Patients',
      'Vaccination Drive Achieves Target Coverage',
    ],
    content: 'Healthcare providers delivered essential medical services to communities in need. The initiative demonstrates commitment to improving public health outcomes and ensuring access to quality care for all residents.',
  },
  {
    category: 'Education',
    titles: [
      'Schools Receive Modern Computer Laboratories',
      'Scholarship Program Benefits Underprivileged Students',
      'University Launches New Research Center',
    ],
    content: 'Educational institutions continue to enhance learning opportunities for students across all levels. The investment in academic infrastructure aims to prepare future generations for emerging challenges and opportunities.',
  },
  {
    category: 'Crime',
    titles: [
      'Police Arrest Drug Trafficking Syndicate Members',
      'Cyber Crime Unit Recovers Stolen Digital Assets',
      'Community Watch Program Reduces Local Incidents',
    ],
    content: 'Law enforcement agencies successfully addressed security concerns through coordinated operations. The proactive measures have contributed to improved safety and security within the community.',
  },
];

async function seedDatabase() {
  try {
    console.log('\n🌐 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB!\n');
    
    // Check database name
    const dbName = mongoose.connection.db?.databaseName;
    console.log('Database name:', dbName);
    
    console.log('Clearing existing news...');
    const deleteResult = await News.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} existing articles`);

    console.log('\n Creating 80+ news articles...');
    
    const newsToInsert = [];
    
    for (let i = 0; i < 80; i++) {
      const randomDistrict = BANGLADESH_DISTRICTS[Math.floor(Math.random() * BANGLADESH_DISTRICTS.length)];
      const categoryData = sampleNews[i % sampleNews.length];
      const titleIndex = Math.floor(Math.random() * categoryData.titles.length);
      
      const contentRepeat = Math.floor(Math.random() * 3) + 2;
      const extendedContent = Array(contentRepeat).fill(categoryData.content).join(' ');
      
      newsToInsert.push({
        title: `${categoryData.titles[titleIndex]} in ${randomDistrict.name}`,
        content: extendedContent,
        thumbnail: `https://picsum.photos/seed/${i}/800/600`,
        category: categoryData.category,
        location: {
          division: randomDistrict.division,
          district: randomDistrict.name,
        },
        metrics: {
          views: Math.floor(Math.random() * 5000),
          isBreaking: Math.random() > 0.85,
        },
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    // Ensure breaking news
    newsToInsert[0].metrics.isBreaking = true;
    newsToInsert[1].metrics.isBreaking = true;
    newsToInsert[2].metrics.isBreaking = true;

    console.log('💾 Inserting articles into database...');
    const inserted = await News.insertMany(newsToInsert);
    console.log(`✅ Successfully inserted ${inserted.length} articles!`);
    
    // Verify insertion
    const count = await News.countDocuments();
    console.log(`✅ Verified: ${count} total articles in database`);
    
    const stats = await News.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    console.log('\n News by Category:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} articles`);
    });
    
    const districtStats = await News.aggregate([
      { $group: { _id: '$location.district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    
    console.log('\ Top 10 Districts:');
    districtStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} articles`);
    });
    
    console.log('\n Database seeding completed successfully!');
    console.log('✨ Run: npm run dev\n');
    
  } catch (error) {
    console.error('\n ERROR during seeding:');
    console.error(error);
    if (error instanceof Error) {
      console.error('\nError details:', error.message);
      if (error.stack) {
        console.error('\nStack trace:', error.stack);
      }
    }
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

seedDatabase();