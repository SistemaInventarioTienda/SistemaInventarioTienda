import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PageLayout from "../components/layout/PageLayout";
import { MetricCard } from "../components/common";
import { Users, UserCircle, Truck, Tag } from "lucide-react";
import { userConfig } from "../config/entities/userConfig";
import { clientConfig } from "../config/entities/clientConfig";
import { supplierConfig } from "../config/entities/supplierConfig";
import { categoryConfig } from "../config/entities/categoryConfig";

import "./styles/HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [metrics, setMetrics] = useState({
    users: 0,
    clients: 0,
    suppliers: 0,
  });

  useEffect(() => {
    document.title = "Inicio";
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const usersData = await userConfig.api.fetchAll();
        const clientsData = await clientConfig.api.fetchAll();
        const suppliersData = await supplierConfig.api.fetchAll();
        const categoriesData = await categoryConfig.api.fetchAll();

        setMetrics({
          users: usersData.total || 0,
          clients: clientsData.total || 0,
          suppliers: suppliersData.total || 0,
          categories: categoriesData.total || 0,
        });
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <PageLayout>
      <div className="page-header">
        <div>
          <h1>Inicio</h1>
          <p>Información general del inventario</p>
        </div>
      </div>
      <div className="metric-grid">
        <MetricCard
          title="Usuarios Totales"
          value={metrics.users}
          icon={<Users className="h-6 w-6" />}
        />
        <MetricCard
          title="Clientes Totales"
          value={metrics.clients}
          icon={<UserCircle className="h-6 w-6" />}
        />
        <MetricCard
          title="Proveedores Totales"
          value={metrics.suppliers}
          icon={<Truck className="h-6 w-6" />}
        />
        <MetricCard
          title="Categorías Totales"
          value={metrics.categories}
          icon={<Tag className="h-6 w-6" />}
        />
      </div>
    </PageLayout>
  );
}

export default HomePage;