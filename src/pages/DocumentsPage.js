import React, { useState, useEffect } from "react";
import ImportForm from "../components/ImportForm";
import SearchBar from "../components/SearchBar";
import DocumentsTable from "../components/DocumentsTable";
import axios from "../api/axios";

const DocumentsPage = ({ isAdmin, token }) => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSearch = () => setSearch(searchInput);
  const handleShowAll = () => {
    setSearchInput("");
    setSearch("");
  };
  const handleImported = () => fetchDocuments();
  const handleDelete = async (doc) => {
    try {
      await axios.delete(`/files/${doc._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocuments();
    } catch {}
  };

  // Khi click vào tên file, mở tab mới với đường dẫn file
  const handleView = (doc) => {
    window.open(doc.path, "_blank");
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
            {search && (
              <button
                type="button"
                onClick={handleShowAll}
                className="absolute right-0 top-1/2 -translate-y-1/2 px-4 py-1 rounded bg-gray-400 text-white font-semibold hover:bg-gray-500 transition border border-gray-300"
                style={{ zIndex: 2 }}
              >
                Hiển thị tất cả
              </button>
            )}
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
                onView={handleView}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentsPage;
