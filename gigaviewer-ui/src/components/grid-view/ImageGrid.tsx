import React, { useState} from 'react';

import { Redirect } from 'react-router-dom';

import { Box } from '@material-ui/core';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';


import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

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
  const [groupId, setGroupId] = useState('');
  const [folderId, setFolderId] = useState(props.folderId === undefined ? '' : props.folderId);
  const [frameNumber, setFrameNumber] = useState(0);
  const [redirect, setRedirect] = useState(false);

  console.log("FOLDER ID");
  console.log(props.folderId);

  function consoleIcon(e: any) {
    e.stopPropagation();
  }

  const renderGrid = (tile: any, fold_id: string) => {
    setFolderId(fold_id)
    setGridData(tile);
    setFrameNumber(0);
    setRedirect(true);
    console.log("Redirecting to render grid");
  }

  const renderViewer = (group_id: string) => {
    if (group_id !== '') {
      setGroupId(group_id);
      setRedirect(!redirect);
    } else {
      setGroupId('');
    }
  };



  // @ts-ignore
  return (
    <div className={classes.container}>
      <br />
      {redirect ? (
          ( folderId === '' ? (
              <Redirect push to={`/viewer/${groupId}/${frameNumber}`} />
              ) : (
                  groupId === '' ? (
                      <Redirect push to={`/folder/${folderId}`} />
                      ) : (
                      <Redirect push to={`/viewer/${folderId}/${groupId}/${frameNumber}`} />
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

              {Object.keys(gridData.groups).map((item, index) => (
                  // Doesn't have a folder property
                  (!gridData.groups[item].folder &&
                    <GridListTile
                      key={item}
                      style={{ height: 300, width: 300 }}

                      onClick={() => {
                        renderViewer(item);
                      }}
                    >
                      <img src={gridData.groups[item].thumbnailImg} alt={gridData.groups[item].title} />
                      <GridListTileBar
                        title={gridData.groups[item].title}
                        subtitle={<span> by: {gridData.groups[item].author}</span>}
                        actionIcon={
                          <IconButton
                            aria-label={`info about ${gridData.groups[item].title}`}
                            className={classes.icon}
                            onClick={consoleIcon}
                          >
                            <InfoIcon />
                          </IconButton>
                        }
                      />
                    </GridListTile>) || (
                      gridData.groups[item].folder &&
                      <GridListTile
                          key={item}
                          style={{ height: 300, width: 300 }}
                          onClick={() => {
                            renderGrid(gridData.groups[item], item);
                          }}
                          // onClick={<Redirect to={`/viewer/${folderId}/${groupId}/${frameNumber}`}}
                      >
                        <img src={gridData.groups[item].thumbnailImg} alt={gridData.groups[item].title} />
                        <GridListTileBar
                            title={gridData.groups[item].title}
                            subtitle={<span> by: {gridData.groups[item].author}</span>}
                            actionIcon={
                              <IconButton
                                  aria-label={`info about ${gridData.groups[item].title}`}
                                  className={classes.icon}
                                  onClick={consoleIcon}
                              >
                                <InfoIcon />
                              </IconButton>
                            }
                        />
                      </GridListTile>
                  )
              ))}
            </GridList>
          </Box>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
