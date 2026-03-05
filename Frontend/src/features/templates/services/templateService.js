/**
 * templateService
 * ──────────────────────────────────────────────────────────────────────────
 * Provides authenticated API methods for template management.
 * All responses are normalised from the Django snake_case schema to the
 * camelCase shape expected by UI components.
 *
 * Backend base URL is read from the VITE_API_BASE_URL env var, falling
 * back to http://localhost:8000 for local development.
 */

// ── Config ──────────────────────────────────────────────────────────────────
const BASE_URL =
  typeof import.meta !== "undefined"
    ? import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8000"
    : "http://localhost:8000";

const TOKEN_KEY = "access_token";

// ── Custom error class ──────────────────────────────────────────────────────
export class TemplateApiError extends Error {
  /** @param {string} message @param {number} status @param {Object} data */
  constructor(message, status, data = {}) {
    super(message);
    this.name = "TemplateApiError";
    this.status = status;
    this.data = data;
  }
}

// ── Internal request helper ─────────────────────────────────────────────────
/**
 * Authenticated fetch wrapper.
 * - Prepends BASE_URL to path
 * - Injects Bearer token from localStorage
 * - Throws TemplateApiError on non-2xx responses
 *
 * @param {string} path  e.g. '/api/templates/'
 * @param {{ method?: string, body?: Object }} [options]
 * @returns {Promise<any>}  parsed JSON body
 */
async function apiRequest(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers = { "Content-Type": "application/json" };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;

    throw new TemplateApiError(message, response.status, data);
  }

  return data;
}

// ── Data normalisation ──────────────────────────────────────────────────────
/**
 * Converts a backend template response (snake_case) to the frontend shape
 * (camelCase) expected by all UI components.
 */
export function normalizeTemplate(raw) {
  return {
    id: raw.id,
    name: raw.template_name,
    description: raw.template_description ?? "",

    subject: raw.subject ?? "",
    category: raw.category ?? "",
    visibility: raw.visibility ?? "",
    status: raw.status ?? "",

    createdBy: raw.created_by_name ?? "",
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  };
}

/**
 * Converts frontend form data to the backend POST / PUT payload.
 */
function denormalizeTemplate(data) {
  return {
    template_name: data.name ?? data.template_name ?? "",
    template_description: data.content ?? data.template_description ?? "",
  };
}

// ── Service ─────────────────────────────────────────────────────────────────
export const templateService = {
  /**
   * Fetch all templates.
   */
  fetchTemplates: async () => {
    const data = await apiRequest("/api/templates/");
    return { data: data.map(normalizeTemplate), success: true };
  },

  /**
   * Fetch a single template by ID.
   */
  fetchTemplate: async (id) => {
    const data = await apiRequest(`/api/templates/${id}/`);
    return { data: normalizeTemplate(data), success: true };
  },

  /**
   * Create a new template.
   */
  createTemplate: async (templateData) => {
    const payload = denormalizeTemplate(templateData);
    const data = await apiRequest("/api/templates/", {
      method: "POST",
      body: payload,
    });

    return { data: normalizeTemplate(data), success: true };
  },

  /**
   * Update an existing template.
   */
  updateTemplate: async (id, templateData) => {
    const payload = denormalizeTemplate(templateData);

    const data = await apiRequest(`/api/templates/${id}/`, {
      method: "PUT",
      body: payload,
    });

    return { data: normalizeTemplate(data), success: true };
  },

  /**
   * Clone a template.
   */
  cloneTemplate: async (id) => {
    const data = await apiRequest(`/api/templates/${id}/clone/`, {
      method: "POST",
    });

    return { data: normalizeTemplate(data), success: true };
  },

  /**
   * Delete a template.
   */
  deleteTemplate: async (id) => {
    await apiRequest(`/api/templates/${id}/`, { method: "DELETE" });
    return { success: true };
  },

  /**
   * Save a template as draft.
   */
  saveDraft: async (id, templateData) => {
    return templateService.updateTemplate(id, {
      ...templateData,
      status: "draft",
    });
  },

  /**
   * Publish a template.
   */
  publishTemplate: async (id) => {
    return templateService.updateTemplate(id, { status: "published" });
  },
};