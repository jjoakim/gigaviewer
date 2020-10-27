import OpenSeaDragon from "openseadragon";
import React, { useEffect, useState } from "react";

const OpenSeaDragonViewer = ({ image }) => {
  const [viewer, setViewer] = useState(null);

  useEffect(() => {
    if (image && viewer) {
      viewer.open(image.source);
    }
  }, [image]);
  const InitOpenseadragon = () => {
    viewer && viewer.destroy();
    setViewer(
      OpenSeaDragon({
        id: 'openSeaDragon',
        prefixUrl: 'openseadragon-images/',
        animationTime: 0.5,
        blendTime: 0.1,
        constrainDuringPan: true,
        maxZoomPixelRatio: 2,
        minZoomLevel: 1,
        visibilityRatio: 1,
        zoomPerScroll: 2,
      })
    );
  };
  useEffect(() => {
    InitOpenseadragon();
    return () => {
      viewer && viewer.destroy();
    };
  }, []);
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <div
      id="openSeaDragon"
      style={{
        height: '800px',
        width: '1200px',
      }}
    />
  );
};
// eslint-disable-next-line import/prefer-default-export
export default OpenSeaDragonViewer;
