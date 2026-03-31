import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from './api';

describe('API Client', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  describe('getOwners', () => {
    it('fetches owners successfully', async () => {
      const mockResponse = { content: [{ id: '1', name: 'Test' }] };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await api.getOwners(0, 10);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/owners?page=0&size=10');
    });

    it('throws error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(api.getOwners()).rejects.toThrow('Failed to fetch owners');
    });
  });

  describe('searchOwners', () => {
    it('includes query and category in url params', async () => {
      const mockResponse = { content: [] };
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await api.searchOwners('plumbing', 'Construction', 1, 5);
      expect(global.fetch).toHaveBeenCalledWith('/api/owners/search?page=1&size=5&query=plumbing&category=Construction');
    });
  });
});
