import React, { useState, useEffect } from 'react';

import { Redirect } from 'react-router-dom';

import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';

import tileData from './tileData';

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
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'foo',
 *     author: 'author',
 *     groupId: 'fooImgs',
 *     idx: '2'
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */

/**
 * Component that renders grid of image thumbnails for a collection of images
 */
const TitlebarGridList = () => {
  const classes = useStyles();
  const [width, setWidth] = useState(0);
  const [grpId, setGrpId] = useState('');
  const [frame, setFrame] = useState(0);
  const [redirect, setRedirect] = useState(false);

  function resizeWindow() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    resizeWindow();
    window.addEventListener('resize', resizeWindow);
    console.log(window.innerWidth);
    return () => window.removeEventListener('resize', resizeWindow);
  }, []);

  function consoleIcon(e: any) {
    e.stopPropagation();
    console.log('ICON');
  }

  const renderRedirect = (groupId: string, index: number) => {
    setGrpId(groupId);
    setFrame(index);
    if (groupId !== '' && index >= 0) {
      setRedirect(!redirect);
    } else {
      setGrpId('');
      setFrame(0);
    }
  }

  return (
    <div className={classes.container}>
      <br />
      {(redirect)
        ? <Redirect to={`/viewer/${grpId}/${frame}`}/>
        : <div className={classes.root}>
          <GridList
            cellHeight={200}
            className={classes.gridList}
            cols={Math.round(width / 300)}
            spacing={6}
          >
            {tileData.map((tile) => (
              <GridListTile
                key={tile.groupId}
                onClick={() => {
                  renderRedirect(tile.groupId, tile.idx);
                }}
              >
                <img src={tile.img} alt={tile.title} />
                <GridListTileBar
                  title={tile.title}
                  subtitle={<span> by: {tile.author}</span>}
                  actionIcon={
                    <IconButton
                      aria-label={`info about ${tile.title}`}
                      className={classes.icon}
                      onClick={consoleIcon}
                    >
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </GridListTile>
            ))}
          </GridList>
        </div>
      }
    </div>
  );
}


export default TitlebarGridList;