import React, { useState } from 'react';
import { TrashIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const AttendeesTable = ({ attendees, isAdmin, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(attendees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttendees = attendees.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  return (
    <div className="w-full overflow-x-auto relative">
      <table className="w-full table-fixed bg-white rounded-xl shadow border border-red-200">
        <thead>
          <tr className="bg-red-700 text-white">
            <th className="px-2 py-2 text-center" style={{ width: '50px' }}>
              STT
            </th>
            <th className="px-2 py-2 text-left" style={{ width: '180px' }}>
              Họ và Tên
            </th>
            <th className="px-2 py-2 text-left" style={{ width: '140px' }}>
              Ngày sinh
            </th>
            <th className="px-2 py-2 text-left" style={{ width: '180px' }}>
              Quê quán
            </th>
            <th className="px-2 py-2 text-left" style={{ width: '200px' }}>
              Chức danh
            </th>
            {isAdmin && (
              <th className="px-2 py-2 text-center" style={{ width: '100px' }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentAttendees.map((d, idx) => (
            <tr key={d._id || idx} className="border-b">
              <td className="px-2 py-2 text-center min-w-[36px]">{startIndex + idx + 1}</td>
              <td className="px-2 py-2 text-left min-w-[180px]">{d.full_name}</td>
              <td className="px-2 py-2 text-left min-w-[140px]">{d.date_of_birth}</td>
              <td className="px-2 py-2 text-left min-w-[180px]">{d.hometown}</td>
              <td className="px-2 py-2 text-left min-w-[200px]">{d.title}</td>
              {isAdmin && (
                <td className="px-2 py-2 flex gap-2 justify-center min-w-[100px]">
                  <button onClick={() => onEdit(d)} className="px-3 py-1 text-yellow-300 rounded">
                    <PencilIcon className="h-5 w-5 inline" />
                  </button>
                  <button onClick={() => onDelete(d)} className="px-3 py-1 text-red-500 rounded">
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="text-sm text-gray-700">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, attendees.length)} của {attendees.length} đại biểu
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // Show first page, last page, current page, and pages around current
                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
              })
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-500">...</span>}
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === page ? 'bg-red-700 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendeesTable;
