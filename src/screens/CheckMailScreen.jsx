import React from 'react';
import { View, Text, Linking, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { ICONS } from '../assets';
import {
  AuthScreen,
  AuthInput,
  Title,
  Subtitle,
  OutlineButton,
  C,
  F,
} from '../components/AuthControls';

const CheckMailScreen = ({ navigation, route }) => {
  const email = route?.params?.email;

  const openMailApp = async () => {
    try {
      await Linking.openURL('mailto:');
    } catch (e) {
      Alert.alert('No email app', 'Could not open an email app on this device.');
    }
  };

  return (
    <AuthScreen top={30}>
      <Title>Check Your Mail</Title>
      <Subtitle style={styles.subtitle}>
        We have sent a password recovery instruction to your email.
      </Subtitle>

      {/* Read-only email field (Figma y 177) */}
      <AuthInput
        style={{ marginTop: 24 }}
        icon={ICONS.envelope}
        placeholder="Email Address"
        value={email || ''}
        editable={false}
      />

      {/* y 257 */}
      <View style={styles.notice}>
        <Text style={styles.noticeText}>Did not receive the email?</Text>
        <Text style={styles.noticeText}>Check your spam folder, or try</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
          <Text style={styles.noticeLink}>another email address</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, minHeight: 24 }} />

      <OutlineButton label="Open Email App" onPress={openMailApp} />
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.skip}
        onPress={() => navigation.navigate('SignInScreen')}
      >
        <Text style={styles.skipText}>Skip, I’ll Confirm later</Text>
      </TouchableOpacity>
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  subtitle: { marginTop: 10, width: 340 },
  notice: { marginTop: 24, width: 243, alignSelf: 'center', alignItems: 'center' },
  noticeText: { fontFamily: F.regular, fontSize: 14, lineHeight: 21, color: C.body2, textAlign: 'center' },
  noticeLink: { marginTop: 5, fontFamily: F.medium, fontSize: 14, lineHeight: 21, color: C.primary, textAlign: 'center' },
  skip: { marginTop: 22, marginBottom: 53, alignSelf: 'center', height: 21, justifyContent: 'center' },
  skipText: { fontFamily: F.medium, fontSize: 14, lineHeight: 21, color: C.body2 },
});

export default CheckMailScreen;
