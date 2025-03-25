import React from "react";
import useNumberInput from "../../hooks/useNumberInput";
import { Label } from "./Label";
import "./styles/inputNumber.css";

const NumberInput = ({
  id,
  min = 1,
  max = 99,
  initialValue = 1,
  onChange,
  label,
}) => {
  const { value, handleIncrement, handleDecrement, handleChange } =
    useNumberInput({
      min,
      max,
      initialValue,
      onChange,
    });

  return (
    <div>

      {label && (<Label htmlFor={id}>{label}</Label>)}

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
