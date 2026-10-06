import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ICONS } from '../assets';

const ORANGE = '#FF6C40';

const FONT = {
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
 * Fixed bar at the bottom of the details page:
 * Chat | View Offers | Send Offer
 */
const BottomActionBar = ({ onChat, onViewOffers, onSendOffer }) => (
  <View style={styles.bar}>
    <TouchableOpacity
      style={[styles.button, styles.outlined, styles.chatButton]}
      activeOpacity={0.85}
      onPress={onChat || (() => Alert.alert('Chat', 'Chat is coming soon.'))}
    >
      <Text style={styles.outlinedText}>Chat</Text>
      <BtnIcon icon={ICONS.chat} glyph="▤" color={ORANGE} />
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, styles.outlined, styles.flexButton]}
      activeOpacity={0.85}
      onPress={onViewOffers || (() => Alert.alert('View Offers', 'No offers yet.'))}
    >
      <Text style={styles.outlinedText}>View Offers</Text>
      <BtnIcon icon={ICONS.eye} glyph="◉" color={ORANGE} />
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, styles.filled, styles.flexButton]}
      activeOpacity={0.85}
      onPress={onSendOffer || (() => Alert.alert('Send Offer', 'Your offer form will open here.'))}
    >
      <Text style={styles.filledText}>Send Offer</Text>
      <BtnIcon icon={ICONS.send} glyph="➤" color="#FFFFFF" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  button: {
    height: 38,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
    width: 78,
    marginRight: 8,
  },
  flexButton: {
    flex: 1,
    marginRight: 8,
  },
  outlined: {
    borderWidth: 1,
    borderColor: ORANGE,
    backgroundColor: '#FFFFFF',
  },
  filled: {
    backgroundColor: ORANGE,
    borderWidth: 1,
    borderColor: ORANGE,
    marginRight: 0,
  },
  outlinedText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: ORANGE,
    marginRight: 6,
  },
  filledText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    color: '#FFFFFF',
    marginRight: 6,
  },
  icon: {
    width: 14,
    height: 14,
  },
  glyph: {
    fontSize: 13,
    lineHeight: 15,
  },
});

export default BottomActionBar;
