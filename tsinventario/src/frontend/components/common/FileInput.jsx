import React, { forwardRef } from 'react';

export const FileInput = forwardRef(({ className = '', style = {}, ...props }, ref) => (
  <input
    {...props}
    ref={ref}
    type="file"
    className={`file-input-container`}
    style={{ ...style }}
  />
));