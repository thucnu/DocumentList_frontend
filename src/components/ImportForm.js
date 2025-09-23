import React, { useState } from "react";
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
  const fileInputRef = React.useRef();

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
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 400,
        margin: "24px auto",
        padding: 24,
        border: "1px solid #eee",
        borderRadius: 8,
      }}
    >
      <h3>Import tài liệu</h3>
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Tên tài liệu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        >
          {groupOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => setFile(e.target.files[0])}
          required
          style={{ width: "100%" }}
          ref={fileInputRef}
        />
      </div>
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          background: "#388e3c",
          color: "#fff",
          border: "none",
          borderRadius: 4,
        }}
      >
        {loading ? "Đang import..." : "Import"}
      </button>
    </form>
  );
};

export default ImportForm;
