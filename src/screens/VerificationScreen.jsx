import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthScreen, Title, Subtitle, PrimaryButton, C, F } from '../components/AuthControls';

const VerificationScreen = ({ navigation }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0); // 0 => "Resend Code"
  const [isTimerActive, setIsTimerActive] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`;
  };

  const handleResendCode = () => {
    setTimer(166);
    setIsTimerActive(true);
  };

  const handleCodeChange = (text, index) => {
    const next = [...code];
    next[index] = text;
    setCode(next);
    if (text && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    console.log('Entered OTP:', code.join(''));
    // TODO: verify OTP with API
    navigation.replace('PropertyListingScreen');
  };

  const timerOn = isTimerActive && timer > 0;

  return (
    <AuthScreen top={30}>
      {/* Figma y 74 */}
      <Title>{'A verification has been sent to your phone number..'}</Title>

      {/* y 138 */}
      <Subtitle style={styles.subtitle}>
        Please enter the code below to verify your phone number
      </Subtitle>

      {/* y 212 : 6 boxes 51x51, radius 8 */}
      <View style={styles.otpRow}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[styles.box, digit !== '' && styles.boxActive]}
            value={digit}
            onChangeText={(t) => handleCodeChange(t, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            underlineColorAndroid="transparent"
          />
        ))}
      </View>

      {/* y 288 */}
      <View style={styles.timerWrap}>
        {timerOn ? (
          <Text style={styles.timerText}>
            {'Resent Code In: '}
            <Text style={styles.timerHighlight}>{formatTime(timer)}</Text>
          </Text>
        ) : (
          <TouchableOpacity onPress={handleResendCode} activeOpacity={0.7}>
            <Text style={styles.resend}>Resend Code</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* y 396 (Figma button starts at x=10) */}
      <PrimaryButton label="Verify" style={styles.verify} onPress={handleVerify} />

      {/* y 476 */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.change, !timerOn && { paddingLeft: 8 }]}
        onPress={() => navigation.navigate('ChangePhoneNumberScreen')}
      >
        <Text style={styles.changeText}>Change Phone Number</Text>
      </TouchableOpacity>
    </AuthScreen>
  );
};

const styles = StyleSheet.create({
  subtitle: { marginTop: 10, width: 304, color: C.body2 },
  otpRow: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 51,
    height: 51,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5EFF2',
    backgroundColor: '#FFFFFF',
    padding: 0,
    textAlign: 'center',
    fontFamily: F.medium,
    fontSize: 18,
    color: '#515151',
    includeFontPadding: false,
  },
  boxActive: { borderColor: C.primary },
  timerWrap: { marginTop: 25, height: 21, alignItems: 'center', justifyContent: 'center' },
  timerText: { fontFamily: F.regular, fontSize: 14, lineHeight: 21, color: C.body2 },
  timerHighlight: { fontFamily: F.medium, color: C.primary },
  resend: { fontFamily: F.medium, fontSize: 14, lineHeight: 21, color: C.primary },
  verify: { marginTop: 87, marginLeft: -5, marginRight: 5 },
  change: { marginTop: 24, alignItems: 'center', height: 21, justifyContent: 'center' },
  changeText: { fontFamily: F.regular, fontSize: 14, lineHeight: 21, color: '#E37553' },
});

export default VerificationScreen;
