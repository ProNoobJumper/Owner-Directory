export interface Owner {
  id: string;
  name: string;
  businessName: string;
  category: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  image: string;
  website?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export const CATEGORIES = [
  'Restaurant',
  'Retail',
  'Technology',
  'Healthcare',
  'Real Estate',
  'Consulting',
  'Manufacturing',
  'Education',
] as const;

export type Category = typeof CATEGORIES[number];
