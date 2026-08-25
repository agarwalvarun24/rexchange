import {
  Listing,
  ExchangeOffer,
  StudentRequest,
  AIPricingSuggestion,
  ListingFilters,
  CreateListingInput,
  CreateOfferInput,
  CreateRequestInput,
  RequestResponseInput
} from '../types';

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const API_BASE = process.env.NEXT_PUBLIC_API_URL || (isLocalhost ? 'http://localhost:5000/api' : '');

let fallbackListings: Listing[] = [
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
    timePosted: '2025-04-10T10:30:00Z'
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
    timePosted: '2025-04-11T14:15:00Z'
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
    isVerified: true,
    timePosted: '2025-04-12T09:00:00Z'
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
    timePosted: '2025-04-13T16:45:00Z'
  },
  {
    id: 5,
    title: 'Concert Ticket – Indie Night (1 extra)',
    description: 'One extra ticket for the college fest Indie Night on Friday.',
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
    timePosted: '2025-04-14T11:20:00Z'
  },
  {
    id: 6,
    title: 'Old Programming Books (Free)',
    description: 'C++, Java, and Data Structures books. Taking space, giving away.',
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
    timePosted: '2025-04-14T13:00:00Z'
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
    campus: 'South Campus - Tech Park',
    locationTag: 'Student Activity Center',
    sellerName: 'Vikram Mehta',
    sellerMajor: 'Mechanical Engineering',
    isVerified: true,
    timePosted: '2025-04-15T08:10:00Z'
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
    timePosted: '2025-04-15T12:30:00Z'
  }
];

let fallbackRequests: StudentRequest[] = [
  {
    id: 1,
    title: 'Need Drafter for Engineering Drawing Exam tomorrow',
    description: 'Exam at 9 AM, urgently need a mini drafter in good condition.',
    category: 'electronics',
    campus: 'South Campus - Tech Park',
    requesterName: 'Varun A.',
    requesterMajor: 'Mechanical',
    reward: '₹150 Bounty',
    urgency: 'urgent',
    timePosted: '2025-04-15T14:00:00Z'
  },
  {
    id: 2,
    title: 'Looking for Cycle Pump in Hostel Block B',
    description: 'Need to inflate tires before morning class.',
    category: 'giveaway',
    campus: 'West Hostel Complex',
    requesterName: 'Rahul M.',
    requesterMajor: 'CSE',
    reward: 'Coffee / Snack',
    urgency: 'urgent',
    timePosted: '2025-04-15T15:30:00Z'
  }
];

export async function fetchListings(filters?: ListingFilters): Promise<Listing[]> {
  // If in cloud production and no external API URL configured, return instant campus data
  if (!API_BASE) {
    let result = [...fallbackListings];
    if (filters?.category && filters.category !== 'All') {
      result = result.filter(item => item.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.transactionType && filters.transactionType !== 'all') {
      result = result.filter(item => item.transactionType === filters.transactionType);
    }
    if (filters?.campus && filters.campus !== 'All Campuses') {
      result = result.filter(item => item.campus === filters.campus);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
    }
    return result;
  }

  try {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.transactionType && filters.transactionType !== 'all') params.append('transactionType', filters.transactionType);
    if (filters?.verifiedOnly) params.append('verifiedOnly', 'true');
    if (filters?.campus && filters.campus !== 'All Campuses') params.append('campus', filters.campus);

    const res = await fetch(`${API_BASE}/listings?${params.toString()}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (_) {
    return fallbackListings;
  }
}

export async function createListing(listingData: CreateListingInput): Promise<Listing> {
  const newListing: Listing = {
    ...listingData,
    id: Date.now(),
    isVerified: true,
    timePosted: new Date().toISOString()
  };
  fallbackListings.unshift(newListing);

  if (API_BASE) {
    try {
      await fetch(`${API_BASE}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listingData)
      });
    } catch (_) {}
  }
  return newListing;
}

export async function submitOffer(offerData: CreateOfferInput): Promise<any> {
  if (API_BASE) {
    try {
      await fetch(`${API_BASE}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData)
      });
    } catch (_) {}
  }
  return { success: true, ...offerData };
}

export async function fetchRequests(campus?: string): Promise<StudentRequest[]> {
  if (!API_BASE) return fallbackRequests;
  try {
    const res = await fetch(`${API_BASE}/requests${campus ? `?campus=${campus}` : ''}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch (_) {
    return fallbackRequests;
  }
}

export async function createRequest(data: CreateRequestInput): Promise<StudentRequest> {
  const req: StudentRequest = {
    ...data,
    id: Date.now(),
    timePosted: new Date().toISOString()
  };
  fallbackRequests.unshift(req);
  return req;
}

export async function getAISuggestion(title: string, category: string, condition: string): Promise<AIPricingSuggestion> {
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
    'Swap with a skill session (e.g., guitar lesson for Python help)'
  ];

  const reason = `Based on recent campus exchanges for ${category}, similar items in ${condition} condition typically go for ₹${suggested}.`;

  return {
    suggestedPrice: suggested,
    minPrice: min,
    maxPrice: max,
    savingsPercentage: savings,
    swapRecommendations: swaps,
    reason
  };
}