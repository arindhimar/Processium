/**
 * FormRenderer.jsx
 * Renders a full schema-driven form inside a WorkflowCanvas card.
 * Uses FieldRenderer for individual field types.
 */

import { useState } from 'react';
import FieldRenderer from './FieldRenderer';

const FormRenderer = ({ schema, onChange }) => {
  // Build initial form state from schema field defaults
  const buildInitialValues = () => {
    const values = {};
    schema.fields.forEach((field) => {
      values[field.key] = field.default ?? null;
    });
    return values;
  };

  const [values, setValues] = useState(buildInitialValues);

  const handleChange = (key, value) => {
    const updated = { ...values, [key]: value };
    setValues(updated);
    onChange?.(updated);
  };

  // Sort fields by their order property
  const sortedFields = [...schema.fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div className="space-y-4">
      {/* Schema description */}
      {schema.description && (
        <p className="text-[11px] text-slate-400 leading-relaxed border-b border-slate-100 pb-3">
          {schema.description}
        </p>
      )}

      {/* Field grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {sortedFields.map((field) => {
          const isWide =
            field.type?.toUpperCase() === 'TEXTAREA' ||
            field.type?.toUpperCase() === 'FILE';

          return (
            <div
              key={field.key}
              className={isWide ? 'col-span-2' : 'col-span-1'}
            >
              <label
                htmlFor={field.key}
                className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-400" title="Required">*</span>
                )}
              </label>
              <FieldRenderer
                field={field}
                value={values[field.key]}
                onChange={handleChange}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FormRenderer;