import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import WorkflowLeftSidebar from './WorkflowLeftSidebar';
import WorkflowCanvas from './WorkflowCanvas';
import WorkflowRightSidebar from './WorkflowRightSidebar';

let nextId = 1;

function isSidebarDrag(id) {
  return String(id).startsWith('sidebar-');
}

/**
 * WorkflowBuilder
 * Inline workflow builder embedded below a selected template row.
 *
 * Props:
 *   template  — the currently selected template object
 *   onClose   — callback to dismiss the builder (go back to all templates)
 */
export default function WorkflowBuilder({ template }) {
  const [canvasItems, setCanvasItems] = useState([]);
  const [activeData, setActiveData]   = useState(null);
  const [activeType, setActiveType]   = useState(null);
  const [selectedId, setSelectedId]   = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const selectedItem = canvasItems.find((c) => c.id === selectedId) || null;

  // ── Drag handlers ────────────────────────────────────────────────────────────

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    if (isSidebarDrag(active.id)) {
      const comp = active.data?.current?.component;
      if (comp) { setActiveData(comp); setActiveType('sidebar'); }
    } else {
      const item = canvasItems.find((c) => c.id === active.id);
      if (item) { setActiveData(item); setActiveType('canvas'); }
    }
  }, [canvasItems]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    setActiveData(null);
    setActiveType(null);

    if (!over) return;

    // Sidebar → Canvas drop
    if (isSidebarDrag(active.id)) {
      const isOverCanvas =
        over.id === 'canvas-drop-zone' ||
        canvasItems.some((c) => c.id === over.id);
      if (!isOverCanvas) return;

      const comp = active.data?.current?.component;
      if (!comp) return;

      const fieldValues = {};
      comp.fields.forEach((f) => { fieldValues[f.key] = f.default; });

      const newItem = {
        ...comp,
        id: `canvas-${comp.type}-${nextId++}`,
        title: comp.label,
        description: '',
        fieldValues,
      };

      if (over.id === 'canvas-drop-zone') {
        setCanvasItems((prev) => [...prev, newItem]);
      } else {
        setCanvasItems((prev) => {
          const overIndex = prev.findIndex((c) => c.id === over.id);
          const copy = [...prev];
          copy.splice(overIndex + 1, 0, newItem);
          return copy;
        });
      }
      return;
    }

    // Canvas reorder
    if (active.id !== over.id) {
      setCanvasItems((prev) => {
        const oldIndex = prev.findIndex((c) => c.id === active.id);
        const newIndex = prev.findIndex((c) => c.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return prev;
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }, [canvasItems]);

  const handleDragCancel = useCallback(() => {
    setActiveData(null);
    setActiveType(null);
  }, []);

  // ── Canvas item handlers ─────────────────────────────────────────────────────

  const handleRemove = useCallback((id) => {
    setCanvasItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleSelect = useCallback((id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleUpdateItem = useCallback((id, updates) => {
    setCanvasItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const handleFormChange = useCallback((id, formValues) => {
    setCanvasItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, formData: formValues } : item))
    );
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="border-t border-border-light dark:border-border-dark animate-slideDown mt-4">
      {/* Builder toolbar */}
      {/* <div className="flex items-center justify-between px-6 py-2.5 bg-slate-50 dark:bg-gray-800/60 border-b border-border-light dark:border-border-dark shrink-0">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[20px]">
            account_tree
          </span>
          <div>
            <p className="text-sm font-bold text-text-main dark:text-white leading-tight">
              Workflow Builder
            </p>
            <p className="text-[11px] text-text-muted">
              {template?.name} — drag components from the left panel onto the canvas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted bg-white dark:bg-gray-700 border border-border-light dark:border-gray-600 px-2 py-1 rounded">
            {canvasItems.length} stage{canvasItems.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setCanvasItems([])}
            className="px-3 py-1.5 text-xs font-medium text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-border-light dark:border-gray-600 rounded transition-colors"
            title="Clear all canvas items"
          >
            Clear
          </button>
          <button className="px-3 py-1.5 text-xs font-bold text-white bg-primary hover:bg-blue-600 rounded transition-colors flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[14px]">save</span>
            Save Workflow
          </button>
        </div>
      </div> */}

      {/* DnD Builder body */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex overflow-hidden" style={{ height: '83vh' }}>
          <WorkflowLeftSidebar />
          <WorkflowCanvas
            canvasItems={canvasItems}
            onRemove={handleRemove}
            selectedId={selectedId}
            onSelect={handleSelect}
            onFormChange={handleFormChange}
          />
          <WorkflowRightSidebar
            selectedItem={selectedItem}
            onUpdateItem={handleUpdateItem}
            onDeselect={() => setSelectedId(null)}
          />
        </div>

        {/* Drag overlay */}
        <DragOverlay dropAnimation={null}>
          {activeData && activeType === 'sidebar' ? (
            <div className="flex w-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-primary bg-white dark:bg-surface-dark p-3 shadow-xl">
              <span className="material-symbols-outlined text-primary text-[22px]">
                {activeData.icon}
              </span>
              <span className="text-xs font-semibold text-primary text-center">
                {activeData.label}
              </span>
            </div>
          ) : null}
          {activeData && activeType === 'canvas' ? (
            <div className="w-full max-w-2xl rounded-xl border-2 border-primary bg-white dark:bg-surface-dark px-4 py-3 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">
                  {activeData.icon}
                </span>
                <span className="text-xs font-bold text-primary">
                  {activeData.title || activeData.label}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
