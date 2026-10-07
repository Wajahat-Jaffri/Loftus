import React from 'react';
import { View } from 'react-native';
import { US_STATES } from '../../../constants/rentData';
import { Stack, SelectField } from '../ListingControls';
import { TextField, DobField } from '../RentControls';

/* Figma: fields are 343 wide (1px inside the page margin). Name block 8px apart, the rest 10px. */
const IdentityStep = ({ identity, onChange }) => (
  <View style={{ marginTop: 32, marginHorizontal: 1 }}>
    <Stack gap={10}>
      <Stack gap={8}>
        <TextField
          label="First Name"
          value={identity.firstName}
          onChangeText={(v) => onChange('firstName', v)}
        />
        <TextField
          label="Middle Name"
          value={identity.middleName}
          onChangeText={(v) => onChange('middleName', v)}
        />
        <TextField
          label="Last name"
          value={identity.lastName}
          onChangeText={(v) => onChange('lastName', v)}
        />
        <DobField
          label="Date of birth"
          value={identity.dob}
          onChangeText={(v) => onChange('dob', v)}
        />
      </Stack>
      <TextField
        label="Address Line 1"
        value={identity.address1}
        onChangeText={(v) => onChange('address1', v)}
      />
      <TextField
        label="Address Line 2"
        value={identity.address2}
        onChangeText={(v) => onChange('address2', v)}
      />
      <TextField label="City" value={identity.city} onChangeText={(v) => onChange('city', v)} />
      <SelectField
        label="State"
        title="Select state"
        value={identity.state}
        options={US_STATES}
        onSelect={(v) => onChange('state', v)}
      />
      <TextField
        label="Zipcode"
        value={identity.zip}
        keyboardType="number-pad"
        maxLength={5}
        onChangeText={(v) => onChange('zip', v.replace(/\D/g, ''))}
      />
    </Stack>
  </View>
);

export default IdentityStep;
