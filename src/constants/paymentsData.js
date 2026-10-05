const base = [
  { title: 'Woodland Apartment', balance: 600 },
  { title: 'Main Apartment', balance: 600 },
  { title: "King's Landing", balance: 600 },
];

const make = (status, offset) =>
  base.map((b, i) => ({
    id: `lease-${offset + i}`,
    title: b.title,
    address: '1012 Ocean avenue, New York, USA',
    balance: b.balance,
    dueDate: '03/06/2025',
    status,
    tenants: 3,
  }));

export const LEASES = [...make('Active', 1), ...make('Expired', 4)];

export const SERVICES = [
  { id: 's1', title: 'Service Request #7', amount: '$76.40', date: 'December 26, 2024' },
  { id: 's2', title: 'Service Request #17', amount: '$76.40', date: 'December 18, 2024' },
  { id: 's3', title: 'Screening', amount: '$76.40', discount: '-$3.67', date: 'November 26, 2024' },
];

// type: 'simple' | 'paidBy' | 'adjusted'
export const PAYMENT_HISTORY = [
  { id: 'h1', type: 'simple', label: 'RC 1', amount: '$10' },
  { id: 'h2', type: 'simple', label: 'Rent', amount: '$120' },
  { id: 'h3', type: 'paidBy', payer: 'George Phillipe', amount: '$76.40', fee: '$3.67' },
  { id: 'h4', type: 'adjusted', payer: 'George Phillipe', amount: '$76.40', discount: '-$3.67' },
];

export const SAVED_CARDS = ['************4242', '************1881'];
export const SAVED_BANKS = ['************6789'];
