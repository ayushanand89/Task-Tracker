import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteTask,
  updateTask,
  toggleComplete,
} from "../redux/slices/tasksSlice";
import toast from "react-hot-toast";
import TaskItem from "./TaskItem";
import { FiSearch } from "react-icons/fi";

export const PRIORITIES = ["High", "Medium", "Low"];
export const FILTER_OPTIONS = [
  { value: "created", label: "Created (Oldest First)" },
  { value: "created-latest", label: "Created (Latest First)" },
  { value: "priority-asc", label: "Priority (Low → High)" },
  { value: "priority-desc", label: "Priority (High → Low)" },
  { value: "due", label: "Urgency (Nearest Due Date First)" },
];

export function getPriorityValue(priority) {
  if (priority === "High") return 1;
  if (priority === "Medium") return 2;
  return 3;
}

export default function TaskList() {
  const tasks = useSelector((state) => state.tasks.list);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [filter, setFilter] = useState(
    () => localStorage.getItem("taskFilter") || "created"
  );

  useEffect(() => {
    localStorage.setItem("taskFilter", filter);
  }, [filter]);

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task) =>
      task.name.toLowerCase().includes(search.toLowerCase())
    );

    switch (filter) {
      case "priority-desc":
        result = [...result].sort(
          (a, b) => getPriorityValue(a.priority) - getPriorityValue(b.priority)
        );
        break;
      case "priority-asc":
        result = [...result].sort(
          (a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority)
        );
        break;
      case "due":
        result = [...result].sort((a, b) => {
          if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
          }
          if (a.dueDate && !b.dueDate) return -1;
          if (!a.dueDate && b.dueDate) return 1;
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }
          if (a.createdAt && !b.createdAt) return -1;
          if (!a.createdAt && b.createdAt) return 1;
          return 0;
        });
        break;
      case "created-latest":
        result = [...result].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        result = [...result].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
    }
    return result;
  }, [tasks, search, filter]);

  const handleEdit = (task) => {
    setEditId(task.id);
    setEditName(task.name);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate ? task.dueDate.slice(0, 16) : "");
  };

  const handleSave = (id) => {
    if (!editName.trim()) {
      toast.error("Task name cannot be empty");
      return;
    }
    dispatch(
      updateTask({
        id,
        name: editName.trim(),
        priority: editPriority,
        dueDate: editDueDate ? new Date(editDueDate).toISOString() : null,
      })
    );
    setEditId(null);
    toast.success("Task updated");
  };

  const handleCancel = () => setEditId(null);

  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
    toast.success("Task deleted");
  };

  return (
    <div className="bg-white border border-indigo-100 rounded-xl shadow p-4 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6 text-center">
        Your tasks...
      </h2>
      <TaskListControls
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />
      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-center">No tasks found.</p>
      ) : (
        <ul>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              editId={editId}
              editName={editName}
              editPriority={editPriority}
              editDueDate={editDueDate}
              setEditId={setEditId}
              setEditName={setEditName}
              setEditPriority={setEditPriority}
              setEditDueDate={setEditDueDate}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleCancel={handleCancel}
              handleToggleComplete={handleToggleComplete}
              handleDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function TaskListControls({ search, setSearch, filter, setFilter }) {
  return (
    <div className="flex flex-row gap-2 mb-4 items-center justify-between w-full">
      <div className="relative w-[70%]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <FiSearch className="h-5 w-5" />
        </span>
        <input
          className="w-full border rounded pl-10 pr-3 py-2"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <select
        className="border rounded px-3 py-2 w-[30%] text-sm ml-0"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        {FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
