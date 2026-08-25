// frontend/src/services/api.ts

import {
  Listing,
  ExchangeOffer,
  SafeLocation,
  ListingFilters,
  CreateListingInput,
  CreateOfferInput,
  StudentRequest,
  AIPricingSuggestion,
  RequestResponseInput,
  CreateRequestInput,
} from '@/types';

const API_BASE = 'http://localhost:5000/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody}`);
  }
  return response.json() as Promise<T>;
}

function buildQueryString(filters: ListingFilters): string {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('search', filters.search);
  if (filters.transactionType) params.append('transactionType', filters.transactionType);
  if (filters.verifiedOnly !== undefined) params.append('verifiedOnly', String(filters.verifiedOnly));
  if (filters.campus) params.append('campus', filters.campus);
  return params.toString();
}

// Listings
export async function fetchListings(filters: ListingFilters = {}): Promise<Listing[]> {
  const query = buildQueryString(filters);
  const url = `${API_BASE}/listings${query ? `?${query}` : ''}`;
  const response = await fetch(url);
  return handleResponse<Listing[]>(response);
}

export async function fetchListingById(id: number): Promise<Listing> {
  const response = await fetch(`${API_BASE}/listings/${id}`);
  return handleResponse<Listing>(response);
}

export async function createListing(listingData: CreateListingInput): Promise<Listing> {
  const response = await fetch(`${API_BASE}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listingData),
  });
  return handleResponse<Listing>(response);
}

export async function submitOffer(offerData: CreateOfferInput): Promise<ExchangeOffer> {
  const response = await fetch(`${API_BASE}/offers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(offerData),
  });
  return handleResponse<ExchangeOffer>(response);
}

export async function fetchSafeLocations(): Promise<SafeLocation[]> {
  const response = await fetch(`${API_BASE}/locations`);
  return handleResponse<SafeLocation[]>(response);
}

// Requests
export async function fetchRequests(campus?: string): Promise<StudentRequest[]> {
  let url = `${API_BASE}/requests`;
  if (campus && campus !== 'All Campuses') {
    url += `?campus=${encodeURIComponent(campus)}`;
  }
  const response = await fetch(url);
  return handleResponse<StudentRequest[]>(response);
}

export async function createRequest(requestData: CreateRequestInput): Promise<StudentRequest> {
  const response = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData),
  });
  return handleResponse<StudentRequest>(response);
}

export async function respondToRequest(requestId: number, responseData: RequestResponseInput): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/requests/${requestId}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(responseData),
  });
  return handleResponse<{ success: boolean }>(response);
}

export async function getAISuggestion(title: string, category: string, condition: string): Promise<AIPricingSuggestion> {
  const response = await fetch(`${API_BASE}/ai/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, category, condition }),
  });
  return handleResponse<AIPricingSuggestion>(response);
}