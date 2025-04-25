import { BarChart } from "@mui/x-charts/BarChart";
import { InfoIcon as InfoCircle, TrendingUp } from "lucide-react";
import { DatePicker } from "../../common/";
import { useTopProductsChart } from "./hooks/useTopProductsChart";
import "./styles/AnalyticsCharts.css";

export default function TopProductsChart() {
    const {
        dateRange,
        handleDateChange,
        chartData,
        best,
        loading,
        error,
    } = useTopProductsChart();

    return (
        <div className="analytics-card">
            <div className="analytics-card-header">
                <div>
                    <h3 className="analytics-card-title">Top Productos Más Vendidos</h3>
                    <p className="analytics-card-subtitle">Ranking por cantidad de unidades vendidas</p>
                </div>
                <div className="analytics-card-badge">
                    <InfoCircle size={16} />
                    <span>Rango de fechas</span>
                </div>
            </div>

            <div className="filter-section">
                <DatePicker
                    label="Desde"
                    value={dateRange.start}
                    onChange={(date) => handleDateChange("start", date)}
                    allowPastDates={true}
                    className="input"
                    placeholder="Selecciona una fecha"
                    dateFormat="Y-m-d"
                />
                <DatePicker
                    label="Hasta"
                    value={dateRange.end}
                    onChange={(date) => handleDateChange("end", date)}
                    allowPastDates={true}
                    allowFutureDates={false}
                    className="input"
                    placeholder="Selecciona una fecha"
                    dateFormat="Y-m-d"
                />
            </div>

            {loading && <div className="loading">Cargando...</div>}
            {error && <div className="error">{error}</div>}

            {!loading && !error && chartData.length === 0 ? (
                <div className="no-data">No se encontraron resultados</div>
            ) : (
                <>
                    <div className="analytics-metrics">
                        <div className="metric">
                            <div className="metric-value">{best.DSC_NOMBRE}</div>
                            <div className="metric-label">Más vendido</div>
                        </div>
                        <div className="metric">
                            <div className="metric-value">{best.TOTAL_VENDIDO}</div>
                            <div className="metric-label">Unidades vendidas</div>
                        </div>
                    </div>

                    <div className="chart-wrapper">
                        <BarChart
                            height={350}
                            series={[
                                {
                                    data: chartData.map((p) => Number(p.TOTAL_VENDIDO)),
                                    label: "Vendidos",
                                    color: "#4dabf5",
                                    valueFormatter: (value) => `${value} unidades`,
                                    barRounded: true,
                                },
                            ]}
                            xAxis={[
                                {
                                    scaleType: "band",
                                    data: chartData.map((p) => p.DSC_NOMBRE),
                                    tickLabelStyle: {
                                        fontSize: 12,
                                        fill: "var(--color-font)",
                                    },
                                },
                            ]}
                            yAxis={[
                                {
                                    tickLabelStyle: {
                                        fontSize: 12,
                                        fill: "var(--color-font)",
                                    },
                                },
                            ]}
                            margin={{ top: 20, right: 30, bottom: 50, left: 40 }}
                            tooltip={{ trigger: "item" }}
                        />
                    </div>

                    <div className="analytics-card-footer">
                        <div className="insight">
                            <TrendingUp size={16} />
                            <span>
                                <strong>Insight:</strong> {best.DSC_NOMBRE} lidera con {best.TOTAL_VENDIDO} unidades
                            </span>
                        </div>
                        <div className="insight-description">
                            Datos basados en el periodo seleccionado: {dateRange.start} a {dateRange.end}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
