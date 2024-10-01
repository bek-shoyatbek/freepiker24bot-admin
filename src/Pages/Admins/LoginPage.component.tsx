import React, { useState } from "react";
import Swal from "sweetalert2";
import "./LoginPage.styles.css"; // We'll create this CSS file separately
import { Axios } from "../../Api/axios";

interface LoginResponse {
  token: string;
}

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await Axios.post(
        "/auth/login",
        JSON.stringify({ username, password }),
      );

      if (response.status > 400) {
        throw new Error("Login failed");
      }

      const data: LoginResponse = response.data;
      // Handle successful login, e.g., store the token in localStorage
      localStorage.setItem("token", data.token);
      // Show success message
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have been successfully logged in!",
      });
      // Redirect or update app state as needed
      console.log("Login successful, token:", data.token);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};
