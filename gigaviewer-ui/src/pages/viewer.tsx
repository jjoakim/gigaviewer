import React, {useState, useEffect} from 'react';
import { OpenSeaDragonViewer } from 'components/image-viewer';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HomeIcon from '@material-ui/icons/Home';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Box from '@material-ui/core/Box';

// import { ImageViewer } from 'components/image-viewer';

/**
 * @TODO hashout if props should be taken here, or in ImageViewer
 *       additionally, could this use Redux to manage state of image viewer?
 */

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  }),
);

interface PublicProps {
  id: string,
  frame: number, // index
  slide: {
    mpp: string,
    name: string,
    source: {
      Image: {
        Format: string,
        Overlap: number,
        Size: {
          Height: number,
          Width: number,
        },
        TileSize: number,
        Url: string,
        xmlns: string,
      }
    }
  };
}

const Viewer = (props: PublicProps) => {
  // const [images, setImages] = useState([]);
  const classes = useStyles();
  const [manifest, setManifest] = useState({});

  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    const response = require('components/image-viewer/sampleTestImages.json');
    let image = response;
    // setImages(image.groups);
    setManifest(image.groups[0].slides[0].slide);
    // setManifest(props.slide);
  }

  // const previewImage = async (slide: any) => {
  //   setManifest(slide.slide);
  // }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: 'space-between'
      }}
    >
      <h2>Test Images</h2>
      {/* <Box className={classes.root} id="toolbarDiv" zIndex="tooltip"> */}
      <div>
        <Box position="absolute" top="16%" left="22%" zIndex="tooltip">
          <IconButton color="primary" aria-label="zoom in" id="zoom-in">
            <AddCircleOutlineIcon style={{ fontSize: 60 }} />
          </IconButton>
        </Box>
        <Box position="absolute" top="16%" left="27%" zIndex="tooltip">
          <IconButton color="primary" aria-label="zoom out" id="zoom-out">
            <RemoveCircleOutlineIcon style={{ fontSize: 60 }}/>
          </IconButton>
        </Box>
        <Box position="absolute" top="16%" left="32%" zIndex="tooltip">
          <IconButton color="primary" aria-label="default zoom" id="home">
            <HomeIcon style={{ fontSize: 60 }}/>
          </IconButton>
        </Box>
        <Box position="absolute" top="16%" left="37%" zIndex="tooltip">
          <IconButton color="primary" aria-label="full screen" id="full-page">
            <FullscreenIcon style={{ fontSize: 60 }}/>
          </IconButton>
        </Box>
      </div>
      {/* </Box> */}
      {/* <Box className={classes.root} id="toolbarDiv" zIndex="tooltip">
      <IconButton color="primary" aria-label="zoom in" id="zoom-in">
            <AddCircleOutlineIcon style={{ fontSize: 60 }} />
          </IconButton>
          <IconButton color="primary" aria-label="zoom out" id="zoom-out">
            <RemoveCircleOutlineIcon style={{ fontSize: 60 }}/>
          </IconButton>
          <IconButton color="primary" aria-label="default zoom" id="home">
            <HomeIcon style={{ fontSize: 60 }}/>
          </IconButton>
          <IconButton color="primary" aria-label="full screen" id="full-page">
            <FullscreenIcon style={{ fontSize: 60 }}/>
          </IconButton>
      </Box> */}
      <div>
      <Box position="absolute" top="15%" left="20%" zIndex="modal">
          <OpenSeaDragonViewer image={manifest} />
        </Box>
      </div>
    </div>
  )
}

export default Viewer;