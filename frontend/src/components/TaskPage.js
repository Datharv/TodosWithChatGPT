import React, { useEffect, useState } from "react";
import api from "../api";

function TaskPage({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/api/tasks");
      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const createTask = async () => {
    try {
      const response = await api.post("/api/tasks", {
        title: newTask,
        description: newTaskDescription,
      });

      setNewTask("");
      setNewTaskDescription("");
      fetchTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await api.put(`/api/tasks/${taskId}`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  return (
    <div className="container">
      <div className="add-task">
        <input
          type="text"
          placeholder="Task Title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        ></textarea>
        <button onClick={createTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task._id, task.completed)}
            />
            <span className={task.completed ? "completed" : ""}>
              {task.title}
            </span>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

export default TaskPage;
