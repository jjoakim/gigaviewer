import React from 'react';
import { OpenSeaDragonViewer } from 'components/image-viewer';
import Box from '@material-ui/core/Box';

const Viewer = (props) => {
  const {
    imageSources,
    title,
    initialFrame,
    zoom,
    xPosition,
    yPosition,
  } = props;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <Box position="absolute" top="80px" left="0%" zIndex="modal">
          <OpenSeaDragonViewer
            sources={imageSources}
            collectionTitle={title}
            initialFrame={initialFrame}
            zoom={zoom}
            xPosition={xPosition}
            yPosition={yPosition}
          />
        </Box>
      </div>
    </div>
  );
};

export default Viewer;
