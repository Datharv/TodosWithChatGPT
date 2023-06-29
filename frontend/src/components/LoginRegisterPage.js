import React, { useState } from "react";
import api from "../api";

function LoginRegisterPage({ onLogin }) {
  const [loginMode, setLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  // After successful login or registration
  const handleFormSubmit = async (e) => {
    e.preventDefault();
setError("");
    
    if (loginMode) {
      // Login logic
      try {
        const response = await api.post("/api/auth/login", { email, password });
        const { token } = response.data;

        // Store the authentication token in the local storage
        localStorage.setItem("token", token);

        // Perform any additional login logic as needed
        // ...
        onLogin();
      } catch (error) {
        console.error("Login failed:", error);
        setError("Failed to login. Please check your credentials."); 
      }
    } else {
      // Registration logic
      try {
        const response = await api.post("/api/auth/register", {
          email,
          password,
        });
        const { token } = response.data;

        // Store the authentication token in the local storage
        localStorage.setItem("token", token);

        // Perform any additional registration logic as needed
        // ...
        onLogin();
      } catch (error) {
         if (error.code === 11000) {
      // Handle duplicate key error
      console.error("Duplicate key error:", error);
        setError("Email is Already existed");
         }
        console.error("Registration failed:", error);
        setError("Failed to register. Please try again later."); 
      }
    }
  };
  
  return (
    <div className="logindiv">
      <h3>{loginMode ? "Login" : "Register"}</h3>
       {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleFormSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{loginMode ? "Login" : "Register"}</button>
      </form>
      <p>
        {loginMode ? "Don't have an account? " : "Already have an account? "}
        <button onClick={() => setLoginMode(!loginMode)}>
          {loginMode ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default LoginRegisterPage;
