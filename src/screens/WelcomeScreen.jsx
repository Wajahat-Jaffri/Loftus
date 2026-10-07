import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { IMAGES } from '../assets';
import { PrimaryButton } from '../components/AuthControls';

const WelcomeScreen = ({ navigation }) => (
  <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
    <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

    {/* Figma: logo 33x64, title 24/39, subtitle 18/24 (width 264) */}
    <View style={styles.center}>
      <Image source={IMAGES.logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Welcome to Loftus</Text>
      <Text style={styles.subtitle}>{'A Click Away From Finding\nYour Dream Home'}</Text>
    </View>

    <View style={styles.bottom}>
      <PrimaryButton label="Get Started" onPress={() => navigation.navigate('SignInScreen')} />
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 157, // group centre sits 56.5px above the screen centre in Figma
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
  bottom: { paddingHorizontal: 15, paddingBottom: 51 },
});

export default WelcomeScreen;
