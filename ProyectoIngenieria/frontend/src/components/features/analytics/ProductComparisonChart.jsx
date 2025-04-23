import { BarChart } from "@mui/x-charts/BarChart"
import { InfoIcon as InfoCircle, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react"
import "./styles/AnalyticsCharts.css";

const data = [
  { nombre: "Producto A", stock: 100, vendidos: 85, ratio: 0.85 },
  { nombre: "Producto B", stock: 80, vendidos: 60, ratio: 0.75 },
  { nombre: "Producto C", stock: 50, vendidos: 45, ratio: 0.9 },
  { nombre: "Producto D", stock: 40, vendidos: 30, ratio: 0.75 },
  { nombre: "Producto E", stock: 20, vendidos: 15, ratio: 0.75 },
]

export default function ProductComparisonChart() {

  const stockColor = "#4dabf5"
  const vendidosColor = "#f55252"

  const bestProduct = [...data].sort((a, b) => b.ratio - a.ratio)[0]

  // Calcular el total de stock y vendidos
  const totalStock = data.reduce((sum, item) => sum + item.stock, 0)
  const totalVendidos = data.reduce((sum, item) => sum + item.vendidos, 0)
  const overallRatio = (totalVendidos / totalStock).toFixed(2)

  // Determinar si el ratio general es bueno o malo (más de 0.7 es bueno)
  const isGoodRatio = Number.parseFloat(overallRatio) > 0.7

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
          <div className="metric-label">Ratio de Ventas</div>
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
              data: data.map((p) => p.stock),
              label: "Stock Disponible",
              color: stockColor,
              valueFormatter: (value) => `${value} unidades`,
              stack: "A",
              barRounded: true,
            },
            {
              data: data.map((p) => p.vendidos),
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
              data: data.map((p) => p.nombre),
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
              labelStyle: {
                fontSize: 14,
                fill: "#fff",
              },
              itemMarkWidth: 15,
              itemMarkHeight: 15,
              markGap: 5,
              itemGap: 15,
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
          Este gráfico muestra la relación entre el inventario disponible y las unidades vendidas para cada producto. Un
          ratio de ventas alto indica una buena rotación de inventario.
        </div>
      </div>
    </div>
  )
}
