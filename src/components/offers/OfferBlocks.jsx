import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { ICONS } from '../../assets';
import { COLORS, FONT } from '../listing/ListingControls';

const { width } = Dimensions.get('window');
const HERO_W = width - 32;
const HERO_IMG_W = HERO_W - 2;
const HERO_IMG_H = 160;

const GREEN = '#17A74A';
const RED = '#D93636';

export const SectionTitle = ({ children }) => <Text style={styles.sectionTitle}>{children}</Text>;

/* ---------- hero (listing preview) ---------- */

const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <Image source={icon} style={styles.featureIcon} resizeMode="contain" />
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

export const HeroCard = ({ listing }) => {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const images = listing.images || [];

  return (
    <View style={styles.heroCard}>
      <View style={{ width: HERO_IMG_W, height: HERO_IMG_H }}>
        <FlatList
          data={images}
          keyExtractor={(_, i) => String(i)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          getItemLayout={(_, i) => ({ length: HERO_IMG_W, offset: HERO_IMG_W * i, index: i })}
          onMomentumScrollEnd={(e) =>
            setIndex(Math.round(e.nativeEvent.contentOffset.x / HERO_IMG_W))
          }
          renderItem={({ item }) => <Image source={item} style={styles.heroImage} />}
        />

        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{listing.type}</Text>
        </View>

        <TouchableOpacity
          style={styles.heart}
          activeOpacity={0.8}
          onPress={() => setLiked((l) => !l)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image
            source={liked ? ICONS.heartFilled : ICONS.heart}
            style={[styles.heartIcon, liked && { tintColor: COLORS.orange }]}
          />
        </TouchableOpacity>

        {images.length > 1 && (
          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, { backgroundColor: i === index ? COLORS.orange : '#FFFFFF' }]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.heroDetails}>
        <Text style={styles.heroTitle}>{listing.title}</Text>
        <View style={styles.featuresRow}>
          <Feature icon={ICONS.bed} label={listing.beds} />
          <View style={styles.divider} />
          <Feature icon={ICONS.bath} label={listing.baths} />
          <View style={styles.divider} />
          <Feature icon={ICONS.area} label={listing.sqft} />
        </View>
        <Text style={styles.heroAddress}>{listing.address}</Text>
        <View style={styles.heroBottom}>
          <View style={styles.timeRow}>
            <Image source={ICONS.clock} style={styles.clockIcon} resizeMode="contain" />
            <Text style={styles.timeText}>{listing.timeAgo}</Text>
          </View>
          <Text style={styles.heroPrice}>{listing.price}</Text>
        </View>
      </View>
    </View>
  );
};

/* ---------- person card ---------- */

export const PartyCard = ({ person, chat }) => (
  <View style={styles.box}>
    <View style={styles.personRow}>
      <Image source={person.avatar} style={styles.avatar} />
      <Text style={styles.personName}>{person.name}</Text>
      {chat && (
        <TouchableOpacity
          style={styles.chatBtn}
          activeOpacity={0.8}
          onPress={() =>
            // TODO: open chat screen with this person
            Alert.alert('Chat', `Chat with ${person.name} coming soon.`)
          }
        >
          <Image source={ICONS.chatText} style={styles.chatIcon} resizeMode="contain" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

/* ---------- offering grid ---------- */

export const OfferingCard = ({ rows }) => (
  <View style={styles.box}>
    {rows.map((row, ri) => (
      <View key={ri} style={[styles.offerRow, ri !== rows.length - 1 && { marginBottom: 12 }]}>
        {row.map((cell) => (
          <View key={cell.label} style={styles.offerCell}>
            <Text style={styles.offerLabel}>{cell.label}</Text>
            <Text style={styles.offerValue}>{cell.value}</Text>
          </View>
        ))}
      </View>
    ))}
  </View>
);

/* ---------- screening (tenant) ---------- */

export const ScreeningCard = ({ person, status, checks }) => (
  <View style={styles.box}>
    <View style={styles.personRow}>
      <Image source={person.avatar} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.personName}>{person.name}</Text>
        <View style={[styles.statusPill, { backgroundColor: GREEN, alignSelf: 'flex-start' }]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>
    </View>

    <View style={styles.checksRow}>
      {checks.map((c, i) => (
        <View
          key={c.label}
          style={[styles.checkBox, i !== checks.length - 1 && { marginRight: 8 }]}
        >
          <Image source={c.icon} style={styles.checkIcon} resizeMode="contain" />
          <Text style={styles.checkLabel} numberOfLines={2}>
            {c.label}
          </Text>
          <View
            style={[
              styles.statusPill,
              { backgroundColor: c.status === 'Expired' ? RED : GREEN },
            ]}
          >
            <Text style={styles.statusText}>{c.status}</Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    fontFamily: FONT.semi,
    fontSize: 11,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },

  /* hero */
  heroCard: {
    width: HERO_W,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  heroImage: { width: HERO_IMG_W, height: HERO_IMG_H, resizeMode: 'cover' },
  typeBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.orange,
    paddingHorizontal: 9,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeBadgeText: { fontFamily: FONT.medium, fontSize: 8, color: '#FFFFFF' },
  heart: { position: 'absolute', top: 6, right: 8, width: 26, height: 26, alignItems: 'center', justifyContent: 'center' },
  heartIcon: { width: 20, height: 20, tintColor: '#FFFFFF', resizeMode: 'contain' },
  dots: { position: 'absolute', bottom: 8, alignSelf: 'center', flexDirection: 'row' },
  dot: { width: 5, height: 5, borderRadius: 2.5, marginHorizontal: 2 },
  heroDetails: { paddingHorizontal: 10, paddingTop: 8, paddingBottom: 10 },
  heroTitle: { fontFamily: FONT.semi, fontSize: 12, color: '#000000', marginBottom: 4 },
  featuresRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { width: 10, height: 10, tintColor: COLORS.orange, marginRight: 3 },
  featureText: { fontFamily: FONT.regular, fontSize: 8, color: '#6B6B6B' },
  divider: { width: 1, height: 9, backgroundColor: '#D1D1D1', marginHorizontal: 6 },
  heroAddress: { fontFamily: FONT.regular, fontSize: 8, color: '#6B6B6B', marginBottom: 6 },
  heroBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  clockIcon: { width: 10, height: 10, tintColor: COLORS.orange, marginRight: 3 },
  timeText: { fontFamily: FONT.regular, fontSize: 8, color: '#8A8A8A' },
  heroPrice: { fontFamily: FONT.semi, fontSize: 15, color: COLORS.orange },

  /* generic bordered box */
  box: {
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },

  /* person */
  personRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 34, height: 34, borderRadius: 17, marginRight: 10 },
  personName: { flex: 1, fontFamily: FONT.medium, fontSize: 11, color: COLORS.text },
  chatBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIcon: { width: 12, height: 12, tintColor: '#FFFFFF' },

  /* offering */
  offerRow: { flexDirection: 'row' },
  offerCell: { flex: 1 },
  offerLabel: { fontFamily: FONT.regular, fontSize: 8, color: COLORS.grey, marginBottom: 2 },
  offerValue: { fontFamily: FONT.semi, fontSize: 12, color: COLORS.orange },

  /* screening */
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 1.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { fontFamily: FONT.medium, fontSize: 7, color: '#FFFFFF' },
  checksRow: { flexDirection: 'row', marginTop: 10 },
  checkBox: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  checkIcon: { width: 22, height: 22, marginBottom: 4 },
  checkLabel: {
    fontFamily: FONT.regular,
    fontSize: 8,
    color: COLORS.text,
    textAlign: 'center',
    minHeight: 22,
  },
});