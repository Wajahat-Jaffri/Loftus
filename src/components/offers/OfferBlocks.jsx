import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { ICONS } from '../../assets';
import { COLORS, FONT } from '../listing/ListingControls';

const GREEN = '#03AA2F';
const RED = '#D33838';
const BOX_BORDER = '#E7E7E7';
const PIC_BORDER = 'rgba(133, 135, 138, 0.3)';

/* Figma section title: 16/500, 24 high, 8 above its box */
export const SectionTitle = ({ children }) => <Text style={styles.sectionTitle}>{children}</Text>;

/* ---------- hero (listing preview, Figma 345 x 343) ---------- */

const Feature = ({ icon, label }) => (
  <View style={styles.featureItem}>
    <Image source={icon} style={styles.featureIcon} resizeMode="contain" />
    <Text style={styles.featureText}>{label}</Text>
  </View>
);

const Divider = () => (
  <View style={styles.dividerBox}>
    <View style={styles.dividerLine} />
  </View>
);

export const HeroCard = ({ listing }) => {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [pw, setPw] = useState(0);
  const images = listing.images || [];

  return (
    <View style={styles.hero}>
      <View style={styles.picture} onLayout={(e) => setPw(e.nativeEvent.layout.width - 2)}>
        {pw > 0 && (
          <FlatList
            data={images}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            getItemLayout={(_, i) => ({ length: pw, offset: pw * i, index: i })}
            onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / pw))}
            renderItem={({ item }) => (
              <Image source={item} style={{ width: pw, height: 222 }} resizeMode="cover" />
            )}
          />
        )}

        {/* badge + heart row: Figma left 17 / top 11, 311 x 32 */}
        <View style={styles.badgeRow} pointerEvents="box-none">
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
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {images.length > 1 && (
          <View style={styles.dots} pointerEvents="none">
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === index ? styles.dotOn : styles.dotOff]} />
            ))}
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View style={styles.textCol}>
          <Text style={styles.heroTitle} numberOfLines={1}>
            {listing.title}
          </Text>
          <View style={styles.featuresRow}>
            <Feature icon={ICONS.bed} label={listing.beds} />
            <Divider />
            <Feature icon={ICONS.bath} label={listing.baths} />
            <Divider />
            <Feature icon={ICONS.area} label={listing.sqft} />
          </View>
          <Text style={styles.heroAddress} numberOfLines={1}>
            {listing.address}
          </Text>
          <View style={styles.timeRow}>
            <Image source={ICONS.clock} style={styles.clockIcon} resizeMode="contain" />
            <Text style={styles.timeText}>{listing.timeAgo}</Text>
          </View>
        </View>
        <Text style={styles.heroPrice}>{listing.price}</Text>
      </View>
    </View>
  );
};

/* ---------- person card (Figma 345 x 92) ---------- */

export const PartyCard = ({ person, chat }) => (
  <View style={styles.box}>
    <View style={styles.personRow}>
      <Image source={person.avatar} style={styles.avatar} />
      <Text style={styles.personName} numberOfLines={1}>
        {person.name}
      </Text>
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

/* Figma cell widths for the 3-column (rent) row; 2-column rows use 140.5 + 32 gap */
const RENT_WIDTHS = [47.74, 47.74, 75];

export const OfferingCard = ({ rows }) => (
  <View style={styles.box}>
    {rows.map((row, ri) => {
      const three = row.length === 3;
      const two = row.length === 2;
      return (
        <View
          key={ri}
          style={[
            styles.offerRow,
            three && { justifyContent: 'space-between' },
            ri !== rows.length - 1 && { marginBottom: 16 },
          ]}
        >
          {row.map((cell, ci) => (
            <View
              key={cell.label}
              style={[
                styles.offerCell,
                three && { minWidth: RENT_WIDTHS[ci] },
                two && { width: 140.5, marginRight: ci === 0 ? 32 : 0 },
              ]}
            >
              <Text style={styles.offerLabel}>{cell.label}</Text>
              <Text style={styles.offerValue}>{cell.value}</Text>
            </View>
          ))}
        </View>
      );
    })}
  </View>
);

/* ---------- screening (tenant) ---------- */

const StatusPill = ({ label, color, wide }) => (
  <View style={[styles.pill, { backgroundColor: color }, wide && styles.pillWide]}>
    <Text style={styles.pillText}>{label}</Text>
  </View>
);

export const ScreeningCard = ({ person, status, checks }) => (
  <View style={styles.box}>
    <View style={styles.personRow}>
      <Image source={person.avatar} style={styles.avatar} />
      <View style={styles.screenInfo}>
        <Text style={styles.personName} numberOfLines={1}>
          {person.name}
        </Text>
        <View style={styles.completeWrap}>
          <StatusPill label={status} color={GREEN} />
        </View>
      </View>
    </View>

    <View style={styles.checksRow}>
      {checks.map((c, i) => (
        <View key={c.label} style={[styles.checkBox, i !== checks.length - 1 && { marginRight: 8 }]}>
          <View style={styles.checkTop}>
            <Image source={c.icon} style={styles.checkIcon} resizeMode="contain" />
            <Text style={styles.checkLabel}>{c.label}</Text>
          </View>
          <StatusPill label={c.status} color={c.status === 'Expired' ? RED : GREEN} wide />
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    height: 24,
    marginBottom: 8,
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#404040',
    includeFontPadding: false,
  },

  /* hero: same markup as the listing card */
  hero: { alignSelf: 'stretch', height: 343, backgroundColor: '#FFFFFF', borderRadius: 12 },
  picture: {
    height: 224,
    borderWidth: 1,
    borderColor: PIC_BORDER,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EDEDED',
  },
  badgeRow: {
    position: 'absolute',
    top: 10,
    left: 16,
    right: 16,
    height: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    height: 23,
    paddingHorizontal: 8,
    borderRadius: 50,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeBadgeText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 11,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  heart: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  heartIcon: { width: 24, height: 24, tintColor: '#FFFFFF' },
  dots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { borderRadius: 5, marginHorizontal: 2 },
  dotOn: { width: 9, height: 9, backgroundColor: COLORS.orange },
  dotOff: { width: 7, height: 7, backgroundColor: '#FFFFFF' },

  info: { height: 103, marginTop: 8, marginHorizontal: 8, justifyContent: 'center' },
  textCol: { height: 93, width: 227 },
  heroTitle: {
    height: 15,
    fontFamily: FONT.semi,
    fontSize: 16,
    lineHeight: 15,
    color: '#000000',
    includeFontPadding: false,
  },
  featuresRow: { marginTop: 10, height: 16, flexDirection: 'row', alignItems: 'center' },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureIcon: { width: 16, height: 16, tintColor: COLORS.orange, marginRight: 2 },
  featureText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 16,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  dividerBox: {
    width: 9,
    height: 16,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerLine: { width: 1, height: 9, backgroundColor: '#4E4E4E', opacity: 0.5 },
  heroAddress: {
    marginTop: 10,
    height: 18,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#4E4E4E',
    includeFontPadding: false,
  },
  timeRow: { marginTop: 10, height: 14, flexDirection: 'row', alignItems: 'center' },
  clockIcon: { width: 14, height: 14, tintColor: COLORS.orange, marginRight: 2 },
  timeText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 14,
    color: '#4E4E4E',
    opacity: 0.5,
    includeFontPadding: false,
  },
  heroPrice: {
    position: 'absolute',
    right: 0,
    bottom: 3,
    height: 19,
    fontFamily: FONT.semi,
    fontSize: 20,
    lineHeight: 19,
    color: COLORS.orange,
    includeFontPadding: false,
  },

  /* generic bordered box: Figma padding 16 + 1px border => 15 + 1 */
  box: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: BOX_BORDER,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 15,
  },

  /* person */
  personRow: { flexDirection: 'row', alignItems: 'center', minHeight: 60 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  personName: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 18,
    lineHeight: 18,
    color: '#000000',
    includeFontPadding: false,
  },
  chatBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIcon: { width: 16, height: 16, tintColor: '#FFFFFF' },

  /* offering */
  offerRow: { flexDirection: 'row' },
  offerCell: {},
  offerLabel: {
    height: 15,
    marginBottom: 4,
    fontFamily: FONT.regular,
    fontSize: 10,
    lineHeight: 15,
    color: '#A5A5A5',
    includeFontPadding: false,
  },
  offerValue: {
    height: 15,
    fontFamily: FONT.semi,
    fontSize: 16,
    lineHeight: 15,
    color: COLORS.orange,
    includeFontPadding: false,
  },

  /* screening */
  screenInfo: { flex: 1 },
  completeWrap: { marginTop: 8, flexDirection: 'row' },
  pill: {
    height: 19,
    paddingHorizontal: 8,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillWide: { width: 83, paddingHorizontal: 0 },
  pillText: {
    fontFamily: FONT.medium,
    fontSize: 11,
    lineHeight: 11,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  checksRow: { marginTop: 16, flexDirection: 'row' },
  checkBox: {
    width: 99,
    height: 125,
    borderWidth: 1,
    borderColor: BOX_BORDER,
    borderRadius: 12,
    paddingVertical: 13, // Figma 14 minus the border
    paddingHorizontal: 7, // Figma 8 minus the border
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkTop: { width: 83, alignItems: 'center' },
  checkIcon: { width: 34, height: 34, marginBottom: 6 },
  checkLabel: {
    width: 83,
    textAlign: 'center',
    fontFamily: FONT.regular,
    fontSize: 13,
    lineHeight: 12,
    color: '#404040',
    includeFontPadding: false,
  },
});
