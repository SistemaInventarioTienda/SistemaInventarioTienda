import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import PageLayout from "../components/layout/PageLayout"
import { Tab, Tabs, TabList, TabPanel } from "../components/common"
import { GenerateReport } from "../components/features/reports/"
import { ReportsHistoryPage } from "../components/features/reports/"
import { usePermissions } from "../context/authPermissions";
import { toast } from "sonner";
import "./styles/ReportsPage.css"

function ReportsPage() {
    const { permissions } = usePermissions();
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("generate")

    useEffect(() => {
        document.title = "Reportes"
        if (permissions.home === undefined) return;

        if (!permissions.reports) {
            toast.error("No tienes permiso para acceder a usuarios");
            navigate("/");
        }
    }, [permissions, navigate]);

    return (
        <PageLayout>
            <div className="page-header">
                <div>
                    <h1>Reportes</h1>
                    <p>Generación, programación y gestión de reportes del sistema</p>
                </div>
            </div>

            <div className="reports-tabs-container">
                <Tabs activeTab={activeTab} onChange={setActiveTab} className="reports-tabs">
                    <TabList className="reports-tab-list">
                        <Tab value="generate">Generar Reporte</Tab>
                        <Tab value="history">Historial de Reportes</Tab>
                    </TabList>

                    <TabPanel value="generate" active={activeTab === "generate"}>
                        <GenerateReport />
                    </TabPanel>
                    <TabPanel value="history" active={activeTab === "history"}>
                        <ReportsHistoryPage />
                    </TabPanel>
                </Tabs>
            </div>
        </PageLayout>
    )
}

export default ReportsPage