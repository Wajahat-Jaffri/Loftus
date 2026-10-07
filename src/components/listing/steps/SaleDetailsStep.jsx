import React from 'react';
import { View } from 'react-native';
import { FREQUENCIES } from '../../../constants/listingData';
import { Stack, MoneyField, DateField, SelectField } from '../ListingControls';

/* Figma: first field 20px under the stepper, 16px between fields */
const SaleDetailsStep = ({ type, form, onChange }) => {
  const isRent = type === 'Rent';
  return (
    <View style={{ marginTop: 20 }}>
      <Stack gap={16}>
        <MoneyField
          label={isRent ? 'Rent' : 'Price'}
          value={form.price}
          onChangeText={(v) => onChange('price', v)}
        />
        <MoneyField label="HOA Fee" value={form.hoaFee} onChangeText={(v) => onChange('hoaFee', v)} />
        <MoneyField
          label="Condo Fee"
          value={form.condoFee}
          onChangeText={(v) => onChange('condoFee', v)}
        />
        <DateField
          label={isRent ? 'Available From' : 'Offer Deadline'}
          value={form.offerDeadline}
          onChangeText={(v) => onChange('offerDeadline', v)}
        />
        <SelectField
          label="HOA Fee Frequency"
          value={form.hoaFrequency}
          options={FREQUENCIES}
          onSelect={(v) => onChange('hoaFrequency', v)}
        />
        <SelectField
          label="Condo Fee Frequency"
          value={form.condoFrequency}
          options={FREQUENCIES}
          onSelect={(v) => onChange('condoFrequency', v)}
        />
      </Stack>
    </View>
  );
};

export default SaleDetailsStep;
