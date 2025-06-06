import { File, FileText, FileSpreadsheet } from 'lucide-react';
import { API_URL_RESOURCES } from '../../../config';
const DEFAULT_IMAGE_URL = `${API_URL_RESOURCES}/images/reports_preview`;

const ReportPreview = ({ reportType, format, isLoading }) => {
  const getReportLabel = (type) => {
    switch (type) {
      case 'ComprasXProveedor':
        return 'Compras por proveedor';
      case 'VentasXCliente':
        return 'Ventas por cliente';
      case 'ReporteTransaccion':
        return 'Reporte de transacciones';
      default:
        return type;
    }
  };

  const getFormatIcon = (format) => {
    switch (format?.toLowerCase()) {
      case 'pdf':
        return <FileText size={16} className="inline-icon" />;
      case 'excel':
        return <FileSpreadsheet size={16} className="inline-icon" />;
      default:
        return null;
    }
  };

  const getFormatClass = (format) => {
    switch (format?.toLowerCase()) {
      case 'pdf':
        return 'pill format-pdf';
      case 'xlsx':
        return 'pill format-excel';
      default:
        return 'pill';
    }
  };

  return (
    <div className="report-preview-card">
      <h3 className="report-preview-title">Vista previa del reporte</h3>
      <p className="pill disclaimer">Los datos mostrados en esta vista previa son solo de ejemplo y no tienen validez.</p>

      {!reportType || !format ? (
        <div className="report-preview-placeholder">
          <File size={40} className="icon-preview" />
          <p>Selecciona un tipo de reporte y un formato para ver la vista previa.</p>
        </div>
      ) : isLoading ? (
        <div className="report-preview-placeholder">
          <p>Cargando vista previa...</p>
        </div>
      ) : (
        <div>
          <div>
            <span className="pill type">
              Tipo de reporte: {getReportLabel(reportType)}
            </span>
            <span className={getFormatClass(format)}>
              {getFormatIcon(format)} Formato seleccionado: {format}
            </span>
          </div>

          <div className="report-preview-image">
            <img
              src={`${DEFAULT_IMAGE_URL}/${reportType.toLowerCase()}_${format.toLowerCase()}_preview.png`}
              alt={`Vista previa del reporte ${reportType} en formato ${format}`}
              className="report-preview-img fade-in"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${DEFAULT_IMAGE_URL}/no_image_found.png`;
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportPreview;