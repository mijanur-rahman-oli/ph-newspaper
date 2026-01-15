import { Document } from 'mongoose';

export type NewsCategory =
  | 'Politics'
  | 'Sports'
  | 'Entertainment'
  | 'Business'
  | 'Technology'
  | 'Health'
  | 'Education'
  | 'Crime';

export interface INews extends Document {
  title: string;
  content: string;
  thumbnail: string;
  category: NewsCategory;
  location: {
    division: string;
    district: string;
  };
  metrics: {
    views: number;
    isBreaking: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
