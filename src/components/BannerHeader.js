import React from "react";
// Thay đổi đường dẫn ảnh bên dưới sau khi bạn upload ảnh vào thư mục assets
import bgBanner from "../assets/background.png"; // ảnh nền
import flagLogo from "../assets/flag.gif"; // ảnh lá cờ + búa liềm

const BannerHeader = () => (
  <div
    className="w-full flex items-center justify-center relative"
    style={{
      backgroundImage: `url(${bgBanner})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: 140,
    }}
  >
    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
      <img
        src={flagLogo}
        alt="Cờ Đảng"
        className="w-40 h-40 object-contain drop-shadow-lg"
      />
    </div>
    <div className="mx-auto text-center py-6">
      <div className="text-2xl md:text-3xl font-extrabold text-red-700 uppercase tracking-wide leading-tight">
        ĐẠI HỘI ĐẠI BIỂU ĐẢNG BỘ THÀNH PHỐ CẦN THƠ
      </div>
      <div className="text-lg md:text-xl font-bold text-red-700 mt-2">
        LẦN THỨ I, NHIỆM KỲ 2025-2030
      </div>
    </div>
  </div>
);

export default BannerHeader;
