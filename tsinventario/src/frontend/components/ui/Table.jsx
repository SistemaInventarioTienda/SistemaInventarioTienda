import React from "react";
import { Button } from "./Button";
import { Eye, SquarePen, Trash, KeyRound, ChevronDown, ChevronUp } from "lucide-react";
import "../css/table.css";

const STATUS_MAP = {
    1: "Activo",
    2: "Inactivo"
};

const StatusPill = ({ status }) => {

    const statusString = STATUS_MAP[status] || "Desconocido";
    const isActive = statusString.toLowerCase() === "activo";

    return (
        <span className={`status-pill ${isActive ? "active" : "inactive"}`}>
            {statusString}
        </span>
    );
};

const ActionsCell = ({ actions, rowData }) => {
    return (
        <div className="actions-cell">
            <input type="hidden" value={rowData.ID_CATEGORIA} />
            {actions.grantPermissions && (
                <Button
                    className="btn me-3 p-0"
                    style={{
                        backgroundColor: '#F9CB32',
                        borderRadius: '16px',
                        width: '40px',
                        height: '40px'
                    }}
                    onClick={() => actions.grantPermissions(rowData)}
                >
                    <KeyRound size={20} color="#FFFFFF" />
                </Button>
            )}
            {actions.view && (
                <Button
                    className="btn me-3 p-0"
                    style={{
                        backgroundColor: '#8E8E93',
                        borderRadius: '16px',
                        width: '40px',
                        height: '40px'
                    }}
                    onClick={() => actions.view(rowData)}
                >
                    <Eye size={20} color="#FFFFFF" />
                </Button>
            )}
            {actions.edit && (
                <Button
                    className="btn me-3 p-0"
                    style={{
                        backgroundColor: '#007AFF',
                        borderRadius: '16px',
                        width: '40px',
                        height: '40px'
                    }}
                    onClick={() => actions.edit(rowData)}
                >
                    <SquarePen size={20} color="#FFFFFF" />
                </Button>
            )}
            {actions.delete && (
                <Button
                    className="btn me-3 p-0"
                    style={{
                        backgroundColor: '#F44336',
                        borderRadius: '16px',
                        width: '40px',
                        height: '40px'
                    }}
                    onClick={() => actions.delete(rowData)}
                >
                    <Trash size={20} color="#FFFFFF" />
                </Button>
            )}

        </div>
    );
};

const Table = ({ columns, data, actions, onSort, sortField, sortOrder }) => {
    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                onClick={column.field === "actions" ? null : () => onSort(column.field)}
                                style={column.field === "actions" ? { cursor: "default" } : { cursor: "pointer" }}
                            >
                                {column.label}
                                {column.field !== "actions" && (
                                    <>
                                        {sortField === column.field ? (
                                            sortOrder === "asc" ? (
                                                <ChevronUp className="chevron-icon" />
                                            ) : (
                                                <ChevronDown className="chevron-icon" />
                                            )
                                        ) : (
                                            <ChevronDown className="chevron-icon" />
                                        )}
                                    </>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex}>
                                        {column.field === "ESTADO" ? (
                                            <StatusPill status={row[column.field]} />
                                        ) : column.field === "actions" ? (
                                            <ActionsCell actions={actions} rowData={row} />
                                        ) : (
                                            row[column.field]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="no-data-message">
                                No hay registros disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Table;