import { BarChart } from "@mui/x-charts/BarChart"
import { InfoIcon as InfoCircle, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { DatePicker } from "../../common";
import { useInventoryComparisonChart } from "./hooks/useInventoryComparisonChart";
import { Select } from "../../common";
import "./styles/AnalyticsCharts.css";

export default function ProductComparisonChart() {
  const {
    chartData,
    dateRange,
    handleDateChange,
    loading,
    error,
    filterType,
    handleFilterTypeChange,
    filterOptions,
    selectedFilter,
    handleFilterChange,
  } = useInventoryComparisonChart();

  const stockColor = "#4dabf5";
  const vendidosColor = "#f55252";

  const bestProduct = [...chartData].sort((a, b) => b.ratio - a.ratio)[0] || {};
  const totalStock = chartData.reduce((sum, item) => sum + item.stock, 0);
  const totalVendidos = chartData.reduce((sum, item) => sum + item.vendidos, 0);
  const overallRatio = totalStock ? (totalVendidos / totalStock).toFixed(2) : 0;
  const isGoodRatio = Number(overallRatio) > 0.7;
  const sortedChartData = [...chartData].sort((a, b) => b.stock - a.stock);

  return (
    <div className="analytics-card">
      <div className="analytics-card-header">
        <div>
          <h3 className="analytics-card-title">Análisis de Inventario y Ventas</h3>
          <p className="analytics-card-subtitle">Comparación entre stock disponible y unidades vendidas por producto</p>
        </div>
        <div className="analytics-card-badge">
          <InfoCircle size={16} />
          <span>Actualizado</span>
        </div>
      </div>

      <div className="filter-container">
        <div className="filter-section">
          <div className="filter-item">
            <div className="filter-label">Desde</div>
            <DatePicker
              value={dateRange.start}
              onChange={(date) => handleDateChange("start", date)}
              allowPastDates={true}
              className="filter-input"
              placeholder="Selecciona una fecha"
              dateFormat="Y-m-d"
            />
          </div>

          <div className="filter-item">
            <div className="filter-label">Hasta</div>
            <DatePicker
              value={dateRange.end}
              onChange={(date) => handleDateChange("end", date)}
              allowPastDates={true}
              allowFutureDates={false}
              className="filter-input"
              placeholder="Selecciona una fecha"
              dateFormat="Y-m-d"
            />
          </div>

          <div className="filter-item">
            <div className="filter-label">Tipo de filtro</div>
            <Select
              name="filterType"
              value={filterType}
              onChange={handleFilterTypeChange}
              options={[
                { value: "category", label: "Categoría" },
                { value: "subcategory", label: "Subcategoría" }
              ]}
              className="filter-input"
            />
          </div>

          <div className="filter-item">
            <div className="filter-label">
              {filterType === 'category' ? "Filtrar por categoría" : "Filtrar por subcategoría"}
            </div>
            <Select
              name="filterValue"
              value={selectedFilter}
              onChange={handleFilterChange}
              options={[{ value: "", label: "Todos" }, ...filterOptions]}
              className="filter-input"
            />
          </div>
        </div>
      </div>


      {loading && <div className="loading">Cargando...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && chartData.length > 0 && (
        <>
          <div className="analytics-metrics">
            <div className="metric">
              <div className="metric-value">{totalStock}</div>
              <div className="metric-label">Stock Total</div>
            </div>
            <div className="metric">
              <div className="metric-value">{totalVendidos}</div>
              <div className="metric-label">Vendidos</div>
            </div>
            <div className="metric">
              <div className="metric-value">
                {overallRatio}
                {isGoodRatio ? (
                  <ArrowUpRight size={16} className="trend-icon positive" />
                ) : (
                  <ArrowDownRight size={16} className="trend-icon negative" />
                )}
              </div>
              <div className="metric-label">% del Inventario Vendido</div>
            </div>
            <div className="metric">
              <div className="metric-value">{bestProduct.nombre}</div>
              <div className="metric-label">Mejor Producto</div>
            </div>
          </div>

          <div className="chart-wrapper">
            <BarChart
              height={350}
              series={[
                {
                  data: sortedChartData.map((p) => p.stock),
                  label: "Stock Disponible",
                  color: stockColor,
                  valueFormatter: (value) => `${value} unidades`,
                  stack: "A",
                  barRounded: true,
                },
                {
                  data: sortedChartData.map((p) => p.vendidos),
                  label: "Unidades Vendidas",
                  color: vendidosColor,
                  valueFormatter: (value) => `${value} unidades`,
                  stack: "B",
                  barRounded: true,
                },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data: sortedChartData.map((p) => p.nombre),
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
              slotProps={{
                legend: {
                  direction: "row",
                },
              }}
              tooltip={{
                trigger: "item",
              }}

            />
          </div>

          <div className="analytics-card-footer">
            <div className="insight">
              <TrendingUp size={16} />
              <span>
                <strong>Insight:</strong> {bestProduct.nombre} tiene el mejor ratio de ventas con{" "}
                {(bestProduct.ratio * 100).toFixed(0)}% del inventario vendido.
              </span>
            </div>
            <div className="insight-description">
              <p>Este gráfico muestra la relación entre el inventario disponible y las unidades vendidas para cada producto.</p>
              <p>El porcentaje mostrado indica cuántas unidades de un producto se han vendido con respecto al total disponible durante el período. Un valor cercano al 100% sugiere que el producto tuvo una alta rotación y buena salida.</p>
            </div>
          </div>
        </>
      )}
      {!loading && chartData.length === 0 && <div className="no-data">No hay datos para mostrar</div>}
    </div>
  )
}
