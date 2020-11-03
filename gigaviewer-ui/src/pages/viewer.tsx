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

interface PublicProps {
  id: string,
  frame: number, // index
  slide: {
    mpp: number,
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
      <div>
      <Box position="absolute" top="15%" left="0%" zIndex="modal">
          <OpenSeaDragonViewer image={manifest} />
        </Box>
      </div>
    </div>
  )
}

export default Viewer;