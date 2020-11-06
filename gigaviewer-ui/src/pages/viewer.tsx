import React, { useState, useEffect } from 'react';
import { OpenSeaDragonViewer } from 'components/image-viewer';
import Box from '@material-ui/core/Box';

/**
 * @TODO hashout if props should be taken here, or in ImageViewer
 *       additionally, could this use Redux to manage state of image viewer?
 */

// interface PublicProps {
//   imgId: string,
//   frame: number, // index
//   groupId: string, // group.name would ideally retrive the <name> set of images
// }

const Viewer = (props: any) => {
  const [manifest, setManifest] = useState({});
  const response = require('components/image-viewer/sampleTestImages.json');
  const image = response;

  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    setManifest(updateManifest(image));
  };

  const updateManifest = (img: any) => {
    const {groupId, frame} = props.location.state;

    for (var i = 0; i < img.groups.length; i++) 
      if (img.groups[i].name === groupId)
        return img.groups[i].slides[frame].slide;
  }

  const previousFrame = () => {
    const { frame } = props.location.state;
    if (frame > 0) {
      props.location.state.frame = props.location.state.frame - 1;
    }
    // updateManifest()
  }

  const nextFrame = () => {}

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <Box position="absolute" top="80px" left="0%" zIndex="modal">
        {props.location.state.title}
          <OpenSeaDragonViewer image={manifest} />
        </Box>
      </div>
    </div>
  );
};

export default Viewer;
