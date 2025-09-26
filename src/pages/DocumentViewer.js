import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useParams } from 'react-router-dom';
import { toolbarPlugin } from '@react-pdf-viewer/toolbar';

const DocumentViewer = () => {
  const { encodedPath } = useParams();
  const path = decodeURIComponent(encodedPath);
  const src = `${process.env.REACT_APP_API_BASE_URL}/${path}`;

  // 1) Tạo toolbar plugin để clone toolbar mặc định
  const toolbarPluginInstance = toolbarPlugin();
  const { renderDefaultToolbar } = toolbarPluginInstance;

  // 2) “Tắt” Download cả ở thanh chính lẫn menu More actions
  const transform = (slot) => ({
    ...slot,
    // Ẩn nút trên thanh chính
    Download: () => <></>,
    Open: () => <></>,
    MoreActionsPopover: () => <></>, // Ẩn hẳn nút ⋯

    // Ẩn các mục trong menu (phòng khi bạn vẫn hiển thị ⋯ ở nơi khác)
    DownloadMenuItem: () => <></>,
    OpenMenuItem: () => <></>,
    PrintMenuItem: () => <></>, // nếu muốn ẩn luôn Print trong menu
    RotateMenuItem: () => slot.RotateMenuItem?.(), // ví dụ: vẫn giữ Rotate
    SwitchThemeMenuItem: () => slot.SwitchThemeMenuItem?.(),
    ShowSearchPopoverMenuItem: () => slot.ShowSearchPopoverMenuItem?.(),
  });

  // 3) Trả Toolbar đã transform cho default layout
  const renderToolbar = (Tb) => <Tb>{renderDefaultToolbar(transform)}</Tb>;

  // 4) Khởi tạo default layout với toolbar đã tùy biến
  const defaultLayoutPluginInstance = defaultLayoutPlugin({ renderToolbar });

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Viewer fileUrl={src} plugins={[defaultLayoutPluginInstance, toolbarPluginInstance]} />
      </Worker>
    </div>
  );
};

export default DocumentViewer;
