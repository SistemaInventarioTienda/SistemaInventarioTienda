import "./styles/metricCard.css";
import React from "react";
import classNames from "classnames";

function MetricCard({ title, value, icon, onClick, dynamicColor = false }) {
    const colorClass =
        dynamicColor && typeof value === "string"
            ? value.includes("-")
                ? "metric-card-value-negative"
                : "metric-card-value-positive"
            : "";

    return (
        <div className="metric-card" onClick={onClick}>
            <div className="metric-card-header">
                <h3 className="metric-card-title">{title}</h3>
                <div className="metric-card-icon">{icon}</div>
            </div>
            <div className={classNames("metric-card-value", colorClass)}>{value}</div>
        </div>
    );
}

export default MetricCard;
