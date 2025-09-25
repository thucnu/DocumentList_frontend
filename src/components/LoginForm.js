import React, { useState } from "react";
import axios from "../api/axios";
import quochuy from "../assets/quochuy.gif";

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      onLogin(res.data.token, res.data.isAdmin);
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-8 py-10 flex flex-col items-center">
          {/* Logo quốc huy (placeholder) */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center shadow">
              <img
                src={quochuy}
                alt="Logo Quốc Huy"
                className="w-16 h-16 object-contain"
              />
              {/* <span className="text-3xl text-gray-400">🏛️</span> */}
            </div>
          </div>
          {/* Tiêu đề lớn */}
          <h1 className="text-2xl md:text-2xl font-bold text-blue-00 mb-6 text-center tracking-wide">
            Hệ thống Quản lý Văn Bản
          </h1>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800 bg-gray-50 text-gray-900"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800 bg-gray-50 text-gray-900"
              />
            </div>
            {error && (
              <div className="text-red-600 mb-3 text-sm text-center">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 bg-red-700 text-white rounded-full font-semibold shadow hover:bg-red-800 transition"
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
