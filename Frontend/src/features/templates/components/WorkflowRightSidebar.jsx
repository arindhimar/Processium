// ── WorkflowRightSidebar ───────────────────────────────────────────────────────
// Properties panel for the selected canvas item.

const WorkflowRightSidebar = ({ selectedItem, onUpdateItem, onDeselect }) => {
  if (!selectedItem) {
    return (
      <aside className="flex w-64 flex-shrink-0 flex-col border-l border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/30">
        {/* Header */}
        <div className="border-b border-border-light dark:border-border-dark px-3 py-2.5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Properties
          </h3>
        </div>

        {/* Empty state */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="material-symbols-outlined text-[36px] text-text-muted">
            tune
          </span>
          <p className="text-xs text-text-muted">
            Select a stage on the canvas to edit its properties
          </p>
        </div>
      </aside>
    );
  }

  const handleFieldChange = (key, value) => {
    onUpdateItem(selectedItem.id, {
      fieldValues: {
        ...selectedItem.fieldValues,
        [key]: value,
      },
    });
  };

  const handleTitleChange = (value) => {
    onUpdateItem(selectedItem.id, { title: value });
  };

  const handleDescriptionChange = (value) => {
    onUpdateItem(selectedItem.id, { description: value });
  };

  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-l border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[14px] text-primary">
              {selectedItem.icon}
            </span>
          </div>
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Properties
          </h3>
        </div>
        <button
          onClick={onDeselect}
          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-text-muted hover:text-text-main transition-colors"
          title="Close"
        >
          <span className="material-symbols-outlined text-[14px]">close</span>
        </button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Stage label / title */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wide text-text-muted mb-1">
            Stage Label
          </label>
          <input
            type="text"
            value={selectedItem.title || selectedItem.label}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-xs text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wide text-text-muted mb-1">
            Notes
          </label>
          <textarea
            rows={2}
            value={selectedItem.description || ''}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Optional notes…"
            className="w-full px-2.5 py-1.5 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-xs text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all resize-none"
          />
        </div>

        {/* Dynamic fields from schema */}
        {selectedItem.fields && selectedItem.fields.length > 0 && (
          <div className="border-t border-border-light dark:border-border-dark pt-3 space-y-3">
            <p className="text-[9px] font-bold uppercase tracking-wider text-text-muted">
              Configuration
            </p>
            {selectedItem.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-[10px] font-semibold text-text-muted mb-1">
                  {field.label}
                </label>
                <input
                  type="text"
                  value={selectedItem.fieldValues?.[field.key] ?? field.default}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-border-light dark:border-border-dark rounded-lg bg-white dark:bg-surface-dark text-xs text-text-main dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border-light dark:border-border-dark p-3">
        <p className="text-[9px] text-text-muted text-center">
          Type: <span className="font-semibold text-primary">{selectedItem.type}</span>
        </p>
      </div>
    </aside>
  );
};

export default WorkflowRightSidebar;
