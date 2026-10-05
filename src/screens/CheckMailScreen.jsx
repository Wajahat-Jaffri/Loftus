import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
} from 'react-native';
import { ICONS } from '../assets';

const CheckMailScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState(route?.params?.email || '');

  const handleOpenEmailApp = () => {
    // Mobile email client open karne ke liye link
    Linking.openURL('mailto:');
  };

 const handleContinueToReset = () => {
  // CreateNewPassword screen par navigate karega
  navigation?.navigate('CreateNewPassword');
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.content}>
            
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Check Your Mail</Text>
              <Text style={styles.subtitle}>
                We have sent a password recovery instruction to your email.
              </Text>
            </View>

            {/* Email Address Display Input */}
            <View style={styles.inputContainer}>
              <Image source={ICONS.mail} style={styles.fieldIcon} resizeMode="contain" />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Subtext with link */}
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>
                Did not receive the email?{"\n"}Check your spam folder, or try
              </Text>
              <TouchableOpacity
                onPress={() => navigation?.navigate('ForgotPassword')}
                activeOpacity={0.7}
              >
                <Text style={styles.linkText}>another email address</Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Bottom Action Section */}
          <View style={styles.bottomContainer}>
            {/* Open Email App Button */}
            <TouchableOpacity
              style={styles.openEmailButton}
              activeOpacity={0.8}
              onPress={handleOpenEmailApp}
            >
              <Text style={styles.openEmailText}>Open Email App</Text>
            </TouchableOpacity>

            {/* Skip Option */}
            <TouchableOpacity
              style={styles.skipContainer}
              activeOpacity={0.7}
              onPress={handleContinueToReset}
            >
              <Text style={styles.skipText}>Skip, I’ll Confirm later</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 32,
    marginTop:40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    lineHeight: 32,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 56,
    backgroundColor: '#FFFFFF',
    marginBottom: 24,
  },
  fieldIcon: {
    width: 20,
    height: 20,
    tintColor: '#A0A0A0',
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#7C7C7C',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#FF6C40',
    fontWeight: '500',
    marginTop: 4,
  },
  bottomContainer: {
    width: '100%',
    paddingBottom:20,
  },
  openEmailButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#FF6C40',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  openEmailText: {
    color: '#FF6C40',
    fontSize: 16,
    fontWeight: '600',
  },
  skipContainer: {
    alignItems: 'center',
  },
  skipText: {
    color: '#1A1A1A',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CheckMailScreen;