import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const F = { regular: 'Poppins-Regular', medium: 'Poppins-Medium' };

/**
 * Figma toast: 344 x 84, #EDEDED, radius 14, padding 12, gap 16.
 * green check 20 | title 16/500 + message 14/400 | grey close X (24).
 *
 * Props: visible, title, message, onClose, duration (ms, 0 = stay), style.
 * Place it as the LAST child of a screen: it floats at the top (Figma top 46,
 * i.e. 2px under the status bar).
 */
const Toast = ({
  visible,
  title = 'Email sent',
  message = 'Email has been sent to reset your password',
  onClose,
  duration = 4000,
  style,
}) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();

    if (visible && duration > 0) {
      const t = setTimeout(() => onClose && onClose(), duration);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [visible, duration, anim, onClose]);

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.toast,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] }) }],
        },
        style,
      ]}
    >
      {/* green check */}
      <View style={styles.check}>
        <View style={styles.checkMark} />
      </View>

      <View style={styles.textCol}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.message}>{message}</Text>
      </View>

      <TouchableOpacity
        style={styles.close}
        onPress={onClose}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <View style={[styles.closeBar, { transform: [{ rotate: '45deg' }] }]} />
        <View style={[styles.closeBar, { transform: [{ rotate: '-45deg' }] }]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 2,
    left: 16,
    right: 15,
    minHeight: 84,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    backgroundColor: '#EDEDED',
    elevation: 6,
    zIndex: 50,
  },
  check: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#07BC0C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    width: 9.5,
    height: 4.5,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '-45deg' }, { translateY: -1 }],
  },
  textCol: { flex: 1, marginLeft: 16 },
  title: {
    fontFamily: F.medium,
    fontSize: 16,
    lineHeight: 20,
    color: '#202020',
    includeFontPadding: false,
  },
  message: {
    fontFamily: F.regular,
    fontSize: 14,
    lineHeight: 20,
    color: '#404040',
    includeFontPadding: false,
  },
  close: {
    width: 24,
    height: 24,
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBar: {
    position: 'absolute',
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#A1A1AA',
  },
});

export default Toast;
