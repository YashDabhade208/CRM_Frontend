import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Contexts/UserContext";
import "../Css/Login.css";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser, setloggedIn } = useUser();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Auth0 login detected
      setUser(user);
      setloggedIn(true);
      sessionStorage.setItem("userUser", JSON.stringify(user));
      navigate("/"); // Redirect after successful login
    }
  }, [isAuthenticated, user, setUser, setloggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", { name, email, password });
      if (response.status === 200) {
        setMessage("Login successful");
        sessionStorage.setItem("jwtToken", response.data.token);
        setUser(response.data.result.user); // Store user data in context
        setloggedIn(true);
        navigate("/"); // Navigate after successful login
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleLoginWithAuth0 = async () => {
    try {
      await loginWithRedirect();
    } catch (error) {
      setMessage("Login with Google failed. Please try again.");
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleForgotPassword = () => {
    navigate("/forgot");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
          required
        />
        <button type="submit" className="login-button">
          Submit
        </button>
        <button type="button" onClick={handleForgotPassword} className="forgot-password-button">
          Forgot Password
        </button>
      </form>
      {message && <p className="login-message">{message}</p>}
      <button onClick={handleRegister} className="register-button">
        Sign Up
      </button>
      <button onClick={handleLoginWithAuth0} className="google-login-button">
        Login with Google
      </button>
    </div>
  );
};

export default Login;
