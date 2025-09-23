import React from "react";

const SearchBar = ({ value, onChange }) => {
  return (
    <div
      style={{
        maxWidth: 400,
        margin: "0 auto 24px auto",
        display: "flex",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        placeholder="Tìm kiếm theo tên tài liệu..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          flex: 1,
          padding: 10,
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
    </div>
  );
};

export default SearchBar;
