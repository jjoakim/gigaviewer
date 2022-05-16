import React from 'react';

import { Viewer } from './pages';
import { TopNavbar } from './components/top-navbar';
import { Route, Switch, useParams } from 'react-router-dom';
import { ImageGrid as Grid } from 'components/grid-view';

import './App.css';

import data from 'components/image-viewer/imageMetadata.json';

const App = () => {
  return (
    <div className="App">
      <TopNavbar />
      <Switch>
        {/*Home Page*/}
        <Route exact path="/" children={<RenderBrowser />} />
        {/*Render image*/}
        <Route
          path="/viewer/:teamId/:projectId/:captureId/:frameId"
          children={<RenderViewer />}
        />
        {/*Render a single Project*/}
        <Route
          path="/team/:teamId/:projectId"
          children={<RenderProjectBrowser />}
        />
        {/*Render a single Team*/}
        <Route path="/team/:teamId" children={<RenderTeamBrowser />} />
      </Switch>
    </div>
  );
};

function RenderBrowser() {
  return (
    <div>
      <Grid gridData={data} />
    </div>
  );
}

function RenderTeamBrowser() {
  console.log('render team');
  const { teamId } = useParams();
  const teamMap = new Map(Object.entries(data.groups));
  return (
    <div>
      <Grid teamId={teamId} gridData={teamMap.get(teamId)} />
    </div>
  );
}

function RenderProjectBrowser() {
  const { teamId, projectId } = useParams();
  const teamMap = new Map(Object.entries(data.groups));
  const teamData = teamMap.get(teamId);
  // @ts-ignore
  const projectMap = new Map(Object.entries(teamData.groups));
  return (
    <div>
      <Grid
        teamId={teamId}
        projectId={projectId}
        gridData={projectMap.get(projectId)}
      />
    </div>
  );
}

function RenderViewer() {
  const { teamId, projectId, captureId, frameId } = useParams();
  const teamMap = new Map(Object.entries(data.groups));
  const teamData = teamMap.get(teamId);
  const projectMap = new Map(Object.entries(teamData.groups));
  const projectData = projectMap.get(projectId);
  const captureMap = new Map(Object.entries(projectData.groups));
  const captureData = captureMap.get(captureId);
  const windowHash = window.location.hash;
  let zoom = null;
  let xPosition = null;
  let yPosition = null;
  if (windowHash) {
    const hashParams = windowHash.substring(1).split('&');
    try {
      zoom = hashParams[0].split('=')[1];
      xPosition = hashParams[1].split('=')[1];
      yPosition = hashParams[2].split('=')[1];
    } catch (error) {
      console.log(error);
    }
  }
  console.log({ windowHash, zoom, xPosition, yPosition, frameId });
  const imageSources = captureData.sources;
  const frameNumber = parseInt(frameId);
  const title = captureData.title;
  const height = captureData.hasOwnProperty('height') ? captureData.height : 0;
  return (
    <Viewer
      imageSources={imageSources}
      title={title}
      height={height}
      initialFrame={frameNumber}
      zoom={zoom}
      xPosition={xPosition}
      yPosition={yPosition}
    />
  );
}

export default App;
