import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ICONS } from '../assets';
import {
  AuthScreen,
  AuthInput,
  Title,
  Subtitle,
  PrimaryButton,
  TextButton,
} from '../components/AuthControls';

const ChangePhoneNumberScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleConfirm = () => {
    if (phoneNumber.trim()) {
      // TODO: update phone number / resend OTP
      navigation.navigate('VerificationScreen');
    }
  };

  return (
    <AuthScreen top={30}>
      <Title>Change Phone Number</Title>
      <Subtitle style={styles.subtitle}>
        Please enter your new phone number. A onetime password will be sent for verification.
      </Subtitle>

      <AuthInput
        style={{ marginTop: 24 }}
        icon={ICONS.phone}
        placeholder="Phone No"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <View style={{ flex: 1, minHeight: 24 }} />

      <PrimaryButton label="Confirm" onPress={handleConfirm} />
      <TextButton label="Back" style={{ marginTop: 8, marginBottom: 32 }} onPress={() => navigation.goBack()} />
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  subtitle: { marginTop: 10 },
});

export default ChangePhoneNumberScreen;
