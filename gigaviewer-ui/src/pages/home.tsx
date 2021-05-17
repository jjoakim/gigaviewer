import React from 'react';

import data from 'components/image-viewer/imageMetadata.json';
import { ImageGrid as Grid } from 'components/grid-view';

const Home = (props: any) => {
  return (
    <div>
      <Grid gridData={data}/>
    </div>
  );
};

export default Home;
