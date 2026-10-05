import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
  PanResponder,
  KeyboardAvoidingView,
} from 'react-native';

const ORANGE = '#FF6C40';
const BORDER_GREY = '#E3E3E3';
const TRACK_GREY = '#E9E9E9';
const TEXT_DARK = '#1A1A1A';
const TEXT_GREY = '#6B6B6B';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};

const PRICE_MIN = 0;
const PRICE_MAX = 12000000;
const PRICE_STEP = 1000;

const FEATURES_LIST = [
  'Attic',
  'Basement',
  'Pool',
  'Loft',
  'Sunroom',
  'Backyard',
  'Deck',
  'Patio',
  'Front yard',
  'Dishwasher',
  'Disposal',
  'Microwave',
  'Ice Dispenser',
  'Oven',
  'Furnished',
  'Den',
  'Balcony',
  'Pet Friendly',
];

const LAUNDRY_OPTIONS = ['In Unit', 'Laundry Facility', 'None'];

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

const chunk = (arr, size) => {
  const rows = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
};

/* ------------------------------------------------------------------ */
/* Dual-thumb range slider (no external library)                       */
/* ------------------------------------------------------------------ */
const THUMB = 22;
const TRACK_HEIGHT = 5;

const RangeSlider = ({
  min,
  max,
  low,
  high,
  step = 1,
  onChange,
  onInteract,
}) => {
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const startValueRef = useRef(0);

  // Latest props, readable from inside the (created-once) pan responders.
  const latest = useRef({});
  latest.current = { min, max, low, high, step, onChange, onInteract };

  const usable = Math.max(width - THUMB, 1);
  const toPos = (v) => ((v - min) / (max - min)) * usable;

  const makeResponder = (which) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        const l = latest.current;
        startValueRef.current = which === 'low' ? l.low : l.high;
        l.onInteract?.(true);
      },
      onPanResponderMove: (_, g) => {
        const l = latest.current;
        const span = Math.max(widthRef.current - THUMB, 1);
        const startPos = ((startValueRef.current - l.min) / (l.max - l.min)) * span;
        const pos = clamp(startPos + g.dx, 0, span);
        const raw = l.min + (pos / span) * (l.max - l.min);
        const stepped = clamp(Math.round(raw / l.step) * l.step, l.min, l.max);

        if (which === 'low') {
          l.onChange(Math.min(stepped, l.high), l.high);
        } else {
          l.onChange(l.low, Math.max(stepped, l.low));
        }
      },
      onPanResponderRelease: () => latest.current.onInteract?.(false),
      onPanResponderTerminate: () => latest.current.onInteract?.(false),
    });

  const lowResponder = useRef(makeResponder('low')).current;
  const highResponder = useRef(makeResponder('high')).current;

  const lowPos = toPos(low);
  const highPos = toPos(high);

  return (
    <View
      style={styles.sliderContainer}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        widthRef.current = w;
        setWidth(w);
      }}
    >
      <View style={styles.sliderBackgroundTrack} />
      <View
        style={[
          styles.sliderActiveTrack,
          { left: THUMB / 2 + lowPos, width: Math.max(highPos - lowPos, 0) },
        ]}
      />
      <View
        {...lowResponder.panHandlers}
        hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
        style={[styles.sliderThumb, { left: lowPos }]}
      />
      <View
        {...highResponder.panHandlers}
        hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
        style={[styles.sliderThumb, { left: highPos }]}
      />
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */
const FilterScreen = ({ navigation }) => {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Price
  const [price, setPrice] = useState({ low: 5308, high: 10130800 });
  const [priceText, setPriceText] = useState({
    low: '5308',
    high: '10130800',
  });

  // Beds / Baths
  const [beds, setBeds] = useState({ low: 0, high: 10 });
  const [baths, setBaths] = useState({ low: 0, high: 10 });

  // Listing information
  const [yearBuilt, setYearBuilt] = useState('2025');
  const [area, setArea] = useState('1231');
  const [lotSize, setLotSize] = useState('5308');

  // Laundry + features (pre-selected like the Figma design)
  const [laundry, setLaundry] = useState('In Unit');
  const [selectedFeatures, setSelectedFeatures] = useState([
    'Attic',
    'Front yard',
  ]);

  const digitsOnly = (t) => t.replace(/[^0-9]/g, '');

  const handlePriceSlider = (low, high) => {
    setPrice({ low, high });
    setPriceText({ low: String(low), high: String(high) });
  };

  const commitPriceText = (which) => {
    const parsed = parseInt(priceText[which], 10);
    if (Number.isNaN(parsed)) {
      setPriceText((p) => ({ ...p, [which]: String(price[which]) }));
      return;
    }
    const value = clamp(parsed, PRICE_MIN, PRICE_MAX);
    const next =
      which === 'low'
        ? { low: Math.min(value, price.high), high: price.high }
        : { low: price.low, high: Math.max(value, price.low) };
    setPrice(next);
    setPriceText({ low: String(next.low), high: String(next.high) });
  };

  const toggleFeature = (feature) =>
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backChevron}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.container}
        >
          {/* Price */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price</Text>
            <RangeSlider
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={PRICE_STEP}
              low={price.low}
              high={price.high}
              onChange={handlePriceSlider}
              onInteract={(active) => setScrollEnabled(!active)}
            />
            <View style={styles.rowTwoInputs}>
              <View style={styles.inputBoxPrefix}>
                <Text style={styles.prefixText}>$</Text>
                <TextInput
                  style={styles.inputWithPrefix}
                  value={priceText.low}
                  onChangeText={(t) =>
                    setPriceText((p) => ({ ...p, low: digitsOnly(t) }))
                  }
                  onEndEditing={() => commitPriceText('low')}
                  keyboardType="numeric"
                  maxLength={9}
                />
              </View>
              <View style={styles.inputBoxPrefix}>
                <Text style={styles.prefixText}>$</Text>
                <TextInput
                  style={styles.inputWithPrefix}
                  value={priceText.high}
                  onChangeText={(t) =>
                    setPriceText((p) => ({ ...p, high: digitsOnly(t) }))
                  }
                  onEndEditing={() => commitPriceText('high')}
                  keyboardType="numeric"
                  maxLength={9}
                />
              </View>
            </View>
          </View>

          {/* Beds */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beds</Text>
            <RangeSlider
              min={0}
              max={10}
              step={1}
              low={beds.low}
              high={beds.high}
              onChange={(low, high) => setBeds({ low, high })}
              onInteract={(active) => setScrollEnabled(!active)}
            />
            <View style={styles.rangeLabelsRow}>
              <Text style={styles.rangeLabelText}>
                {beds.low === 0 ? 'Studio' : beds.low}
              </Text>
              <Text style={styles.rangeLabelText}>{beds.high}</Text>
            </View>
          </View>

          {/* Baths */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Baths</Text>
            <RangeSlider
              min={0}
              max={10}
              step={1}
              low={baths.low}
              high={baths.high}
              onChange={(low, high) => setBaths({ low, high })}
              onInteract={(active) => setScrollEnabled(!active)}
            />
            <View style={styles.rangeLabelsRow}>
              <Text style={styles.rangeLabelText}>{baths.low}</Text>
              <Text style={styles.rangeLabelText}>{baths.high}</Text>
            </View>
          </View>

          {/* Listing Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Listing Information</Text>
            <View style={styles.rowThreeInputs}>
              <View style={styles.inputCol}>
                <Text style={styles.fieldLabel}>Year Built</Text>
                <TextInput
                  style={styles.simpleInput}
                  value={yearBuilt}
                  onChangeText={(t) => setYearBuilt(digitsOnly(t))}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.fieldLabel}>Area</Text>
                <TextInput
                  style={styles.simpleInput}
                  value={area}
                  onChangeText={(t) => setArea(digitsOnly(t))}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.inputCol}>
                <Text style={styles.fieldLabel}>Lot Size</Text>
                <TextInput
                  style={styles.simpleInput}
                  value={lotSize}
                  onChangeText={(t) => setLotSize(digitsOnly(t))}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Laundry */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Laundry</Text>
            <View style={styles.radioGroup}>
              {LAUNDRY_OPTIONS.map((option) => {
                const isSelected = laundry === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    activeOpacity={0.8}
                    onPress={() => setLaundry(option)}
                  >
                    <View style={styles.outerRadio}>
                      {isSelected && <View style={styles.innerRadio} />}
                    </View>
                    <Text style={styles.radioLabel}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Features — rows of 3, chips stretch to fill each row */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            {chunk(FEATURES_LIST, 3).map((row, rowIndex) => (
              <View key={rowIndex} style={styles.chipsRow}>
                {row.map((feature) => {
                  const isSelected = selectedFeatures.includes(feature);
                  return (
                    <TouchableOpacity
                      key={feature}
                      activeOpacity={0.8}
                      onPress={() => toggleFeature(feature)}
                      style={[
                        styles.featureChip,
                        isSelected && styles.featureChipSelected,
                      ]}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.featureText,
                          isSelected && styles.featureTextSelected,
                        ]}
                      >
                        {feature}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 44,
  },
  backButton: {
    width: 24,
  },
  backChevron: {
    fontSize: 30,
    lineHeight: 34,
    color: TEXT_DARK,
    fontWeight: '300',
  },
  headerTitle: {
    fontFamily: FONT.medium,
    fontSize: 16,
    color: TEXT_DARK,
  },
  headerSpacer: {
    width: 24,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: FONT.semibold,
    fontSize: 14,
    color: TEXT_DARK,
    marginBottom: 10,
  },

  // Slider
  sliderContainer: {
    height: THUMB + 6,
    justifyContent: 'center',
    marginBottom: 4,
  },
  sliderBackgroundTrack: {
    position: 'absolute',
    left: THUMB / 2,
    right: THUMB / 2,
    height: TRACK_HEIGHT,
    backgroundColor: TRACK_GREY,
    borderRadius: TRACK_HEIGHT / 2,
  },
  sliderActiveTrack: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    backgroundColor: ORANGE,
    borderRadius: TRACK_HEIGHT / 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: 3,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: ORANGE,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  rangeLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  rangeLabelText: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: TEXT_GREY,
  },

  // Price inputs
  rowTwoInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  inputBoxPrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    borderWidth: 1,
    borderColor: BORDER_GREY,
    borderRadius: 8,
    height: 38,
    paddingHorizontal: 12,
  },
  prefixText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    color: TEXT_DARK,
    marginRight: 8,
  },
  inputWithPrefix: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: TEXT_DARK,
    paddingVertical: 0,
  },

  // Listing info
  rowThreeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputCol: {
    width: '31%',
  },
  fieldLabel: {
    fontFamily: FONT.semibold,
    fontSize: 10,
    color: TEXT_DARK,
    marginBottom: 5,
  },
  simpleInput: {
    borderWidth: 1,
    borderColor: BORDER_GREY,
    borderRadius: 8,
    height: 36,
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: TEXT_DARK,
  },

  // Laundry radios
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 22,
  },
  outerRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  innerRadio: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: ORANGE,
  },
  radioLabel: {
    fontFamily: FONT.regular,
    fontSize: 11,
    color: TEXT_DARK,
  },

  // Feature chips
  chipsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  featureChip: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_GREY,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  featureChipSelected: {
    backgroundColor: ORANGE,
    borderColor: ORANGE,
  },
  featureText: {
    fontFamily: FONT.regular,
    fontSize: 10,
    color: TEXT_GREY,
  },
  featureTextSelected: {
    color: '#FFFFFF',
    fontFamily: FONT.medium,
  },
});

export default FilterScreen;
