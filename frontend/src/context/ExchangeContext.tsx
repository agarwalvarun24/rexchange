// frontend/src/context/ExchangeContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  Listing,
  ExchangeOffer,
  ListingFilters,
  CreateListingInput,
  CreateOfferInput,
  StudentRequest,
  CreateRequestInput,
  RequestResponseInput,
} from '../types';
import {
  fetchListings,
  createListing,
  submitOffer,
  fetchRequests,
  createRequest,
  respondToRequest,
} from '../services/api';

export interface User {
  name: string;
  email: string;
  major: string;
  campus: string;
  dorm: string;
  isVerified: boolean;
  trustScore: number;
}

interface ExchangeContextType {
  listings: Listing[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  transactionFilter: string | null;
  setTransactionFilter: (type: string | null) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (verified: boolean) => void;
  isCreateModalOpen: boolean;
  selectedListingForModal: Listing | null;
  selectedCampus: string;
  setSelectedCampus: (campus: string) => void;
  currentUser: User | null;
  isAuthModalOpen: boolean;
  // Requests
  requests: StudentRequest[];
  activeTab: 'marketplace' | 'requests';
  setActiveTab: (tab: 'marketplace' | 'requests') => void;
  isCreateRequestModalOpen: boolean;
  openCreateRequestModal: () => void;
  closeCreateRequestModal: () => void;
  addNewRequest: (requestData: CreateRequestInput) => Promise<void>;
  sendRequestResponse: (requestId: number, responseData: RequestResponseInput) => Promise<void>;
  refreshRequests: () => Promise<void>;
  // Original functions
  refreshListings: () => Promise<void>;
  addNewListing: (listingData: CreateListingInput) => Promise<void>;
  sendOffer: (offerData: CreateOfferInput) => Promise<void>;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openItemModal: (listing: Listing) => void;
  closeItemModal: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithCollegeEmail: (email: string, name: string, major: string, campus: string, dorm: string) => void;
  logout: () => void;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

export const CAMPUSES = [
  'All Campuses',
  'Main Campus - North Wing',
  'South Campus - Tech Park',
  'East Campus - Medical Block',
  'West Hostel Complex',
];

export function ExchangeProvider({ children }: { children: React.ReactNode }) {
  // Existing state
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [transactionFilter, setTransactionFilter] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [selectedListingForModal, setSelectedListingForModal] = useState<Listing | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<string>(CAMPUSES[0]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // New state for requests
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'requests'>('marketplace');
  const [isCreateRequestModalOpen, setIsCreateRequestModalOpen] = useState<boolean>(false);

  // Refresh listings (as before, includes campus)
  const refreshListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: ListingFilters = {};
      if (selectedCategory) filters.category = selectedCategory as ListingFilters['category'];
      if (searchQuery.trim()) filters.search = searchQuery.trim();
      if (transactionFilter) filters.transactionType = transactionFilter as ListingFilters['transactionType'];
      if (verifiedOnly) filters.verifiedOnly = true;
      if (selectedCampus !== 'All Campuses') filters.campus = selectedCampus;
      const data = await fetchListings(filters);
      setListings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch listings');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, transactionFilter, verifiedOnly, selectedCampus]);

  // Refresh requests
  const refreshRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRequests(selectedCampus);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch requests');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCampus]);

  // Load appropriate data when tab or campus changes
  useEffect(() => {
    if (activeTab === 'marketplace') {
      refreshListings();
    } else {
      refreshRequests();
    }
  }, [activeTab, refreshListings, refreshRequests]);

  const addNewListing = useCallback(async (listingData: CreateListingInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await createListing(listingData);
      await refreshListings();
      closeCreateModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshListings]);

  const sendOffer = useCallback(async (offerData: CreateOfferInput) => {
    setError(null);
    try {
      await submitOffer(offerData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit offer');
      throw err;
    }
  }, []);

  const openCreateModal = useCallback(() => setIsCreateModalOpen(true), []);
  const closeCreateModal = useCallback(() => setIsCreateModalOpen(false), []);
  const openItemModal = useCallback((listing: Listing) => setSelectedListingForModal(listing), []);
  const closeItemModal = useCallback(() => setSelectedListingForModal(null), []);

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), []);

  const loginWithCollegeEmail = useCallback((email: string, name: string, major: string, campus: string, dorm: string) => {
    const newUser: User = {
      name,
      email,
      major,
      campus,
      dorm,
      isVerified: true,
      trustScore: 100,
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // Request functions
  const openCreateRequestModal = useCallback(() => setIsCreateRequestModalOpen(true), []);
  const closeCreateRequestModal = useCallback(() => setIsCreateRequestModalOpen(false), []);

  const addNewRequest = useCallback(async (requestData: CreateRequestInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await createRequest(requestData);
      await refreshRequests();
      closeCreateRequestModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create request');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [refreshRequests]);

  const sendRequestResponse = useCallback(async (requestId: number, responseData: RequestResponseInput) => {
    setError(null);
    try {
      await respondToRequest(requestId, responseData);
      await refreshRequests(); // update count
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send response');
      throw err;
    }
  }, [refreshRequests]);

  const value = useMemo(() => ({
    listings,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    transactionFilter,
    setTransactionFilter,
    verifiedOnly,
    setVerifiedOnly,
    isCreateModalOpen,
    selectedListingForModal,
    selectedCampus,
    setSelectedCampus,
    currentUser,
    isAuthModalOpen,
    requests,
    activeTab,
    setActiveTab,
    isCreateRequestModalOpen,
    openCreateRequestModal,
    closeCreateRequestModal,
    addNewRequest,
    sendRequestResponse,
    refreshRequests,
    refreshListings,
    addNewListing,
    sendOffer,
    openCreateModal,
    closeCreateModal,
    openItemModal,
    closeItemModal,
    openAuthModal,
    closeAuthModal,
    loginWithCollegeEmail,
    logout,
  }), [
    listings,
    isLoading,
    error,
    selectedCategory,
    searchQuery,
    transactionFilter,
    verifiedOnly,
    isCreateModalOpen,
    selectedListingForModal,
    selectedCampus,
    currentUser,
    isAuthModalOpen,
    requests,
    activeTab,
    isCreateRequestModalOpen,
    refreshListings,
    refreshRequests,
    addNewListing,
    sendOffer,
    openCreateModal,
    closeCreateModal,
    openItemModal,
    closeItemModal,
    openAuthModal,
    closeAuthModal,
    loginWithCollegeEmail,
    logout,
    addNewRequest,
    sendRequestResponse,
    openCreateRequestModal,
    closeCreateRequestModal,
    setActiveTab,
  ]);

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  );
}

export function useExchange() {
  const context = useContext(ExchangeContext);
  if (context === undefined) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
}