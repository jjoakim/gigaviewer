import OpenSeaDragon, { World } from 'openseadragon';
import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HomeIcon from '@material-ui/icons/Home';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import OpenSeadragonImagingHelper from '@openseadragon-imaging/openseadragon-imaginghelper';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const OpenSeadragonViewer = ({ images, frame }) => {
  const classes = useStyles();
  const [viewer, setViewer] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  let currentZoom = 0;
  const [scalebarSize, setScalebarSize] = useState(0);
  const [scalebarText, setScalebarText] = useState('');

  useEffect(() => {
    InitOpenseadragon();
    resizeWindow();
    window.addEventListener('resize', resizeWindow);
    console.log('width: ' + window.innerWidth + ' height: ' + window.innerHeight);

    return () => {
      viewer && viewer.destroy();
      window.removeEventListener('resize', resizeWindow);
    };
  }, []);

  const countFrames = (frames) => {
    var sum = 0;
    for (var i = 0; i < frames.length; + i++) {
      sum++;
    }
    return sum;
  };

  useEffect(() => {
    if (images && viewer) {
      viewer.open(images[0].frame.source);
    }
    if(viewer != null) {
      const imagingHelper = viewer.activateImagingHelper({
        onImageViewChanged
      });
    }
  }, [images]);

  function onImageViewChanged(event) {
    currentZoom = viewer.viewport.getZoom();
    console.log(currentZoom);
    const scaleBarSpecs = getScalebarSizeAndTextForMetric(833.77 / ( 0.28 / currentZoom), 100); // 833.77 = window_height/real_height, 0.28 = defaultZoom
    setScalebarSize(scaleBarSpecs.size);
    setScalebarText(scaleBarSpecs.text);
  }

  const resizeWindow = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  function log10(x) {
    return Math.log(x) / Math.log(10);
  }

  function getSignificand(x) {
    return x * Math.pow(10, Math.ceil(-log10(x)));
  }

  function normalize(value, minSize) {
    const significand = getSignificand(value);
    const minSizeSign = getSignificand(minSize);
    let result = getSignificand(significand / minSizeSign);
    if (result >= 5) {
      result /= 5;
    }
    if (result >= 4) {
      result /= 4;
    }
    if (result >= 2) {
      result /= 2;
    }
    return result;
  }

  function getWithUnit(value, unitSuffix) {
    if (value < 0.000001) {
      return value * 1000000000 + ' n' + unitSuffix;
    }
    if (value < 0.001) {
      return value * 1000000 + " μ" + unitSuffix;
    }
    if (value < 1) {
      return value * 1000 + " m" + unitSuffix;
    }
    if (value >= 1000) {
      return value / 1000 + " k" + unitSuffix;
    }
    return value + " " + unitSuffix;
  }

  function roundSignificand(x, decimalPlaces) {
    const exponent = -Math.ceil(-log10(x));
    const power = decimalPlaces - exponent;
    const significand = x * Math.pow(10, power);
    // To avoid rounding problems, always work with integers
    if (power < 0) {
      return Math.round(significand) * Math.pow(10, -power);
    }
    return Math.round(significand) / Math.pow(10, power);
  }

  function getScalebarSizeAndTextForMetric(ppm, minSize) {
    const value = normalize(ppm, minSize);
    const factor = roundSignificand((value / ppm) * minSize, 3);
    console.log(value);
    console.log(factor);
    const size = value * minSize;
    const valueWithUnit = getWithUnit(factor, 'm');
    return {
      size: size,
      text: valueWithUnit,
    };
  }

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    const defaultZoom = (height - 80) / ((11146 / 7479) * width);
    setViewer(
      OpenSeaDragon({
        id: 'openSeaDragon',
        prefixUrl: 'openseadragon-images/',
        animationTime: 0.5,
        blendTime: 0.1,
        maxZoomPixelRatio: 2,
        defaultZoomLevel: defaultZoom,
        minZoomLevel: 0.2,
        visibilityRatio: 0.5,
        zoomPerScroll: 2,
        zoomInButton: 'zoom-in',
        zoomOutButton: 'zoom-out',
        homeButton: 'home',
        fullPageButton: 'full-page',
        sequenceMode: 'true', // sequence of images
        nextButton: 'next',
        previousButton: 'previous',
      })
    );
  };

  return (
    <div>
      <Box height={height-80} width={width} id="openSeaDragon">
        <div className={classes.root}>
        <Box position="absolute" top="0%" right="10%" zIndex="tooltip">
            <IconButton color="primary" aria-label="previous" disableRipple="true" id="previous">
              <ArrowBackIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="0%" right="5%" zIndex="tooltip">
            <IconButton color="primary" aria-label="next" disableRipple="true" id="next">
              <ArrowForwardIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="8%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="zoom in" disableRipple="true" id="zoom-in">
              <AddCircleOutlineIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="16%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="zoom out" disableRipple="true" id="zoom-out">
              <RemoveCircleOutlineIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="0%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="default zoom" disableRipple="true" id="home">
              <HomeIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="24%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="full screen" disableRipple="true" id="full-page">
              <FullscreenIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box border={1} borderTop={0} bgcolor='rgba(255, 255, 255, 0.5)' width={scalebarSize} position="absolute" bottom="0%" left="44%" zIndex="tooltip" style={{borderRight: '3px solid', borderLeft: '3px solid', borderBottom:'3px solid', textAlign: 'center'}}>
             {scalebarText}
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default OpenSeadragonViewer;
