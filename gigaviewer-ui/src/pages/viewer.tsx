import React, { useState, useEffect } from 'react';
import { OpenSeaDragonViewer } from 'components/image-viewer';
import Box from '@material-ui/core/Box';

// import { ImageViewer } from 'components/image-viewer';

/**
 * @TODO hashout if props should be taken here, or in ImageViewer
 *       additionally, could this use Redux to manage state of image viewer?
 */

interface PublicProps {
  id: string;
  frame: number; // index
  slide: {
    mpp: string;
    name: string;
    source: {
      Image: {
        Format: string;
        Overlap: number;
        Size: {
          Height: number;
          Width: number;
        };
        TileSize: number;
        Url: string;
        xmlns: string;
      };
    };
  };
}

const Viewer = (props: PublicProps) => {
  // const [images, setImages] = useState([]);
  const [manifest, setManifest] = useState({});

  const getImages = async () => {
    const response = require('components/image-viewer/sampleTestImages.json');
    const image = response;
    // setImages(image.groups);
    setManifest(image.groups[0].slides[0].slide);
    // setManifest(props.slide);
  };

  useEffect(() => {
    getImages();
  }, []);

  // const previewImage = async (slide: any) => {
  //   setManifest(slide.slide);
  // }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <h2>Test Images</h2>
      <div>
        <Box position="absolute" top="15%" left="20%" zIndex="modal">
          <OpenSeaDragonViewer image={manifest} />
        </Box>
      </div>
    </div>
  );
};

export default Viewer;
