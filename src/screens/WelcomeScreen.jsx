import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { IMAGES } from '../assets';
import { PrimaryButton } from '../components/AuthControls';
import OnboardingDots from '../components/OnboardingDots';

const WelcomeScreen = ({ navigation }) => (
  <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
    <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

    {/* Figma: logo 33x64, title 24/39, subtitle 18/24 (width 264) */}
    <View style={styles.center}>
      <Image source={IMAGES.logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Welcome to Loftus</Text>
      <Text style={styles.subtitle}>{'A Click Away From Finding\nYour Dream Home'}</Text>
    </View>

    {/* Figma y 666: dot 1 of 5 is active */}
    <OnboardingDots count={5} active={0} style={styles.dots} />

    <View style={styles.bottom}>
      <PrimaryButton label="Get Started" onPress={() => navigation.navigate('OnboardingScreen')} />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 118, // 157 minus the 39px the dots now take (keeps the logo where it was)
  },
  logo: { width: 33, height: 64, tintColor: '#FF6C40' },
  title: {
    marginTop: 25,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    lineHeight: 39,
    color: '#252525',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 5,
    width: 264,
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    lineHeight: 24,
    color: '#505050',
    textAlign: 'center',
  },
  dots: { marginBottom: 30 },
  bottom: { paddingHorizontal: 15, paddingBottom: 51 },
});

export default WelcomeScreen;
