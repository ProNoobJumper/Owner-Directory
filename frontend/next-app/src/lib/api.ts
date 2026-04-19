import { Owner } from '../types/owner';

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    const raw = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const base = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
    return base.replace(/\/$/, '') + '/api';
  }
  return '/api';
};

export const api = {
  async getOwners(page: number = 0, size: number = 10): Promise<PageResponse<Owner>> {
    const response = await fetch(`${getApiBaseUrl()}/owners?page=${page}&size=${size}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch owners');
    return response.json();
  },

  async searchOwners(
    query: string = '',
    category: string = '',
    page: number = 0,
    size: number = 10
  ): Promise<PageResponse<Owner>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (query) params.append('query', query);
    if (category && category !== 'all') params.append('category', category);

    const response = await fetch(`${getApiBaseUrl()}/owners/search?${params.toString()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to search owners');
    return response.json();
  },

  async getOwnerById(id: string): Promise<Owner> {
    const response = await fetch(`${getApiBaseUrl()}/owners/${id}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch owner');
    return response.json();
  },

  async getOwnerBySlug(slug: string): Promise<Owner> {
    const response = await fetch(`${getApiBaseUrl()}/owners/slug/${slug}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch owner by slug');
    return response.json();
  },

  async createOwner(data: Partial<Owner>): Promise<Owner> {
    const response = await fetch(`${getApiBaseUrl()}/owners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create owner');
    return response.json();
  },

  async updateOwner(id: string, data: Partial<Owner>): Promise<Owner> {
    const response = await fetch(`${getApiBaseUrl()}/owners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update owner');
    return response.json();
  },

  async deleteOwner(id: string): Promise<void> {
    const response = await fetch(`${getApiBaseUrl()}/owners/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete owner');
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${getApiBaseUrl()}/owners/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.text();
  }
};
