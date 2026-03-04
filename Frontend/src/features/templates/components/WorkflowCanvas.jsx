import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ── SortableCanvasItem ─────────────────────────────────────────────────────────

function SortableCanvasItem({ item, isSelected, onSelect, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md'
          : 'border-border-light dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary/40 hover:shadow-sm'
      }`}
      onClick={() => onSelect(item.id)}
    >
      {/* Drag handle */}
      <span
        {...listeners}
        {...attributes}
        className="material-symbols-outlined text-[16px] text-text-muted cursor-grab active:cursor-grabbing hover:text-primary shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        drag_indicator
      </span>

      {/* Icon */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          isSelected
            ? 'bg-primary text-white'
            : 'bg-gray-100 dark:bg-gray-700 text-text-muted group-hover:bg-primary/10 group-hover:text-primary'
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-main dark:text-white truncate">
          {item.title || item.label}
        </p>
        {item.description && (
          <p className="text-xs text-text-muted truncate">{item.description}</p>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-text-muted hover:text-red-500 transition-all shrink-0"
        title="Remove"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </div>
  );
}

// ── EmptyDropZone ──────────────────────────────────────────────────────────────

function EmptyDropZone({ isOver }) {
  return (
    <div
      className={`flex h-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-200 ${
        isOver
          ? 'border-primary bg-primary/5 scale-[1.01]'
          : 'border-border-light dark:border-border-dark'
      }`}
    >
      <span
        className={`material-symbols-outlined text-[40px] transition-colors ${
          isOver ? 'text-primary' : 'text-text-muted'
        }`}
      >
        {isOver ? 'add_circle' : 'dashboard_customize'}
      </span>
      <div className="text-center px-6">
        <p className="text-sm font-semibold text-text-main dark:text-white">
          {isOver ? 'Drop to add stage' : 'Drag components here'}
        </p>
        <p className="text-xs text-text-muted mt-1">
          Build your workflow by dragging stages from the left panel
        </p>
      </div>
    </div>
  );
}

// ── WorkflowCanvas ─────────────────────────────────────────────────────────────

export default function WorkflowCanvas({ canvasItems, onRemove, selectedId, onSelect }) {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop-zone' });

  return (
    <main
      ref={setNodeRef}
      className="flex flex-1 flex-col overflow-hidden bg-background-light dark:bg-background-dark"
    >
      {/* Canvas header */}
      <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-4 py-2 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
          Canvas
        </span>
        <span className="text-[10px] text-text-muted">
          {canvasItems.length} stage{canvasItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Scrollable canvas body */}
      <div className="flex-1 overflow-y-auto p-4">
        {canvasItems.length === 0 ? (
          <EmptyDropZone isOver={isOver} />
        ) : (
          <SortableContext
            items={canvasItems.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {canvasItems.map((item) => (
                <SortableCanvasItem
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  onSelect={onSelect}
                  onRemove={onRemove}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </main>
  );
}
