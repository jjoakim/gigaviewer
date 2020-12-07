import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import OpenSeaDragon from 'openseadragon';
import '@openseadragon-imaging/openseadragon-imaginghelper';

import {getScalebarSizeAndTextForMetric} from './utils';

import {Box, IconButton, makeStyles, Slider, withStyles,} from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Replay from '@material-ui/icons/Replay';
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

const PrettoSlider = withStyles({
  root: {
    color: 'primary',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    opacity: 0.6,
  },
  mark: {
    backgroundColor: '#bfbfbf',
    height: 10,
    width: 2,
    marginTop: -3,
  },
})(Slider);

/**
 * This component takes in the relevant frames and initializes them to an OSD viewer
 * @param {*} param0 
 */
const OpenSeadragonViewer = ({ sources, initialFrame, collectionTitle }) => {
  const location = useLocation();
  const history = useHistory();
  // const currPage = location.href;

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
  const [currSliderValue, setCurrSliderValue] = useState(Number(initialFrame));
  const [commitSliderValue, setCommitSliderValue] = useState(0);
  // const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {

    if (sources) {
      if (sources.length > 0){
        setTotalFrames(sources[0].tileSources.length);
        InitOpenseadragon(sources[0].tileSources);
        setFrameAtIndex(0, 0, sources[0].tileSources.length);
      }

      if(viewer != null) {
        viewer.activateImagingHelper({
          onImageViewChanged
        });
      }
      resizeWindow();
      window.addEventListener('resize', resizeWindow);
      // console.log('width: ' + window.innerWidth + ' height: ' + window.innerHeight);

      return () => {
        viewer && viewer.destroy();
        window.removeEventListener('resize', resizeWindow);
      };
    }
  }, [sources]);


  useEffect(() => {
    history.push(`${location.pathname.slice(0, -1)}${index}`);
  }, [index]);

  const handleChange = (event, newSliderValue) => {
    setCurrSliderValue(newSliderValue);
  };

  const handleCommit = () => {
    if (currSliderValue !== commitSliderValue) {
      setFrameAtIndex(commitSliderValue, currSliderValue, totalFrames);
    }
    setCommitSliderValue(currSliderValue);
  };

  const previousFrame = () => {
    let newIndex = (index === 0) ? totalFrames-1 : index - 1;
    setFrameAtIndex(index, newIndex, totalFrames);
    setCurrSliderValue(newIndex);
    setCommitSliderValue(newIndex);
  };

  const nextFrame = () => {
    let oldIndex = index;
    let newIndex =  (index + 1) % totalFrames;
    setFrameAtIndex(oldIndex, newIndex, totalFrames);
    setCurrSliderValue(newIndex);
    setCommitSliderValue(newIndex);
  };

  const setFrameAtIndex = (oldIndex, newIndex, totalFrames) => {
    setIndex(newIndex);
    let nextIndex = (newIndex + 1) % totalFrames;
    if (oldIndex !== newIndex){
      viewer.world.getItemAt(oldIndex).setOpacity(0);
      viewer.world.getItemAt(newIndex).setOpacity(1);
      viewer.world.getItemAt(nextIndex).setPreload(true);
    }
  };

  const startPlayback = () => {
    setPlaybackIntervalId(setTimeout(function clicker () {
      const next_button =  document.getElementById('next')
      if (next_button){
        next_button.click();
        setPlaybackIntervalId(setTimeout(clicker, 1000));
      }
    }, 1000));
  };

  const stopPlayback = () => {
    clearTimeout(playbackIntervalId);
  };

  const togglePlayback = () => {
    setIsPlaybackEnabled(!isPlaybackEnabled);
    if (isPlaybackEnabled) {
      startPlayback();
    } else {
      stopPlayback();
    }
  };

  const onImageViewChanged = () => {
    currentZoom = viewer.viewport.getZoom();
    const scaleBarSpecs = getScalebarSizeAndTextForMetric(
      ((height-80)/0.77) / (defaultZoom / currentZoom),
      100
    ); // (height-80)/0.77 = window_height/real_height, 100 = min width of scalebar
    setScalebarSize(scaleBarSpecs.size);
    setScalebarText(scaleBarSpecs.text);
  };

  const resizeWindow = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const InitOpenseadragon = (tileSources) => {
    viewer && viewer.destroy();

    tileSources = tileSources.map(function(tileSource, i) {
      return {
        tileSource: tileSource,
        opacity: i === 0 ? 1 : 0,
        preload: i === 1
      };
    });

    setDefaultZoom((height - 80) / ((11146 / 7479) * width));
    setViewer(
      OpenSeaDragon({
        tileSources: tileSources,
        id: 'openSeaDragon',
        prefixUrl: 'http://cdn.jsdelivr.net/npm/openseadragon@2.3/build/openseadragon/images/',
        maxZoomPixelRatio: 128,
        showNavigator: true,
        maxImageCacheCount: 4096,
        navigatorPosition: 'TOP_LEFT',
        // animationTime: 0.5,
        // blendTime: 0.1,
        // maxZoomPixelRatio: 2,
        // defaultZoomLevel: defaultZoom,
        // minZoomLevel: 0.2,
        preload: true,
        // sequenceMode: true,
        showSequenceControl: false,
        // preserveViewport: true,
        // visibilityRatio: 0.5,
        // zoomPerScroll: 1.1,
        zoomInButton: 'zoom-in',
        zoomOutButton: 'zoom-out',
        homeButton: 'home',
        fullPageButton: 'full-page',
        // showNavigator: true,
        // navigatorPosition: "TOP_LEFT",
        preserveViewport: true,
        // nextButton: 'next',
        // previousButton: 'previous',
      })
    );
  };

  return (
    <div>
      <Box height={height-90} width={width} id="openSeaDragon">
      <div className={classes.root}>
          <Box position="absolute" top="0%" right="1%" zIndex="tooltip" >
            <h1 style={{backgroundColor: "white"}}>{collectionTitle}</h1>
          </Box>
          <Box position="absolute" top="8%" right="10%" zIndex="tooltip">
            <IconButton color="primary" aria-label="previous" disableRipple={true} id="previous" onClick={previousFrame}>
              <ArrowBackIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          {(isPlaybackEnabled)
            ? (totalFrames > 0)
              ? <Box position="absolute" top="8%" right="5%" zIndex="tooltip">
                <IconButton color="primary" aria-label="previous" disableRipple={true} id="play" onClick={togglePlayback}>
                  <PlayArrow style={{ fontSize: 30 }} />
                </IconButton>
              </Box>
              : <Box position="absolute" top="8%" right="5%" zIndex="tooltip">
                  <IconButton disabled={true} color="primary" aria-label="previous" disableRipple={true} id="play" onClick={togglePlayback}>
                    <PlayArrow style={{ fontSize: 30 }} />
                  </IconButton>
                </Box>
            : <Box position="absolute" top="8%" right="5%" zIndex="tooltip">
                <IconButton color="primary" aria-label="previous" disableRipple={true} id="play" onClick={togglePlayback}>
                  <Pause style={{ fontSize: 30 }} />
                </IconButton>
              </Box>
          }
          <Box position="absolute" top="8%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="next" disableRipple={true} id="next" onClick={nextFrame}>
              <ArrowForwardIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position='absolute' top="17%" right='1.2vw' width='10%' zIndex='tooltip'>
            <PrettoSlider 
              defaultValue={0}
              aria-labelledby='discrete-slider'
              valueLabelDisplay='auto'
              value={currSliderValue}
              step={1}
              onChange={handleChange}
              onChangeCommitted={handleCommit}
              marks
              min={0}
              max={totalFrames-1}
            />
          </Box>
          <Box position="absolute" top="24%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="default zoom" disableRipple={true} id="home">
              <Replay style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="32%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="zoom in" disableRipple={true} id="zoom-in">
              <AddCircleOutlineIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="40%" right="0%" zIndex="tooltip">
            <IconButton color="primary" aria-label="zoom out" disableRipple={true} id="zoom-out">
              <RemoveCircleOutlineIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="48%" right="0%" zIndex="tooltip">
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
