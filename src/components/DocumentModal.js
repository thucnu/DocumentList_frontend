import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const getFileType = (filename) => {
  if (!filename) return "";
  const ext = filename.split(".").pop().toLowerCase();
  if (["pdf"].includes(ext)) return "pdf";
  if (["txt"].includes(ext)) return "txt";
  if (["doc", "docx"].includes(ext)) return "doc";
  return "other";
};

const DocumentModal = ({ open, document, onClose }) => {
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileType = getFileType(document?.originalName);

  useEffect(() => {
    if (open && document) {
      setLoading(true);
      setError("");
      axios
        .get(`/files/${document._id}/view`, {
          responseType: fileType === "pdf" ? "blob" : "text",
        })
        .then((res) => {
          if (fileType === "pdf") {
            const url = URL.createObjectURL(
              res.data instanceof Blob ? res.data : new Blob([res.data])
            );
            setFileUrl(url);
          } else if (fileType === "txt") {
            setFileUrl("data:text/plain;base64," + btoa(res.data));
          } else {
            setFileUrl("");
          }
        })
        .catch(() => setError("Không thể tải file"))
        .finally(() => setLoading(false));
    } else {
      setFileUrl("");
      setError("");
    }
    // Cleanup blob url
    return () => fileUrl && URL.revokeObjectURL(fileUrl);
    // eslint-disable-next-line
  }, [open, document]);

  if (!open || !document) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          width: "90vw",
          height: "90vh",
          minWidth: 320,
          minHeight: 200,
          overflow: "auto",
          borderRadius: 12,
          boxShadow: "0 2px 24px rgba(0,0,0,0.2)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 8,
            right: 12,
            background: "#eee",
            border: "none",
            borderRadius: 4,
            padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          Đóng
        </button>
        <h3 style={{ margin: 0, padding: 24, fontSize: 22 }}>
          {document.name}
        </h3>
        {loading && <div style={{ padding: 24 }}>Đang tải...</div>}
        {error && <div style={{ color: "red", padding: 24 }}>{error}</div>}
        {!loading && !error && fileType === "pdf" && fileUrl && (
          <iframe
            src={fileUrl}
            title="PDF Viewer"
            style={{ width: "100%", height: "75vh", border: "none" }}
          />
        )}
        {!loading && !error && fileType === "txt" && fileUrl && (
          <pre
            style={{
              padding: 24,
              background: "#f5f5f5",
              maxHeight: "70vh",
              fontSize: 18,
              overflow: "auto",
            }}
          >
            {atob(fileUrl.replace("data:text/plain;base64,", ""))}
          </pre>
        )}
        {!loading && !error && fileType === "doc" && (
          <div style={{ padding: 24 }}>
            Không hỗ trợ xem trực tiếp file Word.{" "}
            <a
              href={`/files/${document._id}/view`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tải về
            </a>
          </div>
        )}
        {!loading && !error && fileType === "other" && (
          <div style={{ padding: 24 }}>
            Không hỗ trợ xem trực tiếp định dạng này.{" "}
            <a
              href={`/files/${document._id}/view`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tải về
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentModal;
