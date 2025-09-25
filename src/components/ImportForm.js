import React, { useState, useRef } from "react";
import axios from "../api/axios";

const groupOptions = [
  { value: "Văn kiện đại hội", label: "Văn kiện đại hội" },
  { value: "Văn bản", label: "Văn bản" },
  { value: "Khác", label: "Khác" },
];

const ImportForm = ({ onImported }) => {
  const [name, setName] = useState("");
  const [group, setGroup] = useState(groupOptions[0].value);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) {
      setError("Vui lòng chọn tệp đính kèm");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("group", group);
      formData.append("file", file);
      const token = localStorage.getItem("token");
      const res = await axios.post("/files/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setName("");
      setGroup(groupOptions[0].value);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (onImported) onImported(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Import thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 max-w-lg mx-auto">
      <h3 className="text-lg font-semibold text-black mb-4">
        Thêm tài liệu mới
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Tên tài liệu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-800 bg-gray-50"
          />
        </div>
        <div>
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50"
          >
            {groupOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">File tài liệu</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            required
            className="w-full"
            ref={fileInputRef}
          />
        </div>
        {error && <div className="text-gray-600 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-red-700 text-white rounded font-semibold shadow hover:bg-red-800 transition"
        >
          {loading ? "Đang import..." : "Import"}
        </button>
      </form>
    </div>
  );
};

export default ImportForm;
