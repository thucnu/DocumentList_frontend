import React, { useState } from 'react';
import { TrashIcon, DocumentIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

const DocumentsThumbnail = ({ documents, isAdmin, onDelete, onView }) => {
  const [confirmDoc, setConfirmDoc] = useState(null);

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf':
        return <DocumentIcon className="w-16 h-16 text-red-500" />;
      case 'doc':
      case 'docx':
        return <DocumentTextIcon className="w-16 h-16 text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <DocumentTextIcon className="w-16 h-16 text-green-500" />;
      default:
        return <DocumentIcon className="w-16 h-16 text-gray-500" />;
    }
  };

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
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {documents.length === 0 ? (
        <div className="col-span-full text-center py-10 text-gray-500">Không có tài liệu nào</div>
      ) : (
        documents.map((doc) => {
          const isPdf = doc.originalName.toLowerCase().endsWith('.pdf');
          return (
            <div
              key={doc._id}
              className="relative flex flex-col items-center p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => {
                if (isPdf) {
                  onView(doc);
                } else {
                  window.open(`${process.env.REACT_APP_API_BASE_URL}/${doc.path}`, '_blank');
                }
              }}
            >
              <div className="mb-2">{getFileIcon(doc.originalName)}</div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900 break-words w-full" title={doc.name}>
                  {doc.name}
                </p>
                <p className="text-xs text-gray-500">{doc.group}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(doc);
                  }}
                  className="absolute top-0 right-2 mt-2 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          );
        })
      )}
      {confirmDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>Bạn có chắc muốn xóa tài liệu "{confirmDoc.name}"?</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded">
                Hủy
              </button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-red-500 text-white rounded">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsThumbnail;
