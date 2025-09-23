import React, { useEffect, useState } from "react";
import axios from "./api/axios";
import LoginForm from "./components/LoginForm";
import ImportForm from "./components/ImportForm";
import SearchBar from "./components/SearchBar";
import DocumentsTable from "./components/DocumentsTable";
import DocumentModal from "./components/DocumentModal";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAdmin, setIsAdmin] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);

  // Kiểm tra token và lấy quyền admin khi load lại trang
  useEffect(() => {
    if (token) {
      setIsAdmin(JSON.parse(localStorage.getItem("isAdmin") || "false"));
    } else {
      setIsAdmin(false);
    }
  }, [token]);

  // Lấy danh sách file
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/files", {
        params: search ? { name: search } : {},
      });
      setDocuments(res.data);
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

  // Xử lý login thành công
  const handleLogin = (jwt, admin) => {
    setToken(jwt);
    setIsAdmin(admin);
    localStorage.setItem("token", jwt);
    localStorage.setItem("isAdmin", JSON.stringify(admin));
    fetchDocuments();
  };

  // Xử lý import thành công
  const handleImported = () => {
    fetchDocuments();
  };

  // Xử lý xóa file
  const handleDelete = async (doc) => {
    if (!window.confirm(`Xóa tài liệu "${doc.name}"?`)) return;
    try {
      await axios.delete(`/files/${doc._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments();
    } catch {}
  };

  // Đăng xuất
  const handleLogout = () => {
    setToken("");
    setIsAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        background: "#fafbfc",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
        {!token ? (
          <LoginForm onLogin={handleLogin} />
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div>
                Xin chào <b>{isAdmin ? "Admin" : "Khách"}</b>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  background: "#eee",
                  border: "none",
                  borderRadius: 4,
                  padding: "6px 16px",
                  cursor: "pointer",
                }}
              >
                Đăng xuất
              </button>
            </div>
            {isAdmin && <ImportForm onImported={handleImported} />}
            <SearchBar value={search} onChange={setSearch} />
            {loading ? (
              <div style={{ textAlign: "center", padding: 32 }}>
                Đang tải dữ liệu...
              </div>
            ) : (
              <DocumentsTable
                documents={documents}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                onView={setSelectedDoc}
              />
            )}
            <DocumentModal
              open={!!selectedDoc}
              document={selectedDoc}
              onClose={() => setSelectedDoc(null)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
