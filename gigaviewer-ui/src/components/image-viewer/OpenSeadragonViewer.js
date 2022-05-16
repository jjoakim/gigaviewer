import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import OpenSeaDragon from 'openseadragon';
import '@openseadragon-imaging/openseadragon-imaginghelper';
import '../../plugins/openseadragon-scalebar';
import '../../plugins/openseadragon-bookmark-url';

import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Input,
  makeStyles,
  Modal,
  Slider,
  Typography,
  withStyles,
} from '@material-ui/core';

import RotateRightIcon from '@material-ui/icons/RotateRight';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import DetailsIcon from '@material-ui/icons/Details';
import { green } from '@material-ui/core/colors';
import clsx from 'clsx';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  return ref.current; //in the end, return the current ref value.
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: 300,
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
    boxSizing: 'border-box',
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '25%',
    left: '25%',
    marginTop: 0,
    marginLeft: 0,
  },
  buttonSuccess: {
    width: '100%',
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
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
})(Slider);

const OpenSeadragonViewer = ({
  sources,
  initialFrame,
  collectionTitle,
  zoom,
  xPosition,
  yPosition,
}) => {
  const location = useLocation();
  const history = useHistory();

  const classes = useStyles();
  const [viewer, setViewer] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [index, setIndex] = useState(initialFrame);
  const oldIndex = usePrevious(index);
  const [totalFrames, setTotalFrames] = useState(0);
  const [isPlaybackEnabled, setIsPlaybackEnabled] = useState(true);
  const [playbackIntervalId, setPlaybackIntervalId] = useState();
  const [sliderValue, setSliderValue] = useState(initialFrame);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [cacheSliderValue, setCacheSliderValue] = useState(10);
  const [isCaching, setIsCaching] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(3);
  const [viewerWorldEvent, setViewerWorldEvent] = useState(false);

  const onImageViewChanged = () => {};

  useEffect(() => {
    if (viewer) {
      if (viewer.world.getItemAt(index)) {
        let nextIndex = (index + 1) % totalFrames;
        if (oldIndex !== index) {
          console.log('Hello');
          // Make the prev image go away
          viewer.world.getItemAt(oldIndex).setOpacity(0);
          // Stop pre-loading it
          viewer.world.getItemAt(oldIndex).setPreload(false);
        }
        viewer.world.getItemAt(index).setOpacity(1);
        if (viewer.world.getItemAt(nextIndex)) {
          // preload the next item
          viewer.world.getItemAt(nextIndex).setPreload(true);
        }
      } else {
        viewer.world.addOnceHandler('add-item', (event) => {
          setViewerWorldEvent(event);
        });
      }
    }
  }, [viewer, oldIndex, index, totalFrames, viewerWorldEvent]);

  const changeFrame = useCallback(
    (amount) => {
      setIndex((index) => {
        let newIndex = (index + amount) % totalFrames;
        if (newIndex < 0) {
          newIndex = newIndex + totalFrames;
        }
        return newIndex;
      });
    },
    [totalFrames]
  );

  const handleKeyPress = useCallback(
    (event) => {
      const keyName = event.key;
      console.log(keyName);
      if (keyName === 'ArrowLeft') {
        changeFrame(-1);
      } else if (keyName === 'ArrowRight') {
        changeFrame(1);
      }
    },
    [changeFrame]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (sources && !viewer) {
      if (sources.length > 0) {
        const tempTotal = sources[0].tileSources.length;
        setTotalFrames(tempTotal);
        setCacheSliderValue(10 > tempTotal ? tempTotal : 10);
        const tileSources = sources[0].tileSources.map(function (
          tileSource,
          i
        ) {
          return {
            tileSource: tileSource,
            opacity: i === 0 ? 1 : 0,
            preload: i === 1,
          };
        });

        setViewer(
          OpenSeaDragon({
            tileSources: tileSources,
            id: 'openSeaDragon',
            prefixUrl:
              'http://cdn.jsdelivr.net/npm/openseadragon@2.3/build/openseadragon/images/',
            maxZoomPixelRatio: 8,
            showNavigator: true,
            maxImageCacheCount: 4096,
            navigatorPosition: 'TOP_LEFT',
            loadTilesWithAjax: true,
            preload: true,
            showSequenceControl: false,
            showRotationControl: true,
            rotateRightButton: 'rotate-right',
            zoomInButton: 'zoom-in',
            zoomOutButton: 'zoom-out',
            homeButton: 'home',
            fullPageButton: 'full-page',
            preserveViewport: true,
          })
        );
      }
      resizeWindow();
      window.addEventListener('resize', resizeWindow);
      return () => {
        window.removeEventListener('resize', resizeWindow);
      };
    }
  }, [sources, viewer]);

  useEffect(() => {
    let newPath = `${location.pathname.slice(
      0,
      location.pathname.lastIndexOf('/') + 1
    )}${index}`;
    if (location.hash) {
      newPath = `${newPath}${location.hash}`;
    }
    console.log({ newPath, index });
    history.push(newPath);
  }, [index, history, location.pathname]);

  useEffect(() => {
    if (viewer) {
      // Activating some plugins
      viewer.activateImagingHelper({
        onImageViewChanged,
      });
      viewer.bookmarkUrl();
      viewer.scalebar({
        // TODO: get this from the props
        pixelsPerMeter: 100000,
        color: 'white',
        fontColor: 'black',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        stayInsideImage: false,
        barThickness: 10,
      });
      // configure the zoom level/pan
      if (zoom && xPosition && yPosition) {
        viewer.viewport.zoomTo(zoom, null, true);
        viewer.viewport.panTo(
          new OpenSeaDragon.Point(xPosition, yPosition),
          true
        );
      } else {
        console.log({ zoom, xPosition, yPosition });
      }
      // remove the inner keydown handler from OSD
      viewer.innerTracker.keyDownHandler = null;
      viewer.innerTracker.keyPressHandler = null;
    }
    return () => {
      viewer && viewer.destroy();
    };
  }, [viewer]);

  const handleCommit = (event, value) => {
    console.log({ value });
    setIndex(value);
  };

  const startSlowZoom = () => {
    const viewport = viewer.viewport;
    const oldTime = viewport.zoomSpring.animationTime;
    const oldSpring = viewport.zoomSpring.springStiffness;
    viewport.zoomSpring.animationTime = 10;
    viewport.zoomSpring.springStiffness = 1;
    viewport.zoomTo(viewport.getMaxZoom());
    const delay = 10000;
    setTimeout(() => {
      viewport.zoomSpring.animationTime = oldTime;
      viewport.zoomSpring.springStiffness = oldSpring;
    }, delay);
  };

  const startPlayback = () => {
    const delay = 1000 / playbackSpeed;

    setPlaybackIntervalId(
      setTimeout(function clicker() {
        const next_button = document.getElementById('next');
        if (next_button) {
          next_button.click();
          setPlaybackIntervalId(setTimeout(clicker, delay));
        }
      }, delay)
    );
  };

  const stopPlayback = () => {
    clearTimeout(playbackIntervalId);
  };

  const modelOpen = () => {
    setOpen(true);
  };

  const handlePrecacheSliderChange = (event, newValue) => {
    setCacheSliderValue(newValue);
  };

  const modalClose = () => {
    setOpen(false);
  };

  const startPrecache = () => {
    setIsCaching(true);
  };

  const buttonClassname = clsx({
    [classes.buttonSuccess]: isCaching,
  });

  const precacheData = useCallback(
    (cacheAmnt) => {
      let cacheIndex = index;
      let item = null;
      let lastItem = null;
      for (let i = 0; i < cacheAmnt; i++) {
        cacheIndex = (cacheIndex + 1) % totalFrames;
        item = viewer.world.getItemAt(cacheIndex);
        if (!item._fullyLoaded) {
          item.setPreload(true);
          lastItem = item;
          item.addOnceHandler('fully-loaded-change', (event) => {
            event.eventSource.setPreload(false);
          });
        }
      }
      if (lastItem === null) {
        setIsCaching(false);
      } else {
        lastItem.addOnceHandler('fully-loaded-change', () => {
          setIsCaching(false);
        });
      }
    },
    [totalFrames, viewer, index]
  );

  useEffect(() => {
    if (isCaching) {
      precacheData(cacheSliderValue);
    } else {
      modalClose();
    }
  }, [isCaching, cacheSliderValue, precacheData]);

  const togglePlayback = () => {
    setIsPlaybackEnabled(!isPlaybackEnabled);
    if (isPlaybackEnabled) {
      startPlayback();
    } else {
      stopPlayback();
    }
  };

  const resizeWindow = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  return (
    <div>
      <Box height={height - 90} width={width} id="openSeaDragon">
        <div className={classes.root}>
          <Box
            flexDirection="column"
            position="absolute"
            top="0%"
            right="1%"
            zIndex="tooltip"
            justifyContent="center"
          >
            <h1 style={{ backgroundColor: 'white' }}>{collectionTitle}</h1>
            {totalFrames > 1 && (
              <div>
                <Box display="flex" flexDirection="row" justifyContent="center">
                  <IconButton
                    color="primary"
                    aria-label="previous"
                    disableRipple={true}
                    id="previous"
                    onClick={() => changeFrame(-1)}
                  >
                    <ArrowBackIcon style={{ fontSize: 30 }} />
                  </IconButton>

                  <IconButton
                    color="primary"
                    aria-label="previous"
                    disableRipple={true}
                    id="play"
                    onClick={modelOpen}
                  >
                    <SystemUpdateAltIcon style={{ fontSize: 30 }} />
                  </IconButton>
                  <IconButton
                    color="primary"
                    aria-label="previous"
                    disableRipple={true}
                    id="play"
                    onClick={togglePlayback}
                  >
                    {isPlaybackEnabled ? (
                      <PlayArrow style={{ fontSize: 30 }} />
                    ) : (
                      <Pause style={{ fontSize: 30 }} />
                    )}
                  </IconButton>
                  <Input
                    // className={classes.input}
                    value={playbackSpeed}
                    margin="dense"
                    onChange={(event) => {
                      let value = 1;
                      if (event.target.value !== '') {
                        value = event.target.value;
                      }
                      if (value > 30) {
                        value = 30;
                      }
                      setPlaybackSpeed(value);
                    }}
                    // onBlur={handleBlur}
                    inputProps={{
                      step: 1,
                      min: 1,
                      max: 30,
                      type: 'number',
                      style: { width: 35 },
                    }}
                  />
                  <IconButton
                    color="primary"
                    aria-label="next"
                    disableRipple={true}
                    id="next"
                    onClick={() => changeFrame(1)}
                  >
                    <ArrowForwardIcon style={{ fontSize: 30 }} />
                  </IconButton>
                </Box>
                <PrettoSlider
                  defaultValue={index}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  value={sliderValue}
                  step={1}
                  onChange={(event, value) => setSliderValue(value)}
                  onChangeCommitted={handleCommit}
                  min={0}
                  max={totalFrames - 1}
                />
              </div>
            )}
            <Box
              display="flex"
              style={{ float: 'right' }}
              flexDirection="column"
              alignContent="flex-end"
              justifyContent="left"
              width="10%"
            >
              <IconButton
                color="primary"
                aria-label="rotate right"
                disableRipple={true}
                id="rotate-right"
              >
                <RotateRightIcon style={{ fontSize: 30 }} />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="full screen"
                disableRipple={true}
                id="full-page"
              >
                <FullscreenIcon style={{ fontSize: 30 }} />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="zoom in"
                disableRipple={true}
                id="zoom-in"
              >
                <AddCircleOutlineIcon style={{ fontSize: 30 }} />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="zoom out"
                disableRipple={true}
                id="zoom-out"
              >
                <RemoveCircleOutlineIcon style={{ fontSize: 30 }} />
              </IconButton>

              <IconButton
                color="primary"
                aria-label="default zoom"
                disableRipple={true}
                id="home"
              >
                <ZoomOutMapIcon style={{ fontSize: 30 }} />
              </IconButton>
              <IconButton
                color="primary"
                disableRipple={true}
                id="max-zoom-in"
                onClick={startSlowZoom}
              >
                <DetailsIcon style={{ fontSize: 30 }} />
              </IconButton>
            </Box>
          </Box>
        </div>
      </Box>
      <Modal
        open={open}
        onClose={modalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Preload area?</h2>
          <Typography id="range-slider" gutterBottom>
            Cache Amount
          </Typography>
          <PrettoSlider
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            value={cacheSliderValue}
            step={1}
            onChange={handlePrecacheSliderChange}
            min={1}
            max={totalFrames}
          />
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              width="100%"
              className={buttonClassname}
              disabled={isCaching}
              onClick={startPrecache}
            >
              Start Precaching
            </Button>
            {isCaching && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default React.memo(OpenSeadragonViewer);
