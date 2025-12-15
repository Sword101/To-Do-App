import React, { useEffect, useState } from "react";
import { MdDelete, MdFileDownload, MdCancel } from "react-icons/md";
import { IoCheckmarkDone } from "react-icons/io5";
import usetodo from "../TodoContext/TodoContext";

export default function TaskList({ todo }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(null);
  const [editDescription, setEditDescription] = useState(null);
  const [editPriority, setEditPriority] = useState(null);

  // Sync task data into editable fields when todo changes
  useEffect(() => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditPriority(todo.taskpriority);
  }, [todo]);

  // context methods
  const { removeTodo, updateTodo } = usetodo();

  // Delete the current task
  const handleDelete = () => {
    removeTodo(todo.id);
    setIsModalOpen(false);
  };

  // Save the updated task details
  const handleSave = () => {
    updateTodo(todo.id, editTitle, editDescription, editPriority);
    setIsModalOpen(false);
  };

  // Download the note
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(
      [`Title: ${editTitle}\nDescription: ${editDescription}`],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${editTitle || "note"}.txt`;
    element.click();
    alert("Note downloaded successfully");
  };

  // Card background classes based on priority
  const cardBgClass =
    todo.taskpriority === "high"
      ? "bg-red-100"
      : todo.taskpriority === "low"
      ? "bg-green-100"
      : "bg-white";

  // Modal background classes based on current editPriority (optional)
  const modalBgClass =
    editPriority === "high"
      ? "bg-red-100"
      : editPriority === "low"
      ? "bg-green-100"
      : "bg-white dark:bg-gray-800";

  return (
    <>
      {/* Task Card */}
      <div
        onClick={() => setIsModalOpen(true)}
        className={`w-full max-w-sm sm:max-w-md lg:max-w-lg cursor-pointer p-4 border border-gray-200 rounded-xl shadow hover:shadow-lg transition dark:bg-gray-800 dark:border-gray-700 ${cardBgClass}`}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
          {todo.title || "Untitled Task"}
        </h3>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-1">
          {todo.description || "No description provided."}
        </p>
        {todo.taskpriority && (
          <div className="mt-2">
            <span className="inline-block px-3 py-1 text-xs sm:text-sm font-medium rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-white">
              Priority: {todo.taskpriority}
            </span>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-opacity-50 backdrop-blur-sm">
          <div
            className={`relative w-full max-w-md sm:max-w-lg rounded-xl p-6 shadow-xl ${modalBgClass}`}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-white"
            >
              <MdCancel className="w-5 h-5" />
            </button>

            {/* Title Input */}
            <input
              className="w-full mb-3 text-xl font-semibold border-b border-gray-300 outline-none bg-transparent text-gray-900 dark:text-white"
              type="text"
              value={editTitle || ""}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
            />

            {/* Description Textarea */}
            <textarea
              className="w-full text-sm sm:text-base border-b border-gray-300 outline-none resize-none bg-transparent text-gray-700 dark:text-gray-300"
              rows={4}
              value={editDescription || ""}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Description"
            />

            {/* Priority Select */}
            <select
              value={editPriority || "normal"}
              onChange={(e) => setEditPriority(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>

            {/* Footer Buttons */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Editing Task
              </span>
              <div className="flex space-x-2">
                {/* Save */}
                <button
                  onClick={handleSave}
                  className="p-2 rounded-full bg-green-100 hover:bg-green-200 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  <IoCheckmarkDone className="w-5 h-5 text-green-600" />
                </button>

                {/* Delete */}
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-700 dark:hover:bg-red-600"
                >
                  <MdDelete className="w-5 h-5 text-red-600" />
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  <MdFileDownload className="w-5 h-5 text-blue-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
