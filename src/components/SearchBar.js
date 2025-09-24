import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

const SearchBar = ({ value, onChange }) => (
  <div className="max-w-lg mx-auto mb-6 flex items-center bg-gray-50 rounded border border-gray-300 px-3 py-2">
    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
    <input
      type="text"
      placeholder="Tìm kiếm theo tên tài liệu..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 bg-transparent outline-none text-gray-900"
    />
  </div>
);

export default SearchBar;
