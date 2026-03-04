import { useState } from 'react';

// ── Lookup maps ────────────────────────────────────────────────────────────────

const statusColors = {
  published: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
    label: 'Active',
  },
  draft: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800',
    dot: 'bg-yellow-500',
    label: 'Draft',
  },
  archived: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-400',
    label: 'Archived',
  },
};

// ── Component ──────────────────────────────────────────────────────────────────

const TemplateRow = ({
  template,
  onDelete,
  onClone,
  onUpdate,
  onClick,
  isSelected,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(template.name);

  const status     = template.status || 'draft';
  const statusInfo = statusColors[status] || statusColors.draft;

  const handleEditSave = (e) => {
    e.stopPropagation();
    if (editName.trim() && editName.trim() !== template.name) {
      onUpdate(template.id, { ...template, name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleEditCancel = (e) => {
    e.stopPropagation();
    setEditName(template.name);
    setIsEditing(false);
  };

  // ── Selected layout (shown when builder is open) ──────────────────────────

  if (isSelected) {
    return (
      <div
        onClick={onClick}
        className="grid grid-cols-12 gap-4 px-6 py-5 items-center bg-blue-50/60 dark:bg-blue-900/10 border-l-2 border-primary cursor-pointer hover:bg-blue-50/80 dark:hover:bg-blue-900/15 transition-colors duration-200 group"
      >
        {/* Template name — wide */}
        <div className="col-span-6 flex items-center gap-3">
          <h3 className="font-bold text-base text-text-main dark:text-white leading-tight truncate">
            {template.name}
          </h3>
        </div>

        {/* Category badge */}
        <div className="col-span-3 flex items-center">
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            {template.category || 'General'}
          </span>
        </div>

        {/* Status pill */}
        <div className="col-span-3 flex items-center">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
            {statusInfo.label}
          </span>
        </div>
      </div>
    );
  }

  // ── Default list layout ────────────────────────────────────────────────────

  return (
    <div
      onClick={onClick}
      className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group cursor-pointer"
    >
      {/* Title */}
      <div className="col-span-4 flex flex-col">
        {isEditing ? (
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSave(e);
              if (e.key === 'Escape') handleEditCancel(e);
            }}
            onClick={(e) => e.stopPropagation()}
            className="border border-primary rounded px-2 py-1 text-sm text-text-main dark:text-white bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary w-full"
          />
        ) : (
          <h3 className="font-bold text-sm text-text-main dark:text-white leading-tight truncate">
            {template.name}
          </h3>
        )}
      </div>

      {/* Description */}
      <div className="col-span-6 flex items-center">
        <p className="text-sm text-text-muted truncate">
          {template.content || template.subject || '—'}
        </p>
      </div>

      {/* Actions */}
      <div
        className="col-span-2 flex justify-end gap-1 items-center opacity-70 group-hover:opacity-100 transition-opacity duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {isEditing ? (
          <>
            <button
              onClick={handleEditSave}
              className="p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark text-green-500 hover:text-green-600 transition-colors duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark"
              title="Save"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
            </button>
            <button
              onClick={handleEditCancel}
              className="p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark text-text-muted hover:text-red-500 transition-colors duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark"
              title="Cancel"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); setEditName(template.name); }}
            className="p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark text-text-muted hover:text-primary transition-colors duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[18px]">edit_square</span>
          </button>
        )}

        <button
          onClick={() => onClone(template.id)}
          disabled={isLoading}
          className={`p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark transition-colors duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark ${
            isLoading ? 'opacity-40 cursor-not-allowed text-text-muted' : 'text-text-muted hover:text-primary'
          }`}
          title={isLoading ? 'Cloning...' : 'Clone'}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isLoading ? 'sync' : 'content_copy'}
          </span>
        </button>

        <button
          onClick={() => {
            if (window.confirm(`Delete "${template.name}"?`)) {
              onDelete(template.id);
            }
          }}
          className="p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark text-text-muted hover:text-red-500 transition-colors duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark"
          title="Delete"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </div>
  );
};

export default TemplateRow;
