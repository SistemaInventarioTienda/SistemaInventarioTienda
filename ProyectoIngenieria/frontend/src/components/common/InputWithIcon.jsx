import React, { forwardRef } from "react";
import "./styles/InputWithIcon.css";

export const InputWithIcon = forwardRef(
    (
        { icon: Icon, rightIcon: RightIcon, onRightIconClick, className = "", wrapperClassName = "", ...props },
        ref
    ) => {
        return (
            <div className="input-with-icon">
                {Icon && <Icon className="input-icon" size={20} />}
                <input
                    {...props}
                    ref={ref}
                    className={className}
                />
                {RightIcon && (
                    <button
                        type="button"
                        className="input-right-icon"
                        onClick={onRightIconClick}
                    >
                        <RightIcon size={20} />
                    </button>
                )}
            </div>
        );
    }
);

InputWithIcon.displayName = "InputWithIcon";
