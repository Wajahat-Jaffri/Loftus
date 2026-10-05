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

const CreateNewPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = () => {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        console.log('Password reset successfully');
        // Password update API success ke baad SignIn screen par bhej dein
        navigation?.navigate('SignIn');
      } else {
        console.log('Passwords do not match');
      }
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
              <Text style={styles.title}>Create New Password</Text>
              <Text style={styles.subtitle}>
                Your new password must be different from the previous one for security reasons.
              </Text>
            </View>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <Image source={ICONS.lock} style={styles.fieldIcon} resizeMode="contain" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={ICONS.eyeOff}
                  style={[styles.eyeIcon, showPassword && { tintColor: '#FF6C40' }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Image source={ICONS.lock} style={styles.fieldIcon} resizeMode="contain" />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Image
                  source={ICONS.eyeOff}
                  style={[styles.eyeIcon, showConfirmPassword && { tintColor: '#FF6C40' }]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

          </View>

          {/* Bottom Section */}
          <View style={styles.bottomContainer}>
            {/* Reset Password Button */}
            <TouchableOpacity
              style={styles.resetButton}
              activeOpacity={0.8}
              onPress={handleResetPassword}
            >
              <Text style={styles.resetButtonText}>Reset Password</Text>
            </TouchableOpacity>

            {/* Back Button */}
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
    marginBottom: 16,
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
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: '#A0A0A0',
  },
  bottomContainer: {
    width: '100%',
    paddingBottom:20,
  },
  resetButton: {
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
  resetButtonText: {
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

export default CreateNewPasswordScreen;