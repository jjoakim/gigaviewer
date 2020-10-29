import React, { useState } from 'react';

import NavButton from './NavButton';

import {
  faTimes,
  faBars,
  faMicroscope,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItems } from './utils';
import './style.css';

/**
 * The static, naviation bar at top of the single page web app
 */
const TopNavbar = () => {
  const [isMenuIconClicked, setIsMenuIconClicked] = useState(false);
  const [isViewerPage, setIsViewerPage] = useState(false);

  const handleMenuIconClicked = () => {
    setIsMenuIconClicked(!isMenuIconClicked);
  };

  const toggleNavbarType = () => {
    setIsViewerPage(!isViewerPage);
  }

  return (
    <div>
      {(!isViewerPage) ? <nav className="navbar-items">
        <h1 className="navbar-logo">
          Gigaviewer
          <FontAwesomeIcon icon={faMicroscope} />
        </h1>

        <div className="menu-icon" onClick={handleMenuIconClicked}>
          {isMenuIconClicked ? (
            <FontAwesomeIcon icon={faTimes} />
          ) : (
            <FontAwesomeIcon icon={faBars} />
          )}
        </div>

        <ul className={isMenuIconClicked ? 'nav-menu active' : 'nav-menu'}>
          {MenuItems.map((item, index) => {
            return (
              <li key={index}>
                <a className={item.cName} href={item.url}>
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="navbar-upload">
          <NavButton />
        </div>
      </nav>
      :
      <div>off</div>}
    </div>
  );
};

export default TopNavbar;
