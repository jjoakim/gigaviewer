import React from 'react';

import { UIButton as Button } from 'components/ui-toolbox';
import { UPLOAD_BUTTON_PROPS } from './utils';

import { Link } from 'react-router-dom';
import { CloudUpload } from '@material-ui/icons';

const NavButton = () => {
  return (
    <Button
      component={Link}
      startIcon={<CloudUpload />}
      {...UPLOAD_BUTTON_PROPS}
    />
  );
};

export default NavButton;
