import React from 'react';
import { View } from 'react-native';
import { Stack, DateField, MoneyField, SuffixField } from '../ListingControls';
import { CheckboxField } from '../RentControls';

/* Figma: fields 20px under the stepper (16 apart), "Entire Home" checkbox 20px under Deposit */
const RentDetailsStep = ({ form, onChange }) => (
  <View style={{ marginTop: 20 }}>
    <Stack gap={16}>
      <DateField
        label="Available Date"
        value={form.availableDate}
        onChangeText={(v) => onChange('availableDate', v)}
      />
      <DateField
        label="Offer Deadline"
        value={form.offerDeadline}
        onChangeText={(v) => onChange('offerDeadline', v)}
      />
      <SuffixField
        label="Lease Term"
        value={form.leaseTerm}
        suffix="mth"
        onChangeText={(t) => onChange('leaseTerm', t.replace(/[^0-9]/g, '').slice(0, 3))}
      />
      <MoneyField label="Rent" value={form.rent} onChangeText={(v) => onChange('rent', v)} />
      <MoneyField
        label="Deposit"
        value={form.deposit}
        onChangeText={(v) => onChange('deposit', v)}
      />
    </Stack>
    <View style={{ marginTop: 20 }}>
      <CheckboxField
        label="Entire Home"
        checked={form.entireHome}
        onChange={(v) => onChange('entireHome', v)}
      />
    </View>
  </View>
);

export default RentDetailsStep;
