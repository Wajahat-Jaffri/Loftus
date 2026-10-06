import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  HeroCard,
  PartyCard,
  OfferingCard,
  ScreeningCard,
  SectionTitle,
} from '../components/offers/OfferBlocks';
import { COLORS, FONT, BackArrow } from '../components/listing/ListingControls';
import { OFFERS } from '../constants/offersData';

const OfferDetailsScreen = ({ navigation, route }) => {
  const offer = OFFERS.find((o) => o.id === route?.params?.offerId);

  if (!offer) {
    return (
      <SafeAreaView style={styles.container}>
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
    switch (block.kind) {
      case 'party':
        return (
          <View key={index}>
            <SectionTitle>{block.title}</SectionTitle>
            <PartyCard person={block.person} chat={block.chat} />
          </View>
        );
      case 'offering':
        return (
          <View key={index}>
            <SectionTitle>Offering</SectionTitle>
            <OfferingCard rows={block.rows} />
          </View>
        );
      case 'screening':
        return (
          <View key={index}>
            <SectionTitle>Tenants</SectionTitle>
            <ScreeningCard person={block.person} status={block.status} checks={block.checks} />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Offer: {offer.offerNo}</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeroCard listing={offer.listing} />
        {offer.blocks.map(renderBlock)}
      </ScrollView>

      {actions && (
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.btn, styles.btnOutline]}
            onPress={() => handleAction(actions.left)}
          >
            <Text style={[styles.btnText, { color: COLORS.orange }]}>{actions.left}</Text>
          </TouchableOpacity>
          <View style={{ width: 12 }} />
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.btn, styles.btnFilled]}
            onPress={() => handleAction(actions.right)}
          >
            <Text style={[styles.btnText, { color: '#FFFFFF' }]}>{actions.right}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  missing: { textAlign: 'center', marginTop: 60, fontFamily: FONT.regular, color: COLORS.grey },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FONT.medium, fontSize: 12, color: COLORS.text },
  content: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },

  footer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  btn: { flex: 1, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { borderWidth: 1, borderColor: COLORS.orange, backgroundColor: '#FFFFFF' },
  btnFilled: { backgroundColor: COLORS.orange },
  btnText: { fontFamily: FONT.medium, fontSize: 11 },
});

export default OfferDetailsScreen;