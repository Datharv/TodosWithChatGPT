import React, { useEffect, useState } from "react";
import api from "./api";
import LoginRegisterPage from "./components/LoginRegisterPage";
import TaskPage from "./components/TaskPage";
import "./styles.css"; 

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the authentication token exists in the local storage
    const token = localStorage.getItem("token");
    if (token) {
      // Set the authentication token as the default Authorization header in Axios
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Remove the authentication token from local storage
    localStorage.removeItem("token");
    // Remove the default Authorization header from Axios
    delete api.defaults.headers.common["Authorization"];
    setLoggedIn(false);
  };

  return (
    <div>
      <h1>Todo App</h1>
      {loggedIn ? (
        <div>
          <TaskPage onLogout={handleLogout} />
        </div>
      ) : (
        <LoginRegisterPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
