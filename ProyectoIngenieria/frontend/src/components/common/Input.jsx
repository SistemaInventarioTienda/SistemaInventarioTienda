import { forwardRef } from "react"
import "./styles/input.css"

export const Input = forwardRef(({ className = "", wrapperClassName = "", ...props }, ref) => (
  <div className={`input-wrapper ${wrapperClassName}`}>
    <input {...props} ref={ref} className={`input ${className}`} />
  </div>
))

Input.displayName = "Input"

