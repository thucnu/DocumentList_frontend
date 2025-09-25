import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import AttendeesTable from "../components/AttendeesTable";
import AttendeeFormModal from "../components/AttendeeFormModal";
import ImportButton from "../components/ImportButton";
import SearchBar from "../components/SearchBar";
import LoginForm from "../components/LoginForm";

const AttendeesPage = ({ isAdmin, token, username, onLogin, onLogout }) => {
  const [attendees, setAttendees] = useState([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const fetchAttendees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/attendees", {
        params: search ? { full_name: search } : {},
      });
      setAttendees(res.data);
    } catch {
      setAttendees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
    // eslint-disable-next-line
  }, [search]);

  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleShowAll = () => {
    setSearchInput("");
    setSearch("");
  };

  const handleImportSuccess = () => {
    fetchAttendees();
  };

  const handleEdit = (attendee) => {
    setSelectedAttendee(attendee);
  };

  const handleSave = async (updated) => {
    const { _id, full_name, date_of_birth, hometown, title, image_filename } = updated;
    // Parse date_of_birth từ chuỗi dd/MM/yyyy sang Date
    let parsedBirthDate = date_of_birth;
    const match = date_of_birth.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (typeof date_of_birth === "string" && match) {
      const [day, month, year] = match.slice(1);
      parsedBirthDate = new Date(Number(year), Number(month) - 1, Number(day));
    }
    const data = { full_name, date_of_birth: parsedBirthDate, hometown, title, image_filename };
    await axios.put(`attendees/${_id}`, data);
    setSelectedAttendee(null);
    fetchAttendees();
  };

  const handleDelete = async (attendee) => {
    await axios.delete(`/attendees/${attendee._id}`);
    fetchAttendees();
  };

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="flex-1 bg-white rounded-xl shadow p-6 border border-red-200">
          <div className="relative mb-6">
            {isAdmin && <ImportButton onImportSuccess={handleImportSuccess} />}
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSearch={handleSearch}
              placeholder="Tìm theo tên đại biểu..."
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
              <AttendeesTable
                attendees={Array.isArray(attendees) ? attendees : []}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
      <AttendeeFormModal
        open={!!selectedAttendee}
        attendee={selectedAttendee}
        onClose={() => setSelectedAttendee(null)}
        onSave={handleSave}
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

export default AttendeesPage;
