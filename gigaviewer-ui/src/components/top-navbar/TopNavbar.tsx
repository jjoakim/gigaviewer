import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { UIButton as NavButton } from 'components/ui-toolbox';

import { CloudUpload } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faBars,
  faMicroscope,
} from '@fortawesome/free-solid-svg-icons';
import { MenuItems } from './utils';
import './style.css';

/**
 * The static, naviation bar at top of the single page web app
 */
const TopNavbar = () => {
  const [isMenuIconClicked, setIsMenuIconClicked] = useState(false);

  const handleMenuIconClicked = () => {
    setIsMenuIconClicked(!isMenuIconClicked);
  };

  return (
    <nav className="navbar-items">
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

      <NavButton
        variant="contained"
        color="default"
        component={Link}
        text="Upload"
        to="/upload"
        size="medium"
        startIcon={<CloudUpload />}
      />
    </nav>
  );
};

export default TopNavbar;
