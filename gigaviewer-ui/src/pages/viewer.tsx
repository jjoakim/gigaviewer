import React, { useState, useEffect } from 'react';

import OpenSeaDragonViewer from 'components/image-viewer';

interface PublicProps {
    imgSrc: string;
    frame: number;
}

const Viewer = (props: PublicProps) => {
    const [currFrame, setFrame] = useState(props.imgSrc);

    return (
        <div>

        </div>
    );
};

export default Viewer;