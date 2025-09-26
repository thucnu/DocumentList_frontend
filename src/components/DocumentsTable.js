import React, { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/solid';

const DocumentsTableComponent = ({ documents, isAdmin, onDelete, onView, loading }) => {
  const [confirmDoc, setConfirmDoc] = useState(null);

  const handleDeleteClick = (doc) => {
    setConfirmDoc(doc);
  };

  const handleConfirm = () => {
    if (confirmDoc) onDelete(confirmDoc);
    setConfirmDoc(null);
  };

  const handleCancel = () => {
    setConfirmDoc(null);
  };

  return (
    <div className="w-full overflow-x-auto relative">
      <table className="w-full bg-white rounded-xl shadow border border-red-200">
        <thead>
          <tr className="bg-red-700 text-white">
            <th className="py-2 px-3 text-center">STT</th>
            <th className="py-2 px-3 text-left">Tên tài liệu</th>
            <th className="py-2 px-3 text-left">Nhóm tài liệu</th>
            {isAdmin && <th className="py-2 px-3 text-center">Xóa</th>}
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 4 : 3} className="py-6 text-center text-gray-500">
                Không có tài liệu nào
              </td>
            </tr>
          ) : (
            documents.map((doc, idx) => (
              <tr key={doc._id} className={`hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <td className="py-2 px-3 text-center">{idx + 1}</td>
                <td className="py-2 px-3">
                  {doc.originalName.toLowerCase().endsWith('.pdf') ? (
                    <span className="text-blue-900 underline cursor-pointer" onClick={() => onView(doc)}>
                      {doc.name}
                    </span>
                  ) : (
                    <a
                      href={`${process.env.REACT_APP_API_BASE_URL}/${doc.path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-900 underline"
                    >
                      {doc.name}
                    </a>
                  )}
                </td>
                <td className="py-2 px-3">{doc.group}</td>
                {isAdmin && (
                  <td className="py-2 px-3 text-center">
                    <button onClick={() => handleDeleteClick(doc)} className="px-3 py-1 rounded text-red-700 font-semibold">
                      <TrashIcon className="h-5 w-5 inline" />
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
      {/* Modal xác nhận xóa */}
      {confirmDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg max-w-sm w-full p-6 text-center relative">
            <div className="text-lg font-semibold mb-4 text-red-700">Xác nhận xóa tài liệu</div>
            <div className="mb-6 text-gray-700">
              Bạn có chắc muốn xóa tài liệu <span className="font-bold">{confirmDoc.name}</span>?
            </div>
            <div className="flex justify-center gap-4">
              <button className="px-4 py-2 rounded bg-gray-300 text-gray-900 font-semibold hover:bg-gray-400 transition" onClick={handleCancel}>
                Hủy
              </button>
              <button className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition" onClick={handleConfirm}>
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DocumentsTable = React.memo(DocumentsTableComponent);
export default DocumentsTable;
