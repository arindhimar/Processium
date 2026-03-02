import { useState } from 'react';

const TemplateRow = ({
  template,
  onDelete,
  onClone,
  onUpdate,
  isLoading,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(template.name);

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
    <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 group">

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
          className={`p-2 rounded-lg hover:bg-white dark:hover:bg-surface-dark transition-colors duration-200 border border-transparent hover:border-border-light dark:hover:border-border-dark ${isLoading ? 'opacity-40 cursor-not-allowed text-text-muted' : 'text-text-muted hover:text-primary'}`}
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
