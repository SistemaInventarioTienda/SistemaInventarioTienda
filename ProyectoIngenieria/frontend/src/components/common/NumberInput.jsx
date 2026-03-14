import React from "react";
import useNumberInput from "../../hooks/useNumberInput";
import { Label } from "./Label";
import "./styles/inputNumber.css";

const NumberInput = ({ id, min, max, initialValue, onChange, label, mode }) => {
  const { value, handleIncrement, handleDecrement, handleChange } =
    useNumberInput({
      min,
      max,
      initialValue,
      onChange,
    });

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="container">
        <button onClick={handleDecrement} className="button">
          -
        </button>
        <input
          id={id}
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step="0.01"
          className="inputNumber"
        />
        <button onClick={handleIncrement} className="button">
          +
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
