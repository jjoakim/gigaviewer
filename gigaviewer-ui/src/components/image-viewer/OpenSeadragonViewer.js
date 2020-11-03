import OpenSeaDragon from 'openseadragon';
import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HomeIcon from '@material-ui/icons/Home';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const OpenSeadragonViewer = ({ image }) => {
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    if (image && viewer) {
      viewer.open(image.source);
    }
  }, [image]);

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();

    setViewer(
      OpenSeaDragon({
        id: 'openSeaDragon',
        prefixUrl: 'openseadragon-images/',
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        defaultZoomLevel: 1,
        minZoomLevel: 0.7,
        visibilityRatio: 1,
        zoomPerScroll: 2,
        zoomInButton: 'zoom-in',
        zoomOutButton: 'zoom-out',
        homeButton: 'home',
        fullPageButton: 'full-page',
        nextButton: 'next',
        previousButton: 'previous',
        // toolbar: 'toolbarDiv',
      })
    );
  };

  useEffect(() => {
    InitOpenseadragon();
    return () => {
      viewer && viewer.destroy();
    };
  }, []);

  const classes = useStyles();

  return (
    <div>
      <div id="openSeaDragon"
      style={{
        height: '600px',
        width: '900px',
      }}>
        <div className={classes.root}>
          <Box position="absolute" top="2%" left="2%" zIndex="tooltip">
            <IconButton color="primary" aria-label="zoom in" disableRipple="true" id="zoom-in">
              <AddCircleOutlineIcon style={{ fontSize: 60 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="2%" left="12%" zIndex="tooltip">
            <IconButton color="primary" aria-label="zoom out" disableRipple="true" id="zoom-out">
              <RemoveCircleOutlineIcon style={{ fontSize: 60 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="2%" left="22%" zIndex="tooltip">
            <IconButton color="primary" aria-label="default zoom" disableRipple="true" id="home">
              <HomeIcon style={{ fontSize: 60 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="2%" left="32%" zIndex="tooltip">
            <IconButton color="primary" aria-label="full screen" disableRipple="true" id="full-page">
              <FullscreenIcon style={{ fontSize: 60 }} />
            </IconButton>
          </Box>
        </div>
        
      </div>
    </div>
  );
};

export default OpenSeadragonViewer;
