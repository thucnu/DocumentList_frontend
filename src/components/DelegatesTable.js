import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
const DelegatesTable = ({ delegates, isAdmin, onEdit, onDelete }) => (
  <div className="overflow-x-auto w-full">
    <table className="min-w-full bg-white rounded shadow">
      <thead>
        <tr className="bg-gray-400 text-white">
          <th className="px-2 py-2">STT</th>
          <th className="px-2 py-2">Họ và Tên</th>
          <th className="px-2 py-2">Ngày Sinh</th>
          <th className="px-2 py-2">Nơi ở hiện tại</th>
          <th className="px-2 py-2">Chức vụ - Đơn vị công tác</th>
          {/* <th className="px-2 py-2">Ảnh cá nhân</th> */}
          {isAdmin && <th className="px-2 py-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {delegates.map((d, idx) => (
          <tr key={d._id || idx} className="border-b">
            <td className="px-2 py-2 text-center">{d.stt}</td>
            <td className="px-2 py-2 text-center">{d.fullname}</td>
            <td className="px-2 py-2 text-center">{d.birthDate}</td>
            <td className="px-2 py-2 text-center">{d.address}</td>
            <td className="px-2 py-2 text-center">{d.position}</td>
            {/* <td className="px-2 py-2 text-center">
              {d.image ? (
                <img
                  src={d.image}
                  alt="Ảnh cá nhân"
                  className="w-12 h-12 object-cover rounded-full mx-auto"
                />
              ) : (
                <span className="italic text-gray-400">Không có</span>
              )}
            </td> */}
            {isAdmin && (
              <td className="px-2 py-2 flex gap-2 justify-center">
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

export default DelegatesTable;
