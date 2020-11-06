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

  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    const response = require('components/image-viewer/sampleTestImages.json');
    const image = response;

    setManifest(findGroup(image));
  };

  const findGroup = (img: any) => {
    for (var i = 0; i < img.groups.length; i++) 
      if (img.groups[i].name === props.location.state.groupId)
        return img.groups[i].slides[0].slide;
  }

  // function findElement(arr, propName, propValue) {
  //   for (var i=0; i < arr.length; i++)
  //     if (arr[i][propName] == propValue)
  //       return arr[i];
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
