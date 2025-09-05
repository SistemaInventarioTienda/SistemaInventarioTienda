import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import { AuthProvider, useAuth } from "./context/authContext";
import { AuthPermissionsProvider } from "./context/authPermissions";
import { ProtectedRoute } from "./routes";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import {
  CategoryPage,
  ClientPage,
  CreditPage,
  HomePage,
  UserPage,
  SupplierPage,
  LoginPage,
  SettingsPage,
  ProductPage,
  SalePage,
  AddSalePage,
  AddShoppingPage,
  TransactionPage,
  ShoppingPage,
  CreditSalePage,
  ProfilePage,
  ReportsPage,
  CashClosingPage,
  NotificationPage,
  ProformaPage,
  AddProformaPage,
  ProformaDetailPage,
} from "./pages";
import { NotificationProvider } from "./context/NotificationContext";

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
        <NotificationProvider>
        <HashRouter>
          <AppContent isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <Toaster
            position="bottom-right"
            visibleToasts={5}
            richColors
            closeButton
            theme={isDarkMode ? "dark" : "light"}
            toastOptions={{
              className: "custom-toaster",
            }}
          />
        </HashRouter>
        </NotificationProvider>
      </AuthPermissionsProvider>
    </AuthProvider>
  );
}

function AppContent({ isDarkMode, toggleDarkMode }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (location.pathname !== "/login" && isAuthenticated) {
      document.body.classList.remove("login-page");
    } else {
      document.body.classList.add("login-page");
    }
  }, [location, isAuthenticated]);
  return (
    <div className="app-wrapper">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/*"
            element={
              <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            }
          ></Route>
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
            <Route path="notifications" element={<NotificationPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="product" element={<ProductPage />} />
            <Route path="sales/credit" element={<CreditSalePage />}></Route>
            <Route path="credits" element={<CreditPage />} />
            <Route path="sales/history" element={<SalePage />} />
            <Route path="sales/new" element={<AddSalePage />} />
            <Route path="shopping/history" element={<ShoppingPage />} />
            <Route path="shopping/new" element={<AddShoppingPage />} />
            <Route path="transaction" element={<TransactionPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="cashClosing" element={<CashClosingPage />} />

            <Route path="proformas/history" element={<ProformaPage/>} />
            <Route path="proformas/new" element={<AddProformaPage/>} />
            <Route path="/proformas/:barcode" element={<ProformaDetailPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
