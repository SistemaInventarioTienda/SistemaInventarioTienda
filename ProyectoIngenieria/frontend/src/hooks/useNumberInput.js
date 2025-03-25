// useNumberInput.js

import { useState } from 'react';

const useNumberInput = ({ min = 1, max = 99, initialValue = 1, onChange }) => {
  const [value, setValue] = useState(initialValue);

  // Función para incrementar el valor
  const handleIncrement = () => {
    if (value < max) {
      const newValue = value + 1;
      setValue(newValue);
      if (onChange) onChange(newValue); // Notifica al padre
    }
  };

  // Función para decrementar el valor
  const handleDecrement = () => {
    if (value > min) {
      const newValue = value - 1;
      setValue(newValue);
      if (onChange) onChange(newValue); // Notifica al padre
    }
  };

  // Función para manejar cambios manuales en el campo de texto
  const handleChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      setValue(newValue);
      if (onChange) onChange(newValue); // Notifica al padre
    }
  };

  return {
    value,
    handleIncrement,
    handleDecrement,
    handleChange,
  };
};

export default useNumberInput;