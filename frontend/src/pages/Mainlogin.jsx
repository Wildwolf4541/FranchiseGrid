import { useNavigate } from "react-router";
import { useState } from "react";
import api from "../lib/axios";
import { toast } from "react-hot-toast";
import { useAuthContext } from "../hooks/useAuthContext";

export default function MainLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useAuthContext(); // your context uses dispatch

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data } = await api.post("/login/login", {
        username,
        password
      });

      if (!data.status) {
        throw new Error(data.msg || "Login failed");
      }

      const userData = {
        username,
        token: data.token
      };

      // Save user + update global auth
      localStorage.setItem("user", JSON.stringify(userData));
      dispatch({ type: "LOGIN", payload: userData });

      toast.success("Login successful");
      navigate("/dash");
    } catch (err) {
      toast.error(err.response?.data?.msg || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-r from-gray-900 to-black">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-xl w-96">
        <h2 className="text-white text-2xl mb-6 text-center">
          Franchise Login
        </h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
