// import { useDroppable } from '@dnd-kit/core';
// import {
//   SortableContext,
//   verticalListSortingStrategy,
//   useSortable,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// // ── SortableCanvasItem ─────────────────────────────────────────────────────────

// function SortableCanvasItem({ item, isSelected, onSelect, onRemove }) {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id: item.id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     opacity: isDragging ? 0.4 : 1,
//   };

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 cursor-pointer ${
//         isSelected
//           ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-md'
//           : 'border-border-light dark:border-border-dark bg-white dark:bg-surface-dark hover:border-primary/40 hover:shadow-sm'
//       }`}
//       onClick={() => onSelect(item.id)}
//     >
//       {/* Drag handle */}
//       <span
//         {...listeners}
//         {...attributes}
//         className="material-symbols-outlined text-[16px] text-text-muted cursor-grab active:cursor-grabbing hover:text-primary shrink-0"
//         onClick={(e) => e.stopPropagation()}
//       >
//         drag_indicator
//       </span>

//       {/* Icon */}
//       <div
//         className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
//           isSelected
//             ? 'bg-primary text-white'
//             : 'bg-gray-100 dark:bg-gray-700 text-text-muted group-hover:bg-primary/10 group-hover:text-primary'
//         }`}
//       >
//         <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
//       </div>

//       {/* Info */}
//       <div className="flex-1 min-w-0">
//         <p className="text-sm font-semibold text-text-main dark:text-white truncate">
//           {item.title || item.label}
//         </p>
//         {item.description && (
//           <p className="text-xs text-text-muted truncate">{item.description}</p>
//         )}
//       </div>

//       {/* Remove */}
//       <button
//         onClick={(e) => {
//           e.stopPropagation();
//           onRemove(item.id);
//         }}
//         className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-text-muted hover:text-red-500 transition-all shrink-0"
//         title="Remove"
//       >
//         <span className="material-symbols-outlined text-[16px]">close</span>
//       </button>
//     </div>
//   );
// }

// // ── EmptyDropZone ──────────────────────────────────────────────────────────────

// function EmptyDropZone({ isOver }) {
//   return (
//     <div
//       className={`flex h-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-all duration-200 ${
//         isOver
//           ? 'border-primary bg-primary/5 scale-[1.01]'
//           : 'border-border-light dark:border-border-dark'
//       }`}
//     >
//       <span
//         className={`material-symbols-outlined text-[40px] transition-colors ${
//           isOver ? 'text-primary' : 'text-text-muted'
//         }`}
//       >
//         {isOver ? 'add_circle' : 'dashboard_customize'}
//       </span>
//       <div className="text-center px-6">
//         <p className="text-sm font-semibold text-text-main dark:text-white">
//           {isOver ? 'Drop to add stage' : 'Drag components here'}
//         </p>
//         <p className="text-xs text-text-muted mt-1">
//           Build your workflow by dragging stages from the left panel
//         </p>
//       </div>
//     </div>
//   );
// }

// // ── WorkflowCanvas ─────────────────────────────────────────────────────────────

// export default function WorkflowCanvas({ canvasItems, onRemove, selectedId, onSelect }) {
//   const { setNodeRef, isOver } = useDroppable({ id: 'canvas-drop-zone' });

//   return (
//     <main
//       ref={setNodeRef}
//       className="flex flex-1 flex-col overflow-hidden bg-background-light dark:bg-background-dark"
//     >
//       {/* Canvas header */}
//       <div className="flex items-center justify-between border-b border-border-light dark:border-border-dark px-4 py-2 shrink-0">
//         <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
//           Canvas
//         </span>
//         <span className="text-[10px] text-text-muted">
//           {canvasItems.length} stage{canvasItems.length !== 1 ? 's' : ''}
//         </span>
//       </div>

//       {/* Scrollable canvas body */}
//       <div className="flex-1 overflow-y-auto p-4">
//         {canvasItems.length === 0 ? (
//           <EmptyDropZone isOver={isOver} />
//         ) : (
//           <SortableContext
//             items={canvasItems.map((c) => c.id)}
//             strategy={verticalListSortingStrategy}
//           >
//             <div className="flex flex-col gap-2">
//               {canvasItems.map((item) => (
//                 <SortableCanvasItem
//                   key={item.id}
//                   item={item}
//                   isSelected={selectedId === item.id}
//                   onSelect={onSelect}
//                   onRemove={onRemove}
//                 />
//               ))}
//             </div>
//           </SortableContext>
//         )}
//       </div>
//     </main>
//   );
// }


// ------------------------------------------------------------------------------------------

import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableCard({ item, onRemove, isSelected, onSelect }) {
  const [expanded, setExpanded] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(item.id)}
      className={`relative w-full cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all ${
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div
        className={`flex w-full items-center justify-between border-b px-4 py-2 ${
          isSelected
            ? "border-primary/20 bg-primary/5"
            : "border-slate-100 bg-slate-50"
        }`}
      >
        {/* Drag handle */}
        <div
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className="mr-2 flex cursor-grab items-center text-slate-300 hover:text-slate-500 active:cursor-grabbing"
          title="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="material-symbols-outlined text-base">
            drag_indicator
          </span>
        </div>

        <div
          className="flex flex-1 items-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            setExpanded((prev) => !prev)
          }}
        >
          <span
            className={`material-symbols-outlined text-sm ${isSelected ? "text-primary" : "text-slate-500"}`}
          >
            {item.icon}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? "text-primary" : "text-slate-500"}`}
          >
            {item.title || item.label}
          </span>
          {item.description && (
            <span className="ml-1 truncate text-[10px] text-slate-400">
              {"- "}
              {item.description}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRemove(item.id)
            }}
            className="material-symbols-outlined text-base text-slate-400 transition-colors hover:text-red-400"
            title="Remove"
          >
            close
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setExpanded((prev) => !prev)
            }}
            className={`material-symbols-outlined text-base text-slate-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            expand_more
          </button>
        </div>
      </div>

      <div
        className={`grid transition-all duration-200 ease-in-out ${expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 p-4">
            <div className="grid grid-cols-2 gap-3">
              {item.fields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    {field.label}
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {item.fieldValues?.[field.key] ?? field.default}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Connector() {
  return (
    <div className="relative flex h-8 w-0.5 items-center justify-center bg-slate-200">
      <div className="absolute bottom-0 h-2 w-2 translate-y-1/2 rounded-full bg-slate-300"></div>
    </div>
  )
}

export default function WorkflowCanvas({ canvasItems, onRemove, selectedId, onSelect }) {
  const { isOver, setNodeRef } = useDroppable({ id: "canvas-drop-zone" })

  const isEmpty = canvasItems.length === 0
  const itemIds = canvasItems.map((item) => item.id)

  return (
    <section className="flex flex-1 flex-col overflow-hidden bg-slate-50/50">
      <div className="flex items-center gap-2 px-5 py-2 text-slate-400">
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Workflow Canvas
        </span>
        <div className="h-px flex-1 bg-slate-200"></div>
      </div>

      <div
        ref={setNodeRef}
        className={`mx-3 mb-3 flex flex-1 flex-col overflow-y-auto rounded-xl border bg-white shadow-sm transition-colors duration-150 ${
          isOver
            ? "border-primary/50 bg-primary/5 ring-2 ring-primary/20"
            : "border-slate-200"
        }`}
      >
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-slate-400">
            <span className="material-symbols-outlined mb-2 text-5xl text-slate-300">
              drag_indicator
            </span>
            <p className="text-sm font-semibold text-slate-500">
              Drag components here
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Drop workflow stages from the left panel to build your flow
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-0 p-5">
            <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
              {canvasItems.map((item, idx) => (
                <div key={item.id} className="flex w-full max-w-2xl flex-col items-center">
                  {idx > 0 && <Connector />}
                  <div className="w-full">
                    <SortableCard
                      item={item}
                      onRemove={onRemove}
                      isSelected={selectedId === item.id}
                      onSelect={onSelect}
                    />
                  </div>
                </div>
              ))}
            </SortableContext>

            <div className="mt-3 w-full max-w-2xl">
              <div
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-colors ${
                  isOver
                    ? "border-primary/50 bg-primary/5 text-primary"
                    : "border-slate-200 bg-slate-50/30 text-slate-400 hover:border-primary/30"
                }`}
              >
                <span className="material-symbols-outlined mb-1">add_circle</span>
                <p className="text-xs font-medium">
                  {isOver ? "Drop to add stage" : "Add next workflow stage"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}



