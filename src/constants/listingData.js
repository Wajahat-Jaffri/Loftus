import { IMAGES } from '../assets';

export const MY_LISTINGS = [
  {
    id: 'l1',
    status: 'active',
    type: 'Sale',
    title: 'Kings Landing',
    beds: '3 Bed',
    baths: '2 Bath',
    sqft: '1,019 sqft',
    address: '8502 Preston Rd. Inglewood, ME 98380',
    price: '$102,000',
    timeAgo: '6 months ago',
    expiresIn: 'Expires in 28 days',
    images: [IMAGES.house1, IMAGES.house2, IMAGES.house3],
  },
  {
    id: 'l2',
    status: 'active',
    type: 'Rent',
    title: 'Modern Arch. Home',
    beds: '3 Bed',
    baths: '2 Bath',
    sqft: '1,019 sqft',
    address: '8502 Preston Rd. Inglewood, ME 98380',
    price: '$102,000',
    timeAgo: '6 months ago',
    expiresIn: 'Expires in 12 days',
    images: [IMAGES.house2, IMAGES.house3, IMAGES.house1],
  },
  {
    id: 'l3',
    status: 'expired',
    type: 'Sale',
    title: 'Sunset Villa',
    beds: '4 Bed',
    baths: '3 Bath',
    sqft: '2,100 sqft',
    address: '120 Ocean Ave. Santa Monica, CA 90401',
    price: '$320,000',
    timeAgo: '1 year ago',
    expiresIn: 'Expired',
    images: [IMAGES.house3, IMAGES.house1],
  },
];

// Properties the user owns (shown in "Create listing for" dropdown)
export const USER_PROPERTIES = [
  { id: 'p1', label: 'Kings Landing' },
  { id: 'p2', label: 'Modern Arch. Home' },
  { id: 'p3', label: 'Sunset Villa' },
];

export const FREQUENCIES = ['Weekly', 'Biweekly', 'Monthly', 'Quarterly', 'Yearly'];

// 12:00 AM, 12:30 AM ... 11:30 PM
export const TIME_OPTIONS = (() => {
  const list = [];
  for (let h = 0; h < 24; h += 1) {
    for (let m = 0; m < 60; m += 30) {
      const suffix = h < 12 ? 'AM' : 'PM';
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      list.push(`${String(hour12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`);
    }
  }
  return list;
})();

// Figma shows "$8/Monthly" on the Duration step
export const LISTING_FEE_PER_MONTH = 8;
export const PROCESSING_FEE = 0;
