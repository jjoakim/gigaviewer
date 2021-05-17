import React from 'react';

import {Home, Viewer} from './pages';
import {TopNavbar} from './components/top-navbar';
import {Route, Switch, useParams} from 'react-router-dom';
import { ImageGrid as Grid } from 'components/grid-view';


import './App.css';

import data from 'components/image-viewer/imageMetadata.json';


const App = () => {
    return (
        <div className="App">
            <TopNavbar/>
            <Switch>
                {/*Home Page*/}
                <Route
                    exact path="/"
                    children={<RenderBrowser/>}/>
                {/*Folder Page*/}
                <Route
                    path="/folder/:folderId"
                    children={<RenderFolderBrowser/>}
                />
                {/*Render image from folder*/}
                <Route
                    path="/viewer/:folderId/:groupId/:frame"
                    children={<RenderViewerFolder/>}
                />
                {/*Render image not in a folder*/}
                <Route
                    path="/viewer/:groupId/:frame"
                    children={<RenderViewerSingle/>}
                />

            </Switch>
        </div>
    );
};


function RenderFolderBrowser(){
    const {folderId} = useParams();
    const folderMap = new Map(Object.entries(data.groups));
    return (
        <div>
            <Grid folderId={folderId} gridData={folderMap.get(folderId)}/>
        </div>
    );
}


function RenderBrowser(){
    return (
        <div>
            <Grid gridData={data}/>
        </div>
    );
}

// Rendering a viewer thats not in a folder
function RenderViewerSingle() {
    let groupMap = new Map(Object.entries(data.groups));
    let {groupId, frame} = useParams();
    // @ts-ignore
    const groupData = groupMap.get(groupId);
    return RenderViewer(groupData, frame);
}

// Code duplication to deal with folders....
function RenderViewerFolder() {
    const folderMap = new Map(Object.entries(data.groups));
    const {folderId, groupId, frame} = useParams();
    // @ts-ignore
    const groupMap = new Map(Object.entries(folderMap.get(folderId).groups));
    // @ts-ignore
    const groupData = groupMap.get(groupId);
    return RenderViewer(groupData, frame);
}

function RenderViewer(groupData: any, frame: number) {
    const imageSources = groupData.sources;
    // @ts-ignore
    const title = groupData.title;
    // @ts-ignore
    const height = groupData.hasOwnProperty("height") ? groupData.height : 0;
    return (
        <Viewer imageSources={imageSources} title={title} height={height} idx={frame}/>
    );
}

export default App;
