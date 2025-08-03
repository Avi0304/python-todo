import React, { useState, useEffect } from "react";
import { LogOut, Plus } from "lucide-react";
import TodoCard from "../components/TodoCard";
import AddTodoModal from "../components/AddTodoModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from 'react-toastify';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoText, setTodoText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://python-todo-v6s1.onrender.com/api/todos/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodos(res.data || []);
      } catch (error) {
        console.error("Error fetching todos:", error.response?.data || error.message);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (task) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://python-todo-v6s1.onrender.com/api/todos/",
        { task },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optionally, refetch or append to list
      setTodos((prev) => [
        ...prev,
        {
          id: res.data.id || Date.now(), // fallback if id not returned
          task,
          done: false,
          created_at: new Date().toISOString(),
        },
      ]);

      setIsModalOpen(false);
      setTodoText("");
    } catch (error) {
      console.error("Error adding todo:", error.response?.data || error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://python-todo-v6s1.onrender.com/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error.response?.data || error.message);
    }
  };

  const editTodo = async (id, newText) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://python-todo-v6s1.onrender.com/api/todos/${id}`,
        { task: newText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, task: newText } : todo
        )
      );
    } catch (error) {
      console.error("Error editing todo:", error.response?.data || error.message);
    }
  };

  const toggleTodo = async (id) => {
    const todoToToggle = todos.find((t) => t.id === id);
    if (!todoToToggle) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://python-todo-v6s1.onrender.com/api/todos/${id}`,
        { done: !todoToToggle.done },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, done: !todo.done } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling todo:", error.response?.data || error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <nav className="fixed top-0 z-10 flex w-full items-center justify-between bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">My Todos</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center rounded bg-red-400 px-4 py-2 text-white hover:bg-red-500"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Todo
          </button>

          <button
            onClick={handleLogout}
            variant="outline"
            className="border border-gray-300 px-4 py-2 text-gray-700 flex items-center rounded hover:bg-gray-50 bg-transparent"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </button>
        </div>
      </nav>

      <div className="mt-20 w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">Your Tasks</h2>
        <div className="space-y-4">
          {todos.length === 0 ? (
            <p className="text-center text-gray-500">
              No todos yet! Click "Add New Todo" to get started.
            </p>
          ) : (
            todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
              />
            ))
          )}
        </div>
      </div>

      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTodo={handleAddTodo}
        todoText={todoText}
        setTodoText={setTodoText}
      />
    </div>
  );
};

export default TodoPage;
