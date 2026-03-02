import { renderHook, act } from '@testing-library/react';
import { useTemplates } from '../../hooks/useTemplates';
import { templateService } from '../../services/templateService';

// Mock the service
jest.mock('../../services/templateService');

describe('useTemplates cloneTemplate TDD', () => {
  beforeEach(() => {
    // Reset mock implementations and mock data
    templateService.cloneTemplate.mockReset();
    templateService.cloneTemplate.mockImplementation((id) =>
      Promise.resolve({ data: { id: 'clone-' + id, name: 'Clone of ' + id } })
    );
  });

  test('should not create duplicate templates on rapid successive clone calls', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useTemplates());

    // Initial templates empty
    expect(result.current.templates).toHaveLength(0);

    // Simulate two rapid clone calls for the same id
    act(() => {
      result.current.cloneTemplate('1');
      result.current.cloneTemplate('1');
    });

    // Wait for async operations to finish
    await waitForNextUpdate(); // first clone resolves
    // No second update should happen because second call is ignored
    expect(result.current.templates).toHaveLength(1);
    expect(result.current.templates[0].id).toBe('clone-1');
  });
});
