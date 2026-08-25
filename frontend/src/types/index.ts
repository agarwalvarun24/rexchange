// frontend/src/types/index.ts

export type Category = 'textbooks' | 'electronics' | 'notes' | 'skills' | 'tickets' | 'giveaway';
export type TransactionType = 'sell' | 'swap' | 'free' | 'skill_trade';
export type Urgency = 'urgent' | 'moderate' | 'flexible';

export interface Listing {
  id: number;
  title: string;
  description: string;
  category: Category;
  transactionType: TransactionType;
  price: number;
  swapWants: string;
  condition: string;
  locationTag: string;
  campus: string;
  sellerName: string;
  sellerMajor: string;
  isVerified: boolean;
  timePosted: string;
}

export interface ExchangeOffer {
  id: number;
  listingId: number;
  fromName: string;
  contact: string;
  offerDetails: string;
  createdAt: string;
}

export type SafeLocation = string;

export interface ListingFilters {
  category?: Category;
  search?: string;
  transactionType?: TransactionType;
  verifiedOnly?: boolean;
  campus?: string;
}

export type CreateListingInput = Omit<Listing, 'id' | 'timePosted'>;
export type CreateOfferInput = Omit<ExchangeOffer, 'id' | 'createdAt'>;

// New types for requests and AI
export interface StudentRequest {
  id: number;
  title: string;
  description: string;
  category: Category;
  campus: string;
  requesterName: string;
  requesterMajor: string;
  reward: number; // ₹ amount, 0 if trade
  urgency: Urgency;
  timePosted: string;
  responsesCount: number;
}

export interface AIPricingSuggestion {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  savingsPercentage: number;
  swapRecommendations: string[];
  reason: string;
}

export interface RequestResponseInput {
  fromName: string;
  contact: string;
  message?: string;
}

export interface CreateRequestInput {
  title: string;
  description: string;
  category: Category;
  campus: string;
  requesterName: string;
  requesterMajor: string;
  reward: number;
  urgency: Urgency;
}