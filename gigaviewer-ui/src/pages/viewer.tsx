import React, { useState, useEffect } from 'react';

import OpenSeaDragonViewer from 'components/image-viewer';
import * as data from 'components/image-viewer/sampleImages.json';

interface PublicProps {
    imgSrc: string;
    frame: number;
}

const Viewer = (props: PublicProps) => {
    const [currFrame, setFrame] = useState(data);

    return (
        <div>
            <OpenSeaDragonViewer image={data.slides[0]} />
        </div>
    );
};

export default Viewer;