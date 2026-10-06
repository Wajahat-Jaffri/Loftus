import React from 'react';
import { View } from 'react-native';
import { US_STATES } from '../../../constants/rentData';
import { SelectField } from '../ListingControls';
import { TextField, DobField } from '../RentControls';

const IdentityStep = ({ identity, onChange }) => (
  <View>
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
      label="Last Name"
      value={identity.lastName}
      onChangeText={(v) => onChange('lastName', v)}
    />
    <DobField
      label="Date of Birth"
      value={identity.dob}
      onChangeText={(v) => onChange('dob', v)}
    />
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
      placeholder="Select..."
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
  </View>
);

export default IdentityStep;