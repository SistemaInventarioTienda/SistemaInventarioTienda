import { Button, Select, DatePicker, CheckboxList, Input } from "../../common"
import { useProgramReport } from "./hooks/useProgramReport"

function ProgramReport() {
    const {
        // Estado
        reportType,
        format,
        startDate,
        endDate,
        email,
        frecuency,
        isLoading,
        // Opciones
        reportTypeOptions,
        formatOptions,
        frecuencyOptions,
        // Manejadores
        handleReportTypeChange,
        handleFormatChange,
        handleStartDateChange,
        handleEndDateChange,
        handleEmailChange,
        handleFrecuencyChange,
        handleSubmit
    } = useProgramReport()

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

                    <div className="report-filter-item">
                        <label className="report-filter-label">Fecha de Inicio</label>
                        <DatePicker
                            value={startDate}
                            onChange={handleStartDateChange}
                            allowPastDates={true}
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
                            className="report-filter-input"
                            placeholder="Selecciona fecha fin"
                            dateFormat="Y-m-d"
                        />
                    </div>

                    <div className="report-filter-item">
                        <label className="report-filter-label">Correo</label>
                        <div className="report-select-wrapper">
                            <Input
                                name="format"
                                value={email}
                                className="report-filter-input"
                                placeholder="Correo electrónico"
                            />
                        </div>
                    </div>

                    <div className="report-filter-item">
                        <label className="report-filter-label">Frecuencia</label>
                        <div className="checkbox-list radio-style">
                            {[
                                { value: "diary", label: "Diario" },
                                { value: "weekly", label: "Semanal" },
                                { value: "monthly", label: "Mensual" }
                            ].map((option) => (
                                <div key={option.value} className="checkbox-list-item">
                                    <input
                                        type="checkbox"
                                        id={`frecuency-${option.value}`}
                                        checked={frecuency === option.value}
                                        onChange={() => handleFrecuencyChange(option.value)}
                                    />
                                    <label htmlFor={`frecuency-${option.value}`}>{option.label}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="report-actions">
                    <Button type="button" variant="primary" onClick={handleSubmit} className="generate-report-button">
                        Programar Reporte
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default ProgramReport