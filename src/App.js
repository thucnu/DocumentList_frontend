import React, { useEffect, useState } from "react";
import BannerHeader from "./components/BannerHeader";
import MenuBar from "./components/MenuBar";
import DelegatesPage from "./pages/DelegatesPage";
import DocumentsPage from "./pages/DocumentsPage";
import axios from "./api/axios";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState("documents");
  const [search, setSearch] = useState(""); // used for API
  const [searchInput, setSearchInput] = useState(""); // used for input field
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setIsAdmin(JSON.parse(localStorage.getItem("isAdmin") || "false"));
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/files", {
        params: search ? { name: search } : {},
      });
      // So sánh dữ liệu mới với dữ liệu cũ
      const newDocs = res.data;
      if (
        documents.length !== newDocs.length ||
        documents.some((doc, i) => doc._id !== newDocs[i]?._id)
      ) {
        setDocuments(newDocs);
      }
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line
  }, [search]);

  const handleLogin = (jwt, admin) => {
    setSearchInput("");
    setToken(jwt);
    setIsAdmin(admin);
    // Giả sử backend trả về username, nếu không thì có thể lấy từ localStorage hoặc props
    setUsername("Admin"); // Nếu có username thực tế, hãy truyền vào đây
    localStorage.setItem("token", jwt);
    localStorage.setItem("isAdmin", JSON.stringify(admin));
    localStorage.setItem("username", "Admin"); // Nếu có username thực tế, hãy truyền vào đây
    fetchDocuments();
  };

  const handleLogout = () => {
    setSearchInput("");
    setToken("");
    setIsAdmin(false);
    setUsername("");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <BannerHeader />
      <MenuBar
        isAdmin={isAdmin}
        username={username}
        onLogout={handleLogout}
        onMenuSelect={setCurrentPage}
        currentPage={currentPage}
      />
      <div className="mx-auto px-2 py-6">
        {(() => {
          switch (currentPage) {
            case "documents":
              return (
                <DocumentsPage
                  isAdmin={isAdmin}
                  token={token}
                  username={username}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              );
            case "delegates":
              return (
                <DelegatesPage
                  isAdmin={isAdmin}
                  token={token}
                  username={username}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              );
            default:
              return (
                <div className="bg-white rounded-xl shadow p-8 text-center text-lg font-semibold text-blue-900">
                  Trang này sẽ được cập nhật nội dung sau.
                </div>
              );
          }
        })()}
      </div>
    </div>
  );
};

export default App;
