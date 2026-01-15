// src/app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db/connection';
import News from '../../../lib/db/models/News';

export async function GET() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Found' : 'Missing');
    
    await connectDB();
    
    const count = await News.countDocuments();
    console.log(`📊 Total news in database: ${count}`);
    
    const sample = await News.findOne().lean();
    const categories = await News.distinct('category');
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully!',
      totalNews: count,
      categories: categories,
      sampleNews: sample ? {
        id: sample._id,
        title: sample.title,
        category: sample.category,
        district: sample.location?.district,
      } : null,
    });
  } catch (error: any) {
    console.error('❌ Database error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    }, { status: 500 });
  }
}