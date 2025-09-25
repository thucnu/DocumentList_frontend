import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
const AttendeesTable = ({ attendees, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto relative">
      <table className="w-full table-fixed bg-white rounded-xl shadow border border-red-200">
        <thead>
          <tr className="bg-red-700 text-white">
            <th className="px-2 py-2 text-center" style={{ width: "50px" }}>STT</th>
            <th className="px-2 py-2 text-left" style={{ width: "180px" }}>Họ và Tên</th>
            <th className="px-2 py-2 text-left" style={{ width: "140px" }}>Ngày Sinh</th>
            <th className="px-2 py-2 text-left" style={{ width: "180px" }}>Quê quán</th>
            <th className="px-2 py-2 text-left" style={{ width: "200px" }}>Chức vụ</th>
            {isAdmin && (
              <th className="px-2 py-2 text-center" style={{ width: "100px" }}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {attendees.map((d, idx) => (
            <tr key={d._id || idx} className="border-b">
              <td className="px-2 py-2 text-center min-w-[36px]">{idx + 1}</td>
              <td className="px-2 py-2 text-left min-w-[180px]">
                {d.full_name}
              </td>
              <td className="px-2 py-2 text-left min-w-[140px]">
                {d.date_of_birth}
              </td>
              <td className="px-2 py-2 text-left min-w-[180px]">
                {d.hometown}
              </td>
              <td className="px-2 py-2 text-left min-w-[200px]">{d.title}</td>
              {isAdmin && (
                <td className="px-2 py-2 flex gap-2 justify-center min-w-[100px]">
                  <button
                    onClick={() => onEdit(d)}
                    className="px-3 py-1 text-yellow-300 rounded"
                  >
                    <PencilIcon className="h-5 w-5 inline" />
                  </button>
                  <button
                    onClick={() => onDelete(d)}
                    className="px-3 py-1 text-red-500 rounded"
                  >
                    <TrashIcon className="h-5 w-5 inline" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendeesTable;
