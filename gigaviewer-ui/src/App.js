import React, {useState} from 'react';

import {Viewer} from './pages';
import {TopNavbar} from './components/top-navbar';
import {Route, Switch, useParams} from 'react-router-dom';
import { ImageGrid as Grid } from 'components/grid-view';
import {url} from "url.js"

import './App.css';

const data_path = url + "/imageMetadata.json"
let data = null;

const App = () => {
    const [is_data, setData] = useState();

    if ( ! is_data)
    {
      fetch(data_path).then( async (response) => {
        data = await response.json();
        setData(true);
      });
      return "Loading";
    }

    return (
        <div className="App">
            <TopNavbar/>
            <Switch>
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
                {/*Home Page*/}
                <Route
                    path="/"
                    children={<RenderBrowser/>}/>
            </Switch>
        </div>
    );
};


function RenderBrowser(){
    return (
        <div>
            <br/>
            <center>
            <h2>Multi-Gigapixel Video Viewing Platform</h2>
            <h3>Duke University Computational Optics Lab</h3>
            </center><br/>
            <Grid gridData={data}/>
            <br/>
            <center>
            <div class="widget">
            <p>
                Welcome to the <a href = "http://horstmeyer.pratt.duke.edu/">
                Computational Optics Lab's</a> gigapixel video viewing platform,
                through which we can present raw and final composite images captured
                by our suite of multi-camera array microscopes. Please refer to the
                following publications listed below for additional information about
                this collection of computational microscopes, as well as
                our <a href = "https://mcam.deepimaging.io/">project page</a>.
                Additional information about this technology can also be found
                at <a href = "https://ramonaoptics.com/">Ramona Optics</a>.
            </p>
            <br/><ul className='pub'>
                
                <Pub authers={"K. C. Zhou, M. Harfouche, C. L. Cooke, J. Park, P. C. Konda, "+
                              "L. Kreiss, K. Kim, J. Jönsson, T. Doman, P. Reamey, V. Saliu, "+
                              "C. B. Cook, M. Zheng, J. P. Bechtel, A. Begue, M. McCarroll, "+
                              "J. Bagwell, G. Horstmeyer, M. Bagnat and R. Horstmeyer"}
                     title="Parallelized computational 3D video microscopy of freely moving organisms at multiple gigapixels per second"
                     publisher="Accepted to Nature Photonics"
                     year={2023} />
                
                <Pub authers={"M. Harfouche, K. Kim, P. C. Konda, S. Sharma, E. E. Thomson, "+
                              "K. C. Zhou, C. Cooke, S. Xu, X. Yang, X. Yao, V. Pathak, "+
                              "R. Appel. C. Cooke, J. Doman, G. Horstmeyer, J. Park, P. Reamey, "+
                              "V. Saliu, E. Naumann and R. Horstmeyer"}
                     title="Multi-scale gigapixel microscopy using a multi-camera array microscope"
                     publisher="Accepted to Optica"
                     year={2023} />
                
                <Pub authers="X. Yang, M. Harfouche, K. C. Zhou, L. Kreiss, S. Xu, K. Kim, R. Horstmeyer"
                     title="Multimodal imaging using a cascaded microscope design"
                     publisher="Accepted to Optics Letters"
                     year={2023} />
                
                <Pub authers={"E. E. Thomson, M. Harfouche, P. C Konda, C. Seitz, K. Kim, "+
                              "C. Cooke, S. Xu, R. Blazing, Y. Chen, W. S. Jacobs, S. Sharma, "+
                              "T. W. Dunn, J. Park, R. Horstmeyer*  and E. A. Naumann*"}
                     title="Gigapixel imaging with a novel multi-camera array microscope"
                     publisher="eLife 11, e74988"
                     year={2022}
                     other="(*co-corresponding authors)" />
                
            </ul>
            </div>
            </center>
        </div>
    );
}

class Pub extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = { is_visible: false };
  }

  render() {
    const title = this.props.title;
    const authers = this.props.authers;
    const year = this.props.year;
    const publisher = this.props.publisher;
    const other = this.props.other;

    const set = () => this.setState( { is_visible: true } );

    if ( this.state.is_visible )
      return <li>{authers}, <b><q>{title}</q></b>, {publisher} ({year}) {other}</li>;
    else
      return <li onClick={set}><b><q>{title}</q></b>, {publisher} ({year})</li>;
  }
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
