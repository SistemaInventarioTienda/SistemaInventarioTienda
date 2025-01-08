import React, { forwardRef } from "react";
import { Button } from "./Button";
import "./styles/inputButton.css";

const InputButton = forwardRef(({
    inputClassName = '',
    inputStyle = {},
    buttonClassName = '',
    buttonStyle = {},
    icon: Icon,
    onButtonClick,
    ...props
}, ref) => {
    return (
        <div className="input-button-wrapper">
            <input
                {...props}
                ref={ref}
                className={`${inputClassName}`}
                style={{ ...inputStyle }}
            />
            <Button
                className={`button ${buttonClassName}`}
                style={{
                    ...buttonStyle
                }}
                onClick={onButtonClick}
            >
                {Icon && <Icon size={20} />}
            </Button>
        </div>

    );
});

InputButton.displayName = 'InputButton';

export default InputButton;