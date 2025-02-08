import { forwardRef } from "react"
import "./styles/select.css"

export const Select = forwardRef(({ className = "", wrapperClassName = "", children, ...props }, ref) => (
  <div className={`select-wrapper ${wrapperClassName}`}>
    <select {...props} ref={ref} className={`select ${className}`}>
      {children}
    </select>
  </div>
))

Select.displayName = "Select"

