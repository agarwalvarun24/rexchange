export interface Listing {
  id: number;
  title: string;
  description: string;
  category: string;
  transactionType: 'sell' | 'swap' | 'free' | 'skill_trade';
  price?: number;
  swapWants?: string;
  condition: string;
  campus?: string;
  locationTag: string;
  sellerName: string;
  sellerMajor: string;
  isVerified?: boolean;
  timePosted: string;
}

export interface ExchangeOffer {
  id?: number;
  listingId: number;
  fromName: string;
  contact: string;
  offerDetails: string;
  meetupLocation?: string;
  status?: string;
  createdAt?: string;
}

export interface StudentRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  campus: string;
  requesterName: string;
  requesterMajor: string;
  reward?: string;
  urgency: 'urgent' | 'moderate' | 'flexible';
  timePosted: string;
}

export interface AIPricingSuggestion {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  savingsPercentage: number;
  swapRecommendations: string[];
  reason: string;
}

export interface ListingFilters {
  category?: string;
  search?: string;
  transactionType?: string;
  verifiedOnly?: boolean;
  campus?: string;
}

export interface CreateListingInput {
  title: string;
  description: string;
  category: string;
  transactionType: 'sell' | 'swap' | 'free' | 'skill_trade';
  price?: number;
  swapWants?: string;
  condition: string;
  campus?: string;
  locationTag: string;
  sellerName: string;
  sellerMajor: string;
}

export interface CreateOfferInput {
  listingId: number;
  fromName: string;
  contact: string;
  offerDetails: string;
  meetupLocation?: string;
}

export interface CreateRequestInput {
  title: string;
  description: string;
  category: string;
  campus: string;
  requesterName: string;
  requesterMajor: string;
  reward?: string;
  urgency: 'urgent' | 'moderate' | 'flexible';
}

export interface RequestResponseInput {
  responderName: string;
  contact: string;
  message: string;
}

export type SafeLocation = string;