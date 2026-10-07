import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ICONS } from '../assets';

/* Figma: 375 x 812 frame. All values below are taken from the Figma nodes. */

export const C = {
  primary: '#FF6C40',
  title: '#252525',
  body: '#515151',
  body2: '#505050',
  placeholder: '#AFAFAF',
  inputBorder: 'rgba(192,192,192,0.4)',
  socialBorder: '#AEAEAE',
  icon: '#A3A3A3',
  divider: '#C8C8C8',
  dividerText: '#565656',
  footer: '#464646',
};

export const F = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semi: 'Poppins-SemiBold',
};

/**
 * Screen wrapper. `top` = (Figma y of first element) - 44 (Figma's status bar).
 */
export const AuthScreen = ({ children, top = 30 }) => (
  <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
    <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.scroll, { paddingTop: top }]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {children}
    </ScrollView>
  </SafeAreaView>
);

export const Title = ({ children, style }) => <Text style={[styles.title, style]}>{children}</Text>;

export const Subtitle = ({ children, style }) => (
  <Text style={[styles.subtitle, style]}>{children}</Text>
);

export const CloseX = ({ onPress }) => (
  <TouchableOpacity
    style={styles.closeBox}
    onPress={onPress}
    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
  >
    <View style={[styles.closeBar, { transform: [{ rotate: '45deg' }] }]} />
    <View style={[styles.closeBar, { transform: [{ rotate: '-45deg' }] }]} />
  </TouchableOpacity>
);

export const AuthInput = ({ icon, secure, showSecure, onToggleSecure, style, ...props }) => (
  <View style={[styles.input, style]}>
    <Image source={icon} style={styles.inputIcon} resizeMode="contain" />
    <TextInput
      style={styles.inputText}
      placeholderTextColor={C.placeholder}
      secureTextEntry={secure}
      underlineColorAndroid="transparent"
      {...props}
    />
    {!!onToggleSecure && (
      <TouchableOpacity
        onPress={onToggleSecure}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image
          source={ICONS.eyeOff}
          style={[styles.eye, showSecure && { tintColor: C.primary }]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    )}
  </View>
);

export const PrimaryButton = ({ label, onPress, style }) => (
  <TouchableOpacity activeOpacity={0.85} style={[styles.btn, styles.btnFilled, style]} onPress={onPress}>
    <Text style={[styles.btnText, { color: '#FFFFFF' }]}>{label}</Text>
  </TouchableOpacity>
);

export const OutlineButton = ({ label, onPress, style }) => (
  <TouchableOpacity activeOpacity={0.85} style={[styles.btn, styles.btnOutline, style]} onPress={onPress}>
    <Text style={[styles.btnText, { color: C.primary }]}>{label}</Text>
  </TouchableOpacity>
);

export const TextButton = ({ label, onPress, style }) => (
  <TouchableOpacity activeOpacity={0.7} style={[styles.btn, style]} onPress={onPress}>
    <Text style={[styles.btnText, { color: C.primary }]}>{label}</Text>
  </TouchableOpacity>
);

export const SocialButton = ({ icon, iconSize = 24, label, onPress, style }) => (
  <TouchableOpacity activeOpacity={0.85} style={[styles.btn, styles.social, style]} onPress={onPress}>
    <Image source={icon} style={{ width: iconSize, height: iconSize, marginRight: 8 }} resizeMode="contain" />
    <Text style={styles.socialText}>{label}</Text>
  </TouchableOpacity>
);

export const OrDivider = ({ style }) => (
  <View style={[styles.dividerRow, style]}>
    <View style={styles.dividerLine} />
    <Text style={styles.dividerText}>Or Continue with</Text>
    <View style={styles.dividerLine} />
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flexGrow: 1, paddingHorizontal: 15 },

  title: { fontFamily: F.semi, fontSize: 24, lineHeight: 27, color: C.title },
  subtitle: { fontFamily: F.regular, fontSize: 14, lineHeight: 21, color: C.body },

  closeBox: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  closeBar: { position: 'absolute', width: 19, height: 1.5, borderRadius: 1, backgroundColor: C.title },

  input: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: C.inputBorder,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: { width: 20, height: 20, tintColor: C.icon, marginRight: 8 },
  inputText: {
    flex: 1,
    fontFamily: F.regular,
    fontSize: 12,
    color: C.title,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  eye: { width: 20, height: 20, tintColor: C.icon },

  btn: { height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  btnFilled: { backgroundColor: C.primary },
  btnOutline: { borderWidth: 1, borderColor: C.primary, backgroundColor: '#FFFFFF' },
  btnText: { fontFamily: F.medium, fontSize: 18, includeFontPadding: false },

  social: { flexDirection: 'row', borderWidth: 1, borderColor: C.socialBorder, backgroundColor: '#FFFFFF' },
  socialText: { fontFamily: F.medium, fontSize: 14, color: '#000000', includeFontPadding: false },

  dividerRow: { height: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  dividerLine: { width: 51.5, height: 1, backgroundColor: C.divider },
  dividerText: { fontFamily: F.regular, fontSize: 12, color: C.dividerText, marginHorizontal: 10 },
});
