import { useState } from 'react';

const CreateTemplateModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hiring',
    subject: '',
    content: '',
    variables: [],
    visibility: 'team',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreate(formData);
    } catch (err) {
      console.error('[CreateTemplateModal] Error creating template:', err);
      setIsSubmitting(false); // Re-enable on error
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl max-w-md w-full animate-slideUp">
        {/* Header */}
        <div className="px-5 py-3 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-base font-bold text-text-main dark:text-white">New Template</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
            disabled={isSubmitting}
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5 ml-0.5">
                Template Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-lg bg-background-light/50 dark:bg-background-dark/50 text-xs text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5 ml-0.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-lg bg-background-light/50 dark:bg-background-dark/50 text-xs text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                disabled={isSubmitting}
              >
                <option value="Hiring">Hiring</option>
                <option value="Recruitment">Recruitment</option>
                <option value="Evaluation">Evaluation</option>
                <option value="Legal">Legal</option>
                <option value="Process">Process</option>
                <option value="Finance">Finance</option>
                <option value="Onboarding">Onboarding</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5 ml-0.5">
              Subject Line
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Email subject line"
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-lg bg-background-light/50 dark:bg-background-dark/50 text-xs text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-text-muted mb-1.5 ml-0.5">
              Initial Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter content..."
              rows="3"
              className="w-full px-3 py-1.5 border border-border-light dark:border-border-dark rounded-lg bg-background-light/50 dark:bg-background-dark/50 text-xs text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all resize-none"
              disabled={isSubmitting}
            ></textarea>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-1.5 border border-border-light dark:border-border-dark rounded-lg text-xs font-bold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-1.5 bg-primary text-primary-content rounded-lg hover:bg-blue-600 transition-all text-xs font-bold shadow-md shadow-primary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Start Building'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTemplateModal;
