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
} from 'react-native';
import { ICONS } from '../assets';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

 const handleSendResetLink = () => {
  if (email.trim()) {
    // CheckMail screen par email params ke sath navigate hoga
    navigation?.navigate('CheckMail', { email: email.trim() });
  } else {
    // Agar email empty ho to yahan alert ya error state handle karein
    alert('Please enter your email address');
  }
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
              <Text style={styles.title}>Forgot Your Password?</Text>
              <Text style={styles.subtitle}>
                Don’t worry! Enter your email below, and we’ll send you instructions to reset your password.
              </Text>
            </View>

            {/* Email Address Input */}
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

          </View>

          {/* Bottom Buttons Section */}
          <View style={styles.bottomContainer}>
            {/* Send Reset Link Button */}
            <TouchableOpacity
              
              style={styles.sendButton}
              activeOpacity={0.8}
              onPress={handleSendResetLink}
            >
              <Text  style={styles.sendButtonText}>Send Reset Link</Text>
            </TouchableOpacity>

            {/* Back Link */}
            <TouchableOpacity
              style={styles.backContainer}
              activeOpacity={0.7}
              onPress={() => navigation?.goBack()}
            >
              <Text style={styles.backText}>Back</Text>
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
  bottomContainer: {
    width: '100%',
    paddingBottom:20,
  },
  sendButton: {
    backgroundColor: '#FF6C40',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#FF6C40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backContainer: {
    alignItems: 'center',
  },
  backText: {
    color: '#FF6C40',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen;