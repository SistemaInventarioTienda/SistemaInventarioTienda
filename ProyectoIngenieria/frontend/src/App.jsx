import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from "./components/layout/Navbar";
import Sidebar from './components/layout/Sidebar';
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import { ProtectedRoute } from "./routes";
import CategoryPage from "./pages/CategoryPage";
import ClientPage from "./pages/ClientPage";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import SupplierPage from './pages/SupplierPage';
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

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
    if (location.pathname === '/login') {
      document.body.classList.add('login-page');
    } else {
      document.body.classList.remove('login-page');
    }
  }, [location]);

  return (
    <div className="app-wrapper">
      <Routes>
        {/* Ruta pública para login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="user" element={<UserPage />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="clients" element={<ClientPage />} />
            <Route path="suppliers" element={<SupplierPage />} />


            <Route path="profile" element={<ProfilePage />} />
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;