import React from 'react';
import { View } from 'react-native';
import { LISTING_FEE_PER_MONTH } from '../../../constants/listingData';
import { SuffixField, SummaryRows, formatMoney } from '../ListingControls';

/* Figma: field 36px under the stepper, fee rows 13px under the field, 8px apart */
const DurationStep = ({ months, onChange, fees }) => (
  <View style={{ marginTop: 36 }}>
    <SuffixField
      label="Expires in"
      value={months}
      suffix="mth"
      onChangeText={(t) => onChange(t.replace(/[^0-9]/g, '').slice(0, 3))}
    />

    <View style={{ marginTop: 13 }}>
      <SummaryRows
        gap={8}
        rows={[
          { label: 'Listing Fee', value: `$${LISTING_FEE_PER_MONTH}/Monthly` },
          { label: 'Total Listing Fee', value: formatMoney(fees.totalListingFee) },
          { label: 'Processing Fee', value: formatMoney(fees.processingFee) },
          { label: 'Total Due', value: formatMoney(fees.totalDue) },
        ]}
      />
    </View>
  </View>
);

export default DurationStep;
