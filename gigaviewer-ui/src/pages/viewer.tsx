import React, { useState, useEffect } from 'react';

import OpenSeaDragonViewer from 'components/image-viewer';

interface PublicProps {
    imgSrc: string;
    frame: number;
}

const Viewer = (props: PublicProps) => {
    const [currFrame, setFrame] = useState('https://gigaviewer-files.s3.amazonaws.com/monalisa/monalisa_files/');

    return (
        <div>
            <OpenSeaDragonViewer image={'https://gigaviewer-files.s3.amazonaws.com/monalisa/monalisa_files/'} />
        </div>
    );
};

export default Viewer;