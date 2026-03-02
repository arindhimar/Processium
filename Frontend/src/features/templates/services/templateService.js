// import axiosInstance from '../../../shared/api/apiClient';

// /**
//  * templateService
//  * Provides API methods for template management
//  */
// export const templateService = {
//   /**
//    * Fetch all templates
//    * @returns {Promise} axios response
//    */
//   fetchTemplates: () => {
//     return axiosInstance.get('/api/templates');
//   },

//   /**
//    * Create a new template
//    * @param {Object} data Template data
//    * @returns {Promise} axios response
//    */
//   createTemplate: (data) => {
//     return axiosInstance.post('/api/templates', data);
//   },

//   /**
//    * Update an existing template
//    * @param {string|number} id Template ID
//    * @param {Object} data Template data
//    * @returns {Promise} axios response
//    */
//   updateTemplate: (id, data) => {
//     return axiosInstance.put(`/api/templates/${id}`, data);
//   },

//   /**
//    * Clone an existing template
//    * @param {string|number} id Template ID
//    * @returns {Promise} axios response
//    */
//   cloneTemplate: (id) => {
//     return axiosInstance.post(`/api/templates/${id}/clone`);
//   },

//   /**
//    * Delete a template
//    * @param {string|number} id Template ID
//    * @returns {Promise} axios response
//    */
//   deleteTemplate: (id) => {
//     return axiosInstance.delete(`/api/templates/${id}`);
//   }
// };

/**
 * Template Service
 * Handles all API calls related to templates
 * Replace with actual API endpoints when backend is ready
 */

let _nextId = Date.now();
const nextId = () => String(++_nextId);

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
          id: nextId(),
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
          id: nextId(),
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


