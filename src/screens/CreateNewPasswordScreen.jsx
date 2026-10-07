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

const CreateNewPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetPassword = () => {
    if (!password || !confirmPassword) {
      Alert.alert('Required', 'Please fill in both fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }
    // TODO: call reset-password API here
    navigation.navigate('SignInScreen');
  };

  return (
    <AuthScreen top={30}>
      <Title>Create New Password</Title>
      <Subtitle style={styles.subtitle}>
        Your new password must be different from the previous one for security reasons.
      </Subtitle>

      {/* Figma y 185 and 251 */}
      <AuthInput
        style={{ marginTop: 32 }}
        icon={ICONS.lock}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secure={!showPassword}
        showSecure={showPassword}
        onToggleSecure={() => setShowPassword((s) => !s)}
      />
      <AuthInput
        style={{ marginTop: 10 }}
        icon={ICONS.lock}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secure={!showConfirm}
        showSecure={showConfirm}
        onToggleSecure={() => setShowConfirm((s) => !s)}
      />

      <View style={{ flex: 1, minHeight: 24 }} />

      <PrimaryButton label="Reset Password" onPress={handleResetPassword} />
      <TextButton label="Back" style={{ marginTop: 8, marginBottom: 32 }} onPress={() => navigation.goBack()} />
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  subtitle: { marginTop: 10, width: 340 },
});

export default CreateNewPasswordScreen;
