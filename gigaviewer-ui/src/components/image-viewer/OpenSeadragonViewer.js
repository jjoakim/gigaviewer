import React, { useEffect, useState } from 'react';

import OpenSeaDragon from 'openseadragon';
import '@openseadragon-imaging/openseadragon-imaginghelper';

import { getScalebarSizeAndTextForMetric, getTotalFrames } from './utils';

import { 
  Box, 
  IconButton, 
  Slider, 
  makeStyles 
} from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HomeIcon from '@material-ui/icons/Home';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

/**
 * This component takes in the relevant frames and initializes them to an OSD viewer
 * @param {*} param0 
 */
const OpenSeadragonViewer = ({ frames, initialFrame }) => {
  let currentZoom = 0;
  const classes = useStyles();
  const [viewer, setViewer] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [defaultZoom, setDefaultZoom] = useState(0);
  const [scalebarSize, setScalebarSize] = useState(0);
  const [scalebarText, setScalebarText] = useState('');
  const [index, setIndex] = useState(Number(initialFrame));
  const [totalFrames, setTotalFrames] = useState(0);
  const [isPlaybackEnabled, setIsPlaybackEnabled] = useState(true);
  const [playbackIntervalId, setPlaybackIntervalId] = useState();

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

  useEffect(() => {
    if (frames && viewer) {
      setTotalFrames(getTotalFrames(frames));
      viewer.open(frames[0].frame.source[index]); // source is an array of the img data itself
    }
    if(viewer != null) {
      viewer.activateImagingHelper({
        onImageViewChanged
      });
    }
  }, [frames]);

  const previousFrame = () => {
    let newIndex = (index == 0) ? totalFrames-1 : index - 1;
    // setIndex(newIndex);
    setFrameAtIndex(newIndex);
  }

  const nextFrame = () => {
    let newIndex = (index == totalFrames - 1) ? 0 : index + 1;
    // setIndex(newIndex);
    setFrameAtIndex(newIndex);
  }

  const setFrameAtIndex = (i) => {
    setIndex(i);
    viewer.open(frames[0].frame.source[i]);
  }

  const startPlayback = () => {
    setPlaybackIntervalId(setInterval(function () {
      document.getElementById("next").click();
    }, 1000));
  }

  const stopPlayback = () => {
    clearInterval(playbackIntervalId);
  }

  const togglePlayback = () => {
    setIsPlaybackEnabled(!isPlaybackEnabled);
    if (isPlaybackEnabled) {
      startPlayback();
    } else {
      stopPlayback();
    }
  }

  const onImageViewChanged = () => {
    currentZoom = viewer.viewport.getZoom();
    console.log(currentZoom);
    const scaleBarSpecs = getScalebarSizeAndTextForMetric(
      ((height-80)/0.77) / (defaultZoom / currentZoom),
      100
    ); // (height-80)/0.77 = window_height/real_height, 100 = min width of scalebar
    console.log(scaleBarSpecs.size);
    console.log(scaleBarSpecs.text);
    setScalebarSize(scaleBarSpecs.size);
    setScalebarText(scaleBarSpecs.text);
  }

  const resizeWindow = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    
    setDefaultZoom((height - 80) / ((11146 / 7479) * width));

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
        zoomPerScroll: 1.1,
        zoomInButton: 'zoom-in',
        zoomOutButton: 'zoom-out',
        homeButton: 'home',
        fullPageButton: 'full-page',
        nextButton: 'next',
        previousButton: 'previous',
      })
    );
  };

  return (
    <div>
      <Box height={height-80} width={width} id="openSeaDragon">
      <div className={classes.root}>
          <Box position='absolute' top='2%' right='17%' width='10%' zIndex='tooltip'>
          <Slider
            defaultValue={1}
            aria-labelledby='discrete-slider'
            valueLabelDisplay='auto'
            step={1}
            marks
            min={1}
            max={3}
          />
          </Box>
          <Box position="absolute" top="0%" right="10%" zIndex="tooltip">
            <IconButton color="primary" aria-label="previous" disableRipple={true} id="previous" onClick={previousFrame}>
              <ArrowBackIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          {(isPlaybackEnabled)
          ? (totalFrames > 0) 
            ? <Box position="absolute" top="0%" right="5%" zIndex="tooltip">
              <IconButton color="primary" aria-label="previous" disableRipple={true} id="play" onClick={togglePlayback}>
                <PlayArrow style={{ fontSize: 30 }} />
              </IconButton>
            </Box>
            : <Box position="absolute" top="0%" right="5%" zIndex="tooltip">
                <IconButton disabled={true} color="primary" aria-label="previous" disableRipple={true} id="play" onClick={togglePlayback}>
                  <PlayArrow style={{ fontSize: 30 }} />
                </IconButton>
              </Box>
          : <Box position="absolute" top="0%" right="5%" zIndex="tooltip">
              <IconButton color="primary" aria-label="previous" disableRipple={true} id="play" onClick={togglePlayback}>
                <Pause style={{ fontSize: 30 }} />
              </IconButton>
            </Box>
          }
          <Box position="absolute" top="0%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="next" disableRipple={true} id="next" onClick={nextFrame}>
              <ArrowForwardIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="8%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="default zoom" disableRipple={true} id="home">
              <HomeIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="16%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="zoom in" disableRipple={true} id="zoom-in">
              <AddCircleOutlineIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="24%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="zoom out" disableRipple={true} id="zoom-out">
              <RemoveCircleOutlineIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="32%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="full screen" disableRipple={true} id="full-page">
              <FullscreenIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box
            border={1}
            borderTop={0}
            bgcolor="rgba(255, 255, 255, 0.5)"
            width={scalebarSize}
            position="absolute"
            bottom="0%"
            left="44%"
            zIndex="tooltip"
            style={{
              borderRight: '3px solid',
              borderLeft: '3px solid',
              borderBottom: '3px solid',
              textAlign: 'center',
            }}>
             {scalebarText}
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default OpenSeadragonViewer;
