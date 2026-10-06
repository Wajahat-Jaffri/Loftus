import React from 'react';
import { View } from 'react-native';
import { FREQUENCIES } from '../../../constants/listingData';
import { MoneyField, DateField, SelectField } from '../ListingControls';

const SaleDetailsStep = ({ type, form, onChange }) => {
  const isRent = type === 'Rent';
  return (
    <View>
      <MoneyField
        label={isRent ? 'Rent' : 'Price'}
        value={form.price}
        onChangeText={(v) => onChange('price', v)}
      />
      <MoneyField
        label="HOA Fee"
        value={form.hoaFee}
        onChangeText={(v) => onChange('hoaFee', v)}
      />
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
        placeholder="Select.."
        value={form.hoaFrequency}
        options={FREQUENCIES}
        onSelect={(v) => onChange('hoaFrequency', v)}
      />
      <SelectField
        label="Condo Fee Frequency"
        placeholder="Select.."
        value={form.condoFrequency}
        options={FREQUENCIES}
        onSelect={(v) => onChange('condoFrequency', v)}
      />
    </View>
  );
};

export default SaleDetailsStep;