import React, { useState } from 'react';

// import NavButton from './NavButton';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faBars,
  faMicroscope,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { CloudUpload } from '@material-ui/icons';
import { MenuItems } from './utils';
import './style.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({ button: { margin: theme.spacing(1) } })
);

const TopNavbar = () => {
  const [isMenuIconClicked, setIsMenuIconClicked] = useState(false);

  const classes = useStyles();

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

      <Button
        variant="contained"
        color="default"
        className={classes.button}
        startIcon={<CloudUpload />}
        component={Link}
        to="/upload"
      >
        Upload
      </Button>

      {/* <NavButton
        onClick={handleUpload}
        type="button"
        buttonStyle="btn--primary"
        buttonSize="btn--medium"
      >
        Upload
      </NavButton> */}
    </nav>
  );
};

export default TopNavbar;
