import React, { useEffect, useState } from "react";
import { FaRegCircle, FaTrash, FaFloppyDisk, FaCircleCheck } from "react-icons/fa6";
import { MdModeEdit, MdCancel } from "react-icons/md";

// IndexDB
const getLocalStorage = () => {
  let tasks = localStorage.getItem("tasks");
  if (tasks) {
    return JSON.parse(tasks) as { text: string; completed: boolean }[];
  } else {
    return [];
  }
};

// TodoList
const TodoList = () => {
  const [tasks, setTasks] = useState<{ text: string; completed: boolean }[]>(
    getLocalStorage()
  );
  const [newTask, setNewTask] = useState<string>("");
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editTaskText, setEditTaskText] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewTask(event.target.value);
  }

  function handleKeyEnter(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      addTask();
    }
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask("");
    }
  }

  function checkTaskCompletion(index: number) {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  }

  function deleteTask(index: number) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }

  function handleEditInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEditTaskText(event.target.value);
  }

  function handleEditKeyEnter(
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (event.key === "Enter") {
      saveEditTask(index);
    }
  }

  function startEditingTask(index: number) {
    setIsEditing(index);
    setEditTaskText(tasks[index].text);
  }

  function cancelEditing() {
    setIsEditing(null);
    setEditTaskText("");
  }

  function saveEditTask(index: number) {
    if (editTaskText.trim() === "") {
      deleteTask(index);
    } else {
      const updatedTasks = tasks.map((task, i) =>
        i === index ? { ...task, text: editTaskText } : task
      );
      setTasks(updatedTasks);
    }
    setIsEditing(null);
    setEditTaskText("");
  }

  return (
    <div className="Todo-section">
      <div className="todo-contents">
        <div className="todo-header">
          <h3>Tasks</h3>
        </div>

        <div className="task-display">
          {tasks.map((task, index) => (
            <div key={index} className="task-item">
              <div className="task-contents">
                <div className="task-buttons">
                  {task.completed ? (
                    <FaCircleCheck onClick={() => checkTaskCompletion(index)} />
                  ) : (
                    <FaRegCircle onClick={() => checkTaskCompletion(index)} />
                  )}
                </div>
                {isEditing === index ? (
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={handleEditInputChange}
                    onKeyDown={(event) => handleEditKeyEnter(event, index)}
                    className="task-input"
                  />
                ) : (
                  <span
                    className="task-text"
                    style={{
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                    onClick={() => checkTaskCompletion(index)}
                  >
                    {task.text}
                  </span>
                )}
              </div>
              {isEditing === index ? (
                <>
                  <button
                    className="task-save-btn task-delete-btn"
                    onClick={() => saveEditTask(index)}
                  >
                    <FaFloppyDisk />
                  </button>
                  <button
                    className="task-cancel-btn task-delete-btn"
                    onClick={cancelEditing}
                  >
                    <MdCancel />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="task-edit-btn task-delete-btn"
                    onClick={() => startEditingTask(index)}
                  >
                    <MdModeEdit />
                  </button>
                  <button
                    className="task-delete-btn trash-btn"
                    onClick={() => deleteTask(index)}
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="add-task-section">
          <div className="add-task-content">
            <input
              value={newTask}
              onChange={handleInputChange}
              onKeyDown={handleKeyEnter}
              className="task-input"
              placeholder="Enter new task..."
              type="text"
            />
            <button className="add-btn" onClick={addTask}>
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
