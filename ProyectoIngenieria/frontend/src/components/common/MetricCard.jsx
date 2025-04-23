import "./styles/metricCard.css";

function MetricCard({ title, value, icon, onClick }) {
    return (
        <div className="metric-card" onClick={onClick}>
            <div className="metric-card-header">
                <h3 className="metric-card-title">{title}</h3>
                <div className="metric-card-icon">{icon}</div>
            </div>
            <div className="metric-card-value">{value}</div>
        </div>
    );
}

export default MetricCard;
