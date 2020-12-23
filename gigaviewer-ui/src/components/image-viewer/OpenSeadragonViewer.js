import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import OpenSeaDragon from 'openseadragon';
import '@openseadragon-imaging/openseadragon-imaginghelper';

import { getScalebarSizeAndTextForMetric } from './utils';
import Draggable from 'react-draggable';

import {
  Box,
  IconButton,
  makeStyles,
  Slider,
  withStyles,
} from '@material-ui/core';

import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Replay from '@material-ui/icons/Replay';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import CodeIcon from '@material-ui/icons/Code';

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
})(Slider);

const ImageSlider = withStyles({
  root: {
    color: 'primary',
    height: 8,
  },
  thumb: {
    height: 40,
    width: 40,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -16,
    marginLeft: -20,
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
    opacity: 0,
  },
  rail: {
    height: 8,
    opacity: 0,
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
  let defaultZoom = 0;
  let changedFrame = true;
  let rightRect = new OpenSeaDragon.Rect(0, 0, 0, 0);
  let rightImage = null;
  let leftRect = new OpenSeaDragon.Rect(0, 0, 0, 0);
  // let leftImage = null;
  let newRect = new OpenSeaDragon.Rect(0, 0, 0, 0);

  const classes = useStyles();
  const [viewer, setViewer] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  // const [defaultZoom, setDefaultZoom] = useState(0);
  const [scalebarSize, setScalebarSize] = useState(0);
  const [scalebarText, setScalebarText] = useState('');
  const [index, setIndex] = useState(Number(initialFrame));
  const [totalFrames, setTotalFrames] = useState(0);
  const [isPlaybackEnabled, setIsPlaybackEnabled] = useState(true);
  const [playbackIntervalId, setPlaybackIntervalId] = useState();
  const [currSliderValue, setCurrSliderValue] = useState(Number(initialFrame));
  const [commitSliderValue, setCommitSliderValue] = useState(0);
  // const [isRedirecting, setIsRedirecting] = useState(false);
  const [deltaX, setDeltaX] = useState(0);
  const [activeDrags, setActiveDrags] = useState(0);
  const [leftImage, setLeftImage] = useState(null);
  // const middle = new OpenSeaDragon.Point(width / 2, height / 2);

  useEffect(() => {
    if (sources) {
      if (sources.length > 0) {
        setTotalFrames(sources[0].tileSources.length);
        InitOpenseadragon(sources[0].tileSources);
        setFrameAtIndex(0, 0, sources[0].tileSources.length);
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

  useEffect(() => {
    if (viewer != null && activeDrags == 0) {
      leftRect = new OpenSeaDragon.Rect(6500, 0, 6500, 16000);
      viewer.addTiledImage({
        tileSource:
          'https://gigazoom.rc.duke.edu/auto/Falcon-Target/usaf_target_100ms_20201120_163634_914_stitched_12012020.dzi',
        x: 0,
        y: 0,
        width: 1,
        clip: leftRect,
        success: function (event) {
          // leftImage = event.item;
          setLeftImage(event.item);
          console.log(leftImage);
          // imagesLoaded();
        },
      });
      console.log(leftRect.getSize());
      console.log(leftRect);
      console.log(leftImage);
      viewer.activateImagingHelper({
        onImageViewChanged,
      });
    }
    // if (leftImage != null && activeDrags == 1) {
    // const newWidth = 6500 + deltaX;
    // newRect = new OpenSeaDragon.Rect(6500, 0, newWidth, 16000);
    // leftImage.setClip(newRect);
    //   console.log(leftImage);
    //   console.log('mati');
    // }
  }, [viewer]);

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
    let newIndex = index === 0 ? totalFrames - 1 : index - 1;
    setFrameAtIndex(index, newIndex, totalFrames);
    setCurrSliderValue(newIndex);
    setCommitSliderValue(newIndex);
  };

  const nextFrame = () => {
    let oldIndex = index;
    let newIndex = (index + 1) % totalFrames;
    setFrameAtIndex(oldIndex, newIndex, totalFrames);
    setCurrSliderValue(newIndex);
    setCommitSliderValue(newIndex);
  };

  const setFrameAtIndex = (oldIndex, newIndex, totalFrames) => {
    console.log(viewer);
    setIndex(newIndex);
    // setChangedFrame(true);
    changedFrame = true;
    console.log(changedFrame);
    let nextIndex = (newIndex + 1) % totalFrames;
    if (oldIndex !== newIndex) {
      viewer.world.getItemAt(oldIndex).setOpacity(0);
      viewer.world.getItemAt(newIndex).setOpacity(1);
      viewer.world.getItemAt(nextIndex).setPreload(true);
    }
  };

  const startPlayback = () => {
    setPlaybackIntervalId(
      setTimeout(function clicker() {
        const next_button = document.getElementById('next');
        if (next_button) {
          next_button.click();
          setPlaybackIntervalId(setTimeout(clicker, 1000));
        }
      }, 1000)
    );
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
    if (changedFrame) {
      // setDefaultZoom(viewer.viewport.getZoom());
      defaultZoom = viewer.viewport.getZoom();
      changedFrame = false;
    }
    currentZoom = viewer.viewport.getZoom();
    console.log(height);
    console.log(defaultZoom);
    console.log(currentZoom);
    const scaleBarSpecs = getScalebarSizeAndTextForMetric(
      (height - 90) / 0.3 / (defaultZoom / currentZoom),
      100
    ); // (height-80)/0.77 = window_height/real_height, 100 = min width of scalebar
    setScalebarSize(scaleBarSpecs.size);
    setScalebarText(scaleBarSpecs.text);
  };

  const resizeWindow = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  const handleDrag = (e, ui) => {
    const x = deltaX;
    setDeltaX(x + ui.deltaX);
    console.log(deltaX);
    // const newWidth = 6500 + (16000 / 460) * deltaX;
    const middle = new OpenSeaDragon.Point(width / 2 + deltaX, height / 2);
    console.log(width);
    const lox = leftImage.viewerElementToImageCoordinates(middle).x;
    console.log(lox);
    console.log(leftImage.getContentSize().x + lox);
    console.log(leftImage);
    const imageWidth = leftImage.getContentSize().x;
    const newWidth = lox < 0 ? imageWidth - lox : imageWidth;
    newRect = new OpenSeaDragon.Rect(lox, 0, newWidth, 16000);
    leftImage.setClip(newRect);
  };

  const onStart = () => {
    setActiveDrags(1);
  };

  const onStop = () => {
    setActiveDrags(0);
  };

  const InitOpenseadragon = (tileSources) => {
    viewer && viewer.destroy();

    tileSources = tileSources.map(function (tileSource, i) {
      return {
        tileSource: tileSource,
        opacity: i === 0 ? 1 : 0,
        preload: i === 1,
      };
    });

    // setDefaultZoom((height - 80) / ((11146 / 7479) * width));
    setViewer(
      OpenSeaDragon({
        tileSources: tileSources,
        id: 'openSeaDragon',
        prefixUrl:
          'http://cdn.jsdelivr.net/npm/openseadragon@2.3/build/openseadragon/images/',
        maxZoomPixelRatio: 128,
        showNavigator: true,
        maxImageCacheCount: 4096,
        navigatorPosition: 'TOP_LEFT',
        loadTilesWithAjax: true,
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
      <Box height={height - 90} width={width} id="openSeaDragon">
        <Draggable
          onDrag={handleDrag}
          onStart={onStart}
          onStop={onStop}
          axis="x"
        >
          <Box
            position="absolute"
            top="50%"
            left="50%"
            display="flex"
            paddingRight="10%"
            paddingBottom="10%"
            // flexDirection="center"
            alignItems="center"
            justifyContent="center"
            // m="auto"
            width="10%"
            // height="50%"
            zIndex="tooltip"
            // paddingTop="20%"
            // borderRadius="50%"
            // border={1}
            // bgcolor="white"
          >
            {/* <ImageSlider
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              // value={currSliderValue}
              // onChange={handleChange}
              // onChangeCommitted={handleCommit}
              ThumbComponent={CodeIcon}
              min={0}
              max={1000}
              defaultValue={500}
            /> */}
            <IconButton
              color="primary"
              variant="outlined"
              // border={1}
              style={{
                backgroundColor: 'white',
                border: '3px solid',
                borderColor: '#3f50b5',
                // border: '1',
                // borderWidth: '5px',
                // borderColor: 'blue',
              }}
              // aria-label="previous"
              disableRipple={true}
              // id="play"
              // onClick={togglePlayback}
            >
              {/* <div>x: {deltaX.toFixed(0)}</div> */}
              <CodeIcon style={{ fontSize: 25 }} />
            </IconButton>
            {/* <div>facts</div> */}
          </Box>
        </Draggable>
        <div className={classes.root}>
          <Box position="absolute" top="0%" right="1%" zIndex="tooltip">
            <h1 style={{ backgroundColor: 'white' }}>{collectionTitle}</h1>
          </Box>
          <Box position="absolute" top="8%" right="10%" zIndex="tooltip">
            <IconButton
              color="primary"
              aria-label="previous"
              disableRipple={true}
              id="previous"
              onClick={previousFrame}
            >
              <ArrowBackIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          {isPlaybackEnabled ? (
            totalFrames > 0 ? (
              <Box position="absolute" top="8%" right="5%" zIndex="tooltip">
                <IconButton
                  color="primary"
                  aria-label="previous"
                  disableRipple={true}
                  id="play"
                  onClick={togglePlayback}
                >
                  <PlayArrow style={{ fontSize: 30 }} />
                </IconButton>
              </Box>
            ) : (
              <Box position="absolute" top="8%" right="5%" zIndex="tooltip">
                <IconButton
                  disabled={true}
                  color="primary"
                  aria-label="previous"
                  disableRipple={true}
                  id="play"
                  onClick={togglePlayback}
                >
                  <PlayArrow style={{ fontSize: 30 }} />
                </IconButton>
              </Box>
            )
          ) : (
            <Box position="absolute" top="8%" right="5%" zIndex="tooltip">
              <IconButton
                color="primary"
                aria-label="previous"
                disableRipple={true}
                id="play"
                onClick={togglePlayback}
              >
                <Pause style={{ fontSize: 30 }} />
              </IconButton>
            </Box>
          )}
          <Box position="absolute" top="8%" right="0%" zIndex="tooltip">
            <IconButton
              color="primary"
              aria-label="next"
              disableRipple={true}
              id="next"
              onClick={nextFrame}
            >
              <ArrowForwardIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box
            position="absolute"
            top="17%"
            right="1.2vw"
            width="10%"
            zIndex="tooltip"
          >
            <PrettoSlider
              defaultValue={0}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              value={currSliderValue}
              step={1}
              onChange={handleChange}
              onChangeCommitted={handleCommit}
              min={0}
              max={totalFrames - 1}
            />
          </Box>
          <Box position="absolute" top="24%" right="0%" zIndex="tooltip">
            <IconButton
              color="primary"
              aria-label="default zoom"
              disableRipple={true}
              id="home"
            >
              <Replay style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="32%" right="0%" zIndex="tooltip">
            <IconButton
              color="primary"
              aria-label="zoom in"
              disableRipple={true}
              id="zoom-in"
            >
              <AddCircleOutlineIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="40%" right="0%" zIndex="tooltip">
            <IconButton
              color="primary"
              aria-label="zoom out"
              disableRipple={true}
              id="zoom-out"
            >
              <RemoveCircleOutlineIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="48%" right="0%" zIndex="tooltip">
            <IconButton
              color="primary"
              aria-label="full screen"
              disableRipple={true}
              id="full-page"
            >
              <FullscreenIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          {scalebarSize === 0 ? null : (
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
              }}
            >
              {scalebarText}
            </Box>
          )}
        </div>
      </Box>
    </div>
  );
};

export default OpenSeadragonViewer;
