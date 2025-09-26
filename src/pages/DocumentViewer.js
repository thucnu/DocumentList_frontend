import React from 'react';
import { useParams } from 'react-router-dom';

const DocumentViewer = () => {
  const { encodedPath } = useParams();
  const path = decodeURIComponent(encodedPath);
  const src = `${process.env.REACT_APP_API_BASE_URL}/${path}`;

  return <iframe src={src} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }} title="Document Viewer" />;
};

export default DocumentViewer;
