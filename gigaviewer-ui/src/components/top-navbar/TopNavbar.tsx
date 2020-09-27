import React, { useState } from 'react';

import NavButton from './NavButton';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBars, faMicroscope } from '@fortawesome/free-solid-svg-icons';
import { MenuItems } from './utils';
import './style.css';

const TopNavbar = () => {
    const [isMenuIconClicked, setIsMenuIconClicked] = useState(false);

    const handleMenuIconClicked = () => {
        setIsMenuIconClicked(!isMenuIconClicked);
    };

    const handleUpload = () => {

    }

    return (
        <nav className="navbar-items">
            <h1 className="navbar-logo">
                Gigaviewer
                <FontAwesomeIcon icon={faMicroscope} />
            </h1>

            <div className="menu-icon" onClick={handleMenuIconClicked}>
                { isMenuIconClicked ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
            </div>

            <ul className={isMenuIconClicked ? 'nav-menu active' : 'nav-menu'}>
                {MenuItems.map((item, index) => {
                    return (
                        <li key={index}>
                            <a className={item.cName} href={item.url}>
                                {item.title}
                            </a>
                        </li>
                    )
                })}
            </ul>

            <NavButton onClick={handleUpload} type="button" buttonStyle='btn--primary' buttonSize='btn--medium'>Upload</NavButton> 
        </nav>
    )
}

export default TopNavbar;