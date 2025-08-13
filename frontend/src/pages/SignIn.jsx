import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      if (res.ok) {
        const user = await res.json();
        alert(`Welcome back, ${user.username}!`);
        onLogin();
        navigate("/dashboard");
      } else {
        const errorData = await res.json().catch(() => ({})); 
        alert(errorData.error || "Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to log in. Please try again later.");
    }
  };

  return (
    <div className="container">
      <center><h2>Login</h2></center>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}
