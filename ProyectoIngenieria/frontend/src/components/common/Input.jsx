import { forwardRef } from "react";

export const Input = forwardRef(({ className = '', style = {}, ...props }, ref) => (
  <input
    {...props}
    ref={ref}
    className={className}
    style={{ ...style }}
  />
));
