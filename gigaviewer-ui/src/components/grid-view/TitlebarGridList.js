// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import tileData from './tileData';

import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
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
 *     grpId: 'fooImgs'
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */

export default function TitlebarGridList() {
  const classes = useStyles();
  const [width, setWidth] = useState(0);
  const [grpId, setGrpId] = useState('');
  const [title, setTitle] = useState('');
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

  function consoleGrid(data) {
    console.log('GRID');
  }

  function consoleIcon(e) {
    e.stopPropagation();
    console.log('ICON');
  }

  const toggleRedirect = (title, grpId, index) => {
    setTitle(title);
    setGrpId(grpId);
    setFrame(index);
    setRedirect(!redirect);
  }

  return (
    <div>
      {(redirect) 

      ?
      <Redirect to={{
        pathname: '/viewer',
        state: { groupId: grpId, title: title, frame: frame },
      }} />

      :
      <div className={classes.root}>
        <GridList
          cellHeight={200}
          className={classes.gridList}
          cols={Math.round(width / 300)}
          spacing={6}
        >
          {tileData.map((tile) => (
            <GridListTile
              key={tile.img}
              onClick={() => {
                consoleGrid(tile.groupId);
                toggleRedirect(tile.title, tile.groupId, tile.idx);
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
