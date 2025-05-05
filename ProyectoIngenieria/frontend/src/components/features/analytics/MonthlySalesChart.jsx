import { LineChart } from "@mui/x-charts/LineChart";
import { InfoIcon as InfoCircle, TrendingUp } from "lucide-react";
import { useMonthlySalesChart } from "./hooks/useMonthlySalesChart";
import { Select } from "../../common";
import "./styles/AnalyticsCharts.css";

export default function MonthlySalesChart() {
    const { selectedYear, handleYearChange, chartData, loading, error, yearOptions } = useMonthlySalesChart();

    const totalVentas = chartData.reduce((sum, m) => sum + (m.TotalRecaudado || 0), 0);
    const mesesConVentas = chartData.filter((m) => (m.TotalRecaudado || 0) > 0).length;
    const mejorMes = chartData.reduce((prev, current) => (
        current.TotalRecaudado > (prev?.TotalRecaudado || 0) ? current : prev
    ), null);

    const monthLabels = {
        "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr",
        "05": "May", "06": "Jun", "07": "Jul", "08": "Ago",
        "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic"
    };

    const formattedChartData = chartData.map((m) => ({
        ...m,
        MesAbrev: monthLabels[m.Mes.split("-")[1]] || m.Mes
    }));

    if (loading) return <div>Cargando ventas...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="analytics-card">
            <div className="analytics-card-header">
                <div>
                    <h3 className="analytics-card-title">Ventas Mensuales</h3>
                    <p className="analytics-card-subtitle">Análisis del rendimiento mensual de ventas</p>
                </div>
                <div className="analytics-card-badge">
                    <InfoCircle size={16} />
                    <span>Año</span>
                </div>
            </div>

            <div className="filter-container">
                <div className="filter-section">
                    <div className="filter-item">
                        <div className="filter-label">Año seleccionado</div>
                        <Select
                            name="selectedYear"
                            value={selectedYear}
                            onChange={(e) => handleYearChange(e.target.value)}
                            options={yearOptions}
                            className="filter-input"
                        />
                    </div>
                </div>
            </div>

            <div className="analytics-metrics">
                <div className="metric">
                    <div className="metric-value">₡{totalVentas.toLocaleString()}</div>
                    <div className="metric-label">Total Anual</div>
                </div>
                <div className="metric">
                    <div className="metric-value">{mesesConVentas}</div>
                    <div className="metric-label">Meses con ventas</div>
                </div>
            </div>

            <div className="chart-wrapper">
                <LineChart
                    xAxis={[{
                        scaleType: 'point',
                        data: formattedChartData.map((m) => m.MesAbrev),
                        tickLabelStyle: {
                            fill: "var(--color-font)",
                        }
                    }]}
                    yAxis={[{
                        type: 'linear',
                        domain: [0, Math.max(...formattedChartData.map((m) => m.TotalRecaudado || 0))],
                        tickLabelStyle: {
                            fill: "var(--color-font)",
                            fontSize: 10,
                            textAnchor: 'end',
                        },
                    }]}
                    series={[{
                        data: formattedChartData.map((m) => m.TotalRecaudado || 0),
                        label: 'Ventas',
                        showMark: true,
                        color: '#4dabf5',
                    }]}
                    height={350}
                />
            </div>

            <div className="analytics-card-footer">
                {mejorMes && (
                    <div className="insight">
                        <TrendingUp size={16} />
                        <span>
                            <strong>Insight:</strong> El mes con más ventas fue {
                                monthLabels[mejorMes.Mes.split("-")[1]]
                            } con ₡{(mejorMes.TotalRecaudado || 0).toLocaleString()}.
                        </span>
                    </div>
                )}
                <div className="insight-description">
                    Esta visualización ayuda a identificar patrones estacionales y tomar decisiones estratégicas basadas en el rendimiento mensual.
                </div>
            </div>
        </div>
    );
}
