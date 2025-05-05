import React from "react";
import ReactDOM from "react-dom/client";
import ReportViewer from "../ReportViewer"; 

export function openReportViewerInNewWindow(format, downloadLink) {
    const newWindow = window.open("", "_blank", "width=1200,height=800");
    if (!newWindow) return;

    newWindow.document.write(`
        <html>
            <head>
                <title>Vista previa del reporte</title>
                <style>
                    body { margin: 0; padding: 1rem; font-family: sans-serif; background: #f9f9f9; }
                </style>
            </head>
            <body>
                <div id="report-root"></div>
            </body>
        </html>
    `);

    newWindow.document.close();

    const mountNode = newWindow.document.getElementById("report-root");

    if (mountNode) {
        const root = ReactDOM.createRoot(mountNode);
        root.render(<ReportViewer format={format} downloadLink={downloadLink} />);
    }
}