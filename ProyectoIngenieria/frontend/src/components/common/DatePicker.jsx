import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import './styles/DatePicker.css'

const DatePicker = ({
    label,
    placeholder = "Selecciona una fecha",
    value,
    onChange,
    allowPastDates = false,
    allowFutureDates = true,
    className = "",
    dateFormat = "d/m/Y",
    firstDayOfWeek = 1,
    enableTime = false
}) => {
    const datePickerRef = useRef(null);
    const flatpickrInstance = useRef(null);

    useEffect(() => {
        if (datePickerRef.current) {
            const config = {
                enableTime,
                static: true,
                dateFormat,
                locale: { firstDayOfWeek },
                onChange: (selectedDates) => {
                    onChange(selectedDates[0]);
                },
                defaultDate: value,
                minDate: allowPastDates ? undefined : "today",
                maxDate: allowFutureDates ? undefined: "today",
            };

            flatpickrInstance.current = flatpickr(datePickerRef.current, config);
        }

        return () => {
            flatpickrInstance.current?.destroy();
        };
    }, [allowPastDates, enableTime, dateFormat, firstDayOfWeek]);

    useEffect(() => {
        if (flatpickrInstance.current) {
            flatpickrInstance.current.setDate(value, false, dateFormat);
        }
    }, [value, dateFormat]);

    return (
        <div className="custom-flatpickr">
            <div className="date-picker-container">
                {label && <label className="date-picker-label">{label}</label>}
                <input
                    type="text"
                    ref={datePickerRef}
                    className={className}
                    placeholder={placeholder}
                    readOnly
                />
            </div>
        </div>
    );
};

export default DatePicker;