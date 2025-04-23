import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import PageLayout from "../components/layout/PageLayout";
import { MetricCard } from "../components/common";
import { Users, UserCircle, Truck, Tag, Box } from "lucide-react";
import { userConfig } from "../config/entities/userConfig";
import { clientConfig } from "../config/entities/clientConfig";
import { supplierConfig } from "../config/entities/supplierConfig";
import { categoryConfig } from "../config/entities/categoryConfig";
import { productConfig } from "../config/entities/productConfig";
import {
  TopProductsChart,
  ProductComparisonChart
} from "../components/features/analytics";

import "./styles/HomePage.css";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [metrics, setMetrics] = useState({
    users: 0,
    clients: 0,
    suppliers: 0,
    categories: 0,
    products: 0,
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
        const productsData = await productConfig.api.fetchAll();

        setMetrics({
          users: usersData.total || 0,
          clients: clientsData.total || 0,
          suppliers: suppliersData.total || 0,
          categories: categoriesData.total || 0,
          products: productsData.total || 0,
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
          onClick={() => navigate("/user")}
          title="Usuarios Totales"
          value={metrics.users}
          icon={<Users className="h-6 w-6" />}
        />
        <MetricCard
          onClick={() => navigate("/clients")}
          title="Clientes Totales"
          value={metrics.clients}
          icon={<UserCircle className="h-6 w-6" />}
        />
        <MetricCard
          onClick={() => navigate("/suppliers")}
          title="Proveedores Totales"
          value={metrics.suppliers}
          icon={<Truck className="h-6 w-6" />}
        />
        <MetricCard
          onClick={() => navigate("/product")}
          title="Productos Totales"
          value={metrics.products}
          icon={<Box className="h-6 w-6" />}
        />
      </div>

      <div className="charts-section">

         <div className="charts-row">
          {/* <MonthlySalesChart/> */}
          <TopProductsChart/>
        </div> 

        <div className="chart-full-width">
          <ProductComparisonChart />
        </div>
      </div>


    </PageLayout>
  );
}

export default HomePage;