// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ------------------- In-Memory Data -------------------

// Safe Campus Meetup Locations
const safeLocations = [
  'Central Library Foyer',
  'Student Activity Center',
  'Main Canteen',
  'Engineering Block Entrance',
  'Sports Complex Reception',
  'Campus Bookstore',
  'Hostel A Common Room',
  'Academic Block B Lobby'
];

// Campus zones
const campusZones = [
  'Main Campus - North Wing',
  'South Campus - Tech Park',
  'East Campus - Medical Block',
  'West Hostel Complex'
];

// Listings (same as previous with campus and INR prices)
let listings = [
  {
    id: 1,
    title: 'Calculus Early Transcendentals 8th Edition',
    description: 'Used but in great condition, no markings. Perfect for Math 101/102.',
    category: 'textbooks',
    transactionType: 'sell',
    price: 450,
    swapWants: '',
    condition: 'Good',
    locationTag: 'Central Library Foyer',
    campus: 'Main Campus - North Wing',
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
    locationTag: 'Student Activity Center',
    campus: 'South Campus - Tech Park',
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
    locationTag: 'Main Canteen',
    campus: 'East Campus - Medical Block',
    sellerName: 'Rohan Gupta',
    sellerMajor: 'Chemistry',
    isVerified: false,
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
    locationTag: 'Hostel A Common Room',
    campus: 'West Hostel Complex',
    sellerName: 'Sneha Iyer',
    sellerMajor: 'Music',
    isVerified: true,
    timePosted: '2025-04-13T16:45:00Z'
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
    locationTag: 'Campus Bookstore',
    campus: 'Main Campus - North Wing',
    sellerName: 'Kabir Singh',
    sellerMajor: 'Business Administration',
    isVerified: true,
    timePosted: '2025-04-14T11:20:00Z'
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
    locationTag: 'Engineering Block Entrance',
    campus: 'South Campus - Tech Park',
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
    locationTag: 'Student Activity Center',
    campus: 'West Hostel Complex',
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
    locationTag: 'Academic Block B Lobby',
    campus: 'East Campus - Medical Block',
    sellerName: 'Meera Nair',
    sellerMajor: 'Physics',
    isVerified: true,
    timePosted: '2025-04-15T12:30:00Z'
  }
];

// Offers storage
let offers = [];

// ------------------- New: Student Requests (ISO Board) -------------------
let requests = [
  {
    id: 1,
    title: 'Need Drafter for Engineering Drawing Exam tomorrow',
    description: 'Need someone to help me practice isometric projections tonight. Urgent.',
    category: 'skills',
    campus: 'Main Campus - North Wing',
    requesterName: 'Ravi Kumar',
    requesterMajor: 'Mechanical Engineering',
    reward: 150, // ₹
    urgency: 'urgent',
    timePosted: '2025-04-16T09:00:00Z',
    responsesCount: 2
  },
  {
    id: 2,
    title: 'Looking for Cycle Pump in Hostel Block B',
    description: 'My cycle tyre is flat and I need to pump it before evening. Urgent.',
    category: 'giveaway', // or misc? We'll use 'electronics' as category for now? Better add general.
    campus: 'West Hostel Complex',
    requesterName: 'Sana Sheikh',
    requesterMajor: 'Architecture',
    reward: 0, // can be trade
    urgency: 'urgent',
    timePosted: '2025-04-16T10:15:00Z',
    responsesCount: 1
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
    responsesCount: 3
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
    responsesCount: 0
  }
];

// ------------------- Helper Functions -------------------

const generateId = (arr) => {
  return arr.length > 0 ? Math.max(...arr.map(item => item.id)) + 1 : 1;
};

// AI Suggestion logic (simple heuristic)
function getAISuggestion(title, category, condition) {
  // Base price by category (in ₹)
  const categoryBase = {
    textbooks: 400,
    electronics: 800,
    notes: 150,
    skills: 0,
    tickets: 300,
    giveaway: 0,
  };
  let base = categoryBase[category] || 200;
  let conditionMultiplier = 1;
  if (condition === 'Like New') conditionMultiplier = 0.9;
  else if (condition === 'Good') conditionMultiplier = 0.7;
  else if (condition === 'Fair') conditionMultiplier = 0.5;
  else if (condition === 'Digital PDF') conditionMultiplier = 0.3;
  // Adjust based on title keywords
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('calculator')) base = 1500;
  if (lowerTitle.includes('ticket')) base = 500;
  if (lowerTitle.includes('notes')) base = 100;
  if (lowerTitle.includes('pdf')) base = 50;
  const suggested = Math.round(base * conditionMultiplier);
  const min = Math.round(suggested * 0.8);
  const max = Math.round(suggested * 1.2);
  const savingsPercentage = 15 + Math.floor(Math.random() * 20); // 15-34%
  const swapRecommendations = [
    'Offer to trade with a classmate for similar notes or a coffee',
    'Barter for study help or printing credits',
    'Swap with a skill session (e.g., guitar lesson for Python help)'
  ];
  const reason = `Based on recent campus exchanges for ${category}, similar items in ${condition} condition typically go for ₹${min}-₹${max}.`;
  return {
    suggestedPrice: suggested,
    minPrice: min,
    maxPrice: max,
    savingsPercentage,
    swapRecommendations,
    reason
  };
}

// ------------------- API Endpoints -------------------

// GET /api/listings
app.get('/api/listings', (req, res) => {
  const { category, search, transactionType, verifiedOnly, campus } = req.query;
  let filtered = [...listings];

  if (campus && campus !== 'All Campuses') {
    filtered = filtered.filter(item => item.campus === campus);
  }
  if (category) {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }
  if (transactionType) {
    filtered = filtered.filter(item => item.transactionType.toLowerCase() === transactionType.toLowerCase());
  }
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  }
  if (verifiedOnly === 'true') {
    filtered = filtered.filter(item => item.isVerified === true);
  }

  res.json(filtered);
});

// GET /api/listings/:id
app.get('/api/listings/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const listing = listings.find(item => item.id === id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  res.json(listing);
});

// POST /api/listings
app.post('/api/listings', (req, res) => {
  const {
    title, description, category, transactionType, price, swapWants,
    condition, locationTag, campus, sellerName, sellerMajor, isVerified
  } = req.body;

  if (!title || !description || !category || !transactionType || !locationTag || !campus || !sellerName || !sellerMajor) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const validCategories = ['textbooks', 'electronics', 'notes', 'skills', 'tickets', 'giveaway'];
  if (!validCategories.includes(category)) return res.status(400).json({ error: 'Invalid category' });
  const validTransactionTypes = ['sell', 'swap', 'free', 'skill_trade'];
  if (!validTransactionTypes.includes(transactionType)) return res.status(400).json({ error: 'Invalid transaction type' });

  const newListing = {
    id: generateId(listings),
    title,
    description,
    category,
    transactionType,
    price: price !== undefined ? price : 0,
    swapWants: swapWants || '',
    condition: condition || 'N/A',
    locationTag,
    campus,
    sellerName,
    sellerMajor,
    isVerified: isVerified !== undefined ? isVerified : false,
    timePosted: new Date().toISOString()
  };
  listings.push(newListing);
  res.status(201).json(newListing);
});

// Offers endpoints
app.get('/api/offers', (req, res) => res.json(offers));

app.post('/api/offers', (req, res) => {
  const { listingId, fromName, contact, offerDetails } = req.body;
  if (!listingId || !fromName || !contact || !offerDetails) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const listingExists = listings.some(item => item.id === parseInt(listingId));
  if (!listingExists) return res.status(404).json({ error: 'Listing not found' });
  const newOffer = {
    id: generateId(offers),
    listingId: parseInt(listingId),
    fromName,
    contact,
    offerDetails,
    createdAt: new Date().toISOString()
  };
  offers.push(newOffer);
  res.status(201).json(newOffer);
});

// Locations endpoint
app.get('/api/locations', (req, res) => res.json(safeLocations));

// ------------------- New: Requests Endpoints -------------------

// GET /api/requests (with optional campus filter)
app.get('/api/requests', (req, res) => {
  const { campus } = req.query;
  let filtered = [...requests];
  if (campus && campus !== 'All Campuses') {
    filtered = filtered.filter(item => item.campus === campus);
  }
  res.json(filtered);
});

// POST /api/requests
app.post('/api/requests', (req, res) => {
  const { title, description, category, campus, requesterName, requesterMajor, reward, urgency } = req.body;
  if (!title || !description || !category || !campus || !requesterName || !requesterMajor || !urgency) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newRequest = {
    id: generateId(requests),
    title,
    description,
    category,
    campus,
    requesterName,
    requesterMajor,
    reward: reward || 0,
    urgency,
    timePosted: new Date().toISOString(),
    responsesCount: 0
  };
  requests.push(newRequest);
  res.status(201).json(newRequest);
});

// POST /api/requests/:id/respond
app.post('/api/requests/:id/respond', (req, res) => {
  const id = parseInt(req.params.id);
  const request = requests.find(item => item.id === id);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  const { fromName, contact, message } = req.body;
  if (!fromName || !contact) {
    return res.status(400).json({ error: 'Missing fromName or contact' });
  }
  // In prototype, we just increment responsesCount and return success
  request.responsesCount = (request.responsesCount || 0) + 1;
  res.json({ success: true, message: 'Response recorded', request });
});

// POST /api/ai/suggest
app.post('/api/ai/suggest', (req, res) => {
  const { title, category, condition } = req.body;
  if (!title || !category || !condition) {
    return res.status(400).json({ error: 'Missing title, category, or condition' });
  }
  const suggestion = getAISuggestion(title, category, condition);
  res.json(suggestion);
});

// ------------------- Start Server -------------------
app.listen(PORT, () => {
  console.log(`RExchange API server running on http://localhost:${PORT}`);
});