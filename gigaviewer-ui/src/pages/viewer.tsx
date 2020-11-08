import React, { useState, useEffect } from 'react';
import { OpenSeaDragonViewer } from 'components/image-viewer';
import Box from '@material-ui/core/Box';

/**
 * @todo how should this json file be inputted/imported?
 */
import data from 'components/image-viewer/sampleTestImages.json'; 

/**
 * viewer page component
 * @param props contains groupId, frame of props.match.params
 */
const Viewer = (props: any) => {
  const [manifest, setManifest] = useState({});
  const image = data;

  useEffect(() => {
    getImages();
  }, []);

  const getImages = () => {
    setManifest(updateManifest(image));
  };

  const updateManifest = (img: any) => {
    const {groupId, frame} = props.match.params; // grab groupId, frame from router arg params

    for (var i = 0; i < img.groups.length; i++) 
      if (img.groups[i].name === groupId)
        return img.groups[i].slides[frame].frame;
  }

  const previousFrame = () => {
    const { frame } = props.match.params;
    if (frame > 0) {
      props.match.params.frame = props.match.params.frame - 1;
    }
    console.log('groupId - frame: ' + props.match.params.groupId + ' ' + frame);
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
          <OpenSeaDragonViewer image={manifest} />
        </Box>
      </div>
    </div>
  );
};

export default Viewer;
