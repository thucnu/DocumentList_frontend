import React, { useState, useEffect } from "react";
import ImportForm from "../components/ImportForm";
import SearchBar from "../components/SearchBar";
import DocumentsTable from "../components/DocumentsTable";
import DocumentModal from "../components/DocumentModal";
import LoginForm from "../components/LoginForm";
import axios from "../api/axios";

const DocumentsPage = ({ isAdmin, token, username, onLogin, onLogout }) => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/files", {
        params: search ? { name: search } : {},
      });
      const newDocs = res.data;
      setDocuments(newDocs);
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

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleShowAll = () => {
    setSearchInput("");
    setSearch("");
  };

  const handleImported = () => {
    fetchDocuments();
  };

  const handleDelete = async (doc) => {
    try {
      await axios.delete(`/files/${doc._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments();
    } catch {}
  };

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex-1 bg-white rounded-xl shadow p-6 border border-red-200">
          {isAdmin && <ImportForm onImported={handleImported} />}
          <div className="relative mb-6">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleSearch}
              placeholder="Tìm kiếm theo tên tài liệu..."
              className="bg-white border border-red-300 text-red-700 placeholder-red-400"
            />
            <button
              type="button"
              onClick={handleShowAll}
              className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-1 rounded bg-gray-400 text-white font-semibold hover:bg-gray-500 transition border border-gray-300"
              style={{ zIndex: 2 }}
            >
              Hiển thị tất cả
            </button>
          </div>
          <div style={{ minHeight: 320 }}>
            {loading ? (
              <div className="text-center py-10 text-red-400">
                Đang tải dữ liệu...
              </div>
            ) : (
              <DocumentsTable
                documents={Array.isArray(documents) ? documents : []}
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
      {!token && (
        <div className="mt-6 text-center">
          <span className="text-black">Bạn là khách (Anonymous). </span>
          <button
            className="ml-2 px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800 border border-red-300"
            onClick={() => setShowLogin(true)}
          >
            Đăng nhập quản trị
          </button>
        </div>
      )}
      {showLogin && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full relative border border-gray-300">
            {/* Close button at top right */}
            <button
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl font-bold focus:outline-none"
              onClick={() => setShowLogin(false)}
              aria-label="Đóng"
            >
              ×
            </button>
            <LoginForm
              onLogin={(jwt, admin) => {
                onLogin(jwt, admin);
                setShowLogin(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentsPage;
