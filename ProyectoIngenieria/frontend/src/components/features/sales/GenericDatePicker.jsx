import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
// import "flatpickr/dist/flatpickr.min.css";

const GenericDatePicker = ({ onDateChange, minDate = "today", placeholder = "Selecciona una fecha" }) => {
    const datePickerRef = useRef(null);
    const flatpickrInstance = useRef(null);

    useEffect(() => {
        if (datePickerRef.current) {
            flatpickrInstance.current = flatpickr(datePickerRef.current, {
                enableTime: false,
                static: true,
                dateFormat: "d/m/Y",
                minDate: minDate,
                locale: { firstDayOfWeek: 1 },
                onChange: (selectedDates) => {
                    if (selectedDates.length > 0) {
                        onDateChange(selectedDates[0].toISOString().split("T")[0]);
                    }
                }
            });
        }

        return () => {
            if (flatpickrInstance.current) {
                flatpickrInstance.current.destroy();
            }
        };
    }, [onDateChange, minDate]);

    return (
        <div className="date-picker-container">
            <input
                type="text"
                ref={datePickerRef}
                className="input"
                placeholder={placeholder}
            />
        </div>
    );
};

export default GenericDatePicker;