import { IMAGES } from '../../assets';
import { isValidDate } from './ListingControls';

export const num = (v) => parseFloat(v) || 0;

/* After the last step: go back to the screen that opened the wizard and hand it the new listing. */
export const finishListing = (navigation, { type, title, price, months }) => {
  const days = (parseInt(months, 10) || 1) * 30;
  const newListing = {
    id: `l-${Date.now()}`,
    status: 'active',
    type,
    title: title || 'New Listing',
    beds: '3 Bed',
    baths: '2 Bath',
    sqft: '1,019 sqft',
    address: '8502 Preston Rd. Inglewood, ME 98380',
    price,
    timeAgo: 'Just now',
    expiresIn: `Expires in ${days} days`,
    images: [IMAGES.house1, IMAGES.house2, IMAGES.house3],
  };

  const routes = navigation.getState?.().routes || [];
  const prev = routes.length > 1 ? routes[routes.length - 2] : null;
  if (prev) {
    navigation.navigate({ name: prev.name, params: { newListing }, merge: true });
  } else {
    navigation.goBack();
  }
};

export { isValidDate };

/* ---------- open house helpers ---------- */
import { TIME_OPTIONS, LISTING_FEE_PER_MONTH, PROCESSING_FEE } from '../../constants/listingData';

export const blankOpenHouse = () => ({
  id: `oh-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
  date: '',
  start: '',
  end: '',
});

/* Open house is optional: untouched cards are ignored, half filled cards are an error. */
export const validateOpenHouses = (items) => {
  for (let i = 0; i < items.length; i += 1) {
    const { date, start, end } = items[i];
    if (!(date || start || end)) continue;
    if (!isValidDate(date)) return 'Please pick a date for the open house.';
    if (!start || !end) return 'Please select the start and end time.';
    if (TIME_OPTIONS.indexOf(end) <= TIME_OPTIONS.indexOf(start)) {
      return 'End time must be after the start time.';
    }
  }
  return null;
};

export const filledOpenHouses = (items) =>
  items.filter((o) => isValidDate(o.date) && o.start && o.end);

/* fees shown on the Duration step */
export const calcFees = (months) => {
  const m = parseInt(months, 10) || 0;
  const totalListingFee = m * LISTING_FEE_PER_MONTH;
  return {
    totalListingFee,
    processingFee: PROCESSING_FEE,
    totalDue: totalListingFee + PROCESSING_FEE,
  };
};
