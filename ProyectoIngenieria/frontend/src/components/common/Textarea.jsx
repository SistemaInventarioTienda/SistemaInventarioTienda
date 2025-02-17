import { forwardRef } from "react";
import "./styles/textarea.css";

export const Textarea = forwardRef(({ className = "", wrapperClassName = "", ...props }, ref) => (
  <div className={`textarea-wrapper ${wrapperClassName}`}>
    <textarea {...props} ref={ref} className={`textarea ${className}`} />
  </div>
));

Textarea.displayName = "Textarea";
