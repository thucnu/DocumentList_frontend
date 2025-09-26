import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BannerHeader from './components/BannerHeader';
import MenuBar from './components/MenuBar';
import AttendeesPage from './pages/AttendeesPage';
import DocumentsPage from './pages/DocumentsPage';
import LoginPage from './pages/LoginPage';
import DocumentViewer from './pages/DocumentViewer';
import axios from './api/axios';
import { Outlet } from 'react-router-dom';

const Layout = ({ isAdmin, username, onLogout }) => (
  <div className="min-h-screen bg-gray-100 font-sans">
    <BannerHeader />
    <MenuBar isAdmin={isAdmin} username={username} onLogout={onLogout} />
    <div className="mx-auto px-2 py-6">
      <Outlet />
    </div>
  </div>
);

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [documents, setDocuments] = useState([]);
  const [search] = useState(''); // used for API
  const [, setSearchInput] = useState(''); // used for input field
  const [, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setIsAdmin(JSON.parse(localStorage.getItem('isAdmin') || 'false'));
      setUsername(localStorage.getItem('username') || '');
    } else {
      setIsAdmin(false);
      setUsername('');
    }
  }, [token]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/files', {
        params: search ? { name: search } : {},
      });
      const newDocs = res.data;
      if (documents.length !== newDocs.length || documents.some((doc, i) => doc._id !== newDocs[i]?._id)) {
        setDocuments(newDocs);
      }
    } catch {
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line
  }, [search]);

  const handleLogin = (jwt, admin) => {
    setSearchInput('');
    setToken(jwt);
    setIsAdmin(admin);
    setUsername('Admin'); // TODO: thay bằng username thực tế từ backend
    localStorage.setItem('token', jwt);
    localStorage.setItem('isAdmin', JSON.stringify(admin));
    localStorage.setItem('username', 'Admin');
    fetchDocuments();
  };

  const handleLogout = () => {
    setSearchInput('');
    setToken('');
    setIsAdmin(false);
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('username');
  };

  return (
    <Router>
      <Routes>
        {/* Route cho trang login */}
        <Route
          path="/login"
          element={
            <LoginPage
              onLogin={(jwt, admin) => {
                handleLogin(jwt, admin);
                window.location.href = '/';
              }}
            />
          }
        />

        {/* Route cha chứa layout chung */}
        <Route element={<Layout isAdmin={isAdmin} username={username} onLogout={handleLogout} />}>
          <Route
            path="/"
            element={<DocumentsPage isAdmin={isAdmin} token={token} username={username} onLogin={handleLogin} onLogout={handleLogout} />}
          />
          <Route
            path="/documents"
            element={<DocumentsPage isAdmin={isAdmin} token={token} username={username} onLogin={handleLogin} onLogout={handleLogout} />}
          />
          <Route
            path="/attendees"
            element={<AttendeesPage isAdmin={isAdmin} token={token} username={username} onLogin={handleLogin} onLogout={handleLogout} />}
          />
          <Route
            path="*"
            element={
              <div className="bg-white rounded-xl shadow p-8 text-center text-lg font-semibold text-blue-900">
                Trang này sẽ được cập nhật nội dung sau.
              </div>
            }
          />
        </Route>
        <Route path="/view/:encodedPath" element={<DocumentViewer />} />
      </Routes>
    </Router>
  );
};

export default App;
