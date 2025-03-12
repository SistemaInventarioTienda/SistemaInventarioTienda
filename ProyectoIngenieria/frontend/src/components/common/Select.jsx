import { useState, forwardRef } from "react";
import "./styles/select.css";

export const Select = forwardRef(
  (
    {
      className = "",
      wrapperClassName = "",
      options = [],
      value,
      onChange,
      name,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleSelectOption = (option) => {
      if (!disabled) {
        onChange({
          target: {
            name,
            value: option.value,
          },
        });
        setIsOpen(false);
      }
    };

    // Buscamos la opción seleccionada
    const selectedOption = options.find((opt) => opt.value === value);

    return (
      <div className={`select-wrapper ${wrapperClassName}`} {...props}>
        <div
          className={`select ${className} ${disabled ? "disabled" : ""}`}
          onClick={toggleDropdown}
          ref={ref}
        >
          {selectedOption?.label || "Seleccione una opción válida"}
          <div className={`select-arrow ${isOpen ? "open" : ""}`} />
        </div>
        {isOpen && !disabled && (
          <div className="custom-options">
            {options.map((option, index) => (
              <div
                key={index}
                className={`custom-option ${value === option.value ? "selected" : ""}`}
                onClick={() => handleSelectOption(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";