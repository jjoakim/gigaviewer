import React, { useState } from 'react';

import NavButton from './NavButton';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RefreshIcon from '@material-ui/icons/Refresh';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Box from '@material-ui/core/Box';

import {
  faTimes,
  faBars,
  faMicroscope,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MenuItems } from './utils';
import './style.css';

interface PublicProps {
  isViewerMode: boolean;
}

/**
 * The static, naviation bar at top of the single page web app
 */
const TopNavbar = (props: PublicProps) => {
  const [isMenuIconClicked, setIsMenuIconClicked] = useState(false);
  const [isViewerPage, setIsViewerPage] = useState(props.isViewerMode);

  const handleMenuIconClicked = () => {
    setIsMenuIconClicked(!isMenuIconClicked);
  };

  const toggleNavbarType = () => {
    setIsViewerPage(!isViewerPage);
  }

  return (
    <div>
      {(!isViewerPage) 
      
      ? 
      /**
       * DURING NON-VIEWER MODE
       */
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

        <div className="navbar-upload">
          <NavButton />
        </div>
      </nav>

      : 
      /**
       * DURING VIEWER MODE
       */
      <nav className="navbar-items-viewer">
        <h1 className="navbar-logo-viewer">
          Gigaviewer
          <FontAwesomeIcon icon={faMicroscope} />
        </h1>


        <div>
          <Box position="absolute" top="0.5%" right="22%" zIndex="tooltip">
            <IconButton color="inherit" aria-label="zoom in" id="zoom-in">
              <AddCircleOutlineIcon style={{ fontSize: 40 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="0.5%" right="16%" zIndex="tooltip">
            <IconButton color="inherit" aria-label="zoom out" id="zoom-out">
              <RemoveCircleOutlineIcon style={{ fontSize: 40 }}/>
            </IconButton>
          </Box>
          <Box position="absolute" top="0.5%" right="10%" zIndex="tooltip">
            <IconButton color="inherit" aria-label="default zoom" id="home">
              <RefreshIcon style={{ fontSize: 40 }}/>
            </IconButton>
          </Box>
          <Box position="absolute" top="0.5%" right="4%" zIndex="tooltip">
            <IconButton color="inherit" aria-label="full screen" id="full-page">
              <FullscreenIcon style={{ fontSize: 40 }}/>
            </IconButton>
          </Box>
        </div>
      </nav>
      }
    </div>
  );
};

export default TopNavbar;
