import { Download } from "lucide-react";
import { useEffect, useRef } from "react";
import * as XLSX from "xlsx";

function ReportViewer({ format, downloadLink }) {
    const containerRef = useRef();

    useEffect(() => {
        console.log("Montando ReportViewer", { format, downloadLink });

        if (!format || !downloadLink || !containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = "";

        if (format === "pdf") {
            const iframe = document.createElement("iframe");
            iframe.src = downloadLink;
            iframe.style.width = "100%";
            iframe.style.height = "90vh";
            iframe.style.border = "none";
            iframe.style.borderRadius = "8px";
            container.appendChild(iframe);
        }

        if (format === "xlsx") {
            fetch(downloadLink)
                .then(res => res.arrayBuffer())
                .then(data => {
                    const workbook = XLSX.read(data, { type: "array" });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (!jsonData || jsonData.length === 0 || jsonData.every(row => row.length === 0)) {
                        container.innerHTML = "<p style='padding: 16px; font-style: italic;'>No se encontraron resultados para esos criterios.</p>";
                        return;
                    }

                    const table = document.createElement("table");
                    table.style.width = "100%";
                    table.style.borderCollapse = "collapse";
                    table.style.backgroundColor = "white";

                    jsonData.forEach((row, index) => {
                        const tr = document.createElement("tr");
                        row.forEach(cell => {
                            const cellEl = document.createElement(index === 0 ? "th" : "td");
                            cellEl.textContent = cell ?? "";
                            cellEl.style.border = "1px solid #ccc";
                            cellEl.style.padding = "8px";
                            tr.appendChild(cellEl);
                        });
                        table.appendChild(tr);
                    });

                    container.appendChild(table);
                })
                .catch(() => {
                    container.innerHTML = "<p style='padding: 16px; color: red;'>Error al cargar el archivo Excel</p>";
                });
        }
    }, [format, downloadLink]);

    const handleDownload = () => {
        const a = document.createElement("a");
        a.href = downloadLink;
        a.download = `reporte.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };

    return (
        <div className="report-viewer">
            {format === "xlsx" && (
                <button
                    type="button"
                    onClick={handleDownload}
                    className="generate-report-button"
                >
                    <Download />
                    Descargar
                </button>
            )}
            <div ref={containerRef} />

            {/* Estilos en línea para mantenerlo autocontenible */}
            <style>
                {`.generate-report-button {
                    background-color: #4a6bff;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 8px 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    margin-bottom: 20px;                
                }
                .generate-report-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                `}
            </style>
        </div>
    );
}

export default ReportViewer;
