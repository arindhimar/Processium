import { useState } from 'react';

const InlineTemplateRow = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Hiring',
    subject: 'New Template',
    content: '',
    visibility: 'team',
  });

  const handleSave = () => {
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-5 items-center bg-blue-50/30 dark:bg-blue-900/5 animate-fadeIn border-l-2 border-primary">
      {/* Name Input */}
      <div className="col-span-4">
        <input
          autoFocus
          type="text"
          placeholder="Enter Template Title..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') onCancel();
          }}
          className="font-bold text-sm text-text-main dark:text-white leading-tight bg-transparent border-b-2 border-primary/20 focus:border-primary focus:outline-none w-full pb-1 transition-colors"
        />
      </div>

      {/* Description (Content) Input */}
      <div className="col-span-6">
        <input
          type="text"
          placeholder="Add a brief description..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') onCancel();
          }}
          className="text-sm text-text-main dark:text-gray-300 font-medium bg-transparent border-b-2 border-border-light dark:border-border-dark focus:border-primary focus:outline-none w-full pb-1 transition-colors"
        />
      </div>

      {/* Actions */}
      <div className="col-span-2 flex justify-end gap-3 items-center">
        <button
          onClick={handleSave}
          disabled={!formData.name.trim()}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            !formData.name.trim()
              ? 'opacity-30 cursor-not-allowed'
              : 'text-green-500 hover:bg-green-500 hover:text-white'
          }`}
          title="Save Template"
        >
          <span className="material-symbols-outlined text-[24px]">check</span>
        </button>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-full text-text-muted hover:bg-red-500 hover:text-white transition-all duration-200"
          title="Cancel"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>
      </div>
    </div>
  );
};

export default InlineTemplateRow;
