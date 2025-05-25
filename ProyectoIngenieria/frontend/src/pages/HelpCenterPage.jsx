import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { Tab, Tabs, TabList, TabPanel } from "../components/common";
import Accordion from "../components/features/helpCenter/Accordion";

import { usersData } from "../config/data/usersData";
import { productsData } from "../config/data/productsData";
import { categoriesData } from "../config/data/categoriesData";
import { suppliersData } from "../config/data/suppliersData";
// import { clientsData } from "../config/data/clientsData";
// import { salesData } from "../config/data/salesData";
// import { purchasesData } from "../config/data/purchasesData";
// import { transactionsData } from "../config/data/transactionsData";
// import { reportsData } from "../config/data/reportsData";

import "./styles/HelpCenterPage.css";

const helpCenterContent = {
    users: usersData,
    products: productsData,
    categories: categoriesData,
    suppliers: suppliersData,
    // clients: clientsData,
    // sales: salesData,
    // purchases: purchasesData,
    // transacctions: transactionsData,
    // reports: reportsData,
};

function HelpCenterPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const tabFromURL = searchParams.get("tab");
    const validTabs = Object.keys(helpCenterContent);
    const initialTab = validTabs.includes(tabFromURL) ? tabFromURL : "users";

    const [activeTab, setActiveTab] = useState(initialTab);
    const [openAccordionIndex, setOpenAccordionIndex] = useState(null);

    const handleAccordionToggle = (index) => {
        setOpenAccordionIndex(openAccordionIndex === index ? null : index);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setOpenAccordionIndex(null);
        navigate(`/help-center?tab=${tab}`);
    };

    return (
        <PageLayout>
            <div className="page-header">
                <div>
                    <h1>Centro de Ayuda</h1>
                    <p>
                        Encuentra tutoriales y respuestas a preguntas frecuentes sobre el
                        sistema
                    </p>
                </div>
            </div>

            <div className="help-center-container">
                <div className="help-center-tabs-container">
                    <Tabs
                        activeTab={activeTab}
                        onChange={handleTabChange}
                        className="help-center-tabs"
                    >
                        <TabList className="help-center-tab-list">
                            <Tab value="users">Usuarios</Tab>
                            <Tab value="products">Productos</Tab>
                            <Tab value="categories">Categorías</Tab>
                            <Tab value="suppliers">Proveedores</Tab>
                            <Tab value="clients">Clientes</Tab>
                            <Tab value="sales">Ventas</Tab>
                            <Tab value="purchases">Compras</Tab>
                            <Tab value="transacctions">Transacciones</Tab>
                            <Tab value="reports">Reportes</Tab>
                        </TabList>

                        {validTabs.map((tabValue) => (
                            <TabPanel
                                key={tabValue}
                                value={tabValue}
                                active={activeTab === tabValue}
                            >
                                <div className="help-center-content-area">
                                    <h2>{helpCenterContent[tabValue]?.title}</h2>
                                    <p className="help-center-description">
                                        {helpCenterContent[tabValue]?.description}
                                    </p>

                                    {helpCenterContent[tabValue]?.sections?.length > 0 ? (
                                        <>
                                            <hr className="help-center-divider" />

                                            {helpCenterContent[tabValue].sections.map(
                                                (section, index) => (
                                                    <Accordion
                                                        key={index}
                                                        question={section.question}
                                                        answer={section.answer}
                                                        videoUrl={section.videoUrl}
                                                        isAccordionOpen={openAccordionIndex === index}
                                                        onToggle={() => handleAccordionToggle(index)}
                                                    />
                                                )
                                            )}
                                        </>
                                    ) : (
                                        <div className="help-center-no-content">
                                            <p>No hay contenido disponible para esta sección.</p>
                                        </div>
                                    )}
                                </div>
                            </TabPanel>
                        ))}
                    </Tabs>
                </div>
            </div>
        </PageLayout>
    );
}

export default HelpCenterPage;
