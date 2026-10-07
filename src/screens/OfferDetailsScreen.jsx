import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import {
  HeroCard,
  PartyCard,
  OfferingCard,
  ScreeningCard,
  SectionTitle,
} from '../components/offers/OfferBlocks';
import { COLORS, FONT } from '../components/listing/ListingControls';
import { OFFERS } from '../constants/offersData';

const OfferDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const offer = OFFERS.find((o) => o.id === route?.params?.offerId);

  if (!offer) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title="Offer" onBack={() => navigation.goBack()} />
        <Text style={styles.missing}>Offer not found</Text>
      </SafeAreaView>
    );
  }

  // Buttons data se aate hain (offersData.js ka `actions` field)
  let actions = null;
  if (offer.actions === 'declineAccept') {
    actions = { left: 'Decline', right: 'Accept' };
  } else if (offer.actions === 'editDelete') {
    actions = { left: 'Edit', right: 'Delete' };
  }

  const confirm = (title, message, confirmText) =>
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: confirmText,
        onPress: () => {
          // TODO: call your API here (accept / decline / delete)
          navigation.goBack();
        },
      },
    ]);

  const handleAction = (label) => {
    switch (label) {
      case 'Accept':
        return confirm('Accept offer', 'Are you sure you want to accept this offer?', 'Accept');
      case 'Decline':
        return confirm('Decline offer', 'Are you sure you want to decline this offer?', 'Decline');
      case 'Delete':
        return confirm('Delete offer', 'Are you sure you want to delete this offer?', 'Delete');
      default:
        // TODO: open the edit-offer screen
        return Alert.alert('Edit offer', 'Edit offer screen coming soon.');
    }
  };

  const renderBlock = (block, index) => {
    // Figma: 12 px between the sections
    const style = index === 0 ? null : styles.section;
    switch (block.kind) {
      case 'party':
        return (
          <View key={index} style={style}>
            <SectionTitle>{block.title}</SectionTitle>
            <PartyCard person={block.person} chat={block.chat} />
          </View>
        );
      case 'offering':
        return (
          <View key={index} style={style}>
            <SectionTitle>Offering</SectionTitle>
            <OfferingCard rows={block.rows} />
          </View>
        );
      case 'screening':
        return (
          <View key={index} style={style}>
            <SectionTitle>Tenants</SectionTitle>
            <ScreeningCard person={block.person} status={block.status} checks={block.checks} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader title={`My Offer: ${offer.offerNo}`} onBack={() => navigation.goBack()} />

      {/* Figma: content starts 18 px under the header, 15 px side margins */}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 24 + (actions ? 0 : insets.bottom) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard listing={offer.listing} />
        <View style={styles.sections}>{offer.blocks.map(renderBlock)}</View>
      </ScrollView>

      {actions && (
        <View style={styles.footerWrap}>
          <View pointerEvents="none" style={[styles.shade, { top: -6, backgroundColor: 'rgba(0,0,0,0.015)' }]} />
          <View pointerEvents="none" style={[styles.shade, { top: -4, backgroundColor: 'rgba(0,0,0,0.03)' }]} />
          <View pointerEvents="none" style={[styles.shade, { top: -2, backgroundColor: 'rgba(0,0,0,0.05)' }]} />

          {/* Figma navbar 375 x 78: buttons 166.5 x 40, radius 12, 12 apart, 16 from the top */}
          <View style={[styles.footer, { height: 78 + insets.bottom }]}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.btn, styles.btnOutline]}
              onPress={() => handleAction(actions.left)}
            >
              <Text style={[styles.btnText, { color: COLORS.orange }]}>{actions.left}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.btn, styles.btnFilled]}
              onPress={() => handleAction(actions.right)}
            >
              <Text style={[styles.btnText, { color: '#FFFFFF' }]}>{actions.right}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  missing: { textAlign: 'center', marginTop: 60, fontFamily: FONT.regular, color: COLORS.grey },
  content: { paddingTop: 18, paddingHorizontal: 15 },
  sections: { marginTop: 16 },
  section: { marginTop: 12 },

  footerWrap: { backgroundColor: '#FFFFFF' },
  shade: { position: 'absolute', left: 0, right: 0, height: 2 },
  footer: {
    paddingTop: 16,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  btn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutline: { marginRight: 12, borderWidth: 1, borderColor: COLORS.orange, backgroundColor: '#FFFFFF' },
  btnFilled: { backgroundColor: COLORS.orange },
  btnText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 20,
    includeFontPadding: false,
  },
});

export default OfferDetailsScreen;
