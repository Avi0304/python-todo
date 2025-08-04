import React, { useState } from "react";
import { Trash2, List, CheckSquare, Pencil } from "lucide-react";

const TodoCard = ({ todo, onToggle, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.task);

  const handleSaveEdit = () => {
    if (editedText.trim() !== "") {
      onEdit(todo.id, editedText.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="w-full bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-grow gap-3">
         

          {isEditing ? (
            <input
              type="text"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSaveEdit();
              }}
              className="flex-grow border border-gray-300 rounded px-2 py-1 text-sm"
            />
          ) : (
            <label
              htmlFor={`todo-${todo.id}`}
              className={`flex-grow text-sm ml-4 ${
                todo.completed ? "line-through text-gray-500" : "text-gray-900"
              }`}
            >
              {todo.task}
            </label>
          )}
        </div>

        <div className="flex space-x-2 ml-3">
          {isEditing ? (
            <button
              onClick={handleSaveEdit}
              className="text-green-600 hover:text-green-800"
              title="Save"
            >
              <CheckSquare className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700"
              title="Edit"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            className="text-red-500 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
