import { IMAGES, ICONS } from '../assets';

export const CATEGORIES = ['All', 'Sale', 'Rent'];
export const PROPERTY_TYPES = ['All', 'Apartment', 'House', 'Condo', 'Townhouse'];

const PEOPLE = {
  abida: { name: 'Abida Rehman', avatar: IMAGES.avatarAbida },
  george: { name: 'George Phillie', avatar: IMAGES.avatarGeorge },
  piro: { name: 'Piro Polo', avatar: IMAGES.avatarPiro },
  geroge: { name: 'Geroge Phillie', avatar: IMAGES.avatarGeroge },
};

const listing = (type, price, extra = {}) => ({
  type,
  price,
  title: 'Kings Landing',
  beds: '3 Bed',
  baths: '2 Baths',
  sqft: '2,336 sqft',
  address: '8502 Preston Rd. Inglewood, ME 98380',
  timeAgo: '6 months ago',
  images: [IMAGES.house1, IMAGES.house2, IMAGES.house3],
  ...extra,
});

// Figma: "Offers - Tenants" (Sale, Edit / Delete)
const SALE_HERO = listing('Sale', '$824', {
  sqft: '2,135 sqft',
  timeAgo: '5 months ago',
  images: [IMAGES.house2, IMAGES.house1, IMAGES.house3],
});

const SCREENING = {
  kind: 'screening',
  person: PEOPLE.geroge,
  status: 'Complete',
  checks: [
    { label: 'Criminal', icon: ICONS.handcuffs, status: 'Expired' },
    { label: 'Credit', icon: ICONS.creditCheck, status: 'Expired' },
    { label: 'Eviction Proceedings', icon: ICONS.gavel, status: 'Expired' },
  ],
};

// Sale offer with 4 offering items + buyer info (Edit / Delete screen)
const SALE_BLOCKS_FULL = [
  { kind: 'party', title: "Landlord's Information", person: PEOPLE.piro, chat: true },
  {
    kind: 'offering',
    rows: [
      [
        { label: 'Price', value: '$100,000' },
        { label: 'Down Payment', value: '$200' },
      ],
      [
        { label: 'Earnest Money', value: '$200' },
        { label: 'Closing Date', value: '12/31/2025' },
      ],
    ],
  },
  { kind: 'party', title: "Buyer's Information", person: PEOPLE.piro, chat: false },
];

// Sale offer with only Price (Decline / Accept screen)
const SALE_BLOCKS_SIMPLE = [
  { kind: 'party', title: "Landlord's Information", person: PEOPLE.george, chat: false },
  { kind: 'offering', rows: [[{ label: 'Price', value: '$100,000' }]] },
  { kind: 'party', title: 'Buyer Information', person: PEOPLE.piro, chat: true },
];

const RENT_BLOCKS = [
  { kind: 'party', title: "Landlord's Information", person: PEOPLE.abida, chat: true },
  {
    kind: 'offering',
    rows: [
      [
        { label: 'Price', value: '$600' },
        { label: 'Term', value: '11 mth' },
        { label: 'Move - in Date', value: '5/3/2025' },
      ],
    ],
  },
];

const ACCEPTED_FIELDS = [
  { label: 'Offering', value: '$600' },
  { label: 'Term', value: '11 mth' },
  { label: 'Move - in Date', value: '03/06/2025' },
];

/*
 * role:    'landlord' = offers I received  |  'tenant' = offers I sent
 * status:  'pending' | 'accepted' | 'declined'
 * actions: 'editDelete' | 'declineAccept' | undefined (no buttons)
 * cardFields: 3 fields on the list card (4th slot is always the tenants avatars)
 */
export const OFFERS = [
  {
    id: 'o1',
    offerNo: 'offer_000015',
    role: 'landlord',
    status: 'pending',
    actions: 'editDelete',
    type: 'Sale',
    propertyType: 'Apartment',
    title: 'Woodland Apartment',
    address: '1012 Ocean avenue, New York, USA',
    thumb: IMAGES.house1,
    cardFields: [
      { label: 'Offering', value: '$600,000' },
      { label: 'Down Payment', value: '$0' },
      { label: 'Response Deadline', value: '03/06/2025' },
    ],
    tenants: [IMAGES.avatarTenant1, IMAGES.avatarTenant2],
    listing: SALE_HERO,
    blocks: SALE_BLOCKS_FULL,
  },
  {
    id: 'o6',
    offerNo: 'offer_000016',
    role: 'landlord',
    status: 'accepted',
    type: 'Sale',
    propertyType: 'Apartment',
    title: 'Woodland Apartment',
    address: '1012 Ocean avenue, New York, USA',
    thumb: IMAGES.house1,
    cardFields: ACCEPTED_FIELDS,
    tenants: [IMAGES.avatarTenant1, IMAGES.avatarTenant2],
    listing: SALE_HERO,
    blocks: SALE_BLOCKS_FULL,
  },
  {
    id: 'o7',
    offerNo: 'offer_000014',
    role: 'landlord',
    status: 'pending',
    actions: 'declineAccept',
    type: 'Sale',
    propertyType: 'House',
    title: 'Lakeview Villa',
    address: '90 Lake Road, Chicago, USA',
    thumb: IMAGES.house2,
    cardFields: [
      { label: 'Offering', value: '$100,000' },
      { label: 'Down Payment', value: '$0' },
      { label: 'Response Deadline', value: '04/10/2025' },
    ],
    tenants: [IMAGES.avatarTenant1],
    listing: listing('Sale', '$102,000'),
    blocks: SALE_BLOCKS_SIMPLE,
  },
  {
    id: 'o2',
    offerNo: 'offer_000012',
    role: 'landlord',
    status: 'pending',
    actions: 'declineAccept',
    type: 'Rent',
    propertyType: 'House',
    title: 'Maple Street House',
    address: '218 Maple Street, Brooklyn, USA',
    thumb: IMAGES.house2,
    cardFields: [
      { label: 'Offering', value: '$600' },
      { label: 'Term', value: '11 mth' },
      { label: 'Move - in Date', value: '03/06/2025' },
    ],
    tenants: [IMAGES.avatarTenant1, IMAGES.avatarTenant2],
    listing: listing('Rent', '$824'),
    blocks: [RENT_BLOCKS[0], RENT_BLOCKS[1], SCREENING],
  },
  {
    id: 'o3',
    offerNo: 'offer_000018',
    role: 'tenant',
    status: 'pending',
    actions: 'editDelete',
    type: 'Sale',
    propertyType: 'Condo',
    title: 'Harbor View Condo',
    address: '77 Harbor Blvd, Miami, USA',
    thumb: IMAGES.house3,
    cardFields: [
      { label: 'Offering', value: '$100,000' },
      { label: 'Down Payment', value: '$200' },
      { label: 'Response Deadline', value: '12/31/2025' },
    ],
    tenants: [IMAGES.avatarTenant2],
    listing: SALE_HERO,
    blocks: SALE_BLOCKS_FULL,
  },
  {
    id: 'o4',
    offerNo: 'offer_000020',
    role: 'tenant',
    status: 'accepted',
    type: 'Sale',
    propertyType: 'Apartment',
    title: 'Woodland Apartment',
    address: '1012 Ocean avenue, New York, USA',
    thumb: IMAGES.house1,
    cardFields: ACCEPTED_FIELDS,
    tenants: [IMAGES.avatarTenant1, IMAGES.avatarTenant2],
    listing: SALE_HERO,
    blocks: SALE_BLOCKS_FULL,
  },
  {
    id: 'o5',
    offerNo: 'offer_000009',
    role: 'landlord',
    status: 'declined',
    type: 'Sale',
    propertyType: 'Apartment',
    title: 'Sunset Apartment',
    address: '45 Sunset Drive, Los Angeles, USA',
    thumb: IMAGES.house3,
    cardFields: [
      { label: 'Offering', value: '$450,000' },
      { label: 'Down Payment', value: '$10,000' },
      { label: 'Response Deadline', value: '01/15/2025' },
    ],
    tenants: [IMAGES.avatarTenant2],
    listing: listing('Sale', '$102,000'),
    blocks: SALE_BLOCKS_SIMPLE,
  },
];