import React from "react";
import { FiX, FiEdit2 } from "react-icons/fi";

export default function TaskItem({
  task,
  editId,
  editName,
  editPriority,
  editDueDate,
  setEditName,
  setEditPriority,
  setEditDueDate,
  handleEdit,
  handleSave,
  handleCancel,
  handleToggleComplete,
  handleDelete,
}) {
  const isEditing = editId === task.id;

  return (
    <li
      className={`relative flex flex-col gap-2 p-4 mb-2 rounded-lg border-b border-indigo-100 ${
        isEditing ? "bg-white" : "bg-indigo-50 hover:bg-indigo-100"
      } overflow-hidden`}
      style={{ maxWidth: "100%" }}
    >
      {/* Main row: left (checkbox, name, priority), right (buttons) */}
      <div className="flex flex-row items-center justify-between gap-2 w-full min-w-0">
        {/* Left: tickbox, name, priority */}
        <div className="flex flex-row items-center min-w-0 gap-2 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => handleToggleComplete(task.id)}
            className="accent-green-500 flex-shrink-0 scale-110"
          />
          {isEditing ? (
            <>
              <input
                className="border border-indigo-300 rounded px-2 py-1 text-gray-800 min-w-0"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{ maxWidth: "100%" }}
              />
              <select
                className="border border-indigo-300 rounded px-2 py-1 text-gray-800 min-w-0"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </>
          ) : (
            <>
              <span
                className={`font-medium truncate ${
                  task.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-800"
                }`}
                style={{ maxWidth: "100%" }}
                title={task.name}
              >
                {task.name}
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ml-2 ${
                  task.priority === "High"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.priority}
              </span>
            </>
          )}
        </div>
        {/* Right: edit and delete buttons */}
        <div className="flex flex-row gap-2 items-center flex-shrink-0 ml-2">
          {isEditing ? (
            <>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-all duration-150 font-medium text-base h-10"
                onClick={() => handleSave(task.id)}
              >
                Save
              </button>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded transition-all duration-150 font-medium text-base h-10"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full w-7 h-7 flex items-center justify-center transition"
                onClick={() => handleEdit(task)}
                aria-label="Edit"
                style={{ minWidth: "1.75rem", minHeight: "1.75rem" }}
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-sm transition"
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this task?")
                  ) {
                    handleDelete(task.id);
                  }
                }}
                aria-label="Delete"
                tabIndex={0}
                style={{ minWidth: "1.75rem", minHeight: "1.75rem" }}
              >
                <FiX className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
      {/* Due date always below the top row */}
      <div>
        {isEditing ? (
          <input
            className="border border-indigo-300 rounded px-2 py-1 text-gray-800 min-w-0 mt-1 sm:mt-0"
            type="datetime-local"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            style={{ maxWidth: "100%" }}
          />
        ) : (
          task.dueDate && (
            <span
              className="block text-xs text-indigo-700 truncate mt-1 ml-7 sm:ml-0"
              title={task.dueDate}
            >
              {(() => {
                const d = new Date(task.dueDate);
                // Swap day and month in the output, keep time as before
                const formatted = d
                  .toLocaleString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                  })
                  .replace(/^(\d{2})\/(\d{2})/, (_, mm, dd) => `${dd}/${mm}`);
                return formatted;
              })()}
            </span>
          )
        )}
      </div>
    </li>
  );
}
