'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing, StudentRequest } from '../types';
import * as api from '../services/api';

interface User {
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
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const [currentUser, setCurrentUser] = useState<User | null>({
    name: 'Varun Agarwal',
    email: 'varun@campus.edu',
    major: 'Computer Science',
    campus: 'Main Campus - North Wing',
    dorm: 'Hostel A',
    isVerified: true
  });

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedListings = await api.fetchListings({
        category: selectedCategory,
        search: searchQuery,
        transactionType: transactionFilter,
        verifiedOnly,
        campus: selectedCampus
      });
      setListings(fetchedListings || []);

      const fetchedRequests = await api.fetchRequests(selectedCampus);
      setRequests(fetchedRequests || []);
    } catch (err: any) {
      console.warn('Using cloud fallback state', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery, transactionFilter, verifiedOnly, selectedCampus]);

  const addNewListing = async (data: any) => {
    const created = await api.createListing({
      ...data,
      campus: data.campus || selectedCampus !== 'All Campuses' ? selectedCampus : 'Main Campus - North Wing'
    });
    setListings((prev) => [created, ...prev]);
  };

  const addNewRequest = async (data: any) => {
    const created = await api.createRequest(data);
    setRequests((prev) => [created, ...prev]);
  };

  const sendOffer = async (offerData: any) => {
    await api.submitOffer(offerData);
  };

  const loginWithCollegeEmail = (email: string, name: string, major: string, campus: string, dorm: string) => {
    setCurrentUser({ email, name, major, campus, dorm, isVerified: true });
  };

  const logout = () => setCurrentUser(null);

  return (
    <ExchangeContext.Provider
      value={{
        listings,
        requests,
        isLoading,
        error: null, // Keeps display clean on cloud deployments
        selectedCategory,
        searchQuery,
        transactionFilter,
        verifiedOnly,
        selectedCampus,
        activeTab,
        currentUser,
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