import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ICONS } from '../assets';
import {
  AuthScreen,
  AuthInput,
  Title,
  Subtitle,
  CloseX,
  PrimaryButton,
  SocialButton,
  OrDivider,
  C,
  F,
} from '../components/AuthControls';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignUp = () => {
    // TODO: call sign-up API here
    navigation.navigate('VerificationScreen');
  };

  return (
    <AuthScreen top={11}>
      {/* Header (Figma y 55) */}
      <View style={styles.titleRow}>
        <Title style={styles.title}>Sign up</Title>
        <View style={styles.closeWrap}>
          <CloseX onPress={() => navigation.goBack()} />
        </View>
      </View>
      <Subtitle style={{ color: C.body2, width: 278 }}>
        Enter the complete details to start using loftus
      </Subtitle>

      {/* Name row (Figma y 156, two inputs 170.5 wide, gap 4) */}
      <View style={styles.nameRow}>
        <AuthInput
          style={styles.half}
          icon={ICONS.user}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <AuthInput
          style={[styles.half, { marginLeft: 4 }]}
          icon={ICONS.user}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <AuthInput
        style={{ marginTop: 10 }}
        icon={ICONS.envelope}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <AuthInput
        style={{ marginTop: 10 }}
        icon={ICONS.phone}
        placeholder="Phone No"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <AuthInput
        style={{ marginTop: 10 }}
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

      <PrimaryButton label="Sign Up" style={{ marginTop: 20 }} onPress={handleSignUp} />

      <OrDivider style={{ marginTop: 24 }} />

      <SocialButton
        style={{ marginTop: 16 }}
        icon={ICONS.google}
        iconSize={18}
        label="Sign up with Google"
      />
      <SocialButton style={{ marginTop: 12 }} icon={ICONS.apple} label="Sign in with Apple" />

      <View style={{ flex: 1, minHeight: 21 }} />

      <Text style={styles.footer}>
        <Text style={{ color: C.footer }}>Already have an account? </Text>
        <Text style={styles.footerLink} onPress={() => navigation.navigate('SignInScreen')}>
          Sign in
        </Text>
      </Text>
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  titleRow: { height: 39, flexDirection: 'row', justifyContent: 'space-between' },
  title: { lineHeight: 39 },
  closeWrap: { marginTop: 8 },
  nameRow: { flexDirection: 'row', marginTop: 20 },
  half: { flex: 1 },
  footer: {
    alignSelf: 'center',
    height: 39,
    marginBottom: 18,
    fontFamily: F.regular,
    fontSize: 12,
    lineHeight: 39,
    textAlign: 'center',
  },
  footerLink: { fontFamily: F.medium, color: C.primary },
});

export default SignUpScreen;
