import React, { useState, useEffect } from 'react';
import { OpenSeaDragonViewer } from 'components/image-viewer';
import Box from '@material-ui/core/Box';

/**
 * @todo how should this json file be inputted/imported?
 * 
 * openseadragon term conversions slide(s) -> frame(s), name -> gid
 */
import data from 'components/image-viewer/imageMetadata.json'; 

/**
 * viewer page component
 * @param props contains groupId, frame of props.match.params
 */
const Viewer = (props: any) => {
  const [currIndex, setCurrIndex] = useState(-1);
  const [imageSources, setImageSources] = useState<any>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    initIndex();
  });


  useEffect(() => {
    if (currIndex >= 0){
      setImageSources(data.groups[currIndex].sources);
      setTitle(data.groups[currIndex].title);
    }
  }, [currIndex]);

  const initIndex = () => {
    setCurrIndex(getIndex(data));
  };

  const getIndex = (data: any) => {
    for (var i = 0; i < data.groups.length; i++) 
      if (data.groups[i].gid === props.match.params.groupId) 
        return i;
    return -1;
  }


  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <Box position="absolute" top="80px" left="0%" zIndex="modal">
          <OpenSeaDragonViewer sources={imageSources} collectionTitle={title} initialFrame={props.match.params.frame}/>
        </Box>
      </div>
    </div>
  );
};

export default Viewer;
