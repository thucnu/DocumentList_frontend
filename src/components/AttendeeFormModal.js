import React, { useState, useEffect } from "react";

const AttendeeFormModal = ({ open, attendee, onClose, onSave }) => {
  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    hometown: "",
    title: "",
    image_filename: ""
  });

  useEffect(() => {
    if (attendee) setForm(attendee);
  }, [attendee]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4 text-red-700">
          Sửa thông tin đại biểu
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Họ và tên"
            className="border p-2 rounded"
          />
          <input
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
            placeholder="Ngày sinh (dd/MM/yyyy)"
            className="border p-2 rounded"
          />
          <input
            name="hometown"
            value={form.hometown}
            onChange={handleChange}
            placeholder="Quê quán"
            className="border p-2 rounded"
          />
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Chức vụ"
            className="border p-2 rounded"
          />
          <input
            name="image_filename"
            value={form.image_filename}
            onChange={handleChange}
            placeholder="Tên file ảnh (vd: 1.png)"
            className="border p-2 rounded"
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendeeFormModal;
