import { forwardRef } from "react";

export const Select = forwardRef(({ className = '', style = {}, children, ...props }, ref) => (
  <select
    {...props}
    ref={ref}
    className={`w-full bg-zinc-700 text-black px-4 py-2 rounded-md ${className}`}
    style={{ ...style }}
  >
    {children}
  </select>
));
