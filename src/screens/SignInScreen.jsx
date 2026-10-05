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

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Sign in logic
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
          {/* Main Upper Content */}
          <View style={styles.topSection}>
            {/* Header Section */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Let’s sign in</Text>
                <Text style={styles.subtitle}>Please enter your login details</Text>
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

              {/* Forget Password */}
              <TouchableOpacity
                onPress={() => navigation?.navigate('ForgotPassword')}
                style={styles.forgotContainer}
              >
                <Text style={styles.forgotText}>Forget Password?</Text>
              </TouchableOpacity>

              {/* Main Sign In Button */}
              <TouchableOpacity
                style={styles.signInButton}
                activeOpacity={0.8}
                onPress={handleSignIn}
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or Continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Sign In Buttons */}
            <View style={styles.socialContainer}>
              {/* Google Button */}
              <TouchableOpacity style={styles.socialButton} activeOpacity={0.8}>
                <Image source={ICONS.google} style={styles.socialIcon} resizeMode="contain" />
                <Text style={styles.socialButtonText}>Sign in with Google</Text>
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
            <Text style={styles.footerText}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => navigation?.navigate('SignUp')}>
              <Text style={styles.signUpText}>Sign up</Text>
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
    marginBottom: 32,
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
    marginBottom: 28,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 56,
    marginBottom: 16,
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
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: '#A0A0A0',
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 24,
  },
  forgotText: {
    color: '#FF6C40',
    fontSize: 13,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#FF6C40',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#FF6C40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
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
    gap: 14,
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
    marginTop: 20,
    paddingBottom:20,
  },
  footerText: {
    color: '#7C7C7C',
    fontSize: 14,
  },
  signUpText: {
    color: '#FF6C40',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SignInScreen;