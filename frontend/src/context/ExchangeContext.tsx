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
  selectedListingForModal: Listing | null;
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
  openItemModal: (listing: Listing) => void;
  closeItemModal: () => void;
  loginWithCollegeEmail: (email: string, name: string, major: string, campus: string, dorm: string) => void;
  logout: () => void;
  addNewListing: (listing: any) => Promise<void>;
  addNewRequest: (req: any) => Promise<void>;
  sendOffer: (offer: any) => Promise<void>;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

export function ExchangeProvider({ children }: { children: React.ReactNode }) {
  const [allListings, setAllListings] = useState<Listing[]>(defaultListings);
  const [requests, setRequests] = useState<StudentRequest[]>(defaultRequests);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = localStorage.getItem('theme') === 'dark';
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
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
  const [selectedListingForModal, setSelectedListingForModal] = useState<Listing | null>(null);

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

  const addNewListing = async (data: any) => {
    const newListing: Listing = {
      ...data,
      id: Date.now(),
      campus: data.campus || (selectedCampus !== 'All Campuses' ? selectedCampus : 'Main Campus - North Wing'),
      isVerified: true,
      timePosted: new Date().toISOString()
    };
    setAllListings((prev) => [newListing, ...prev]);
  };

  const addNewRequest = async (data: any) => {
    const newReq: StudentRequest = {
      ...data,
      id: Date.now(),
      timePosted: new Date().toISOString()
    };
    setRequests((prev) => [newReq, ...prev]);
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
        selectedListingForModal,
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
        openItemModal: (item) => setSelectedListingForModal(item),
        closeItemModal: () => setSelectedListingForModal(null),
        loginWithCollegeEmail,
        logout,
        addNewListing,
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