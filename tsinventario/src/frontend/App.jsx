import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';
import Navbar from "./components/Navbar";
import Sidebar from './components/Sidebar';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import { ProtectedRoute } from "./routes";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import CategoryPage from "./pages/CategoryPage";
import { LoginPage } from "./pages/LoginPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (location.pathname !== '/login' && isAuthenticated) {
      document.body.classList.remove('login-page');
    } else {
      document.body.classList.add('login-page');
    }
  }, [location, isAuthenticated]);

  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="category" element={<CategoryPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="content">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="category" element={<CategoryPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;