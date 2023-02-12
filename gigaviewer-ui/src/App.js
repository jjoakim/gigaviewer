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
                {/*Render image*/}
                <Route
                    path="/viewer/:teamId/:projectId/:captureId/:frameId"
                    children={<RenderViewer/>}
                />
                {/*Render a single Project*/}
                <Route
                    path="/team/:teamId/:projectId"
                    children={<RenderProjectBrowser/>}
                />
                {/*Render a single Team*/}
                <Route
                    path="/team/:teamId"
                    children={<RenderTeamBrowser/>}
                />
            </Switch>
        </div>
    );
};


function RenderBrowser(){
    return (
        <div>
            <Grid gridData={data}/>
        </div>
    );
}

function RenderTeamBrowser(){
    console.log("render team");
    const {teamId} = useParams();
    const teamMap = new Map(Object.entries(data.groups));
    return (
        <div>
            <Grid teamId={teamId} gridData={teamMap.get(teamId)}/>
        </div>
    );
}

function RenderProjectBrowser(){
    const {teamId, projectId} = useParams();
    const teamMap = new Map(Object.entries(data.groups));
    const teamData = teamMap.get(teamId);
    // @ts-ignore
    const projectMap = new Map(Object.entries(teamData.groups));
    return (
        <div>
            <Grid teamId={teamId} projectId={projectId} gridData={projectMap.get(projectId)}/>
        </div>
    );
}

function RenderViewer() {
    const {teamId, projectId, captureId, frameId} = useParams();

    const teamMap = new Map(Object.entries(data.groups));
    const teamData = teamMap.get(teamId);
    // @ts-ignore
    const projectMap = new Map(Object.entries(teamData.groups));
    const projectData = projectMap.get(projectId);
    // @ts-ignore
    const captureMap = new Map(Object.entries(projectData.groups));
    const captureData = captureMap.get(captureId);

    // @ts-ignore
    const imageSources = captureData.sources;
    const frameNumber = parseInt(frameId);
    // @ts-ignore
    const title = captureData.title;
    // @ts-ignore
    const height = captureData.hasOwnProperty("height") ? captureData.height : 0;
    return (
        <Viewer imageSources={imageSources} title={title} height={height} idx={frameNumber}/>
    );
}

export default App;
