import { IMAGES } from '../assets';

export const CATEGORIES = ['Sale', 'Apartments', 'Houses', 'Villas', 'Farm'];

export const PROPERTIES = [
  {
    id: '1',
    title: 'Kings Landing',
    beds: '3 Bed',
    baths: '2 Baths',
    sqft: '2,135 sqft',
    address: '8502 Preston Rd. Inglewood, Maine 98380',
    price: '$102,000',
    timeAgo: '5 months ago',
    images: [IMAGES.house1, IMAGES.house2, IMAGES.house3],
  },
  {
    id: '2',
    title: 'Modern Arch. Home',
    beds: '3 Bed',
    baths: '2 Baths',
    sqft: '2,135 sqft',
    address: '8502 Preston Rd. Inglewood, Maine 98380',
    price: '$102,000',
    timeAgo: '5 months ago',
    images: [IMAGES.house2, IMAGES.house1, IMAGES.house3],
  },
  {
    id: '3',
    title: 'Sweet Home Cottage',
    beds: '3 Bed',
    baths: '2 Baths',
    sqft: '2,135 sqft',
    address: '8502 Preston Rd. Inglewood, Maine 98380',
    price: '$102,000',
    timeAgo: '5 months ago',
    images: [IMAGES.house3, IMAGES.house2, IMAGES.house1],
  },
];