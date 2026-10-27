import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { IMAGES, ICONS } from '../assets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import Toast from '../components/Toast';

const NAV_H = 74; // bottom navbar height
const ORANGE = '#FF6C40';
const LINK_BLUE = '#5C83E8';
const F = { regular: 'Poppins-Regular', medium: 'Poppins-Medium', semi: 'Poppins-SemiBold' };

/**
 * Two popups on one transparent route (opens over the listing screen):
 *  - "verify": Figma "Welcome Modal"  (345 x 372, logo badge on top)
 *  - "change": Figma "Change Email"   (345 x 204)
 * Route params: { email }.
 */
const EmailVerifyScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cardW = width - 30;

  const [mode, setMode] = useState('verify'); // 'verify' | 'change'
  const email = route?.params?.email || 'jerryhelfer231@gmail.com';
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [toast, setToast] = useState(null); // { title, message }

  const close = () => navigation.goBack();

  const handleResend = () => {
    // TODO: call the resend-verification API here
    setToast({ title: 'Email sent', message: `Verification email has been sent to ${email}` });
  };

  const handleChange = () => {
    if (!password.trim()) {
      setInvalid(true);
      return;
    }
    // TODO: call the change-email API here
    setPassword('');
    setInvalid(false);
    setMode('verify');
    setToast({ title: 'Email sent', message: `A verification link has been sent to ${email}` });
  };

  const backToVerify = () => {
    setPassword('');
    setInvalid(false);
    setMode('verify');
  };

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* tap outside to close */}
      <Pressable style={StyleSheet.absoluteFill} onPress={close} />

      {/* popup layer: centred on the whole screen (the navbar is drawn over its bottom part) */}
      <View
        style={[
          styles.layer,
          { marginBottom: -(NAV_H + insets.bottom) },
          mode === 'change' && styles.layerChange,
        ]}
        pointerEvents="box-none"
      >
        {mode === 'verify' ? (
          <View style={[styles.verifyWrap, { width: cardW }]} pointerEvents="box-none">
            {/* modal 345 x 372, 38px under the wrapper top */}
            <View style={[styles.card, styles.verifyCard]}>
              <Text style={[styles.text, { height: 46 }]}>
                {'You are almost there! We send an email to\n'}
                <Text style={styles.link}>{email}</Text>
              </Text>
              <Text style={[styles.text, styles.left, styles.gap16, { height: 92 }]}>
                {'Just click on the link in that email to\ncomplete your sign-up. If you don’t see it,\nyou may need to '}
                <Text style={styles.bold}>check your spam</Text>
                {' folder.'}
              </Text>
              <Text style={[styles.text, styles.gap16, { height: 23 }]}>
                Still can’t find the email?
              </Text>
              <Text style={[styles.text, styles.gap16, { height: 23 }]}>
                {'Need Help? '}
                <Text style={styles.link}>Contact US</Text>
              </Text>

              <View style={[styles.btnRow, { marginTop: 32 }]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.btn, styles.btnOutline]}
                  onPress={() => setMode('change')}
                >
                  <Text style={[styles.btnText, { color: ORANGE }]}>Change Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.btn, styles.btnFilled, { marginLeft: 10 }]}
                  onPress={handleResend}
                >
                  <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Resend Email</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 75 x 75 badge with the logo, centred on the card's top edge */}
            <View style={styles.badge}>
              <Image source={IMAGES.logo} style={styles.logo} resizeMode="contain" />
            </View>
          </View>
        ) : (
          <View style={[styles.card, styles.changeCard, { width: cardW }]}>
            <Text style={[styles.text, styles.left, { height: 46, marginHorizontal: 0 }]}>
              {'Please enter your new email address.\nA link will be sent for verification.'}
            </Text>

            <View style={[styles.field, invalid && styles.fieldInvalid]}>
              <Image source={ICONS.lock} style={styles.fieldIcon} resizeMode="contain" />
              <TextInput
                style={styles.fieldInput}
                placeholder="Password"
                placeholderTextColor="#A5A5A5"
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (invalid) setInvalid(false);
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={ICONS.eyeOff}
                  style={[styles.fieldIcon, { marginRight: 0 }, showPassword && { tintColor: ORANGE }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.btnRow, { marginTop: 24 }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.btn, styles.btnOutline]}
                onPress={backToVerify}
              >
                <Text style={[styles.btnText, { color: ORANGE }]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.btn, styles.btnFilled, { marginLeft: 10 }]}
                onPress={handleChange}
              >
                <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Figma: white "Property listing" page with only the navbar behind the popup */}
      <BottomNav active="Explore" navigation={navigation} />

      <Toast
        visible={!!toast}
        title={toast?.title}
        message={toast?.message}
        onClose={() => setToast(null)}
        style={{ top: 46 }}
      />
    </View>
  );
};

const SHADOW = {
  elevation: 10,
  shadowColor: '#000000',
  shadowOpacity: 0.19,
  shadowRadius: 25,
  shadowOffset: { width: 0, height: 0 },
};

const styles = StyleSheet.create({
  // Figma: plain white page behind the popup (no dimming), navbar at the bottom
  root: { flex: 1, backgroundColor: '#FFFFFF' },

  // Welcome modal wrapper: 345 x 410, centred on the screen
  layer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  layerChange: { paddingBottom: 120 }, // Change Email popup sits 60px above the middle
  verifyWrap: { height: 410 },
  verifyCard: { position: 'absolute', top: 38, left: 0, right: 0, height: 372, paddingTop: 48 },

  // Change email modal: 345 x 204, centred 60px above the middle
  changeCard: { height: 204, paddingTop: 16 },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 16,
    ...SHADOW,
  },

  text: {
    fontFamily: F.regular,
    fontSize: 14,
    lineHeight: 23,
    letterSpacing: 0.14,
    color: '#404040',
    textAlign: 'center',
    includeFontPadding: false,
    marginHorizontal: -3.5, // Figma text boxes are 304 wide inside the 297 content area
  },
  left: { textAlign: 'left' },
  link: { color: LINK_BLUE },
  bold: { fontFamily: F.semi },
  gap16: { marginTop: 16 },

  badge: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 75,
    height: 75,
    borderRadius: 40,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 24.47, height: 48, tintColor: ORANGE },

  btnRow: { height: 44, flexDirection: 'row' },
  btn: { flex: 1, height: 44, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { borderWidth: 1, borderColor: ORANGE, backgroundColor: '#FFFFFF' },
  btnFilled: { backgroundColor: ORANGE },
  btnText: { fontFamily: F.medium, fontSize: 14, lineHeight: 21, includeFontPadding: false },

  // 297 x 50 field (8px under the text)
  field: {
    marginTop: 8,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15, // Figma 16 minus the border
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldInvalid: { borderColor: '#E53935' },
  fieldIcon: { width: 20, height: 20, tintColor: '#A5A5A5', marginRight: 8 },
  fieldInput: {
    flex: 1,
    padding: 0,
    fontFamily: F.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#252525',
    includeFontPadding: false,
  },
});

export default EmailVerifyScreen;
