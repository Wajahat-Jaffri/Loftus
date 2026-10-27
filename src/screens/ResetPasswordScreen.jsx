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
import Toast from '../components/Toast';

/**
 * Figma "Reset Your Password - Toast": same layout as Forgot Password,
 * with the green "Email sent" toast at the top (shown when the screen opens,
 * because the reset email has just been sent).
 */
const ResetPasswordScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState(route?.params?.email || '');
  const [toast, setToast] = useState(true);

  const handleReset = () => {
    if (!email.trim()) {
      Alert.alert('Email required', 'Please enter your email address');
      return;
    }
    // TODO: call the reset-password API here
    navigation.navigate('CheckMailScreen', { email: email.trim() });
  };

  return (
    <AuthScreen top={30}>
      <Title>Reset Your Password here!</Title>
      <Subtitle style={styles.subtitle}>
        Don’t worry! Enter your email below, and we’ll send you email to reset your password.
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

      <PrimaryButton label="Reset Password" onPress={handleReset} />
      <TextButton label="Back" style={{ marginTop: 8, marginBottom: 32 }} onPress={() => navigation.goBack()} />

      <Toast
        visible={toast}
        title="Email sent"
        message="Email has been sent to reset your password"
        onClose={() => setToast(false)}
      />
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  subtitle: { marginTop: 10 },
});

export default ResetPasswordScreen;
