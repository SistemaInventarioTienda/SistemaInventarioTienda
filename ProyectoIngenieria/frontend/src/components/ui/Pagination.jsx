import React from "react";
import "../css/table.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const delta = 1; 

    if (totalPages <= 1) return [1];

    if (currentPage > delta + 2) {
      pageNumbers.push(1, "...");
    } else {
      for (let i = 1; i < currentPage; i++) {
        pageNumbers.push(i);
      }
    }

    // Agregar las páginas alrededor de la página actual
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pageNumbers.push(i);
    }

    // Agregar última página y puntos suspensivos si es necesario
    if (currentPage < totalPages - delta - 1) {
      pageNumbers.push("...", totalPages);
    } else {
      for (let i = currentPage + 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }

    return [...new Set(pageNumbers)];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
      {pageNumbers.map((number, index) =>
        number === "..." ? (
          <span key={index} className="ellipsis">...</span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
