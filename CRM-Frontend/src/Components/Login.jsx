import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../Contexts/UserContext";
import BASE_URL from "../../Config/apiConfig";
import { DNA } from "react-loader-spinner";

const Login = () => {
  const { loginWithRedirect } = useAuth0();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate();
  const { setUser, setloggedIn } = useUser();

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
        loginType: "custom",
      });

      if (response.status === 200) {
        setMessage("Login successful");
        sessionStorage.setItem("jwtToken", response.data.token);
        setUser(response.data.result.user);
        setloggedIn(true);
        navigate("/");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithAuth0 = async () => {
    try {
      await loginWithRedirect();
      navigate("/");
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">Welcome back</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleCustomLogin} className="space-y-4">
          <div className="relative">
            <Mail className="ml-1 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email"
              required
            />
          </div>

          <div className="relative">
            <Lock className="ml-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
            disabled={loading}
          >
            Log In
          </button>
        </form>

        {/* Loader (Separate from Button) */}
        {loading && (
          <div className="flex justify-center">
            <DNA visible={true} height="5" width="5" ariaLabel="dna-loading" />
          </div>
        )}

        <button
          type="button"
          onClick={handleLoginWithAuth0}
          className="w-full py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <LogIn className="m-2 w-5 h-5" />
          Continue with Google
        </button>

        <div className="flex justify-between text-sm">
          <button type="button" onClick={() => navigate("/forgot")} className="text-blue-600 hover:text-blue-500">
            Forgot password?
          </button>
          <button type="button" onClick={() => navigate("/register")} className="text-blue-600 hover:text-blue-500">
            Sign up
          </button>
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.includes("successful") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
