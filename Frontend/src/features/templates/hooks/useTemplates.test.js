import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTemplates } from './useTemplates';
import { templateService } from '../services/templateService';

// Mock the service
vi.mock('../services/templateService', () => ({
  templateService: {
    fetchTemplates: vi.fn(),
    cloneTemplate: vi.fn(),
  },
}));

describe('useTemplates Hook - Clone Bug Reproduction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should only add ONE template when cloneTemplate is called', async () => {
    const mockInitialTemplates = [
      { id: '1', name: 'Original', category: 'Hiring', subject: 'Subject', content: 'Content' }
    ];
    
    const mockClonedTemplate = { 
      id: '2', 
      name: 'Original (Copy)', 
      category: 'Hiring', 
      subject: 'Subject', 
      content: 'Content' 
    };

    templateService.fetchTemplates.mockResolvedValue({ 
      data: mockInitialTemplates, 
      success: true 
    });
    
    templateService.cloneTemplate.mockResolvedValue({ 
      data: mockClonedTemplate, 
      success: true 
    });

    const { result } = renderHook(() => useTemplates());

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.templates).toHaveLength(1);
    });

    // Act: Clone
    await act(async () => {
      await result.current.cloneTemplate('1');
    });

    // Expectation: Length should be 2, not 3 or more
    expect(result.current.templates).toHaveLength(2);
    expect(result.current.templates[1].id).toBe('2');
  });
});
