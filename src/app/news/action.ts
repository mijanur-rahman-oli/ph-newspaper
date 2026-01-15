// src/app/news/actions.ts
'use server';

import connectDB from '../../lib/db/connection';
import News from '../../lib/db/models/News';
import { revalidatePath } from 'next/cache';

export async function incrementViews(newsId: string) {
  try {
    await connectDB();
    
    await News.findByIdAndUpdate(
      newsId,
      { $inc: { 'metrics.views': 1 } },
      { new: true }
    );
    
    revalidatePath(`/news`);
    
    return { success: true };
  } catch (error) {
    console.error('Error incrementing views:', error);
    return { success: false };
  }
}