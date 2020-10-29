import React, {useState, useEffect} from 'react';
import OpenSeaDragonViewer from 'components/image-viewer/OpenSeadragonViewer';

interface PublicProps {
  group: {};
  name: string;
}

const Viewer = () => {
  const [images, setImages] = useState([]);
  const [manifest, setManifest] = useState();

  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    const response = require('components/image-viewer/sampleTestImages.json');
    let image = response;
    setImages(image.groups);
    setManifest(image.groups[0].slides[0].slide);
  }

  const previewImage = async (slide: any) => {
    setManifest(slide.slide);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: 'space-between'
      }}
    >
      <h2>Test Images</h2>
      <div>
        <OpenSeaDragonViewer image={manifest} />
      </div>
    </div>
  )
}

export default Viewer;