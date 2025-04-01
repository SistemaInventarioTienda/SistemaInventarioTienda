import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const DatePickerComponent = ({ saleForm }) => {
    const datePickerRef = useRef(null);
    const flatpickrInstance = useRef(null);

    useEffect(() => {
        if (saleForm.selectedSaleType === 1 && datePickerRef.current) {
            flatpickrInstance.current = flatpickr(datePickerRef.current, {
                enableTime: false,
                static: true,
                dateFormat: "d/m/Y",
                minDate: "today",
                locale: { firstDayOfWeek: 1 },
                onChange: (selectedDates) => {
                    saleForm.setCreditDueDate(selectedDates[0].toISOString().split("T")[0]);
                }
            });
        }

        return () => {
            if (flatpickrInstance.current) {
                flatpickrInstance.current.destroy();
            }
        };
    }, [saleForm.selectedSaleType]);

    return (
        <>
            {saleForm.selectedSaleType === 1 && (
                <div className="credit-due-date-container">
                    <label className="sales-card-label">Fecha de Vencimiento del Crédito</label>
                    <input
                        type="text"
                        ref={datePickerRef}
                        className="input"
                        placeholder="Selecciona una fecha"
                    />
                </div>
            )}
        </>
    );
};

export default DatePickerComponent;
