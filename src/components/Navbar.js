import React from "react";
import quochuy from "../assets/quochuy.gif";

const Navbar = ({ isAdmin, username, onLogout }) => (
  <nav className="bg-blue-900 text-white shadow flex items-center justify-between px-4 py-3 rounded-b-lg">
    <div className="flex items-center gap-3">
      <img
        src={quochuy}
        alt="Logo Quốc Huy"
        className="w-10 h-10 rounded-full bg-white"
      />
      <span className="font-bold text-lg tracking-wide">
        Hệ thống Quản lý Tài liệu
      </span>
    </div>
    {isAdmin && (
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">
          Xin chào <b>{username || "Admin"}</b>
        </span>
        <button
          onClick={onLogout}
          className="px-4 py-1 rounded bg-gray-100 text-blue-900 font-semibold border border-gray-300 hover:bg-gray-200 transition"
        >
          Đăng xuất
        </button>
      </div>
    )}
  </nav>
);

export default Navbar;
