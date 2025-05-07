import React from "react";
import '../common/styles/checkboxList.css';
function CheckboxList({ options, selectedOptions, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-8">
      {options.map((option) => (
        <div key={option.value} className="checkbox-option">
          <label>
            <input
              className="checkbox-input"
              type="checkbox"
              name={option.value}
              checked={selectedOptions[option.value]}
              onChange={onChange}
            />
            <span className="checkbox-label">{option.label}</span>
          </label>
        </div>
      ))}
    </div>
  );
}

export default CheckboxList;
