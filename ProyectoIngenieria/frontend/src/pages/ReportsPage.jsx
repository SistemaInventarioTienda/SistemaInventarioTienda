"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/authContext"
import PageLayout from "../components/layout/PageLayout"
import { Tab, Tabs, TabList, TabPanel } from "../components/common"
import { GenerateReport, ProgramReport } from "../components/features/reports/"
import "./styles/ReportsPage.css"

function ReportsPage() {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [activeTab, setActiveTab] = useState("generate")

    useEffect(() => {
        document.title = "Reportes"
        if (!isAuthenticated) {
            navigate("/login")
        }
    }, [isAuthenticated, navigate])

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
                        <Tab value="schedule">Programar Reporte</Tab>
                        <Tab value="history">Historial</Tab>
                        <Tab value="scheduled">Programados</Tab>
                    </TabList>

                    <TabPanel value="generate" active={activeTab === "generate"}>
                        <GenerateReport />
                    </TabPanel>
                    <TabPanel value="schedule" active={activeTab === "schedule"}>
                        <ProgramReport />
                    </TabPanel>
                    <TabPanel value="history" active={activeTab === "history"}>
                        {/* Contenido de Historial */}
                        <p>Listado de reportes generados.</p>
                    </TabPanel>
                    <TabPanel value="scheduled" active={activeTab === "scheduled"}>
                        {/* Contenido de Programados */}
                        <p>Listado de reportes programados.</p>
                    </TabPanel>
                </Tabs>
            </div>
        </PageLayout>
    )
}

export default ReportsPage