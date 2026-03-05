import { useState } from "react";

const TemplateRow = ({
  template,
  onDelete,
  onClone,
  onUpdate,
  onClick,
  isSelected,
  isLoading,
  setSelectedTemplate
}) => {
  /* ─────────────────────────────────────────────
     Local state for inline editing
  ───────────────────────────────────────────── */

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(template.name);
  const [editDescription, setEditDescription] = useState(
    template.description || ""
  );

  /* ─────────────────────────────────────────────
     Save edited fields
  ───────────────────────────────────────────── */

  const handleEditSave = (e) => {
    e.stopPropagation();
    let updatedTemplate;
    const newName = editName.trim();
    const newDescription = editDescription.trim();
    console.log(newDescription);
    if (
      newName !== template.name ||
      newDescription !== (template.description || "")
    ) {
      updatedTemplate = onUpdate(template.id, {
        name: newName,
        description: newDescription,
      });
    }

    setIsEditing(false);
    console.log("Updated Template: ", updatedTemplate);
    setSelectedTemplate(updatedTemplate);
  };

  /* ─────────────────────────────────────────────
     Cancel editing
  ───────────────────────────────────────────── */

  const handleEditCancel = (e) => {
    e.stopPropagation();
    setEditName(template.name);
    setEditDescription(template.description || "");
    setIsEditing(false);
  };

  if (isSelected) {
    return(
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`grid grid-cols-[2fr_3fr_auto] items-center gap-4 px-4 py-3
      border-b border-gray-200
      cursor-pointer transition-colors
      ${
        isSelected
          ? "bg-white border-l-2 border-blue-600"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {/* ─────────────── Title Column ─────────────── */}

      <div className="font-medium text-gray-800 truncate">
        {isEditing ? (
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSave(e);
              if (e.key === "Escape") handleEditCancel(e);
            }}
            className="border border-blue-500 rounded px-2 py-1 text-sm w-56 bg-white"
          />
        ) : (
          template.name
        )}
      </div>

      {/* ─────────────── Description Column ─────────────── */}

      <div className="text-sm text-gray-600 truncate">
        {isEditing ? (
          <input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="border border-blue-500 rounded px-2 py-1 text-sm w-full bg-white"
          />
        ) : (
          template.description || "No description"
        )}
      </div>

      {/* ─────────────── Actions Column ─────────────── */}

      <div
        className="flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Edit */}

        {!isEditing && (
          <button
          onClick={() => {
            setIsEditing(true);
            setEditName(template.name);
            setEditDescription(template.description || "");
          }}
            className="text-blue-600 hover:text-blue-700"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[20px]">
              edit_square
            </span>
          </button>
        )}

        {/* Save */}

        {isEditing && (
          <button
            onClick={handleEditSave}
            className="text-green-600"
            title="Save"
          >
            <span className="material-symbols-outlined text-[20px]">
              check
            </span>
          </button>
        )}

        {/* Cancel */}

        {isEditing && (
          <button
            onClick={handleEditCancel}
            className="text-red-500"
            title="Cancel"
          >
            <span className="material-symbols-outlined text-[20px]">
              close
            </span>
          </button>
        )}
        
      </div>
    </div>);
  }

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className={`grid grid-cols-[2fr_3fr_auto] items-center gap-4 px-4 py-3
      border-b border-gray-200
      cursor-pointer transition-colors
      ${
        isSelected
          ? "bg-gray-200 border-l-2 border-blue-600"
          : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {/* ─────────────── Title Column ─────────────── */}

      <div className="font-medium text-gray-800 truncate">
        {isEditing ? (
          <input
            autoFocus
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSave(e);
              if (e.key === "Escape") handleEditCancel(e);
            }}
            className="border border-blue-500 rounded px-2 py-1 text-sm w-56 bg-white"
          />
        ) : (
          template.name
        )}
      </div>

      {/* ─────────────── Description Column ─────────────── */}

      <div className="text-sm text-gray-600 truncate">
        {isEditing ? (
          <input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="border border-blue-500 rounded px-2 py-1 text-sm w-full bg-white"
          />
        ) : (
          template.description || "No description"
        )}
      </div>

      {/* ─────────────── Actions Column ─────────────── */}

      <div
        className="flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Edit */}

        {!isEditing && (
          <button
          onClick={() => {
            setIsEditing(true);
            setEditName(template.name);
            setEditDescription(template.description || "");
          }}
            className="text-blue-600 hover:text-blue-700"
            title="Edit"
          >
            <span className="material-symbols-outlined text-[20px]">
              edit_square
            </span>
          </button>
        )}

        {/* Save */}

        {isEditing && (
          <button
            onClick={handleEditSave}
            className="text-green-600"
            title="Save"
          >
            <span className="material-symbols-outlined text-[20px]">
              check
            </span>
          </button>
        )}

        {/* Cancel */}

        {isEditing && (
          <button
            onClick={handleEditCancel}
            className="text-red-500"
            title="Cancel"
          >
            <span className="material-symbols-outlined text-[20px]">
              close
            </span>
          </button>
        )}

        {/* Clone */}

        <button
          onClick={() => onClone(template.id)}
          disabled={isLoading}
          className={`text-blue-600 hover:text-blue-700 ${
            isLoading ? "opacity-40 cursor-not-allowed" : ""
          }`}
          title="Clone"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isLoading ? "sync" : "content_copy"}
          </span>
        </button>

        {/* Delete */}

        <button
          onClick={() => {
            if (window.confirm(`Delete "${template.name}"?`)) {
              onDelete(template.id);
            }
          }}
          className="text-red-500 hover:text-red-600"
          title="Delete"
        >
          <span className="material-symbols-outlined text-[20px]">
            delete
          </span>
        </button>
      </div>
    </div>
  );
};

export default TemplateRow;