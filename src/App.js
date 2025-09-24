import React, { useEffect, useState } from "react";
import BannerHeader from "./components/BannerHeader";
import MenuBar from "./components/MenuBar";
import ImportForm from "./components/ImportForm";
import SearchBar from "./components/SearchBar";
import DocumentsTable from "./components/DocumentsTable";
import DocumentModal from "./components/DocumentModal";
import LoginForm from "./components/LoginForm";
import axios from "./api/axios";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [documents, setDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState("documents");
  const [search, setSearch] = useState(""); // used for API
  const [searchInput, setSearchInput] = useState(""); // used for input field
  const [selectedDoc, setSelectedDoc] = useState(null);
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

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [searchInput]);

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

  const handleImported = () => {
    fetchDocuments();
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Xóa tài liệu "${doc.name}"?`)) return;
    try {
      await axios.delete(`/files/${doc._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments();
    } catch {}
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
                <>
                  <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    <div className="flex-1">
                      {/* Chỉ admin mới thấy ImportForm và nút xóa */}
                      {isAdmin && <ImportForm onImported={handleImported} />}
                      <SearchBar
                        value={searchInput}
                        onChange={setSearchInput}
                      />
                      <div style={{ minHeight: 320 }}>
                        {loading ? (
                          <div className="text-center py-10 text-gray-500">
                            Đang tải dữ liệu...
                          </div>
                        ) : (
                          <DocumentsTable
                            documents={
                              Array.isArray(documents) ? documents : []
                            }
                            isAdmin={isAdmin}
                            onDelete={isAdmin ? handleDelete : undefined}
                            onView={setSelectedDoc}
                            loading={loading}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <DocumentModal
                    open={!!selectedDoc}
                    document={selectedDoc}
                    onClose={() => setSelectedDoc(null)}
                  />
                  {/* Nếu chưa đăng nhập và không phải admin, hiển thị nút đăng nhập nhỏ ở góc hoặc dưới navbar nếu muốn */}
                  {!token && (
                    <div className="mt-6 text-center">
                      <span className="text-gray-500">
                        Bạn là khách (Anonymous).{" "}
                      </span>
                      <button
                        className="ml-2 px-3 py-1 bg-blue-900 text-white rounded hover:bg-blue-900"
                        onClick={() => setToken("showLogin")}
                      >
                        Đăng nhập quản trị
                      </button>
                    </div>
                  )}
                  {/* Hiển thị form đăng nhập nếu người dùng bấm nút đăng nhập */}
                  {token === "showLogin" && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                      <div className="bg-white rounded shadow-lg max-w-lg w-full relative">
                        {/* Close button at top right */}
                        <button
                          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                          onClick={() => setToken("")}
                          aria-label="Đóng"
                        >
                          ×
                        </button>
                        <LoginForm onLogin={handleLogin} />
                      </div>
                    </div>
                  )}
                </>
              );
            case "delegates":
              return (
                <div className="bg-white rounded-xl shadow p-8 text-center text-lg font-semibold text-red-700">
                  Danh sách đại biểu Đảng bộ Thành Phố sẽ được cập nhật tại đây.
                </div>
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
