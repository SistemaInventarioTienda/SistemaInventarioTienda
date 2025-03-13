import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { Eye, SquarePen, Trash, KeyRound, ChevronDown, ChevronUp, ChevronRight, Plus } from "lucide-react";
import "./styles/table.css";

const StatusPill = ({ status }) => {
    let parsedStatus = typeof status === "number" ? (status === 2 ? "Inactivo" : "Activo") : status;
    const isActive = parsedStatus.toLowerCase() === "activo";
    return <span className={`status-pill ${isActive ? "active" : "inactive"}`}>{parsedStatus}</span>;
};

const ActionsCell = ({ actions, rowData }) => (
    <div className="actions-cell">
        {actions.grantPermissions && (
            <ActionButton onClick={() => actions.grantPermissions(rowData)} color="#F9CB32">
                <KeyRound size={20} color="#FFFFFF" />
            </ActionButton>
        )}
        {actions.view && (
            <ActionButton onClick={() => actions.view(rowData)} color="#8E8E93">
                <Eye size={20} color="#FFFFFF" />
            </ActionButton>
        )}
        {actions.edit && (
            <ActionButton onClick={() => actions.edit(rowData)} color="#007AFF">
                <SquarePen size={20} color="#FFFFFF" />
            </ActionButton>
        )}
        {actions.delete && (
            <ActionButton onClick={() => actions.delete(rowData)} color="#F44336">
                <Trash size={20} color="#FFFFFF" />
            </ActionButton>
        )}
    </div>
);

const ActionButton = ({ onClick, color, children }) => (
    <Button className="btn me-3 p-0" style={{ backgroundColor: color, borderRadius: "16px", width: "40px", height: "40px" }} onClick={onClick}>
        {children}
    </Button>
);

const Table = ({ columns, data, actions, onSort, sortField, sortOrder, expandableKey, onAddSubcategory, subcategoryActions }) => {
    const [expandedRows, setExpandedRows] = useState({});

    // Función para manejar el estado de las filas expandidas
    const toggleRow = (id) => {
        setExpandedRows((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    // Función para verificar si una fila es expandible
    const isExpandableRow = (row) => expandableKey && row[expandableKey];

    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} onClick={column.field === "actions" ? null : () => onSort(column.field)} style={{ cursor: column.field === "actions" ? "default" : "pointer" }}>
                                {column.label}
                                {column.field !== "actions" && (
                                    <>
                                        {sortField === column.field ? (sortOrder === "asc" ? <ChevronUp className="chevron-icon" /> : <ChevronDown className="chevron-icon" />) : <ChevronUp className="chevron-icon default-chevron" />}
                                    </>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => {
                            const rowId = row.ID_CATEGORIA || `row-${rowIndex}`; // Usar ID_CATEGORIA como identificador único
                            return (
                                <React.Fragment key={rowId}>
                                    <tr>
                                        {columns.map((column, colIndex) => (
                                            <td key={colIndex}>
                                                {column.field === "ESTADO" ? (
                                                    <StatusPill status={row[column.field]} />
                                                ) : column.field === "actions" ? (
                                                    <ActionsCell actions={actions} rowData={row} />
                                                ) : isExpandableRow(row) && column.field === "DSC_NOMBRE" ? (
                                                    <ExpandableRow row={row} expanded={expandedRows[rowId]} toggleRow={() => toggleRow(rowId)} />
                                                ) : (
                                                    row[column.field]
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    {expandedRows[rowId] && row.subcategories && (
                                        <SubcategoriesList
                                            row={row}
                                            columns={columns}
                                            subcategoryActions={subcategoryActions}
                                            onAddSubcategory={onAddSubcategory}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })
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

const ExpandableRow = ({ row, expanded, toggleRow }) => (
    <div className="subcategory-row">
        <button className="expand-button" onClick={toggleRow} aria-label={expanded ? "Collapse" : "Expand"}>
            {expanded ? <ChevronDown className="chevron-icon" /> : <ChevronRight className="chevron-icon" />}
        </button>
        <span className="category-name">{row.DSC_NOMBRE}</span>
    </div>
);

const SubcategoriesList = ({ row, columns, onAddSubcategory, subcategoryActions }) => (
    <tr className="subcategories-container">
        <td colSpan={columns.length}>
            <div className="subcategories-wrapper">
                <div className="subcategories-header">
                    <h3 className="subcategories-title">Subcategorías</h3>
                    <Button className="add-subcategory-btn" onClick={() => onAddSubcategory(row.ID_CATEGORIA)}>
                        <Plus size={16} />
                        <span>Agregar Subcategoría</span>
                    </Button>
                </div>
                <div className="subcategories-list">
                    {row.subcategories.map((sub) => (
                        <div key={sub.ID_SUBCATEGORIA} className="subcategory-row">
                            <div className="subcategory-cell name">
                                <span className="subcategory-indent"></span>
                                {sub.DSC_NOMBRE}
                            </div>
                            <div className="subcategory-cell status">
                                <StatusPill status={sub.ESTADO} />
                            </div>
                            <div className="subcategory-cell actions">
                                <ActionsCell
                                    actions={{
                                        edit: subcategoryActions?.edit ?
                                            () => subcategoryActions.edit(sub) :
                                            undefined,
                                        delete: subcategoryActions?.delete ?
                                            () => subcategoryActions.delete(sub) :
                                            undefined
                                    }}
                                    rowData={sub}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </td>
    </tr>
);

export default Table;