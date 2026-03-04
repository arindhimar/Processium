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

const visibilityIcons = {
  public: 'domain',
  team: 'visibility',
  private: 'lock',
};

const categoryBgColors = {
  blue:   'bg-blue-50 dark:bg-blue-900/20',
  cyan:   'bg-cyan-50 dark:bg-cyan-900/20',
  purple: 'bg-purple-50 dark:bg-purple-900/20',
  gray:   'bg-gray-100 dark:bg-gray-800',
  teal:   'bg-teal-50 dark:bg-teal-900/20',
  pink:   'bg-pink-50 dark:bg-pink-900/20',
  green:  'bg-green-50 dark:bg-green-900/20',
  orange: 'bg-orange-50 dark:bg-orange-900/20',
  indigo: 'bg-indigo-50 dark:bg-indigo-900/20',
};

const categoryTextColors = {
  blue:   'text-blue-600 dark:text-blue-400',
  cyan:   'text-cyan-600 dark:text-cyan-400',
  purple: 'text-purple-600 dark:text-purple-400',
  gray:   'text-gray-600 dark:text-gray-400',
  teal:   'text-teal-600 dark:text-teal-400',
  pink:   'text-pink-600 dark:text-pink-400',
  green:  'text-green-600 dark:text-green-400',
  orange: 'text-orange-600 dark:text-orange-400',
  indigo: 'text-indigo-600 dark:text-indigo-400',
};

// ── Component ──────────────────────────────────────────────────────────────────

const TemplateRow = ({
  template,
  categoryIcon,
  categoryColor,
  onDelete,
  onClone,
  onUpdate,
  onClick,
  isSelected,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(template.name);

  const status     = template.status     || 'draft';
  const visibility = template.visibility || 'team';
  const statusInfo = statusColors[status] || statusColors.draft;

  const bgColor   = categoryBgColors[categoryColor]   || categoryBgColors.blue;
  const textColor = categoryTextColors[categoryColor] || categoryTextColors.blue;

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

  return (
    <div
      onClick={onClick}
      className={`grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 group animate-fadeIn cursor-pointer ${
        isSelected
          ? 'bg-blue-50/60 dark:bg-blue-900/10 border-l-2 border-primary'
          : ''
      }`}
    >
      {isSelected ? (
        <>
          {/* SELECTED: Template name — wide */}
          <div className="col-span-6 flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded ${bgColor} ${textColor} flex items-center justify-center shrink-0`}
            >
              <span className="material-symbols-outlined">{categoryIcon}</span>
            </div>
            <h3 className="font-bold text-base text-text-main dark:text-white leading-tight truncate">
              {template.name}
            </h3>
          </div>

          {/* SELECTED: Category badge */}
          <div className="col-span-3 flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${bgColor} ${textColor} border border-current border-opacity-20`}
            >
              {template.category || 'General'}
            </span>
          </div>

          {/* SELECTED: Status pill */}
          <div className="col-span-3 flex items-center">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
              {statusInfo.label}
            </span>
          </div>
        </>
      ) : (
        <>
          {/* DEFAULT: Template Info */}
          <div className="col-span-3 flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded ${bgColor} ${textColor} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110`}
            >
              <span className="material-symbols-outlined">{categoryIcon}</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-sm text-text-main dark:text-white leading-tight">
                {template.name}
              </h3>
              <span className="text-xs text-text-muted font-medium mt-0.5">
                {template.category || 'Uncategorized'}
              </span>
            </div>
          </div>

          {/* DEFAULT: Category & Visibility */}
          <div className="col-span-2 flex flex-col items-start gap-1.5">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${bgColor} ${textColor} border border-current border-opacity-20`}
            >
              {template.category || 'General'}
            </span>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <span className="material-symbols-outlined text-[14px]">
                {visibilityIcons[visibility] || 'visibility'}
              </span>
              <span className="capitalize">
                {visibility === 'team' ? 'Team Visible' : (visibility || 'Team')}
              </span>
            </div>
          </div>

          {/* DEFAULT: Status */}
          <div className="col-span-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text} border ${statusInfo.border}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
              {statusInfo.label}
            </span>
          </div>

          {/* DEFAULT: Metadata & Usage */}
          <div className="col-span-3 grid grid-cols-2 gap-y-1 gap-x-4">
            <div className="text-xs">
              <span className="text-text-muted block text-[10px] uppercase tracking-wide">
                Modified
              </span>
              <span className="text-text-main dark:text-gray-300 font-medium">
                {template.updatedAt || template.createdAt
                  ? new Date(template.updatedAt || template.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })
                  : '—'}
              </span>
            </div>
            <div className="text-xs">
              <span className="text-text-muted block text-[10px] uppercase tracking-wide">
                Usage
              </span>
              <span className="text-text-main dark:text-gray-300 font-medium">
                {template.usage ?? 0} uses
              </span>
            </div>
            <div className="text-xs col-span-2 flex gap-3 text-text-muted mt-1">
              <span>v{template.version || '1.0'}</span>
              <span>•</span>
              <span>
                {template.createdBy ? `By ${template.createdBy}` : (
                  template.createdAt
                    ? `Created ${new Date(template.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                    : 'No date'
                )}
              </span>
            </div>
          </div>

          {/* DEFAULT: Actions */}
          <div
            className="col-span-2 flex justify-end gap-2 items-center opacity-80 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {isEditing ? (
              <>
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditSave(e);
                    if (e.key === 'Escape') handleEditCancel(e);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="border border-primary rounded px-2 py-1 text-sm text-text-main dark:text-white bg-background-light dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary w-36"
                />
                <button
                  onClick={handleEditSave}
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark text-green-500 hover:text-green-600 transition-colors duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark hover:shadow-sm"
                  title="Save"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </button>
                <button
                  onClick={handleEditCancel}
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark text-text-muted hover:text-red-500 transition-colors duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark hover:shadow-sm"
                  title="Cancel"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                  setEditName(template.name);
                }}
                className="p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark text-text-muted hover:text-primary transition-colors duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark hover:shadow-sm"
                title="Edit"
              >
                <span className="material-symbols-outlined text-[18px]">edit_square</span>
              </button>
            )}

            <button
              onClick={() => onClone(template.id)}
              disabled={isLoading}
              className={`p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark transition-colors duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark hover:shadow-sm ${
                isLoading ? 'opacity-40 cursor-not-allowed text-text-muted' : 'text-text-muted hover:text-primary'
              }`}
              title={isLoading ? 'Processing…' : 'Clone'}
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
              className="p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark text-text-muted hover:text-red-500 transition-colors duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark hover:shadow-sm"
              title="Delete"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateRow;
