import { PublicProps } from 'components/ui-toolbox/ui-button';

export const UPLOAD_BUTTON_PROPS: PublicProps = {
  color: 'default',
  size: 'medium',
  text: 'Upload',
  to: '/upload',
  variant: 'contained',
};

export const MenuItems = [
  {
    title: 'Home',
    url: '/',
    cName: 'nav-link',
  },
  {
    title: 'About',
    url: '/about',
    cName: 'nav-link',
  },
  {
    title: 'Login',
    url: '/login',
    cName: 'nav-link',
  },
  {
    title: 'Sign Up',
    url: '/signup',
    cName: 'nav-link',
  },
  {
    title: 'Upload',
    url: '/upload',
    cName: 'nav-link-mobile',
  },
];
