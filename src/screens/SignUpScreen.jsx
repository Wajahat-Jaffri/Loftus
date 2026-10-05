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
  ScrollView,
} from 'react-native';
import { ICONS } from '../assets';

const SignUpScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    navigation.navigate('Verification');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Main Content Area */}
          <View style={styles.topSection}>
            {/* Header Section */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Sign up</Text>
                <Text style={styles.subtitle}>
                  Enter the complete details to start{'\n'}using loftus
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation?.goBack()}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              {/* First Name & Last Name Row */}
              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfInput]}>
                  <Image source={ICONS.user} style={styles.fieldIcon} resizeMode="contain" />
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#A0A0A0"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>

                <View style={[styles.inputContainer, styles.halfInput]}>
                  <Image source={ICONS.user} style={styles.fieldIcon} resizeMode="contain" />
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#A0A0A0"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              {/* Email Input */}
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

              {/* Phone Number Input */}
              <View style={styles.inputContainer}>
                <Image source={ICONS.phone} style={styles.fieldIcon} resizeMode="contain" />
                <TextInput
                  style={styles.input}
                  placeholder="Phone No"
                  placeholderTextColor="#A0A0A0"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Password Input */}
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

              {/* Main Sign Up Button */}
              <TouchableOpacity
                style={styles.signUpButton}
                activeOpacity={0.8}
                onPress={handleSignUp}
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or Continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Sign Up Buttons */}
            <View style={styles.socialContainer}>
              {/* Google Button */}
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <Image source={ICONS.google} style={styles.socialIcon} resizeMode="contain" />
                <Text style={styles.socialButtonText}>Sign up with Google</Text>
              </TouchableOpacity>

              {/* Apple Button */}
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <Image source={ICONS.apple} style={styles.socialIcon} resizeMode="contain" />
                <Text style={styles.socialButtonText}>Sign in with Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Section */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('SignIn')}>
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 50,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '300',
  },
  formContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 30,
    paddingHorizontal: 18,
    height: 54,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  fieldIcon: {
    width: 20,
    height: 20,
    tintColor: '#A0A0A0',
    marginRight: 10,
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
  signUpButton: {
    backgroundColor: '#FF6C40',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#FF6C40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8E8',
  },
  dividerText: {
    marginHorizontal: 14,
    color: '#8C8C8C',
    fontSize: 13,
  },
  socialContainer: {
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 30,
    height: 54,
    backgroundColor: '#FFFFFF',
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  footerText: {
    color: '#7C7C7C',
    fontSize: 14,
  },
  signInText: {
    color: '#FF6C40',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignUpScreen;