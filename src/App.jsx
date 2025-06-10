import { Toaster } from "react-hot-toast";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-200 to-blue-300 flex flex-col items-center py-10 px-2 sm:px-8">
        <Toaster />
        <h1 className="text-4xl font-bold mb-8 text-indigo-700 drop-shadow-sm">
          Task Tracker
        </h1>
        <TaskForm />
        <TaskList />
      </div>
    </Provider>
  );
}

export default App;
