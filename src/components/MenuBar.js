import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const menuItems = [
  {
    label: "Tài liệu văn kiện đại hội",
    key: "documents",
  },
  {
    label: "Danh sách đại biểu Đảng bộ Thành Phố",
    key: "attendees",
  },
];

const MenuBar = ({
  isAdmin,
  username,
  onLogout
}) => {
  const location = useLocation();
  return (
    <div className="w-full bg-red-700 flex items-center justify-center py-2 px-4">
      <nav className="flex gap-8">
        {menuItems.map((item, idx) => {
          const isActive = location.pathname === `/${item.key}`;
          return (
            <Link
              key={idx}
              to={`/${item.key}`}
              className={`text-white text-lg px-4 py-2 rounded  duration-150 hover:text-white hover:bg-red-800 ${
                isActive ? "bg-red-800" : ""
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      {isAdmin && (
        <div className="flex items-center gap-4 ml-auto">
          <span className="hidden sm:inline text-white font-bold">
            Xin chào <b>{username || "Admin"}</b>
          </span>
          <button
            onClick={onLogout}
            className="px-4 py-1 rounded bg-white text-red-700 font-semibold border border-white hover:bg-white transition"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default MenuBar;
