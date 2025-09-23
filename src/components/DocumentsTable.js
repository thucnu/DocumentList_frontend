import React from "react";

const DocumentsTable = ({ documents, isAdmin, onDelete, onView }) => {
  return (
    <table
      style={{ width: "100%", borderCollapse: "collapse", margin: "24px 0" }}
    >
      <thead>
        <tr style={{ background: "#f5f5f5" }}>
          <th style={{ padding: 8, border: "1px solid #ddd" }}>STT</th>
          <th style={{ padding: 8, border: "1px solid #ddd" }}>Tên tài liệu</th>
          <th style={{ padding: 8, border: "1px solid #ddd" }}>
            Nhóm tài liệu
          </th>
          {isAdmin && (
            <th style={{ padding: 8, border: "1px solid #ddd" }}>Xóa</th>
          )}
        </tr>
      </thead>
      <tbody>
        {documents.length === 0 ? (
          <tr>
            <td
              colSpan={isAdmin ? 4 : 3}
              style={{ textAlign: "center", padding: 16 }}
            >
              Không có tài liệu nào
            </td>
          </tr>
        ) : (
          documents.map((doc, idx) => (
            <tr key={doc._id}>
              <td
                style={{
                  padding: 8,
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                {idx + 1}
              </td>
              <td
                style={{
                  padding: 8,
                  border: "1px solid #ddd",
                  color: "#1976d2",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => onView(doc)}
              >
                {doc.name}
              </td>
              <td style={{ padding: 8, border: "1px solid #ddd" }}>
                {doc.group}
              </td>
              {isAdmin && (
                <td
                  style={{
                    padding: 8,
                    border: "1px solid #ddd",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => onDelete(doc)}
                    style={{
                      background: "#d32f2f",
                      color: "#fff",
                      border: "none",
                      borderRadius: 4,
                      padding: "4px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default DocumentsTable;
