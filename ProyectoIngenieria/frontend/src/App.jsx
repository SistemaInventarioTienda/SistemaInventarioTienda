import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from "./components/layout/Navbar";
import Sidebar from './components/layout/Sidebar';
import { AuthProvider, useAuth } from "./context/authContext";
import { AuthPermissionsProvider } from './context/authPermissions';
import { ProtectedRoute } from "./routes";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import CategoryPage from "./pages/CategoryPage";
import ClientPage from "./pages/ClientPage";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import SupplierPage from './pages/SupplierPage';
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ProductPage from './pages/ProductPage';
import { Toaster } from "sonner";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode);
      document.body.classList.toggle("dark-mode", newMode);
      return newMode;
    });
  };
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);
  return (
    <AuthProvider>
      <AuthPermissionsProvider>
        <HashRouter>
          <AppContent isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <Toaster
            position="bottom-right"
            visibleToasts={5}
            richColors
            closeButton
            theme={isDarkMode ? "dark" : "light"}
            toastOptions={{
              className: 'custom-toaster',
            }}
          />
        </HashRouter>
      </AuthPermissionsProvider>
    </AuthProvider>
  );
}

function AppContent({ isDarkMode, toggleDarkMode }) {
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
          <Route path="/*" element={<Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}>
            <Route index element={<HomePage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="clients" element={<ClientPage />} />
            <Route path="suppliers" element={<SupplierPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="product" element={<ProductPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

function Layout({ isDarkMode, toggleDarkMode }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <main className="content">
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="clients" element={<ClientPage />} />
            <Route path="suppliers" element={<SupplierPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="product" element={<ProductPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;