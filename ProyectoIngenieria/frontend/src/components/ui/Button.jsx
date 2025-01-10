import React from 'react';

export function Button({
  onClick,
  children,
  className = '',
  style = {},
  icon: Icon,
  iconSize = 24,
  iconColor = '#000',
  ...props
}) {
  return (
    <button
      className={`border-custom ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon size={iconSize} color={iconColor} style={{ marginRight: children ? '8px' : '0' }} />}
      {children}
    </button>
  );
}
