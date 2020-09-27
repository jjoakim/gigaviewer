import React, { ReactNode } from 'react';

import './utils';
import './style.css';
import { BUTTON_SIZES, BUTTON_STYLES } from './utils';

interface PublicProps {
    children: any;
    type: "button" | "submit" | "reset";
    onClick: () => void;
    buttonStyle: string;
    buttonSize: string;
}

const NavButton = (props : PublicProps) => {
    const checkButtonStyle = BUTTON_STYLES.includes(props.buttonStyle) ? props.buttonStyle : BUTTON_STYLES[0];
    const checkButtonSize = BUTTON_SIZES.includes(props.buttonSize) ? props.buttonSize : BUTTON_SIZES[0];

    return (
        <button className={`btn ${checkButtonStyle} ${checkButtonSize}`} onClick={props.onClick} type={props.type} >
            {props.children}
        </button>
    )
}

export default NavButton;