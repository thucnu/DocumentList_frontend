import React, { useState, useEffect } from 'react';
import { ListBulletIcon, Squares2X2Icon } from '@heroicons/react/24/solid';
import ImportForm from '../components/ImportForm';
import SearchBar from '../components/SearchBar';
import DocumentsTable from '../components/DocumentsTable';
import DocumentsThumbnail from '../components/DocumentsThumbnail';
import axios from '../api/axios';

const DocumentsPage = ({ isAdmin, token }) => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('thumbnail'); // 'thumbnail' or 'list'
  const [showModal, setShowModal] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/files', {
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
    setSearchInput('');
    setSearch('');
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
  const toggleViewMode = () => {
    setViewMode(viewMode === 'thumbnail' ? 'list' : 'thumbnail');
  };

  // Khi click vào tên file, mở tab mới với trang view fullscreen
  const handleView = (doc) => {
    const encodedPath = encodeURIComponent(doc.path);
    window.open(`${window.location.origin}/view/${encodedPath}`, '_blank');
  };

  return (
    <>
      <div className="px-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative">
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

          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition whitespace-nowrap"
            >
              Thêm tài liệu
            </button>
          )}
        </div>

        <div className=" bg-white rounded-xl shadow p-6 border border-red-200 h-full relative">
          {/* Top row with button, search, and view toggle */}
          <button
            onClick={toggleViewMode}
            className="px-3 py-2 bg-red-700 text-white rounded hover:bg-red-600 transition absolute top-4 right-6"
            title={viewMode === 'thumbnail' ? 'Chuyển sang danh sách' : 'Chuyển sang thumbnail'}
          >
            {viewMode === 'thumbnail' ? <ListBulletIcon className="w-5 h-5" /> : <Squares2X2Icon className="w-5 h-5" />}
          </button>
          <div className="py-10" style={{ minHeight: 320 }}>
            {loading ? (
              <div className="text-center py-10 text-red-400">Đang tải dữ liệu...</div>
            ) : viewMode === 'list' ? (
              <DocumentsTable
                documents={Array.isArray(documents) ? documents : []}
                isAdmin={isAdmin}
                onDelete={isAdmin ? handleDelete : undefined}
                onView={handleView}
              />
            ) : (
              <DocumentsThumbnail
                documents={Array.isArray(documents) ? documents : []}
                isAdmin={isAdmin}
                onDelete={isAdmin ? handleDelete : undefined}
                onView={handleView}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal for Import Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-700">Thêm tài liệu mới</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 text-2xl">
                ×
              </button>
            </div>
            <ImportForm
              onImported={() => {
                handleImported();
                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentsPage;
