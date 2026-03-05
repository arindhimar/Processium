import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { componentLibrary } from './componentLibrary';

// ── DraggableCard ──────────────────────────────────────────────────────────────

function DraggableCard({ component }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `sidebar-${component.type}`,
      data: { component },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex cursor-grab flex-col items-center justify-center gap-1.5 rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-surface-dark p-3 transition-all hover:border-primary hover:text-primary dark:hover:border-primary active:cursor-grabbing hover:shadow-sm"
    >
      <span className="material-symbols-outlined text-[22px]">{component.icon}</span>
      <div className="text-center">
        <span className="text-[11px] font-semibold leading-tight text-text-main dark:text-white">
          {component.label}
        </span>
        {component.subtitle && (
          <p className="text-[9px] text-text-muted mt-0.5">{component.subtitle}</p>
        )}
      </div>
    </div>
  );
}

// ── WorkflowLeftSidebar ────────────────────────────────────────────────────────

export default function WorkflowLeftSidebar() {
  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-r border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/30">
      <div className="border-b border-border-light dark:border-border-dark px-3 py-2.5">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
          Workflow Components
        </h3>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-3">
        {componentLibrary.map((group) => (
          <div key={group.category} className="space-y-2">
            <p className="ml-1 text-[9px] font-bold uppercase tracking-wider text-text-muted">
              {group.category}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {group.items.map((comp) => (
                <DraggableCard key={comp.type} component={comp} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
