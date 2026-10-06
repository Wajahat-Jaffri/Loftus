import React from 'react';
import { View } from 'react-native';
import { LISTING_FEE_PER_MONTH } from '../../../constants/listingData';
import { SuffixField, SummaryRows, formatMoney } from '../ListingControls';

const DurationStep = ({ months, onChange, fees }) => (
  <View>
    <SuffixField
      label="Expires in"
      value={months}
      suffix="mth"
      onChangeText={(t) => onChange(t.replace(/[^0-9]/g, '').slice(0, 3))}
    />

    <SummaryRows
      rows={[
        { label: 'Listing Fees', value: `$${LISTING_FEE_PER_MONTH}/Monthly` },
        { label: 'Total Listing Fee', value: formatMoney(fees.totalListingFee) },
        { label: 'Processing Fee', value: formatMoney(fees.processingFee) },
        { label: 'Total Due', value: formatMoney(fees.totalDue) },
      ]}
    />
  </View>
);

export default DurationStep;