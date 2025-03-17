import { default as useSaleForm } from '../hooks/useSaleForm';
import PageLayout from "../components/layout/PageLayout";
import { SalesDetailsCard, SalesSummaryCard } from "../components/features/sales";
import "./styles/AddSalePage.css"

const AddSalePage = () => {
    const saleForm = useSaleForm();

    return (
        <PageLayout>
            <div className="page-header">
                <div>
                    <h1>Nueva Venta</h1>
                    <p>Seleccione o digite los datos correspondientes para realizar una nueva venta</p>
                </div>
            </div>
            <div className="sales-grid">
                <SalesDetailsCard saleForm={saleForm} />
                <SalesSummaryCard saleForm={saleForm} />
            </div>
        </PageLayout>
    );
};

export default AddSalePage;