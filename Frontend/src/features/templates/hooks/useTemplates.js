/**
 * useTemplates Hook
 * Manages template state and API operations with proper loading and error handling
 */

import { useState, useCallback, useEffect } from 'react';
import { templateService } from '../services/templateService';

// Map to store ongoing clone promises per template ID to avoid duplicate clones
const clonePromises = new Map();

export const useTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all templates on component mount
   */
  useEffect(() => {
    fetchTemplates();
  }, []);

  /**
   * Fetch templates from service
   */
  const fetchTemplates = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await templateService.fetchTemplates();
      setTemplates(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch templates');
      console.error('[useTemplates] Error fetching templates:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Select a template to edit
   */
  const selectTemplate = useCallback((template) => {
    setSelectedTemplate({ ...template });
    setError(null);
  }, []);

  /**
   * Create new template
   */
  const createTemplate = useCallback(async (templateData) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await templateService.createTemplate(templateData);
      // Re-fetch to stay in sync with the service layer (avoids duplicates
      // caused by both an optimistic push AND the service array growing)
      const latest = await templateService.fetchTemplates();
      setTemplates(latest.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to create template');
      console.error('[useTemplates] Error creating template:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update existing template
   */
  const updateTemplate = useCallback(async (id, templateData) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await templateService.updateTemplate(id, templateData);
      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? response.data : t))
      );
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(response.data);
      }
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to update template');
      console.error('[useTemplates] Error updating template:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedTemplate?.id]);

  /**
   * Clone template
   */
  const cloneTemplate = useCallback(async (id) => {
    // If a clone operation for this ID is already in progress, return the existing promise
    if (clonePromises.has(id)) {
      console.warn('[useTemplates] Duplicate clone prevented for id', id);
      return clonePromises.get(id);
    }
    // Create a new promise for the clone operation and store it
    const clonePromise = (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await templateService.cloneTemplate(id);
        setTemplates((prev) => [...prev, response.data]);
        setSelectedTemplate(response.data);
        return response.data;
      } catch (err) {
        setError(err.message || 'Failed to clone template');
        console.error('[useTemplates] Error cloning template:', err);
        throw err;
      } finally {
        setIsLoading(false);
        clonePromises.delete(id);
      }
    })();
    clonePromises.set(id, clonePromise);
    return clonePromise;
  }, []);

  /**
   * Delete template
   */
  const deleteTemplate = useCallback(async (id) => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await templateService.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      if (selectedTemplate?.id === id) {
        setSelectedTemplate(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete template');
      console.error('[useTemplates] Error deleting template:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [selectedTemplate?.id]);

  /**
   * Save template as draft
   */
  const saveDraft = useCallback(async (id, templateData) => {
    return updateTemplate(id, { ...templateData, status: 'draft' });
  }, [updateTemplate]);

  /**
   * Publish template
   */
  const publishTemplate = useCallback(async (id) => {
    return updateTemplate(id, { status: 'published' });
  }, [updateTemplate]);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedTemplate(null);
  }, []);

  return {
    // State
    templates,
    selectedTemplate,
    isLoading,
    error,

    // Actions
    selectTemplate,
    createTemplate,
    updateTemplate,
    cloneTemplate,
    deleteTemplate,
    saveDraft,
    publishTemplate,
    clearSelection,
    refetch: fetchTemplates,
  };
};
