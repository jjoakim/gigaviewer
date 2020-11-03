import React, {useState, useEffect} from 'react';
import { OpenSeaDragonViewer } from 'components/image-viewer';

import Box from '@material-ui/core/Box';

// import { ImageViewer } from 'components/image-viewer';

/**
 * @TODO hashout if props should be taken here, or in ImageViewer
 *       additionally, could this use Redux to manage state of image viewer?
 */

interface PublicProps {
  id: string,
  frame: number, // index
  slide: {},
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
      <Box position="absolute" top="13%" left="8%" zIndex="modal">
          <OpenSeaDragonViewer image={manifest} />
        </Box>
      </div>
    </div>
  )
}

export default Viewer;