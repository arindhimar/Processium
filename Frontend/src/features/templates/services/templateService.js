// /**
//  * templateService
//  * ──────────────────────────────────────────────────────────────────────────
//  * Provides authenticated API methods for template management.
//  * All responses are normalised from the Django snake_case schema to the
//  * camelCase shape expected by UI components.
//  *
//  * Backend base URL is read from the VITE_API_BASE_URL env var, falling
//  * back to http://localhost:8000 for local development.
//  */

// // ── Config ────────────────────────────────────────────────────────────────────

// const BASE_URL = typeof import.meta !== 'undefined'
//   ? (import.meta.env?.VITE_API_BASE_URL ?? 'http://localhost:8000')
//   : 'http://localhost:8000';

// const TOKEN_KEY = 'access_token';

// // ── Custom error class ────────────────────────────────────────────────────────

// export class TemplateApiError extends Error {
//   /** @param {string} message @param {number} status @param {Object} data */
//   constructor(message, status, data = {}) {
//     super(message);
//     this.name = 'TemplateApiError';
//     this.status = status;
//     this.data = data;
//   }
// }

// // ── Internal request helper ───────────────────────────────────────────────────

// /**
//  * Authenticated fetch wrapper.
//  * - Prepends BASE_URL to path
//  * - Injects Bearer token from localStorage
//  * - Throws TemplateApiError on non-2xx responses
//  *
//  * @param {string} path  e.g. '/api/templates/'
//  * @param {{ method?: string, body?: Object }} [options]
//  * @returns {Promise<any>}  parsed JSON body
//  */
// async function apiRequest(path, { method = 'GET', body } = {}) {
//   const token = localStorage.getItem(TOKEN_KEY);
//   const headers = { 'Content-Type': 'application/json' };
//   if (token) {
//     headers['Authorization'] = `Bearer ${token}`;
//   }

//   const response = await fetch(`${BASE_URL}${path}`, {
//     method,
//     headers,
//     body: body !== undefined ? JSON.stringify(body) : undefined,
//   });

//   let data;
//   try {
//     data = await response.json();
//   } catch {
//     data = {};
//   }

//   if (!response.ok) {
//     const message =
//       data?.detail ||
//       data?.message ||
//       data?.error ||
//       `Request failed with status ${response.status}`;
//     throw new TemplateApiError(message, response.status, data);
//   }

//   return data;
// }

// // ── Data normalisation ────────────────────────────────────────────────────────

// /**
//  * Converts a backend template response (snake_case) to the frontend shape
//  * (camelCase) expected by all UI components.
//  *
//  * Fields NOT present in the backend model (subject, category, visibility,
//  * status) are defaulted to empty strings so component code never crashes
//  * with `undefined.toLowerCase()`.
//  *
//  * @param {Object} raw  Raw object from the DRF serializer
//  * @returns {Object}    Normalised frontend-ready template object
//  */
// export function normalizeTemplate(raw) {
//   return {
//     id: raw.id,
//     name: raw.template_name,
//     content: raw.template_description ?? '',
//     // Fields not tracked by the backend – kept as empty strings for UI safety
//     subject: raw.subject ?? '',
//     category: raw.category ?? '',
//     visibility: raw.visibility ?? '',
//     status: raw.status ?? '',
//     // Audit fields
//     createdBy: raw.created_by_name ?? '',
//     createdAt: raw.created_at,
//     updatedAt: raw.updated_at,
//   };
// }

// /**
//  * Converts frontend form data to the backend POST / PUT payload.
//  * Strips fields the API does not accept.
//  *
//  * @param {Object} data  Frontend template object / form values
//  * @returns {{ template_name: string, template_description: string }}
//  */
// function denormalizeTemplate(data) {
//   return {
//     template_name: data.name ?? data.template_name ?? '',
//     template_description: data.content ?? data.template_description ?? '',
//   };
// }

// // ── Service ───────────────────────────────────────────────────────────────────

// export const templateService = {
//   /**
//    * Fetch all templates.
//    * Requires admin authentication.
//    * @returns {Promise<{ data: Object[], success: true }>}
//    */
//   fetchTemplates: async () => {
//     const data = await apiRequest('/api/templates/');
//     return { data: data.map(normalizeTemplate), success: true };
//   },

//   /**
//    * Fetch a single template by ID.
//    * @param {string} id  Template UUID
//    * @returns {Promise<{ data: Object, success: true }>}
//    */
//   fetchTemplate: async (id) => {
//     const data = await apiRequest(`/api/templates/${id}/`);
//     return { data: normalizeTemplate(data), success: true };
//   },

//   /**
//    * Create a new template.
//    * Automatically maps { name, content } → { template_name, template_description }.
//    * @param {Object} templateData  Frontend form values
//    * @returns {Promise<{ data: Object, success: true }>}
//    */
//   createTemplate: async (templateData) => {
//     const payload = denormalizeTemplate(templateData);
//     const data = await apiRequest('/api/templates/', { method: 'POST', body: payload });
//     return { data: normalizeTemplate(data), success: true };
//   },

//   /**
//    * Update an existing template (full replace via PUT).
//    * @param {string} id           Template UUID
//    * @param {Object} templateData  Updated frontend form values
//    * @returns {Promise<{ data: Object, success: true }>}
//    */
//   updateTemplate: async (id, templateData) => {
//     const payload = denormalizeTemplate(templateData);
//     const data = await apiRequest(`/api/templates/${id}/`, { method: 'PUT', body: payload });
//     return { data: normalizeTemplate(data), success: true };
//   },

//   /**
//    * Clone a template.
//    * Calls POST /api/templates/<id>/clone/ which the backend creates as
//    * "Copy of <original_name>".
//    * @param {string} id  Template UUID to clone
//    * @returns {Promise<{ data: Object, success: true }>}
//    */
//   cloneTemplate: async (id) => {
//     const data = await apiRequest(`/api/templates/${id}/clone/`, { method: 'POST' });
//     return { data: normalizeTemplate(data), success: true };
//   },

//   /**
//    * Delete a template.
//    * @param {string} id  Template UUID
//    * @returns {Promise<{ success: true }>}
//    */
//   deleteTemplate: async (id) => {
//     await apiRequest(`/api/templates/${id}/`, { method: 'DELETE' });
//     return { success: true };
//   },

//   /**
//    * Save a template as draft.
//    * @param {string} id           Template UUID
//    * @param {Object} templateData  Updated frontend form values
//    * @returns {Promise<{ data: Object, success: true }>}
//    */
//   saveDraft: async (id, templateData) => {
//     return templateService.updateTemplate(id, { ...templateData, status: 'draft' });
//   },

//   /**
//    * Publish a template.
//    * @param {string} id  Template UUID
//    * @returns {Promise<{ data: Object, success: true }>}
//    */
//   publishTemplate: async (id) => {
//     return templateService.updateTemplate(id, { status: 'published' });
//   },
// };



// ---------------------------------------------------------------------------------------------

/**
 * Template Service
 * Handles all API calls related to templates
 * Replace with actual API endpoints when backend is ready
 */

let MOCK_TEMPLATES = [
  {
    id: '1',
    name: 'Senior Developer - Offer Letter',
    department: 'Engineering',
    category: 'Hiring',
    subject: 'Offer Letter - Senior Developer Position',
    content: 'Dear {{candidateName}},\n\nWe are pleased to offer you the position of Senior Developer...',
    businessDescription: 'High-performing engineer for backend services',
    budgetApproval: '$150,000 - $180,000',
    jdInfo: 'Senior Developer - 5+ years experience in backend development',
    roundsInfo: 'Technical Round, System Design Round, HR Round',
    offerOutcome: 'Contingent on background check',
    variables: ['candidateName', 'salary', 'startDate'],
    status: 'published',
    visibility: 'team',
    version: '1.2',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    createdBy: 'John Doe',
    updatedBy: 'Jane Smith',
    usage: 12,
  },
  {
    id: '2',
    name: 'Internship Acceptance Email',
    department: 'HR',
    category: 'Onboarding',
    subject: 'Welcome to Our Team - Internship Program',
    content: 'Dear {{internName}},\n\nWelcome to our internship program...',
    businessDescription: 'Entry-level talent development program',
    budgetApproval: 'Minimal cost',
    jdInfo: 'Internship - 3-6 months duration',
    roundsInfo: 'Initial screening, Technical screening',
    offerOutcome: 'Performance-based conversion',
    variables: ['internName', 'duration', 'mentor'],
    status: 'draft',
    visibility: 'team',
    version: '1.0',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    createdBy: 'Jane Smith',
    updatedBy: 'Jane Smith',
    usage: 3,
  },
];

export const templateService = {
  /**
   * Fetch all templates
   */
  fetchTemplates: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: MOCK_TEMPLATES,
          success: true,
        });
      }, 500);
    });
  },

  /**
   * Fetch single template by ID
   */
  fetchTemplate: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const template = MOCK_TEMPLATES.find((t) => t.id === id);
        if (template) {
          resolve({
            data: { ...template },
            success: true,
          });
        } else {
          reject(new Error('Template not found'));
        }
      }, 300);
    });
  },

  /**
   * Create new template
   */
  createTemplate: async (templateData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTemplate = {
          id: String(Date.now()),
          ...templateData,
          createdAt: new Date(),
          updatedAt: new Date(),
          version: '1.0',
          usage: 0,
        };
        MOCK_TEMPLATES.push(newTemplate);
        resolve({
          data: newTemplate,
          success: true,
        });
      }, 300);
    });
  },

  /**
   * Update existing template
   */
  updateTemplate: async (id, templateData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_TEMPLATES.findIndex((t) => t.id === id);
        if (index !== -1) {
          MOCK_TEMPLATES[index] = {
            ...MOCK_TEMPLATES[index],
            ...templateData,
            updatedAt: new Date(),
          };
          resolve({
            data: { ...MOCK_TEMPLATES[index] },
            success: true,
          });
        } else {
          reject(new Error('Template not found'));
        }
      }, 300);
    });
  },

  /**
   * Clone template
   */
  cloneTemplate: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const template = MOCK_TEMPLATES.find((t) => t.id === id);
        if (template) {
          const clonedTemplate = {
            ...template,
            id: String(Date.now()),
            name: `${template.name} (Copy)`,
            status: 'draft',
            createdAt: new Date(),
            updatedAt: new Date(),
            usage: 0,
          };
          MOCK_TEMPLATES.push(clonedTemplate);
          resolve({
            data: clonedTemplate,
            success: true,
          });
        } else {
          reject(new Error('Template not found'));
        }
      }, 300);
    });
  },

  /**
   * Delete template
   */
  deleteTemplate: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = MOCK_TEMPLATES.findIndex((t) => t.id === id);
        if (index !== -1) {
          MOCK_TEMPLATES.splice(index, 1);
          resolve({
            success: true,
          });
        } else {
          reject(new Error('Template not found'));
        }
      }, 300);
    });
  },

  /**
   * Publish template
   */
  publishTemplate: async (id) => {
    return templateService.updateTemplate(id, { status: 'published' });
  },

  /**
   * Save as draft
   */
  saveDraft: async (id, templateData) => {
    return templateService.updateTemplate(id, { ...templateData, status: 'draft' });
  },
};
