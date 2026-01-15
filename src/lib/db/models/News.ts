// src/lib/db/models/News.ts
import mongoose, { Schema, Model } from 'mongoose';
import { INews, NewsCategory } from '../../../types';

const newsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Thumbnail is required'],
      default: '/images/news/default-thumbnail.jpg',
    },
    category: {
      type: String,
      enum: ['Politics', 'Sports', 'Entertainment', 'Business', 'Technology', 'Health', 'Education', 'Crime'],
      required: [true, 'Category is required'],
    },
    location: {
      division: {
        type: String,
        required: [true, 'Division is required'],
      },
      district: {
        type: String,
        required: [true, 'District is required'],
      },
    },
    metrics: {
      views: {
        type: Number,
        default: 0,
        min: 0,
      },
      isBreaking: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
newsSchema.index({ category: 1, createdAt: -1 });
newsSchema.index({ 'location.district': 1 });
newsSchema.index({ 'metrics.isBreaking': 1, createdAt: -1 });
newsSchema.index({ 'metrics.views': -1 });

// Prevent model overwrite during hot reload in development
const News: Model<INews> = mongoose.models.News || mongoose.model<INews>('News', newsSchema);

export default News;