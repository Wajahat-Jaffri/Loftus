import { IMAGES } from '../assets';

/* Roles of the logged-in user. Both => Leases shows the Landlord/Tenant toggle (Figma frame 2).
   One role only => no toggle, tabs fill the row (Figma frame 1). Replace with the real user roles. */
export const USER_ROLES = ['landlord', 'tenant'];

export const LEASE_TABS = ['Active', 'Declined', 'Pending', 'Expired'];

/* property (as shown in the "Select Property" dropdown) -> address + accepted offer tenants */
export const LEASE_PROPERTIES = [
  {
    id: 'p1',
    name: 'Kings Landing',
    address: '8502 Preston Rd. Inglewood, Maine 98380',
    // tenants whose offer was accepted => they can be added to the lease
    offerTenants: [{ id: 't1', name: 'George Phillipe', email: 'george@example.com' }],
  },
  {
    id: 'p2',
    name: 'Woodland Apartment',
    address: '1012 Ocean avenue, New York, USA',
    offerTenants: [],
  },
  {
    id: 'p3',
    name: 'Home Sweet Home',
    address: '1012 Ocean avenue, New York, USA',
    offerTenants: [],
  },
];

const PEOPLE = {
  george: { name: 'George Phillipe', avatar: IMAGES.avatarGeorge },
  lesir: { name: 'Lesir Yorel', avatar: IMAGES.avatarAbida },
};

const TERMS = {
  template: 'Standard',
  startDate: '12/31/2025',
  endDate: '12/31/2025',
  monthToMonth: 'Yes',
  rentAmount: '$1,000',
  securityDeposit: '$200',
  gracePeriod: '5 Days',
  lateFee: '$50',
  nsfFee: '$100',
  flooring: 'Hardwood',
};

const base = (id, status, role, extra = {}) => ({
  id,
  status, // 'active' | 'declined' | 'pending' | 'expired'
  role, // 'landlord' | 'tenant'
  leaseNo: 'x4m35323',
  decidedOn: 'Nov 18, 2024',
  title: 'Woodland Apartment',
  propertyType: 'Apartment',
  address: '1012 Ocean avenue, New York, USA',
  thumb: IMAGES.house1,
  price: '$600,000',
  expires: 'NA-mtm',
  term: '1 mth',
  tenants: [IMAGES.avatarGeorge, IMAGES.avatarAbida],
  // details screen
  detailTitle: 'Kings Landing',
  detailAddress: '8502 Preston Rd. Inglewood, Maine 98380',
  beds: '3 Bed',
  baths: '2 Baths',
  sqft: '2,135 sqft',
  heroImage: IMAGES.house1,
  terms: TERMS,
  people: [PEOPLE.george, PEOPLE.lesir],
  recurring: [
    { name: 'RC 1', amount: '$10' },
    { name: 'RC 2', amount: '$20' },
  ],
  oneTime: [
    { name: 'OC 1', amount: '$10' },
    { name: 'OC 2', amount: '$20' },
  ],
  ...extra,
});

export const LEASES = [];
['landlord', 'tenant'].forEach((role) => {
  ['active', 'declined', 'pending', 'expired'].forEach((status) => {
    const k = `${role}-${status}`;
    LEASES.push(base(`${k}-1`, status, role));
    LEASES.push(
      base(`${k}-2`, status, role, {
        title: 'Home Sweet Home',
        propertyType: 'House',
        thumb: IMAGES.house2,
        tenants: [IMAGES.avatarGeorge, IMAGES.avatarPiro],
      })
    );
    LEASES.push(
      base(`${k}-3`, status, role, {
        title: 'Home Sweet Home',
        propertyType: 'House',
        thumb: IMAGES.house3,
        tenants: [IMAGES.avatarAbida, IMAGES.avatarPiro],
      })
    );
  });
});

export const findLease = (id) => LEASES.find((l) => l.id === id);

/* called by the Create Lease screen */
export const addLease = ({ address, tenants, recurring, oneTime, terms }) => {
  const lease = base(`new-${Date.now()}`, 'pending', 'landlord', {
    detailAddress: address,
    people: tenants.map((t) => ({ name: t.name, avatar: IMAGES.avatarGeorge })),
    recurring: recurring.map((c) => ({ name: c.name, amount: `$${c.amount}` })),
    oneTime: oneTime.map((c) => ({ name: c.name, amount: `$${c.amount}` })),
    terms: { ...TERMS, ...terms },
  });
  LEASES.unshift(lease);
  return lease;
};
