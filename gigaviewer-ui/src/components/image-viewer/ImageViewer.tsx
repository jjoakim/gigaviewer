import OpenSeaDragon from 'openseadragon';
import React, { useEffect, useState } from 'react';

interface PublicProps {
  image: any;
}

const ImageViewer = (props: PublicProps) => {  
  const [viewer, setViewer] = useState(new OpenSeaDragon.Viewer({id: 'null'}));

  useEffect(() => {
    if (viewer && props.image) {
      viewer.open(props.image.source);
    }
  }, [props.image]);


  const InitOpenseadragon = () => {
    viewer && viewer.destroy();

    const options: OpenSeaDragon.Options = {
      id: 'openSeaDragon',
      prefixUrl: 'openseadragon-images/',
      animationTime: 0.5,
      blendTime: 0.1,
      constrainDuringPan: true,
      maxZoomPixelRatio: 2,
      minZoomLevel: 1,
      visibilityRatio: 1,
      zoomPerScroll: 2,
      zoomInButton: 'zoom-in',
      zoomOutButton: 'zoom-out',
      homeButton: 'home',
      fullPageButton: 'full-page',
      nextButton: 'next',
      previousButton: 'previous',
    }

    setViewer(OpenSeaDragon(options));
  }

  useEffect(() => {
    InitOpenseadragon();
    return () => {
      viewer && viewer.destroy();
    };
  }, []);

  return (
    <div
      id="openSeaDragon"
      style={{
        height: '100%',
        width: '100%',
      }}
    />
  );
};

export default ImageViewer;
