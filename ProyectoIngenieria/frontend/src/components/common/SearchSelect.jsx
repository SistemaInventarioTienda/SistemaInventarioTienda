import { useState, useEffect, useRef } from "react";
import "./styles/searchSelect.css";
import { Input } from "./Input";

const SearchSelect = ({
    placeholder = "Buscar...",
    fetchOptions,
    onSelect,
    selectedItem = null,
    displayField = "label",
    valueField = "value",
    pageSize = 5,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [options, setOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (searchTerm) {
            fetchOptions(searchTerm, currentPage, pageSize)
                .then((data) => {
                    setOptions(data.products || []);
                    setTotalPages(data.totalPages);
                })
                .catch((error) => console.error("Error fetching options:", error));
        } else {
            setOptions([]);
            setTotalPages(1);
        }
    }, [searchTerm, currentPage, fetchOptions, pageSize]);

    const handleSelect = (item) => {
        onSelect(item);
        setSearchTerm("");
        setIsOpen(false);
    };

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        setIsOpen(true);
    };

    const handleClickOutside = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target) &&
            inputRef.current !== event.target
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="search-select-wrapper">
            <Input
                ref={inputRef}
                type="text"
                className="search-select-input"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && options.length > 0 && (
                <div className="search-select-dropdown" ref={dropdownRef}>
                    {options.map((item) => (
                        <div
                            key={item[valueField]}
                            className="search-select-option"
                            onClick={() => handleSelect(item)}
                        >
                            {item[displayField]}
                        </div>
                    ))}
                    <div className="search-select-pagination">
                        <button onClick={handlePrevPage} disabled={currentPage === 1}>
                            ◀
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            ▶
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchSelect;
