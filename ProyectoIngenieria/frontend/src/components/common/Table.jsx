import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import {
  Eye,
  SquarePen,
  Trash,
  Ban,
  KeyRound,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Plus,
  DollarSign,
} from "lucide-react";
import { Tooltip } from "react-tooltip";

import "./styles/table.css";

const StatusPill = ({ status, entityKey }) => {
  const statusMappings = {
    default: { 1: "Activo", 2: "Inactivo" },
    sales: { 1: "Pagada", 2: "Anulada", 3: "Pendiente" },
    shopping: { 1: "Pagada", 2: "Anulada", 3: "Pendiente" },
    credit: { 0: "Activo", 1: "Moroso", 2: "Cancelado" },
  };

  const selectedMap = statusMappings[entityKey] || statusMappings.default;
  const parsedStatus =
    typeof status === "number" ? selectedMap[status] || "Desconocido" : status;
  const lowerStatus = parsedStatus.toLowerCase();

  let statusClass = "active"; // default

  if (entityKey === "credit") {
    if (lowerStatus === "moroso") {
      statusClass = "inactive";
    } else if (lowerStatus === "cancelado") {
      statusClass = "pending";
    } else {
      statusClass = "active";
    }
  } else {
    if (["pendiente"].includes(lowerStatus)) {
      statusClass = "pending";
    } else if (["anulada", "inactivo"].includes(lowerStatus)) {
      statusClass = "inactive";
    } else {
      statusClass = "active";
    }
  }

  return <span className={`status-pill ${statusClass}`}>{parsedStatus}</span>;
};

const ActionsCell = ({ actions, rowData, entityKey }) => (
  <>
    <div className="actions-cell">
      {actions.manageCredits && (
        <ActionButton
          onClick={() => actions.manageCredits(rowData)}
          color="#28A745"
          tooltipId="tooltip"
          tooltipContent="Gestionar Créditos"
        >
          <DollarSign size={20} color="#FFFFFF" />
        </ActionButton>
      )}
      {actions.grantPermissions && (
        <ActionButton
          onClick={() => actions.grantPermissions(rowData)}
          color="#F9CB32"
          tooltipId="tooltip"
          tooltipContent="Asignar Permisos"
        >
          <KeyRound size={20} color="#FFFFFF" />
        </ActionButton>
      )}
      {actions.view && (
        <ActionButton
          onClick={() => actions.view(rowData)}
          color="#8E8E93"
          tooltipId="tooltip"
          tooltipContent="Ver detalles"
        >
          <Eye size={20} color="#FFFFFF" />
        </ActionButton>
      )}
      {actions.edit && (
        <ActionButton
          onClick={() => actions.edit(rowData)}
          color="#007AFF"
          tooltipId="tooltip"
          tooltipContent="Editar"
        >
          <SquarePen size={20} color="#FFFFFF" />
        </ActionButton>
      )}
      {actions.delete &&
        (entityKey === "sales" || entityKey === "shopping" ? (
          rowData.CAN_CANCEL && (
            <ActionButton
              onClick={() => actions.delete(rowData)}
              color="#F44336"
              tooltipId="tooltip"
              tooltipContent="Eliminar"
            >
              <Ban size={20} color="#FFFFFF" />
            </ActionButton>
          )
        ) : (
          <ActionButton
            onClick={() => actions.delete(rowData)}
            color="#F44336"
            tooltipId="tooltip"
            tooltipContent="Eliminar"
          >
            <Trash size={20} color="#FFFFFF" />
          </ActionButton>
        ))}
    </div>
  </>
);

const ActionButton = ({
  onClick,
  color,
  children,
  tooltipId,
  tooltipContent,
}) => (
  <>
    <Button
      className="btn me-3 p-0"
      style={{
        backgroundColor: color,
        borderRadius: "16px",
        width: "40px",
        height: "40px",
      }}
      onClick={onClick}
      data-tooltip-id={tooltipId}
      data-tooltip-content={tooltipContent}
    >
      {children}
    </Button>
  </>
);

const Table = ({
  columns,
  data,
  actions,
  onSort,
  sortField,
  sortOrder,
  expandableKey,
  onAddSubcategory,
  subcategoryActions,
  entityKey,
}) => {
  const [expandedRows, setExpandedRows] = useState({});

  // Función para manejar el estado de las filas expandidas
  const toggleRow = (id) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Función para verificar si una fila es expandible
  const isExpandableRow = (row) => expandableKey && row[expandableKey];

  return (
    <>
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  onClick={
                    column.field === "actions"
                      ? null
                      : () => onSort(column.field)
                  }
                  style={{
                    cursor: column.field === "actions" ? "default" : "pointer",
                  }}
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
                        <ChevronUp className="chevron-icon default-chevron" />
                      )}
                    </>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => {
                const rowId = row.ID_CATEGORIA || `row-${rowIndex}`;
                return (
                  <React.Fragment key={rowId}>
                    <tr>
                      {columns.map((column, colIndex) => (
                        <td key={colIndex}>
                          {column.field === "ESTADO_CREDITO" ? (
                            <StatusPill
                              status={row[column.field]}
                              entityKey={entityKey}
                            />
                          ) : column.field === "ESTADO" ? (
                            <StatusPill
                              status={row[column.field]}
                              entityKey={entityKey}
                            />
                          ) : column.field === "actions" ? (
                            <ActionsCell
                              actions={actions}
                              rowData={row}
                              entityKey={entityKey}
                            />
                          ) : isExpandableRow(row) &&
                            column.field === "DSC_NOMBRE" ? (
                            <ExpandableRow
                              row={row}
                              expanded={expandedRows[rowId]}
                              toggleRow={() => toggleRow(rowId)}
                            />
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
                        entityKey={entityKey}
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
      <Tooltip
        id="tooltip"
        place="top"
        style={{
          backgroundColor: "var(--color-card)",
          color: "var(--color-font)",
          border: "1px solid var(--color-border)",
          borderRadius: "4px",
          padding: "8px 12px",
          fontSize: "14px",
          zIndex: 1001,
        }}
        // getContent = {(dataTip) => dataTip}
      />
    </>
  );
};

const ExpandableRow = ({ row, expanded, toggleRow }) => (
  <div className="subcategory-row">
    <button
      className="expand-button"
      onClick={toggleRow}
      aria-label={expanded ? "Collapse" : "Expand"}
    >
      {expanded ? (
        <ChevronDown className="chevron-icon" />
      ) : (
        <ChevronRight className="chevron-icon" />
      )}
    </button>
    <span className="category-name">{row.DSC_NOMBRE}</span>
  </div>
);

const SubcategoriesList = ({
  row,
  columns,
  onAddSubcategory,
  subcategoryActions,
  entityKey,
}) => (
  <tr className="subcategories-container">
    <td colSpan={columns.length}>
      <div className="subcategories-wrapper">
        <div className="subcategories-header">
          <h3 className="subcategories-title">Subcategorías</h3>
          <Button
            className="add-subcategory-btn"
            onClick={() => onAddSubcategory(row.ID_CATEGORIA)}
          >
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
                    edit: subcategoryActions?.edit
                      ? () => subcategoryActions.edit(sub)
                      : undefined,
                    delete: subcategoryActions?.delete
                      ? () => subcategoryActions.delete(sub)
                      : undefined,
                  }}
                  rowData={sub}
                  entityKey={entityKey}
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
