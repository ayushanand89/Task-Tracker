import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: JSON.parse(localStorage.getItem("tasks")) || [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.list.push(action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.list));
    },
    deleteTask: (state, action) => {
      state.list = state.list.filter((task) => task.id !== action.payload);
      localStorage.setItem("tasks", JSON.stringify(state.list));
    },
    updateTask: (state, action) => {
      const idx = state.list.findIndex((task) => task.id === action.payload.id);
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...action.payload };
        localStorage.setItem("tasks", JSON.stringify(state.list));
      }
    },
    toggleComplete: (state, action) => {
      const task = state.list.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
        localStorage.setItem("tasks", JSON.stringify(state.list));
      }
    },
    setTasks: (state, action) => {
      state.list = action.payload;
      localStorage.setItem("tasks", JSON.stringify(state.list));
    },
  },
});

export const { addTask, deleteTask, updateTask, toggleComplete, setTasks } =
  tasksSlice.actions;
export default tasksSlice.reducer;
