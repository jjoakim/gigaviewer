import React, {useState} from 'react';

import {Redirect} from 'react-router-dom';

import {Box} from '@material-ui/core';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';


import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

import url from "url.js"

const useStyles = makeStyles((theme) => ({
    container: {
        marginLeft: '1vw',
        marginRight: '1vw',
    },
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        width: 'auto',
        height: 'auto',
        justifyContent: 'space-evenly',
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
}));

/**
 * Component that renders grid of image thumbnails for a collection of images
 */
const ImageGrid = (props: any) => {
    const classes = useStyles();
    const [gridData, setGridData] = useState(props.gridData);
    const [teamId, setTeamId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [captureId, setCaptureId] = useState('');
    const [frameNumber, setFrameNumber] = useState(0);
    const [redirect, setRedirect] = useState(false);

    function getPath(key: string)
    {
      const item = gridData.groups[key];
      const pathname = window.location.pathname;
      let path = `${pathname}/${key}/${item.thumbnailImg}`;

      if (path.startsWith("/team/"))
        path = url + path.replace("/team/", "/auto/");
      else
        path = url + "/auto" + path;
      
      return path;
    }

    function consoleIcon(e: any) {
        e.stopPropagation();
    }

    const renderGrid = (tile: any, tile_id: string) => {
        const tile_kind: string = tile.kind
        //kind is one of [team, project, or capture]
        if (tile_kind === 'team') {
            setTeamId(tile_id)
            setProjectId('')
            console.log("team id", tile_id)
            console.log('project id', "N/A");
        } else if (tile_kind === 'project') {
            // grab team id from the URL (first param)
            const path = window.location.pathname.split('/');
            const tid = path[path.length-1];
            setTeamId(tid)
            setProjectId(tile_id)
            console.log("team id", tid)
            console.log('project id', tile_id);
        } else if (tile_kind === 'capture') {
            const path = window.location.pathname.split('/');
            const tid = path[path.length-2];
            const pid = path[path.length-1];
            setTeamId(tid);
            setProjectId(pid);
            setCaptureId(tile_id);
            console.log("team id", tid)
            console.log('project id', pid);
            console.log('capture id', tile_id);
        }
        setGridData(tile);
        setFrameNumber(0);
        setRedirect(true);
        console.log("Redirecting to render grid");
    }

    // @ts-ignore
    return (
        <div className={classes.container}>
            <br/>
            {redirect ? (
                // RENDERING THE IMAGE VIEWER
                captureId !== '' ? (
                    <Redirect push to={`/viewer/${teamId}/${projectId}/${captureId}/${frameNumber}`}/>
                ) : (
                    // RENDER A SINGLE PROJECT
                    projectId !== '' ? (
                        <Redirect push to={`/team/${teamId}/${projectId}`}/>
                    ) : (
                        // RENDER A SINGLE TEAM
                        teamId !== '' ? (
                            <Redirect push to={`/team/${teamId}`}/>
                        ) : (
                            // RENDER THE HOME PAGE
                            <Redirect push to={`/`}/>
                        )
                    )
                )
            ) : (
                <div className={classes.root}>
                    <Box paddingBottom="1.5%">
                        <GridList
                            cellHeight={200}
                            className={classes.gridList}
                            // cols={4}
                            spacing={10}
                        >
                            {/*RENDERING A GRID*/}
                            {Object.keys(gridData.groups).map((item, index) => (
                                // Doesn't have a folder property
                                <GridListTile
                                    key={item}
                                    style={{height: 300, width: 300}}
                                    onClick={() => {
                                        renderGrid(gridData.groups[item], item);
                                    }}
                                >
                                    <img src={getPath(item)} alt={gridData.groups[item].title}/>
                                    <GridListTileBar
                                        title={gridData.groups[item].title}

                                    />
                                </GridListTile>
                            ))}
                        </GridList>
                    </Box>
                </div>
            )}
        </div>
    );
};

export default ImageGrid;
