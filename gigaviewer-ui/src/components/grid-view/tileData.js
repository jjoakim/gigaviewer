import lebronImage from './lebron.jpg';
import carusoImage from './caruso.jpg';
import kobeImage from './kobe.jpg';
import monaImage from './monalisa_small.jpg';
import collard1 from './Collard_Green_1_small.jpg';
import collard2 from './Collard_Green_2.png';

const tileData = [
  {
    img: lebronImage,
    title: 'Lebron James',
    author: 'fernando',
    idx: 0,
    cols: 2,
    featured: true,
  },
  {
    img: carusoImage,
    title: 'Alex Caruso',
    author: 'zapata',
    idx: 1,
  },
  {
    img: kobeImage,
    title: 'Kobe Bryant',
    author: '24',
    idx: 2,
  },
  {
    img: monaImage,
    title: 'Mona Lisa',
    author: 'Leonardo',
    groupId: 'MonaLisa',
    idx: 0,
  },
  {
    img: collard1,
    title: 'Aperio - Collard Green',
    author: 'Horstmeyer Lab',
    groupId: 'Aperio',
    idx: 0,
  },
  {
    img: collard2,
    title: 'Aperio - Collard Green frame 2',
    author: 'Horstmeyer Lab',
    groupId: 'Aperio',
    idx: 1,
  },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
  // {
  //   img: lebronImage,
  //   title: 'Lebron James',
  //   author: 'fernando',
  // },
  // {
  //   img: carusoImage,
  //   title: 'Alex Caruso',
  //   author: 'zapata',
  // },
  // {
  //   img: kobeImage,
  //   title: 'Kobe Bryant',
  //   author: '24',
  // },
];

export default tileData;
