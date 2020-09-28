import React from 'react';

import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';

export interface PublicProps {
  color: 'default' | 'inherit' | 'primary' | 'secondary' | undefined;
  component?: any;
  size: 'small' | 'medium' | 'large';
  startIcon?: any; // icon on button
  text: string;
  to: string; // where button redirects to
  variant: 'text' | 'outlined' | 'contained' | undefined;
  onClick?: () => void; // if want to do something with button click
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({ button: { margin: theme.spacing(1) } })
);

/**
 * The custom Button component that will be used throughout Gigaviewer's UI
 * @param props
 */
const UIButton = (props: PublicProps) => {
  const classes = useStyles();

  const { variant, color, component, text, to, size, startIcon } = props;
  return (
    <Button
      variant={props.variant}
      color={color}
      className={classes.button}
      component={component}
      to={to}
      size={size}
      startIcon={startIcon}
    >
      {text}
    </Button>
  );
};

export default UIButton;
