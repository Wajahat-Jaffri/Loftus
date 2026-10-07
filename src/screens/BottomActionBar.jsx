import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ICONS } from '../assets';

const ORANGE = '#FF6C40';
const CHAT_GREY = '#6A6A6A';
const CHAT_ICON = '#444444';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
};

// Icon from ICONS if you added it, otherwise a simple text symbol.
const BtnIcon = ({ icon, glyph, color }) =>
  icon ? (
    <Image source={icon} style={[styles.icon, { tintColor: color }]} resizeMode="contain" />
  ) : (
    <Text style={[styles.glyph, { color }]}>{glyph}</Text>
  );

/**
 * Fixed bar at the bottom of the details page (Figma navbar 375 x 78):
 * Chat | View Offer | Send Offer
 */
const BottomActionBar = ({ onChat, onViewOffers, onSendOffer }) => (
  <View style={styles.wrap}>
    <View pointerEvents="none" style={[styles.shade, { top: -6, backgroundColor: 'rgba(0,0,0,0.015)' }]} />
    <View pointerEvents="none" style={[styles.shade, { top: -4, backgroundColor: 'rgba(0,0,0,0.03)' }]} />
    <View pointerEvents="none" style={[styles.shade, { top: -2, backgroundColor: 'rgba(0,0,0,0.05)' }]} />

    <View style={styles.bar}>
      <TouchableOpacity
        style={styles.chat}
        activeOpacity={0.8}
        onPress={onChat || (() => Alert.alert('Chat', 'Chat is coming soon.'))}
      >
        <Image
          source={ICONS.chat || ICONS.chatText}
          style={styles.chatIcon}
          resizeMode="contain"
        />
        <Text style={styles.chatLabel}>Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.outlined]}
        activeOpacity={0.85}
        onPress={onViewOffers || (() => Alert.alert('View Offer', 'No offers yet.'))}
      >
        <Text style={styles.outlinedText}>View Offer</Text>
        <BtnIcon icon={ICONS.eye} glyph="◉" color={ORANGE} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.filled]}
        activeOpacity={0.85}
        onPress={onSendOffer || (() => Alert.alert('Send Offer', 'Your offer form will open here.'))}
      >
        <Text style={styles.filledText}>Send Offer</Text>
        <BtnIcon icon={ICONS.send} glyph="➤" color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#FFFFFF',
  },
  shade: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
  },
  bar: {
    height: 78,
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  chat: {
    width: 40,
    height: 48,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIcon: {
    width: 30,
    height: 30,
    tintColor: CHAT_ICON,
  },
  chatLabel: {
    marginTop: 4,
    width: 40,
    textAlign: 'center',
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 14,
    color: CHAT_GREY,
    includeFontPadding: false,
  },
  button: {
    flex: 1,
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlined: {
    marginRight: 12,
    borderWidth: 1,
    borderColor: ORANGE,
    backgroundColor: '#FFFFFF',
  },
  filled: {
    backgroundColor: ORANGE,
  },
  outlinedText: {
    marginRight: 4,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 20,
    color: ORANGE,
    includeFontPadding: false,
  },
  filledText: {
    marginRight: 4,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  icon: {
    width: 20,
    height: 20,
  },
  glyph: {
    fontSize: 16,
    lineHeight: 20,
  },
});

export default BottomActionBar;
