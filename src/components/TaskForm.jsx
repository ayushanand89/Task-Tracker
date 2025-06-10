import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../redux/slices/tasksSlice";
import toast from "react-hot-toast";

const priorities = ["High", "Medium", "Low"];

export default function TaskForm() {
  const dispatch = useDispatch();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");

  const resetForm = () => {
    setName("");
    setPriority("Low");
    setDueDate("");
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Task name cannot be empty");
      return;
    }
    const newTask = {
      id: Date.now().toString(),
      name: name.trim(),
      priority,
      dueDate:
        dueDate && !isNaN(new Date(dueDate).getTime())
          ? new Date(dueDate).toISOString()
          : null,
      createdAt: new Date().toISOString(),
      completed: false,
    };
    dispatch(addTask(newTask));
    toast.success("Task added!");
    resetForm();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-indigo-200 rounded-xl p-6 max-w-lg w-full mx-auto mt-8 mb-8 shadow"
    >
      <h2 className="text-lg font-semibold text-indigo-700 mb-5 text-center">
        {step === 1 ? "Add New Task" : "Set Priority & Deadline"}
      </h2>
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <label className="block font-medium min-w-[100px] text-gray-700">
              Task Name:
            </label>
            <input
              className="flex-1 border border-indigo-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter task name"
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              className="bg-indigo-500 text-white px-4 py-2 rounded font-medium transition-all duration-200 transform hover:bg-indigo-600 hover:scale-110 active:scale-95"
              onClick={() => {
                if (!name.trim()) {
                  toast.error("Task name cannot be empty");
                  return;
                }
                setStep(2);
              }}
            >
              Select Priority and Deadline
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded font-medium transition-all duration-200 transform hover:bg-blue-600 hover:scale-110 active:scale-95"
            >
              Add Task
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <label className="block font-medium min-w-[100px] text-gray-700">
              Priority:
            </label>
            <select
              className="flex-1 border border-indigo-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="block font-medium min-w-[100px] text-gray-700">
              Deadline:
            </label>
            <input
              className="flex-1 border border-indigo-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
            {dueDate ? (
              <span className="text-xs text-gray-600 sm:mb-0 mb-2 sm:text-left text-center w-full sm:w-auto">
                Selected Deadline:{" "}
                {new Date(dueDate).toLocaleString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
            ) : (
              <span />
            )}
            <div className="flex gap-2 justify-center sm:justify-end w-full sm:w-auto">
              <button
                type="button"
                className="bg-indigo-500 text-white px-4 py-2 rounded font-medium transition-all duration-200 transform hover:bg-indigo-600 hover:scale-110 active:scale-95"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded font-medium transition-all duration-200 transform hover:bg-blue-600 hover:scale-110 active:scale-95"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
