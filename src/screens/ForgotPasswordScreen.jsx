import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { ICONS } from '../assets';
import {
  AuthScreen,
  AuthInput,
  Title,
  Subtitle,
  PrimaryButton,
  TextButton,
} from '../components/AuthControls';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSendResetLink = () => {
    if (email.trim()) {
      navigation.navigate('CheckMailScreen', { email: email.trim() });
    } else {
      Alert.alert('Email required', 'Please enter your email address');
    }
  };

  return (
    <AuthScreen top={30}>
      <Title>Forgot Your Password?</Title>
      <Subtitle style={styles.subtitle}>
        Don’t worry! Enter your email below, and we’ll send you instructions to reset your
        password.
      </Subtitle>

      <AuthInput
        style={{ marginTop: 24 }}
        icon={ICONS.envelope}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={{ flex: 1, minHeight: 24 }} />

      <PrimaryButton label="Send Reset Link" onPress={handleSendResetLink} />
      <TextButton label="Back" style={{ marginTop: 8, marginBottom: 32 }} onPress={() => navigation.goBack()} />
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  subtitle: { marginTop: 10 },
});

export default ForgotPasswordScreen;
