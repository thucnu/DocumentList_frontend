import React, { useState, useEffect } from "react";

const DelegateFormModal = ({ open, delegate, onClose, onSave }) => {
  const [form, setForm] = useState({
    stt: "",
    fullname: "",
    birthDate: "",
    address: "",
    position: "",
    // image: "", // Commented out image logic
  });

  useEffect(() => {
    if (delegate) setForm(delegate);
  }, [delegate]);

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
          {/* <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Ảnh cá nhân (base64/link)"
            className="border p-2 rounded"
          /> */}
          <input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            placeholder="Họ và tên"
            className="border p-2 rounded"
          />
          <input
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            placeholder="Ngày Sinh"
            className="border p-2 rounded"
          />
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Nơi ở hiện tại"
            className="border p-2 rounded"
          />
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Chức vụ - Đơn vị công tác"
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

export default DelegateFormModal;
