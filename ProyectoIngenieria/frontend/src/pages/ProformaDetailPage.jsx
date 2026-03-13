import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { getAllProformas, getProformaSale } from "../api/proforma"
import ProformaTable from "../components/features/proforma/ProformaTable"
import "./styles/ProformaDetailPage.css"
import PageLayout from "../components/layout/PageLayout"
import { Printer, ArrowLeft, ShoppingCart } from "lucide-react"
import Barcode from "react-barcode"
import html2pdf from "html2pdf.js"
import { toast } from "sonner"
import { formatPhoneNumber, formatPrice } from "../utils/formatters"

export default function ProformaDetailPage() {
    const [proforma, setProforma] = useState(null)
    const navigate = useNavigate()
    const { barcode } = useParams()
    const location = useLocation()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProformaSale(barcode);
                if (!data?.proforma?.length) {
                    setProforma(null);
                } else {
                    const pf = data.proforma[0];

                    // Normalizamos la estructura
                    const normalized = {
                        ...pf,
                        detailsproformas: pf.PRODUCTS_LISTS.map(p => ({
                            ...p,
                            ID_PRODUCTO: p.ID,
                            DSC_NOMBRE: p.DSC_NOMBRE,
                            DSC_DESCRIPTION: p.DSC_DESCRIPTION,
                            PRECIO_UNITARIO: p.PRECIO_UNITARIO,
                            CANTIDAD: p.CANTIDAD,
                            IMPUESTO: p.IMPUESTO,
                            DESCUENTO: p.DESCUENTO
                        })),
                        Config: {
                            DSC_NOMBRE: pf.DSC_NOMBRE,
                            DSC_CORREO: pf.DSC_CORREO,
                            DSC_DIRECCION: pf.DSC_DIRECCION,
                            NUM_TELEFONO: pf.NUM_TELEFONO,
                            DSC_SLOGAN: pf.DSC_ESLOGAN
                        },
                        Cliente: {
                            TIPO_CLIENTE: "Cliente general",
                            NOTA: ""
                        }
                    };

                    setProforma(normalized);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [barcode]);

    // Descarga automática si viene con ?download=1
    useEffect(() => {
        if (proforma) {
            const params = new URLSearchParams(location.search)
            if (params.get("download") === "1") {
                setTimeout(() => {
                    handlePrint()
                }, 1000)
            }
        }
    }, [proforma, location])

    if (!proforma) {
        return <div className="loading-container">Cargando detalle de proforma...</div>
    }

    function reverseDate(dateStr) {
        // Separa la fecha en partes: [YYYY, MM, DD]
        const parts = dateStr.split("-");

        // Retorna en orden invertido: DD-MM-YYYY
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    // ✅ Calcular totales producto por producto
    const { subtotal, totalDescuentos, totalImpuestos, total } =
        proforma.detailsproformas?.reduce(
            (acc, item) => {
                const sub = item.PRECIO_UNITARIO * item.CANTIDAD

                // descuento (%)
                const descPct = item.DESCUENTO || 0
                const desc = (descPct * sub) / 100
                const subDesc = sub - desc

                // impuesto (%)
                const impPct = item.IMPUESTO || 0
                const imp = (impPct * subDesc) / 100

                // acumular
                acc.subtotal += sub
                acc.totalDescuentos += desc
                acc.totalImpuestos += imp
                acc.total += subDesc + imp

                return acc
            },
            { subtotal: 0, totalDescuentos: 0, totalImpuestos: 0, total: 0 }
        ) || { subtotal: 0, totalDescuentos: 0, totalImpuestos: 0, total: 0 }

    const handlePrint = async () => {
        const element = document.getElementById("print-area")

        document.body.classList.add("pdf-mode")
        await new Promise((r) => requestAnimationFrame(() => r()))

        const opt = {
            margin: 10,
            filename: `proforma-${proforma.DSC_CODIGO_BARRAS}.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                scrollX: 0,
                scrollY: 0,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            },
            pagebreak: {
                mode: ["css", "legacy", "avoid-all"],
                avoid: [".summary-sidebar", ".products-table", ".summary-box"],
            },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        }

        try {
            await html2pdf().set(opt).from(element).save()
        } finally {
            document.body.classList.remove("pdf-mode")
        }
    }

    const handleBack = () => {
        navigate("/proformas/history")
    }

    const handleConvertToSale = async () => {
        try {
            const data = await getProformaSale(proforma.DSC_CODIGO_BARRAS);
            if (!data?.proforma?.length) {
                return toast.error("No se pudo cargar la proforma");
            }

            const selected = data.proforma[0];
            navigate("/sales/new", { state: { proforma: selected } });

        } catch (error) {
            toast.error("Error al convertir la proforma a venta");
        }
    };

    return (
        <PageLayout>
            <div className="proforma-page">
                <div className="proforma-header-actions">
                    <button className="btn-back" onClick={handleBack}>
                        <ArrowLeft size={16} style={{ marginRight: 6 }} /> Volver al historial
                    </button>
                    <div className="proforma-header-buttons">
                        <button className="secondary-btn" onClick={handlePrint}>
                            <Printer size={16} style={{ marginRight: 6 }} /> Imprimir
                        </button>
                        <button className="primary-btn" onClick={handleConvertToSale}>
                            <ShoppingCart size={16} style={{ marginRight: 6 }} /> Convertir a venta
                        </button>
                    </div>
                </div>

                <div id="print-area" className="proforma-document">
                    <div className="document-header">
                        <div className="company-section">
                            <div className="company-logo">
                                <div className="logo-circle">TZ</div>
                            </div>
                            <div className="company-info">
                                <h2 className="company-name">{proforma.Config?.DSC_NOMBRE || "Tienda"}</h2>
                                <p className="company-slogan">{proforma.Config?.DSC_SLOGAN || ""}</p>
                                <div className="company-contact">
                                    <p>{proforma.Config?.DSC_DIRECCION || ""}</p>
                                    <p>{formatPhoneNumber(proforma.Config?.NUM_TELEFONO)}</p>
                                    <p>{proforma.Config?.DSC_CORREO || ""}</p>
                                </div>
                            </div>
                        </div>

                        <div className="proforma-section">
                            <h1 className="proforma-title">FACTURA PROFORMA</h1>
                            <div className="proforma-details">
                                <p>
                                    <strong>Código:</strong> {proforma.DSC_CODIGO_BARRAS}
                                </p>
                                <p>
                                    <strong>Fecha:</strong> {reverseDate(proforma.FEC_CREACION)}
                                </p>
                                <p>
                                    <strong>Válida hasta:</strong> {reverseDate(proforma.FEC_LIMITE)}
                                </p>
                            </div>
                            <div className={`status-badge ${new Date(proforma.FEC_LIMITE) < new Date() ? "expired" : "valid"}`}>
                                {new Date(proforma.FEC_LIMITE) < new Date() ? "Vencida" : "Válida"}
                            </div>
                        </div>
                    </div>

                    <div className="client-section">
                        <h3 className="section-title">Información del Cliente</h3>
                        <div className="client-info">
                            <p className="client-type">{proforma.Cliente?.TIPO_CLIENTE || "Cliente general"}</p>
                            <p className="client-note">{proforma.Cliente?.NOTA || "No se especificó información del cliente"}</p>
                        </div>
                    </div>

                    <div className="products-section">
                        <h3 className="section-title">Productos</h3>
                        <div className="products-layout">
                            <div className="products-table">
                                <ProformaTable items={proforma.detailsproformas} />
                            </div>
                            <div className="summary-sidebar">
                                <div className="summary-box">
                                    <div className="summary-row">
                                        <span>Subtotal:</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Impuestos:</span>
                                        <span>{formatPrice(totalImpuestos)}</span>
                                    </div>
                                    <div className="summary-row total-row">
                                        <span><strong>Total:</strong></span>
                                        <span className="total-amount">{formatPrice(total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="document-footer">
                        <p className="validity-text">
                            Esta proforma es válida hasta el {new Date(proforma.FEC_LIMITE).toLocaleDateString("es-CR")}
                        </p>
                        <p className="price-text">Los precios pueden estar sujetos a cambios sin previo aviso</p>

                        <div className="barcode-section">
                            <Barcode
                                value={proforma.DSC_CODIGO_BARRAS}
                                format="CODE128"
                                width={1}
                                height={50}
                                displayValue={true}
                                fontSize={12}
                                margin={0}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
