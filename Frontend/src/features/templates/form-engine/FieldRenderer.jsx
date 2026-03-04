/**
 * FieldRenderer.jsx
 * Renders a single form field based on its schema definition.
 * Handles both lowercase (text, number, date, dropdown, textarea, boolean, file)
 * and uppercase (TEXT, NUMBER, DATE, DROPDOWN, TEXTAREA, BOOLEAN, FILE) type strings.
 */

const FieldRenderer = ({ field, value, onChange }) => {
  const type = field.type?.toUpperCase();

  switch (type) {
    case 'TEXT':
      return (
        <input
          type="text"
          id={field.key}
          value={value ?? field.default ?? ''}
          placeholder={field.placeholder || field.label}
          readOnly={field.readonly}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors disabled:bg-slate-50 disabled:text-slate-400"
        />
      );

    case 'NUMBER':
      return (
        <input
          type="number"
          id={field.key}
          value={value ?? field.default ?? ''}
          placeholder={field.placeholder || field.label}
          readOnly={field.readonly}
          onChange={(e) => onChange(field.key, Number(e.target.value))}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      );

    case 'DATE':
      return (
        <input
          type="date"
          id={field.key}
          value={value ?? field.default ?? ''}
          readOnly={field.readonly}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      );

    case 'BOOLEAN':
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id={field.key}
            checked={value ?? field.default ?? false}
            disabled={field.readonly}
            onChange={(e) => onChange(field.key, e.target.checked)}
            className="w-4 h-4 rounded accent-primary"
          />
          <span className="text-xs text-slate-600">{field.label}</span>
        </label>
      );

    case 'DROPDOWN': {
      const options = field.options ?? [];
      const isObjectOptions = options.length > 0 && typeof options[0] === 'object';
      return (
        <select
          id={field.key}
          value={value ?? field.default ?? ''}
          disabled={field.readonly}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
        >
          <option value="">{field.placeholder || `Select ${field.label}`}</option>
          {isObjectOptions
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
        </select>
      );
    }

    case 'TEXTAREA':
      return (
        <textarea
          id={field.key}
          rows={3}
          value={value ?? field.default ?? ''}
          placeholder={field.placeholder || field.label}
          readOnly={field.readonly}
          onChange={(e) => onChange(field.key, e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-colors resize-none"
        />
      );

    case 'FILE':
      return (
        <input
          type="file"
          id={field.key}
          accept=".pdf,.doc,.docx"
          onChange={(e) => onChange(field.key, e.target.files[0])}
          className="w-full text-xs text-slate-600 file:mr-3 file:rounded file:border-0 file:bg-primary/10 file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary hover:file:bg-primary/20 cursor-pointer"
        />
      );

    default:
      return null;
  }
};

export default FieldRenderer;
