import { useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { ToastContainer, toast, Bounce } from 'react-toastify';

export default function AddTodoModal({
    isOpen,
    onClose,
    onAddTodo,
    todoText,
    setTodoText,
}) {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };

        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    const handleAdd = () => {
        if (todoText.trim() !== "") {
            onAddTodo(todoText.trim());
            setTodoText("");
            onClose();
            toast.success('Added Successfully and show after sometimes! ', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
       
            <div ref={modalRef} className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h2 className="text-xl font-semibold mb-2">Add New Todo</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Enter the task you want to add to your list.
                </p>
                <div className="mb-4">
                    <label htmlFor="todo-input" className="block text-sm font-medium text-gray-700 mb-1">
                        Todo
                    </label>
                    <input
                        id="todo-input"
                        type="text"
                        value={todoText}
                        onChange={(e) => setTodoText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleAdd();
                        }}
                        placeholder="e.g., Buy groceries"
                        className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-red-400"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleAdd}
                        className="flex items-center bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Todo
                    </button>
                </div>
            </div>
        </div>
    );

}
