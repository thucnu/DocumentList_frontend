import React from "react";

const DocumentsTableComponent = ({ documents, isAdmin, onDelete, onView, loading }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
      <thead>
        <tr className="bg-blue-900 text-white">
          <th className="py-2 px-3 text-center">STT</th>
          <th className="py-2 px-3 text-left">Tên tài liệu</th>
          <th className="py-2 px-3 text-left">Nhóm tài liệu</th>
          {isAdmin && <th className="py-2 px-3 text-center">Xóa</th>}
        </tr>
      </thead>
      <tbody>
        {documents.length === 0 ? (
          <tr>
            <td
              colSpan={isAdmin ? 4 : 3}
              className="py-6 text-center text-gray-500"
            >
              Không có tài liệu nào
            </td>
          </tr>
        ) : (
          documents.map((doc, idx) => (
            <tr
              key={doc._id}
              className={`hover:bg-blue-50 ${
                idx % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="py-2 px-3 text-center">{idx + 1}</td>
              <td
                className="py-2 px-3 text-blue-900 underline cursor-pointer"
                onClick={() => onView(doc)}
              >
                {doc.name}
              </td>
              <td className="py-2 px-3">{doc.group}</td>
              {isAdmin && (
                <td className="py-2 px-3 text-center">
                  <button
                    onClick={() => onDelete(doc)}
                    className="px-3 py-1 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
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
    {loading && (
      <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-900 mr-2"></div>
        <span className="text-blue-900 font-semibold">Đang tải dữ liệu...</span>
      </div>
    )}
  </div>
);

const DocumentsTable = React.memo(DocumentsTableComponent);
export default DocumentsTable;
