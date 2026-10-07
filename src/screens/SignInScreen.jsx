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

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // TODO: call sign-in API here
    navigation.replace('PropertyListingScreen');
  };

  return (
    <AuthScreen top={11}>
      {/* Header (Figma y 55) */}
      <View style={styles.titleRow}>
        <Title style={styles.title}>Let’s sign in</Title>
        <View style={styles.closeWrap}>
          <CloseX onPress={() => navigation.goBack()} />
        </View>
      </View>
      <Subtitle style={{ color: C.body2 }}>Please enter your login details</Subtitle>

      {/* Form (Figma y 135) */}
      <AuthInput
        style={{ marginTop: 20 }}
        icon={ICONS.envelope}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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

      <Text style={styles.forgot} onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        Forget Password?
      </Text>

      <PrimaryButton label="Sign In" style={{ marginTop: 20 }} onPress={handleSignIn} />

      <OrDivider style={{ marginTop: 32 }} />

      <SocialButton
        style={{ marginTop: 31 }}
        icon={ICONS.google}
        label="Sign in with Google"
      />
      <SocialButton style={{ marginTop: 12 }} icon={ICONS.apple} label="Sign in with Apple" />

      <View style={{ flex: 1, minHeight: 172 }} />

      <Text style={styles.footer}>
        <Text style={{ color: C.footer }}>Don’t have an account? </Text>
        <Text style={styles.footerLink} onPress={() => navigation.navigate('SignUpScreen')}>
          Sign up
        </Text>
      </Text>
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  titleRow: { height: 39, flexDirection: 'row', justifyContent: 'space-between' },
  title: { lineHeight: 39 },
  closeWrap: { marginTop: 8 },
  forgot: {
    alignSelf: 'flex-end',
    marginTop: 4,
    height: 28,
    paddingTop: 10,
    fontFamily: F.medium,
    fontSize: 12,
    lineHeight: 18,
    color: C.primary,
    textAlign: 'right',
  },
  footer: {
    alignSelf: 'center',
    height: 39,
    marginBottom: 31,
    fontFamily: F.regular,
    fontSize: 12,
    lineHeight: 39,
    textAlign: 'center',
  },
  footerLink: { fontFamily: F.medium, color: C.primary },
});

export default SignInScreen;
