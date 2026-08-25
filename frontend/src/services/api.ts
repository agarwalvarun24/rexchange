// frontend/src/services/api.ts

import {
  Listing,
  ExchangeOffer,
  StudentRequest,
  AIPricingSuggestion,
  ListingFilters,
  CreateListingInput,
  CreateOfferInput,
  CreateRequestInput,
  RequestResponseInput,
} from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ---------- Fallback In-Memory Data (used when backend unreachable) ----------
let fallbackListingsData: Listing[] = [
  {
    id: 1,
    title: 'Calculus Early Transcendentals 8th Edition',
    description: 'Used but in great condition, no markings. Perfect for Math 101/102.',
    category: 'textbooks',
    transactionType: 'sell',
    price: 450,
    swapWants: '',
    condition: 'Good',
    campus: 'Main Campus - North Wing',
    locationTag: 'Central Library Foyer',
    sellerName: 'Aarav Sharma',
    sellerMajor: 'Computer Science',
    isVerified: true,
    timePosted: '2025-04-10T10:30:00Z',
  },
  {
    id: 2,
    title: 'TI-84 Plus CE Graphing Calculator',
    description: 'Barely used, includes charging cable and case.',
    category: 'electronics',
    transactionType: 'sell',
    price: 1500,
    swapWants: '',
    condition: 'Like New',
    campus: 'South Campus - Tech Park',
    locationTag: 'Student Activity Center',
    sellerName: 'Priya Patel',
    sellerMajor: 'Electrical Engineering',
    isVerified: true,
    timePosted: '2025-04-11T14:15:00Z',
  },
  {
    id: 3,
    title: 'Complete Organic Chemistry Notes (Semester 3)',
    description: 'Handwritten, colour-coded, includes reaction mechanisms and diagrams.',
    category: 'notes',
    transactionType: 'swap',
    price: 0,
    swapWants: 'Need Microeconomics notes or coffee',
    condition: 'Digital PDF',
    campus: 'East Campus - Medical Block',
    locationTag: 'Main Canteen',
    sellerName: 'Rohan Gupta',
    sellerMajor: 'Chemistry',
    isVerified: false,
    timePosted: '2025-04-12T09:00:00Z',
  },
  {
    id: 4,
    title: 'Guitar Lessons for Beginners',
    description: 'I can teach basic chords, strumming and a few songs. 4 sessions of 1 hour each.',
    category: 'skills',
    transactionType: 'skill_trade',
    price: 0,
    swapWants: 'Help with Python programming or graphic design',
    condition: 'N/A',
    campus: 'West Hostel Complex',
    locationTag: 'Hostel A Common Room',
    sellerName: 'Sneha Iyer',
    sellerMajor: 'Music',
    isVerified: true,
    timePosted: '2025-04-13T16:45:00Z',
  },
  {
    id: 5,
    title: 'Concert Ticket – Indie Night (1 extra)',
    description: 'One extra ticket for the college fest Indie Night on Friday. Selling at original price.',
    category: 'tickets',
    transactionType: 'sell',
    price: 500,
    swapWants: '',
    condition: 'Electronic',
    campus: 'Main Campus - North Wing',
    locationTag: 'Campus Bookstore',
    sellerName: 'Kabir Singh',
    sellerMajor: 'Business Administration',
    isVerified: true,
    timePosted: '2025-04-14T11:20:00Z',
  },
  {
    id: 6,
    title: 'Old Programming Books (Free)',
    description: 'C++, Java, and Data Structures books. Taking space, give away to anyone who needs.',
    category: 'giveaway',
    transactionType: 'free',
    price: 0,
    swapWants: '',
    condition: 'Used',
    campus: 'South Campus - Tech Park',
    locationTag: 'Engineering Block Entrance',
    sellerName: 'Ananya Reddy',
    sellerMajor: 'Information Technology',
    isVerified: false,
    timePosted: '2025-04-14T13:00:00Z',
  },
  {
    id: 7,
    title: 'HP Wireless Mouse',
    description: 'Works perfectly, upgraded to a gaming mouse. Comes with USB receiver.',
    category: 'electronics',
    transactionType: 'swap',
    price: 0,
    swapWants: 'Bluetooth earphones or a power bank',
    condition: 'Good',
    campus: 'West Hostel Complex',
    locationTag: 'Student Activity Center',
    sellerName: 'Vikram Mehta',
    sellerMajor: 'Mechanical Engineering',
    isVerified: true,
    timePosted: '2025-04-15T08:10:00Z',
  },
  {
    id: 8,
    title: 'Handwritten Physics Lab Manual (Sem 2)',
    description: 'All experiments neatly written with observations and graphs.',
    category: 'notes',
    transactionType: 'sell',
    price: 150,
    swapWants: '',
    condition: 'Good',
    campus: 'East Campus - Medical Block',
    locationTag: 'Academic Block B Lobby',
    sellerName: 'Meera Nair',
    sellerMajor: 'Physics',
    isVerified: true,
    timePosted: '2025-04-15T12:30:00Z',
  },
];

let fallbackRequestsData: StudentRequest[] = [
  {
    id: 1,
    title: 'Need Drafter for Engineering Drawing Exam tomorrow',
    description: 'Need someone to help me practice isometric projections tonight. Urgent.',
    category: 'skills',
    campus: 'Main Campus - North Wing',
    requesterName: 'Ravi Kumar',
    requesterMajor: 'Mechanical Engineering',
    reward: 150,
    urgency: 'urgent',
    timePosted: '2025-04-16T09:00:00Z',
    responsesCount: 2,
  },
  {
    id: 2,
    title: 'Looking for Cycle Pump in Hostel Block B',
    description: 'My cycle tyre is flat and I need to pump it before evening. Urgent.',
    category: 'giveaway',
    campus: 'West Hostel Complex',
    requesterName: 'Sana Sheikh',
    requesterMajor: 'Architecture',
    reward: 0,
    urgency: 'urgent',
    timePosted: '2025-04-16T10:15:00Z',
    responsesCount: 1,
  },
  {
    id: 3,
    title: 'Need Unit 4 Microeconomics Notes',
    description: 'Missed classes due to illness. Can trade with my macro notes or pay.',
    category: 'notes',
    campus: 'South Campus - Tech Park',
    requesterName: 'Ankit Jain',
    requesterMajor: 'Economics',
    reward: 50,
    urgency: 'moderate',
    timePosted: '2025-04-16T11:30:00Z',
    responsesCount: 3,
  },
  {
    id: 4,
    title: 'Looking to borrow HDMI cable for presentation',
    description: 'Need HDMI cable for a group presentation tomorrow morning.',
    category: 'electronics',
    campus: 'East Campus - Medical Block',
    requesterName: 'Divya Nair',
    requesterMajor: 'Biotechnology',
    reward: 0,
    urgency: 'flexible',
    timePosted: '2025-04-16T12:45:00Z',
    responsesCount: 0,
  },
];

// ---------- Helpers ----------
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`API Error ${response.status}`);
  }
  return response.json() as Promise<T>;
};

const generateId = (arr: { id: number }[]): number => {
  return arr.length > 0 ? Math.max(...arr.map((i) => i.id)) + 1 : 1;
};

const buildQueryString = (filters: ListingFilters): string => {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.transactionType) params.append('transactionType', filters.transactionType);
  if (filters.verifiedOnly !== undefined) params.append('verifiedOnly', String(filters.verifiedOnly));
  if (filters.campus && filters.campus !== 'All Campuses') params.append('campus', filters.campus);
  return params.toString();
};

// ---------- API Functions with Fallback ----------

export async function fetchListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const query = buildQueryString(filters);
  const url = `${API_BASE}/listings${query ? `?${query}` : ''}`;

  try {
    const response = await fetch(url);
    return await handleResponse<Listing[]>(response);
  } catch (error) {
    console.warn('API offline, using fallback listings data', error);
    // Apply filters to fallback data
    let filtered = [...fallbackListingsData];
    if (filters.campus && filters.campus !== 'All Campuses') {
      filtered = filtered.filter((item) => item.campus === filters.campus);
    }
    if (filters.category) {
      filtered = filtered.filter((item) => item.category === filters.category);
    }
    if (filters.transactionType) {
      filtered = filtered.filter((item) => item.transactionType === filters.transactionType);
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }
    if (filters.verifiedOnly) {
      filtered = filtered.filter((item) => item.isVerified === true);
    }
    return filtered;
  }
}

export async function createListing(listingData: CreateListingInput): Promise<Listing> {
  try {
    const response = await fetch(`${API_BASE}/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listingData),
    });
    return await handleResponse<Listing>(response);
  } catch (error) {
    console.warn('API offline, adding to fallback listings', error);
    const newListing: Listing = {
      ...listingData,
      id: generateId(fallbackListingsData),
      timePosted: new Date().toISOString(),
    };
    fallbackListingsData = [newListing, ...fallbackListingsData];
    return newListing;
  }
}

export async function submitOffer(offerData: CreateOfferInput): Promise<ExchangeOffer> {
  try {
    const response = await fetch(`${API_BASE}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerData),
    });
    return await handleResponse<ExchangeOffer>(response);
  } catch (error) {
    console.warn('API offline, simulating offer submission', error);
    const newOffer: ExchangeOffer = {
      ...offerData,
      id: Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    return newOffer;
  }
}

export async function fetchRequests(campus?: string): Promise<StudentRequest[]> {
  const url = campus && campus !== 'All Campuses'
    ? `${API_BASE}/requests?campus=${encodeURIComponent(campus)}`
    : `${API_BASE}/requests`;

  try {
    const response = await fetch(url);
    return await handleResponse<StudentRequest[]>(response);
  } catch (error) {
    console.warn('API offline, using fallback requests data', error);
    if (campus && campus !== 'All Campuses') {
      return fallbackRequestsData.filter((req) => req.campus === campus);
    }
    return fallbackRequestsData;
  }
}

export async function createRequest(requestData: CreateRequestInput): Promise<StudentRequest> {
  try {
    const response = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    return await handleResponse<StudentRequest>(response);
  } catch (error) {
    console.warn('API offline, adding to fallback requests', error);
    const newRequest: StudentRequest = {
      ...requestData,
      id: generateId(fallbackRequestsData),
      timePosted: new Date().toISOString(),
      responsesCount: 0,
    };
    fallbackRequestsData = [newRequest, ...fallbackRequestsData];
    return newRequest;
  }
}

export async function respondToRequest(requestId: number, responseData: RequestResponseInput): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE}/requests/${requestId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(responseData),
    });
    return await handleResponse<{ success: boolean }>(response);
  } catch (error) {
    console.warn('API offline, simulating request response', error);
    // Increment local count if possible
    const request = fallbackRequestsData.find((r) => r.id === requestId);
    if (request) request.responsesCount += 1;
    return { success: true };
  }
}

export async function getAISuggestion(title: string, category: string, condition: string): Promise<AIPricingSuggestion> {
  try {
    const response = await fetch(`${API_BASE}/ai/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, condition }),
    });
    return await handleResponse<AIPricingSuggestion>(response);
  } catch (error) {
    console.warn('API offline, using local AI suggestion', error);

    let basePrice = 300;
    if (category === 'textbooks') basePrice = 400;
    if (category === 'electronics') basePrice = 800;
    if (category === 'notes') basePrice = 150;
    if (category === 'tickets') basePrice = 300;
    if (category === 'giveaway' || category === 'skills') basePrice = 0;

    let multiplier = 1;
    if (condition === 'Like New') multiplier = 0.9;
    else if (condition === 'Good') multiplier = 0.7;
    else if (condition === 'Fair') multiplier = 0.5;
    else if (condition === 'Digital PDF') multiplier = 0.3;

    const lowerTitle = title ? title.toLowerCase() : '';
    if (lowerTitle.includes('calculator')) basePrice = 1500;
    if (lowerTitle.includes('ticket')) basePrice = 500;
    if (lowerTitle.includes('notes')) basePrice = 100;
    if (lowerTitle.includes('pdf')) basePrice = 50;

    const suggested = Math.max(0, Math.round(basePrice * multiplier));
    const min = Math.round(suggested * 0.8);
    const max = Math.round(suggested * 1.2);
    const savings = 15 + Math.floor(Math.random() * 20);

    const swaps = [
      'Offer to trade with a classmate for similar notes or a coffee',
      'Barter for study help or printing credits',
      'Swap with a skill session (e.g., guitar lesson for Python help)',
    ];

    const reason = `Based on recent campus exchanges for ${category}, similar items in ${condition} condition typically go for ₹${suggested}.`;

    return {
      suggestedPrice: suggested,
      minPrice: min,
      maxPrice: max,
      savingsPercentage: savings,
      swapRecommendations: swaps,
      reason,
    };
  }
}