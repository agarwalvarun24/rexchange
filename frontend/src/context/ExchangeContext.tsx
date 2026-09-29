'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing, StudentRequest } from '../types';

export const CAMPUSES = [
  'All Campuses',
  'Main Campus - North Wing',
  'South Campus - Tech Park',
  'East Campus - Medical Block',
  'West Hostel Complex'
];

export const CATEGORIES = [
  'All',
  'Textbooks',
  'Electronics',
  'Notes',
  'Skills',
  'Tickets',
  'Free Giveaways'
];

const defaultListings: Listing[] = [
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
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
    sellerName: 'Meera Nair',
    sellerMajor: 'Physics',
    isVerified: true,
    timePosted: '2025-04-15T12:30:00Z'
  }
];

const defaultRequests: StudentRequest[] = [
  {
    id: 1,
    title: 'Need Drafter for Engineering Drawing Exam tomorrow',
    description: 'Exam at 9 AM, urgently need a mini drafter in good condition.',
    category: 'electronics',
    campus: 'South Campus - Tech Park',
    requesterName: 'Aman Verma',
    requesterMajor: 'Mechanical Engineering',
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
    requesterMajor: 'Computer Science',
    reward: 'Coffee / Snack',
    urgency: 'urgent',
    timePosted: '2025-04-15T15:30:00Z'
  }
];

export interface User {
  name: string;
  email: string;
  major: string;
  campus: string;
  dorm: string;
  isVerified: boolean;
}

interface ExchangeContextType {
  listings: Listing[];
  requests: StudentRequest[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
  transactionFilter: string;
  verifiedOnly: boolean;
  selectedCampus: string;
  activeTab: 'marketplace' | 'requests';
  currentUser: User | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isCreateModalOpen: boolean;
  isCreateRequestModalOpen: boolean;
  isAuthModalOpen: boolean;
  isEditModalOpen: boolean;
  selectedListingForModal: Listing | null;
  selectedListingForEdit: Listing | null;
  setSelectedCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  setTransactionFilter: (filter: string) => void;
  setVerifiedOnly: (val: boolean) => void;
  setSelectedCampus: (campus: string) => void;
  setActiveTab: (tab: 'marketplace' | 'requests') => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openCreateRequestModal: () => void;
  closeCreateRequestModal: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openEditModal: (listing: Listing) => void;
  closeEditModal: () => void;
  openItemModal: (listing: Listing) => void;
  closeItemModal: () => void;
  loginWithCollegeEmail: (email: string, name: string, major: string, campus: string, dorm: string) => void;
  logout: () => void;
  addNewListing: (listing: any) => Promise<void>;
  editListing: (listing: Listing) => Promise<void>;
  deleteListing: (id: number) => Promise<void>;
  addNewRequest: (req: any) => Promise<void>;
  sendOffer: (offer: any) => Promise<void>;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

export function ExchangeProvider({ children }: { children: React.ReactNode }) {
  const [allListings, setAllListings] = useState<Listing[]>(defaultListings);
  const [requests, setRequests] = useState<StudentRequest[]>(defaultRequests);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [darkMode, setDarkMode] = useState(false);

  // Sync with LocalStorage on client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('theme') === 'dark';
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      const savedListings = localStorage.getItem('rexchange_listings');
      if (savedListings) {
        try {
          setAllListings(JSON.parse(savedListings));
        } catch (_) {}
      }

      const savedRequests = localStorage.getItem('rexchange_requests');
      if (savedRequests) {
        try {
          setRequests(JSON.parse(savedRequests));
        } catch (_) {}
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', next ? 'dark' : 'light');
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return next;
    });
  };

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('All Campuses');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'requests'>('marketplace');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedListingForModal, setSelectedListingForModal] = useState<Listing | null>(null);
  const [selectedListingForEdit, setSelectedListingForEdit] = useState<Listing | null>(null);

  const filteredListings = allListings.filter((item) => {
    if (selectedCampus !== 'All Campuses' && item.campus && item.campus !== selectedCampus) {
      return false;
    }
    if (selectedCategory !== 'All' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (transactionFilter !== 'all' && item.transactionType !== transactionFilter) {
      return false;
    }
    if (verifiedOnly && !item.isVerified) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  // Create Listing
  const addNewListing = async (data: any) => {
    const newListing: Listing = {
      ...data,
      id: Date.now(),
      campus: data.campus || (selectedCampus !== 'All Campuses' ? selectedCampus : 'Main Campus - North Wing'),
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      isVerified: true,
      timePosted: new Date().toISOString()
    };
    setAllListings((prev) => {
      const updated = [newListing, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('rexchange_listings', JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Edit Listing (CRUD Update)
  const editListing = async (updatedListing: Listing) => {
    setAllListings((prev) => {
      const updated = prev.map((item) => (item.id === updatedListing.id ? updatedListing : item));
      if (typeof window !== 'undefined') {
        localStorage.setItem('rexchange_listings', JSON.stringify(updated));
      }
      return updated;
    });
    if (selectedListingForModal?.id === updatedListing.id) {
      setSelectedListingForModal(updatedListing);
    }
    setIsEditModalOpen(false);
  };

  // Delete Listing (CRUD Delete)
  const deleteListing = async (id: number) => {
    setAllListings((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('rexchange_listings', JSON.stringify(updated));
      }
      return updated;
    });
    if (selectedListingForModal?.id === id) {
      setSelectedListingForModal(null);
    }
  };

  // Add Request
  const addNewRequest = async (data: any) => {
    const newReq: StudentRequest = {
      ...data,
      id: Date.now(),
      timePosted: new Date().toISOString()
    };
    setRequests((prev) => {
      const updated = [newReq, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('rexchange_requests', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const sendOffer = async (offerData: any) => {
    console.log('Offer submitted:', offerData);
  };

  const loginWithCollegeEmail = (email: string, name: string, major: string, campus: string, dorm: string) => {
    setCurrentUser({ email, name, major, campus, dorm, isVerified: true });
  };

  const logout = () => setCurrentUser(null);

  return (
    <ExchangeContext.Provider
      value={{
        listings: filteredListings,
        requests,
        isLoading: false,
        error: null,
        selectedCategory,
        searchQuery,
        transactionFilter,
        verifiedOnly,
        selectedCampus,
        activeTab,
        currentUser,
        darkMode,
        toggleDarkMode,
        isCreateModalOpen,
        isCreateRequestModalOpen,
        isAuthModalOpen,
        isEditModalOpen,
        selectedListingForModal,
        selectedListingForEdit,
        setSelectedCategory,
        setSearchQuery,
        setTransactionFilter,
        setVerifiedOnly,
        setSelectedCampus,
        setActiveTab,
        openCreateModal: () => setIsCreateModalOpen(true),
        closeCreateModal: () => setIsCreateModalOpen(false),
        openCreateRequestModal: () => setIsCreateRequestModalOpen(true),
        closeCreateRequestModal: () => setIsCreateRequestModalOpen(false),
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        openEditModal: (item) => {
          setSelectedListingForEdit(item);
          setIsEditModalOpen(true);
        },
        closeEditModal: () => {
          setSelectedListingForEdit(null);
          setIsEditModalOpen(false);
        },
        openItemModal: (item) => setSelectedListingForModal(item),
        closeItemModal: () => setSelectedListingForModal(null),
        loginWithCollegeEmail,
        logout,
        addNewListing,
        editListing,
        deleteListing,
        addNewRequest,
        sendOffer
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
}

export function useExchange() {
  const context = useContext(ExchangeContext);
  if (!context) throw new Error('useExchange must be used within ExchangeProvider');
  return context;
}