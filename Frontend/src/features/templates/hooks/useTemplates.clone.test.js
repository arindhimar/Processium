/**
 * TDD: useTemplates – cloneTemplate deduplication
 *
 * Ensures that two rapid clone calls for the same ID only produce one
 * new template in state (the in-flight promise is reused for duplicates).
 *
 * Migrated from Jest to Vitest syntax.
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTemplates } from './useTemplates';
import { templateService } from '../services/templateService';

// Mock the entire service module
vi.mock('../services/templateService', () => ({
  templateService: {
    fetchTemplates: vi.fn(),
    cloneTemplate: vi.fn(),
  },
}));

describe('useTemplates – cloneTemplate deduplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // fetchTemplates returns an empty list by default
    templateService.fetchTemplates.mockResolvedValue({ data: [], success: true });

    // cloneTemplate resolves with a single cloned template
    templateService.cloneTemplate.mockImplementation((id) =>
      Promise.resolve({ data: { id: `clone-${id}`, name: `Clone of ${id}` }, success: true })
    );
  });

  it('should not create duplicate templates on rapid successive clone calls', async () => {
    const { result } = renderHook(() => useTemplates());

    // Wait for initial fetch to settle (returns empty)
    await act(async () => {});

    // Simulate two rapid clone calls for the same id
    await act(async () => {
      // Fire both without awaiting individually – the hook deduplicates
      result.current.cloneTemplate('1');
      result.current.cloneTemplate('1');
    });

    // Length must be exactly 1, not 2
    expect(result.current.templates).toHaveLength(1);
    expect(result.current.templates[0].id).toBe('clone-1');
    // The service was only called once
    expect(templateService.cloneTemplate).toHaveBeenCalledTimes(1);
  });

  it('allows cloning different templates independently', async () => {
    const { result } = renderHook(() => useTemplates());

    await act(async () => {});

    await act(async () => {
      await result.current.cloneTemplate('A');
    });

    await act(async () => {
      await result.current.cloneTemplate('B');
    });

    expect(result.current.templates).toHaveLength(2);
    expect(templateService.cloneTemplate).toHaveBeenCalledTimes(2);
  });
});

