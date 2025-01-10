import { forwardRef } from "react";

export const Input = forwardRef(({ className = '', style = {}, ...props }, ref) => (
  <input
    {...props}
    ref={ref}
    className={`w-full bg-zinc-700 text-black py-2 rounded-md ${className}`}
    style={{ ...style }}
  />
));
