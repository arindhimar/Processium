import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import FormRenderer from "../form-engine/FormRenderer";
import { getSchemaForType } from "../services/schemaRegistry";

// ── SortableCard ───────────────────────────────────────────────────────────────

function SortableCard({ item, onRemove, isSelected, onSelect, onFormChange }) {
  const [expanded, setExpanded] = useState(false);

  const schemaEntry = getSchemaForType(item.type);
  const hasSchema   = !!schemaEntry;

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(item.id)}
      className={`relative w-full cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 ${
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* ── Card header ──────────────────────────────────────────────────── */}
      <div
        className={`flex w-full items-center justify-between border-b px-4 py-2.5 ${
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
          className="mr-2 flex cursor-grab items-center text-slate-300 hover:text-slate-500 active:cursor-grabbing shrink-0"
          title="Drag to reorder"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="material-symbols-outlined text-base">drag_indicator</span>
        </div>

        {/* Icon + title */}
        <div
          className="flex flex-1 items-center gap-2.5"
          onClick={(e) => {
            e.stopPropagation();
            if (hasSchema) setExpanded((p) => !p);
          }}
        >
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
              isSelected ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
          </div>
          <div>
            <p
              className={`text-xs font-bold leading-tight ${
                isSelected ? "text-primary" : "text-slate-700"
              }`}
            >
              {item.title || item.label}
            </p>
            {item.description && (
              <p className="text-[10px] text-slate-400 truncate max-w-[260px]">
                {item.description}
              </p>
            )}
          </div>
          {!hasSchema && (
            <span className="ml-auto text-[9px] font-semibold uppercase tracking-wide text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              No Form
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="material-symbols-outlined text-base text-slate-300 transition-colors hover:text-red-400"
            title="Remove stage"
          >
            close
          </button>
          {hasSchema && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((p) => !p);
              }}
              className={`material-symbols-outlined text-base text-slate-400 transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
              title={expanded ? "Collapse form" : "Expand form"}
            >
              expand_more
            </button>
          )}
        </div>
      </div>

      {/* ── Schema form (accordion) ──────────────────────────────────────── */}
      {hasSchema && (
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="overflow-hidden">
            <div className="border-t border-slate-100 bg-slate-50/50 p-4">
              {/* Schema title badge */}
              <div className="mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[14px] text-primary">
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {schemaEntry.schema.title}
                </span>
              </div>

              {/* Actual form */}
              <FormRenderer
                schema={schemaEntry.schema}
                onChange={(values) => onFormChange?.(item.id, values)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Connector ─────────────────────────────────────────────────────────────────

function Connector() {
  return (
    <div className="relative mx-auto flex h-8 w-px flex-col items-center justify-center bg-slate-200">
      <div className="absolute bottom-0 h-2.5 w-2.5 translate-y-1/2 rounded-full border-2 border-white bg-slate-300 shadow-sm" />
    </div>
  );
}

// ── WorkflowCanvas ─────────────────────────────────────────────────────────────

export default function WorkflowCanvas({
  canvasItems,
  onRemove,
  selectedId,
  onSelect,
  onFormChange,
}) {
  const { isOver, setNodeRef } = useDroppable({ id: "canvas-drop-zone" });

  const isEmpty  = canvasItems.length === 0;
  const itemIds  = canvasItems.map((item) => item.id);

  return (
    <section className="flex flex-1 flex-col overflow-hidden bg-slate-50/50">
      {/* Header strip */}
      <div className="flex items-center gap-2 px-5 py-2 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Workflow Canvas
        </span>
        <div className="h-px flex-1 bg-slate-200" />
        {canvasItems.length > 0 && (
          <span className="text-[10px] text-slate-400">
            {canvasItems.length} stage{canvasItems.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={`mx-3 mb-3 flex flex-1 flex-col overflow-y-auto rounded-xl border bg-white shadow-sm transition-colors duration-150 ${
          isOver
            ? "border-primary/50 bg-primary/5 ring-2 ring-primary/20"
            : "border-slate-200"
        }`}
      >
        {isEmpty ? (
          /* ── Empty state ── */
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-slate-400">
            <span className="material-symbols-outlined mb-2 text-5xl text-slate-300">
              drag_indicator
            </span>
            <p className="text-sm font-semibold text-slate-500">Drag components here</p>
            <p className="mt-1 text-xs text-slate-400">
              Drop workflow stages from the left panel to build your flow
            </p>
          </div>
        ) : (
          /* ── Cards ── */
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
                      onFormChange={onFormChange}
                    />
                  </div>
                </div>
              ))}
            </SortableContext>

            {/* "Add next stage" drop hint at bottom */}
            <div className="mt-3 w-full max-w-2xl">
              <div
                className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-colors ${
                  isOver
                    ? "border-primary/50 bg-primary/5 text-primary"
                    : "border-slate-200 bg-slate-50/30 text-slate-400 hover:border-primary/30"
                }`}
              >
                <span className="material-symbols-outlined mb-1 text-[20px]">add_circle</span>
                <p className="text-xs font-medium">
                  {isOver ? "Drop to add stage" : "Add next workflow stage"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
