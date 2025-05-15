import { Button, Select, DatePicker } from "../../common"
import { useGenerateReport } from "./hooks/useGenerateReport"
import { ReportPreview } from "./";

function GenerateReport() {
    const {
        // Estado
        reportType,
        format,
        startDate,
        endDate,
        isLoading,
        // Opciones
        reportTypeOptions,
        formatOptions,
        // Manejadores
        handleReportTypeChange,
        handleFormatChange,
        handleStartDateChange,
        handleEndDateChange,
        handleSubmit,
    } = useGenerateReport()

    return (
        <div className="reports-container">
            <div className="report-form-card">
                <div className="report-filter-grid">
                    <div className="report-filter-item">
                        <label className="report-filter-label">Tipo de Reporte</label>
                        <div className="report-select-wrapper">
                            <Select
                                name="reportType"
                                value={reportType}
                                onChange={handleReportTypeChange}
                                options={reportTypeOptions}
                                className="report-filter-input"
                                placeholder="Seleccionar tipo de reporte"
                            />
                        </div>
                    </div>

                    <div className="report-filter-item">
                        <label className="report-filter-label">Formato</label>
                        <div className="report-select-wrapper">
                            <Select
                                name="format"
                                value={format}
                                onChange={handleFormatChange}
                                options={formatOptions}
                                className="report-filter-input"
                                placeholder="Seleccionar formato"
                            />
                        </div>
                    </div>

                    {reportType !== "ProveedoresActivos" && (
                        <>
                            <div className="report-filter-item">
                                <label className="report-filter-label">Fecha de Inicio</label>
                                <DatePicker
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    allowPastDates={true}
                                    allowFutureDates={false}
                                    className="report-filter-input"
                                    placeholder="Selecciona fecha inicio"
                                    dateFormat="Y-m-d"
                                />
                            </div>

                            <div className="report-filter-item">
                                <label className="report-filter-label">Fecha de Fin</label>
                                <DatePicker
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    allowPastDates={true}
                                    allowFutureDates={false}
                                    className="report-filter-input"
                                    placeholder="Selecciona fecha fin"
                                    dateFormat="Y-m-d"
                                />
                            </div>
                        </>
                    )}

                </div>

                <div className="report-actions">
                    <Button type="button" variant="primary" onClick={handleSubmit} className="generate-report-button">
                        Generar Reporte
                    </Button>
                </div>
            </div>

            <ReportPreview reportType={reportType} format={format} isLoading={isLoading} />
        </div>
    )
}

export default GenerateReport