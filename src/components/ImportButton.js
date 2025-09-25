import React from "react";
import * as XLSX from "xlsx";
import axios from "../api/axios";

const ImportButton = ({ onImportSuccess }) => {
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    // Assuming first row is header
    const [header, ...body] = rows;
    const objects = body.map((row, idx) => ({
      stt: row[0] || idx + 1,
      fullname: row[1] || "",
      birthDate: row[2] || "",
      address: row[3] || "",
      position: row[4] || "",
      // image: row[5] || "", // Commented out image logic
    }));
    try {
      await axios.post("delegates/import", { delegates: objects });
      onImportSuccess();
    } catch (err) {
      alert("Import thất bại!");
    }
  };

  return (
    <label className="cursor-pointer absolute px-4 py-2 bg-red-700 text-white font-bold rounded hover:bg-red-800">
      Import Excel (.xlsx)
      <input
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={handleImport}
      />
    </label>
  );
};

export default ImportButton;
