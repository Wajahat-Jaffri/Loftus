import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const VerificationScreen = ({ navigation }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0); // 0 hone par "Resend Code" button dikhega
  const [isTimerActive, setIsTimerActive] = useState(false);
  const inputRefs = useRef([]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // Seconds ko mm:ss format mein convert karne ka helper
  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const formattedMins = mins < 10 ? `0${mins}` : mins;
    const formattedSecs = secs < 10 ? `0${secs}` : secs;
    return `${formattedMins}:${formattedSecs}`;
  };

  const handleResendCode = () => {
    setTimer(166);
    setIsTimerActive(true);
  };

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otp = code.join('');
    console.log('Entered OTP:', otp);
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
            {/* Header Text */}
            <View style={styles.headerContainer}>
              <Text style={styles.title}>
                A verification has been sent{'\n'}to your phone number..
              </Text>
              <Text style={styles.subtitle}>
                Please enter the code below to verify your{'\n'}phone number
              </Text>
            </View>

            {/* OTP Input Boxes */}
            <View style={styles.otpContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref)}
                  style={[styles.otpBox, digit !== '' && styles.otpBoxActive]}
                  value={digit}
                  onChangeText={text => handleCodeChange(text, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Dynamic Resend Code / Timer State */}
            <View style={styles.timerContainer}>
              {isTimerActive && timer > 0 ? (
                <Text style={styles.timerText}>
                  Resent Code In:{' '}
                  <Text style={styles.timerHighlight}>{formatTime(timer)}</Text>
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendCode}
                  activeOpacity={0.7}
                >
                  <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={styles.verifyButton}
              activeOpacity={0.8}
              onPress={handleVerify}
            >
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>

            {/* Change Phone Number Link */}
            <TouchableOpacity
              style={styles.changePhoneContainer}
              activeOpacity={0.7}
              onPress={() => navigation?.navigate('ChangePhoneNumber')}
            >
              <Text style={styles.changePhoneText}>Change Phone Number</Text>
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
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  headerContainer: {
    marginTop: 70,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#7C7C7C',
    lineHeight: 18,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  otpBox: {
    width: 46,
    height: 50,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
  },
  otpBoxActive: {
    borderColor: '#FF6C40',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 13,
    color: '#7C7C7C',
  },
  timerHighlight: {
    color: '#FF6C40',
    fontWeight: '600',
  },
  resendText: {
    color: '#FF6C40',
    fontSize: 13,
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: '#FF6C40',
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#FF6C40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginTop:60,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  changePhoneContainer: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  changePhoneText: {
    color: '#FF6C40',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default VerificationScreen;