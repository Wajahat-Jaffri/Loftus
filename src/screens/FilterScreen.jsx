// import React, { useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   StatusBar,
//   Platform,
//   PanResponder,
//   KeyboardAvoidingView,
// } from 'react-native';
// import ScreenHeader from '../components/ScreenHeader';
// import { ICONS } from '../assets';

// const ORANGE = '#FF6C40';
// const BORDER_GREY = '#E9E9E9';
// const TRACK_GREY = '#F3F4F6';
// const TEXT_GREY = '#5B5B5B';

// const FONT = {
//   regular: 'Poppins-Regular',
//   medium: 'Poppins-Medium',
// };

// const PRICE_MIN = 0;
// const PRICE_MAX = 12000000;
// const PRICE_STEP = 1000;

// const FEATURES_LIST = [
//   'Attic',
//   'Basement',
//   'Pool',
//   'Loft',
//   'Sunroom',
//   'Backyard',
//   'Deck',
//   'Patio',
//   'Front yard',
//   'Dishwasher',
//   'Disposal',
//   'Microwave',
//   'Ice Dispenser',
//   'Oven',
//   'Furnished',
//   'Den',
//   'Balcony',
//   'Pet Friendly',
// ];

// const LAUNDRY_OPTIONS = ['In Unit', 'Laundry Facility', 'None'];

// const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

// const chunk = (arr, size) => {
//   const rows = [];
//   for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
//   return rows;
// };

// /* ------------------------------------------------------------------ */
// /* Dual-thumb range slider (Figma: track 10, thumb 18 + 3px border)    */
// /* ------------------------------------------------------------------ */
// const THUMB = 18;
// const TRACK_HEIGHT = 10;
// const SLIDER_HEIGHT = 27;

// const RangeSlider = ({ min, max, low, high, step = 1, onChange, onInteract }) => {
//   const [width, setWidth] = useState(0);
//   const widthRef = useRef(0);
//   const startValueRef = useRef(0);

//   const latest = useRef({});
//   latest.current = { min, max, low, high, step, onChange, onInteract };

//   const usable = Math.max(width - THUMB, 1);
//   const toPos = (v) => ((v - min) / (max - min)) * usable;

//   const makeResponder = (which) =>
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderTerminationRequest: () => false,
//       onPanResponderGrant: () => {
//         const l = latest.current;
//         startValueRef.current = which === 'low' ? l.low : l.high;
//         l.onInteract?.(true);
//       },
//       onPanResponderMove: (_, g) => {
//         const l = latest.current;
//         const span = Math.max(widthRef.current - THUMB, 1);
//         const startPos = ((startValueRef.current - l.min) / (l.max - l.min)) * span;
//         const pos = clamp(startPos + g.dx, 0, span);
//         const raw = l.min + (pos / span) * (l.max - l.min);
//         const stepped = clamp(Math.round(raw / l.step) * l.step, l.min, l.max);

//         if (which === 'low') {
//           l.onChange(Math.min(stepped, l.high), l.high);
//         } else {
//           l.onChange(l.low, Math.max(stepped, l.low));
//         }
//       },
//       onPanResponderRelease: () => latest.current.onInteract?.(false),
//       onPanResponderTerminate: () => latest.current.onInteract?.(false),
//     });

//   const lowResponder = useRef(makeResponder('low')).current;
//   const highResponder = useRef(makeResponder('high')).current;

//   const lowPos = toPos(low);
//   const highPos = toPos(high);

//   return (
//     <View
//       style={styles.sliderContainer}
//       onLayout={(e) => {
//         const w = e.nativeEvent.layout.width;
//         widthRef.current = w;
//         setWidth(w);
//       }}
//     >
//       <View style={styles.sliderBackgroundTrack} />
//       <View
//         style={[
//           styles.sliderActiveTrack,
//           { left: THUMB / 2 + lowPos, width: Math.max(highPos - lowPos, 0) },
//         ]}
//       />
//       <View
//         {...lowResponder.panHandlers}
//         hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
//         style={[styles.sliderThumb, { left: lowPos }]}
//       />
//       <View
//         {...highResponder.panHandlers}
//         hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
//         style={[styles.sliderThumb, { left: highPos }]}
//       />
//     </View>
//   );
// };

// /* ------------------------------------------------------------------ */
// /* Screen                                                              */
// /* ------------------------------------------------------------------ */
// const FilterScreen = ({ navigation }) => {
//   const [scrollEnabled, setScrollEnabled] = useState(true);

//   // Price
//   const [price, setPrice] = useState({ low: 5308, high: 10130800 });
//   const [priceText, setPriceText] = useState({ low: '5308', high: '10130800' });

//   // Beds / Baths
//   const [beds, setBeds] = useState({ low: 0, high: 10 });
//   const [baths, setBaths] = useState({ low: 0, high: 10 });

//   // Listing information
//   const [yearBuilt, setYearBuilt] = useState('2025');
//   const [area, setArea] = useState('1231');
//   const [lotSize, setLotSize] = useState('5308');

//   // Laundry + features (pre-selected like the Figma design)
//   const [laundry, setLaundry] = useState('In Unit');
//   const [selectedFeatures, setSelectedFeatures] = useState(['Attic', 'Front yard']);

//   const digitsOnly = (t) => t.replace(/[^0-9]/g, '');

//   const handlePriceSlider = (low, high) => {
//     setPrice({ low, high });
//     setPriceText({ low: String(low), high: String(high) });
//   };

//   const commitPriceText = (which) => {
//     const parsed = parseInt(priceText[which], 10);
//     if (Number.isNaN(parsed)) {
//       setPriceText((p) => ({ ...p, [which]: String(price[which]) }));
//       return;
//     }
//     const value = clamp(parsed, PRICE_MIN, PRICE_MAX);
//     const next =
//       which === 'low'
//         ? { low: Math.min(value, price.high), high: price.high }
//         : { low: price.low, high: Math.max(value, price.low) };
//     setPrice(next);
//     setPriceText({ low: String(next.low), high: String(next.high) });
//   };

//   const toggleFeature = (feature) =>
//     setSelectedFeatures((prev) =>
//       prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
//     );

//   const renderPriceBox = (which) => (
//     <View style={[styles.priceBox, which === 'high' && { marginRight: 0 }]}>
//       <Image source={ICONS.currencyDollar} style={styles.dollarIcon} resizeMode="contain" />
//       <TextInput
//         style={styles.priceInput}
//         value={priceText[which]}
//         onChangeText={(t) => setPriceText((p) => ({ ...p, [which]: digitsOnly(t) }))}
//         onEndEditing={() => commitPriceText(which)}
//         keyboardType="numeric"
//         maxLength={9}
//       />
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

//       <ScreenHeader title="Filters" onBack={() => navigation?.goBack()} />

//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       >
//         <ScrollView
//           scrollEnabled={scrollEnabled}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//           contentContainerStyle={styles.container}
//         >
//           {/* Price (Figma top 116) */}
//           <View style={[styles.section, { marginBottom: 23 }]}>
//             <Text style={styles.sectionTitle}>Price</Text>
//             <RangeSlider
//               min={PRICE_MIN}
//               max={PRICE_MAX}
//               step={PRICE_STEP}
//               low={price.low}
//               high={price.high}
//               onChange={handlePriceSlider}
//               onInteract={(active) => setScrollEnabled(!active)}
//             />
//             <View style={styles.rowTwoInputs}>
//               {renderPriceBox('low')}
//               {renderPriceBox('high')}
//             </View>
//           </View>

//           {/* Beds (Figma top 244) */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Beds</Text>
//             <RangeSlider
//               min={0}
//               max={10}
//               step={1}
//               low={beds.low}
//               high={beds.high}
//               onChange={(low, high) => setBeds({ low, high })}
//               onInteract={(active) => setScrollEnabled(!active)}
//             />
//             <View style={styles.rangeLabelsRow}>
//               <Text style={styles.rangeLabelText}>{beds.low === 0 ? 'Studio' : beds.low}</Text>
//               <Text style={styles.rangeLabelText}>{beds.high}</Text>
//             </View>
//           </View>

//           {/* Baths (Figma top 359) */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Baths</Text>
//             <RangeSlider
//               min={0}
//               max={10}
//               step={1}
//               low={baths.low}
//               high={baths.high}
//               onChange={(low, high) => setBaths({ low, high })}
//               onInteract={(active) => setScrollEnabled(!active)}
//             />
//             <View style={styles.rangeLabelsRow}>
//               <Text style={styles.rangeLabelText}>{baths.low}</Text>
//               <Text style={styles.rangeLabelText}>{baths.high}</Text>
//             </View>
//           </View>

//           {/* Listing Information (Figma top 474) */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Listing Information</Text>
//             <View style={styles.rowThreeInputs}>
//               <View style={styles.inputCol}>
//                 <Text style={styles.fieldLabel}>Year Built</Text>
//                 <TextInput
//                   style={styles.simpleInput}
//                   value={yearBuilt}
//                   onChangeText={(t) => setYearBuilt(digitsOnly(t))}
//                   keyboardType="numeric"
//                   maxLength={4}
//                 />
//               </View>
//               <View style={styles.inputCol}>
//                 <Text style={styles.fieldLabel}>Area</Text>
//                 <TextInput
//                   style={styles.simpleInput}
//                   value={area}
//                   onChangeText={(t) => setArea(digitsOnly(t))}
//                   keyboardType="numeric"
//                 />
//               </View>
//               <View style={styles.inputCol}>
//                 <Text style={styles.fieldLabel}>Lot Size</Text>
//                 <TextInput
//                   style={styles.simpleInput}
//                   value={lotSize}
//                   onChangeText={(t) => setLotSize(digitsOnly(t))}
//                   keyboardType="numeric"
//                 />
//               </View>
//             </View>
//           </View>

//           {/* Laundry (Figma top 584) */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Laundry</Text>
//             <View style={styles.radioGroup}>
//               {LAUNDRY_OPTIONS.map((option) => {
//                 const isSelected = laundry === option;
//                 return (
//                   <TouchableOpacity
//                     key={option}
//                     style={styles.radioOption}
//                     activeOpacity={0.8}
//                     onPress={() => setLaundry(option)}
//                   >
//                     <View style={styles.outerRadio}>
//                       {isSelected && <View style={styles.innerRadio} />}
//                     </View>
//                     <Text style={styles.radioLabel}>{option}</Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           </View>

//           {/* Features (Figma top 672): rows of 3, chips grow to fill the row */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Features</Text>
//             {chunk(FEATURES_LIST, 3).map((row, rowIndex) => (
//               <View key={rowIndex} style={styles.chipsRow}>
//                 {row.map((feature, i) => {
//                   const isSelected = selectedFeatures.includes(feature);
//                   return (
//                     <TouchableOpacity
//                       key={feature}
//                       activeOpacity={0.8}
//                       onPress={() => toggleFeature(feature)}
//                       style={[
//                         styles.featureChip,
//                         i < row.length - 1 && { marginRight: 8 },
//                         isSelected && styles.featureChipSelected,
//                       ]}
//                     >
//                       <Text
//                         numberOfLines={1}
//                         style={[styles.featureText, isSelected && styles.featureTextSelected]}
//                       >
//                         {feature}
//                       </Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             ))}
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
//   },

//   // header ends at Figma 96, Price starts at 116
//   container: {
//     paddingHorizontal: 15,
//     paddingTop: 20,
//     paddingBottom: 45,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     height: 24,
//     marginBottom: 10,
//     fontFamily: FONT.medium,
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#000000',
//     includeFontPadding: false,
//   },

//   // Slider
//   sliderContainer: {
//     height: SLIDER_HEIGHT,
//   },
//   sliderBackgroundTrack: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 8,
//     height: TRACK_HEIGHT,
//     backgroundColor: TRACK_GREY,
//     borderRadius: 50,
//   },
//   sliderActiveTrack: {
//     position: 'absolute',
//     top: 8,
//     height: TRACK_HEIGHT,
//     backgroundColor: ORANGE,
//     borderRadius: 50,
//   },
//   sliderThumb: {
//     position: 'absolute',
//     top: 3,
//     width: THUMB,
//     height: THUMB,
//     borderRadius: THUMB / 2,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 3,
//     borderColor: ORANGE,
//   },
//   rangeLabelsRow: {
//     height: 21,
//     marginTop: 9,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   rangeLabelText: {
//     fontFamily: FONT.regular,
//     fontSize: 14,
//     lineHeight: 21,
//     color: TEXT_GREY,
//     includeFontPadding: false,
//   },

//   // Price inputs: 165 x 34, radius 10, padding 8 / 6, gap 5
//   rowTwoInputs: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   priceBox: {
//     flex: 1,
//     height: 34,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 6,
//     borderWidth: 1,
//     borderColor: BORDER_GREY,
//     borderRadius: 10,
//     backgroundColor: '#FFFFFF',
//     marginRight: 16,
//   },
//   dollarIcon: {
//     width: 18,
//     height: 18,
//     tintColor: TEXT_GREY,
//     marginRight: 5,
//   },
//   priceInput: {
//     flex: 1,
//     padding: 0,
//     fontFamily: FONT.regular,
//     fontSize: 14,
//     color: TEXT_GREY,
//     includeFontPadding: false,
//   },

//   // Listing info: three 110 x 34 boxes
//   rowThreeInputs: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   inputCol: {
//     width: 110,
//   },
//   fieldLabel: {
//     height: 18,
//     fontFamily: FONT.medium,
//     fontSize: 12,
//     lineHeight: 18,
//     color: '#000000',
//     includeFontPadding: false,
//   },
//   simpleInput: {
//     height: 34,
//     paddingHorizontal: 6,
//     paddingVertical: 0,
//     borderWidth: 1,
//     borderColor: BORDER_GREY,
//     borderRadius: 10,
//     backgroundColor: '#FFFFFF',
//     fontFamily: FONT.regular,
//     fontSize: 14,
//     color: TEXT_GREY,
//     includeFontPadding: false,
//   },

//   // Laundry radios: 18px circle, 2px border, 14px dot, gap 12
//   radioGroup: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   radioOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   outerRadio: {
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     borderWidth: 2,
//     borderColor: ORANGE,
//     backgroundColor: '#FFFFFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   innerRadio: {
//     width: 14,
//     height: 14,
//     borderRadius: 7,
//     backgroundColor: ORANGE,
//   },
//   radioLabel: {
//     fontFamily: FONT.regular,
//     fontSize: 14,
//     lineHeight: 21,
//     color: TEXT_GREY,
//     includeFontPadding: false,
//   },

//   // Feature chips: 29 high, radius 21, rows gap 10
//   chipsRow: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   featureChip: {
//     flexGrow: 1,
//     height: 29,
//     paddingHorizontal: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 21,
//     borderWidth: 1,
//     borderColor: BORDER_GREY,
//     backgroundColor: '#FFFFFF',
//   },
//   featureChipSelected: {
//     backgroundColor: ORANGE,
//     borderColor: ORANGE,
//   },
//   featureText: {
//     fontFamily: FONT.regular,
//     fontSize: 11,
//     lineHeight: 16,
//     color: '#888888',
//     includeFontPadding: false,
//   },
//   featureTextSelected: {
//     color: '#FFFFFF',
//     fontFamily: FONT.medium,
//   },
// });

// export default FilterScreen;


import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  PanResponder,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ICONS } from '../assets';

const ORANGE = '#FF6C40';
const TEXT = '#404040';
const BORDER = '#E9E9E9';
const TRACK = '#F3F4F6';
const GREY = '#808080';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
};

const PRICE_MAX = 12000000;
const THUMB = 18;

const PROPERTY_TYPES = ['Single Family', 'Townhouse', 'Condo', 'Apartment', 'Duplex', 'Other'];
const FEATURES = [
  'Attic', 'Basement', 'Pool',
  'Loft', 'Sunroom', 'Backyard',
  'Deck', 'Patio', 'Front yard',
  'Dishwasher', 'Disposal', 'Microwave',
  'Ice Dispenser', 'Oven', 'Furnished',
  'Den', 'Balcony', 'Pet Friendly',
];
const AMENITIES = [
  'Fitness Center', 'Package Service', 'Business Center',
  'Play Ground', 'Gameroom', 'Pool',
  'Clubhouse', 'Elevator', 'Dog Park',
  'Concierge',
];
const LAUNDRY = ['In Unit', 'Laundry Facility', 'None'];

// Figma wali default values
const DEFAULTS = {
  priceLow: 5308,
  priceHigh: 10130800,
  bedsLow: 0,
  bedsHigh: 10,
  bathsLow: 0,
  bathsHigh: 10,
  yearBuilt: '2025',
  squareFeet: '1231',
  lotSize: '5308',
  laundry: 'In Unit',
  propertyType: 'Single Family',
  features: ['Attic', 'Front yard'],
  amenities: ['Fitness Center', 'Dog Park'],
};

const EMPTY = {
  priceLow: 0,
  priceHigh: PRICE_MAX,
  bedsLow: 0,
  bedsHigh: 10,
  bathsLow: 0,
  bathsHigh: 10,
  yearBuilt: '',
  squareFeet: '',
  lotSize: '',
  laundry: '',
  propertyType: '',
  features: [],
  amenities: [],
};

/* ---------------- range slider (2 thumbs) ---------------- */

const RangeSlider = ({ min, max, step = 1, low, high, onChange, onDrag }) => {
  const [width, setWidth] = useState(0);
  const widthRef = useRef(0);
  const valRef = useRef({ low, high });
  const changeRef = useRef(onChange);
  const dragRef = useRef(onDrag);
  const startX = useRef(0);

  valRef.current = { low, high };
  changeRef.current = onChange;
  dragRef.current = onDrag;

  const span = () => Math.max(widthRef.current - THUMB, 1);
  const toX = (v) => ((v - min) / (max - min)) * span();
  const toVal = (x) => {
    const r = Math.min(Math.max(x / span(), 0), 1);
    return Math.round((min + r * (max - min)) / step) * step;
  };

  const makeResponder = (which) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        startX.current = toX(valRef.current[which]);
        dragRef.current?.(true);
      },
      onPanResponderMove: (_, g) => {
        const v = toVal(startX.current + g.dx);
        const cur = valRef.current;
        if (which === 'low') changeRef.current(Math.min(v, cur.high), cur.high);
        else changeRef.current(cur.low, Math.max(v, cur.low));
      },
      onPanResponderRelease: () => dragRef.current?.(false),
      onPanResponderTerminate: () => dragRef.current?.(false),
    });

  const lowPan = useRef(makeResponder('low')).current;
  const highPan = useRef(makeResponder('high')).current;

  const lowX = width ? toX(low) : 0;
  const highX = width ? toX(high) : 0;

  return (
    <View
      style={styles.sliderWrap}
      onLayout={(e) => {
        widthRef.current = e.nativeEvent.layout.width;
        setWidth(e.nativeEvent.layout.width);
      }}
    >
      <View style={styles.sliderTrack} />
      {width > 0 && (
        <>
          <View
            style={[
              styles.sliderFill,
              { left: lowX + THUMB / 2, width: Math.max(highX - lowX, 0) },
            ]}
          />
          <View style={[styles.thumb, { left: lowX }]} {...lowPan.panHandlers} />
          <View style={[styles.thumb, { left: highX }]} {...highPan.panHandlers} />
        </>
      )}
    </View>
  );
};

/* ---------------- small pieces ---------------- */

const SectionTitle = ({ children, big }) => (
  <Text style={[styles.sectionTitle, big && styles.sectionTitleBig]}>{children}</Text>
);

const ValueBox = ({ value }) => (
  <View style={styles.valueBox}>
    <Image source={ICONS.currencyDollar} style={styles.dollar} resizeMode="contain" />
    <Text style={styles.valueText}>{value}</Text>
  </View>
);

const InfoInput = ({ label, value, onChangeText }) => (
  <View style={styles.infoCol}>
    <Text style={styles.infoLabel}>{label}</Text>
    <View style={styles.infoBox}>
      <TextInput
        style={styles.infoInput}
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/\D/g, ''))}
        keyboardType="number-pad"
      />
    </View>
  </View>
);

const Radio = ({ label, selected, onPress }) => (
  <TouchableOpacity style={styles.radioRow} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.radioOuter}>{selected && <View style={styles.radioInner} />}</View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

/* 3 chips per row, same look as Figma */
const ChipGrid = ({ options, isSelected, onPress, gap = 8 }) => {
  const rows = [];
  for (let i = 0; i < options.length; i += 3) rows.push(options.slice(i, i + 3));

  return (
    <View>
      {rows.map((row, ri) => (
        <View key={ri} style={[styles.chipRow, ri !== rows.length - 1 && { marginBottom: gap }]}>
          {[0, 1, 2].map((ci) => {
            const opt = row[ci];
            if (!opt) return <View key={ci} style={styles.chipFlex} />;
            const on = isSelected(opt);
            return (
              <TouchableOpacity
                key={opt}
                activeOpacity={0.8}
                onPress={() => onPress(opt)}
                style={[
                  styles.chipFlex,
                  styles.chip,
                  on && styles.chipOn,
                  ci !== 2 && { marginRight: gap },
                ]}
              >
                <Text style={[styles.chipText, on && styles.chipTextOn]} numberOfLines={1}>
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

/* ---------------- screen ---------------- */

const FilterScreen = ({ navigation }) => {
  const [f, setF] = useState(DEFAULTS);
  const [scrollOn, setScrollOn] = useState(true);

  const set = (patch) => setF((p) => ({ ...p, ...patch }));
  const toggleIn = (key, item) =>
    setF((p) => ({
      ...p,
      [key]: p[key].includes(item) ? p[key].filter((x) => x !== item) : [...p[key], item],
    }));

  const apply = () => {
    // TODO: listing screen mein `route.params.filters` se filter lagayein
    navigation.navigate({
      name: 'PropertyListingScreen',
      params: { filters: f },
      merge: true,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        scrollEnabled={scrollOn}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {/* Clear All / Apply */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => setF(EMPTY)} activeOpacity={0.7}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={apply} activeOpacity={0.7}>
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Price */}
        <View style={styles.section}>
          <SectionTitle>Price</SectionTitle>
          <RangeSlider
            min={0}
            max={PRICE_MAX}
            step={100}
            low={f.priceLow}
            high={f.priceHigh}
            onChange={(l, h) => set({ priceLow: l, priceHigh: h })}
            onDrag={(d) => setScrollOn(!d)}
          />
          <View style={styles.priceRow}>
            <ValueBox value={f.priceLow} />
            <ValueBox value={f.priceHigh} />
          </View>
        </View>

        {/* Beds */}
        <View style={styles.section}>
          <SectionTitle>Beds</SectionTitle>
          <RangeSlider
            min={0}
            max={10}
            low={f.bedsLow}
            high={f.bedsHigh}
            onChange={(l, h) => set({ bedsLow: l, bedsHigh: h })}
            onDrag={(d) => setScrollOn(!d)}
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeText}>{f.bedsLow === 0 ? 'Studio' : f.bedsLow}</Text>
            <Text style={styles.rangeText}>{f.bedsHigh}</Text>
          </View>
        </View>

        {/* Baths */}
        <View style={styles.section}>
          <SectionTitle>Baths</SectionTitle>
          <RangeSlider
            min={0}
            max={10}
            low={f.bathsLow}
            high={f.bathsHigh}
            onChange={(l, h) => set({ bathsLow: l, bathsHigh: h })}
            onDrag={(d) => setScrollOn(!d)}
          />
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeText}>{f.bathsLow}</Text>
            <Text style={styles.rangeText}>{f.bathsHigh}</Text>
          </View>
        </View>

        {/* Listing Information */}
        <View style={styles.section}>
          <SectionTitle>Listing Information</SectionTitle>
          <View style={styles.infoRow}>
            <InfoInput
              label="Year Built"
              value={f.yearBuilt}
              onChangeText={(v) => set({ yearBuilt: v.slice(0, 4) })}
            />
            <View style={{ width: 8 }} />
            <InfoInput
              label="Square Feet"
              value={f.squareFeet}
              onChangeText={(v) => set({ squareFeet: v })}
            />
            <View style={{ width: 8 }} />
            <InfoInput
              label="Lot Size"
              value={f.lotSize}
              onChangeText={(v) => set({ lotSize: v })}
            />
          </View>
        </View>

        {/* Laundry */}
        <View style={styles.section}>
          <SectionTitle>Laundry</SectionTitle>
          <View style={styles.laundryRow}>
            {LAUNDRY.map((l) => (
              <Radio
                key={l}
                label={l}
                selected={f.laundry === l}
                onPress={() => set({ laundry: f.laundry === l ? '' : l })}
              />
            ))}
          </View>
        </View>

        {/* Property Type */}
        <View style={styles.section}>
          <SectionTitle>Property Type</SectionTitle>
          <ChipGrid
            options={PROPERTY_TYPES}
            gap={4}
            isSelected={(o) => f.propertyType === o}
            onPress={(o) => set({ propertyType: f.propertyType === o ? '' : o })}
          />
        </View>

        {/* Features */}
        <View style={styles.section}>
          <SectionTitle>Features</SectionTitle>
          <ChipGrid
            options={FEATURES}
            isSelected={(o) => f.features.includes(o)}
            onPress={(o) => toggleIn('features', o)}
          />
        </View>

        {/* Amenities */}
        <View style={[styles.section, { marginBottom: 0 }]}>
          <SectionTitle big>Amenities</SectionTitle>
          <ChipGrid
            options={AMENITIES}
            isSelected={(o) => f.amenities.includes(o)}
            onPress={(o) => toggleIn('amenities', o)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
  },
  backBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  backArrow: {
    width: 11,
    height: 11,
    borderLeftWidth: 2.2,
    borderBottomWidth: 2.2,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
  headerTitle: { fontFamily: FONT.medium, fontSize: 18, color: TEXT },

  content: { paddingHorizontal: 15, paddingTop: 12, paddingBottom: 40 },
  section: { marginBottom: 24 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  clearText: { fontFamily: FONT.regular, fontSize: 16, color: '#000000' },
  applyText: { fontFamily: FONT.medium, fontSize: 16, color: ORANGE },

  sectionTitle: { fontFamily: FONT.medium, fontSize: 14, color: TEXT, marginBottom: 10 },
  sectionTitleBig: { fontSize: 16 },

  /* slider */
  sliderWrap: { height: 24, justifyContent: 'center' },
  sliderTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 7,
    height: 10,
    borderRadius: 50,
    backgroundColor: TRACK,
  },
  sliderFill: {
    position: 'absolute',
    top: 7,
    height: 10,
    borderRadius: 50,
    backgroundColor: ORANGE,
  },
  thumb: {
    position: 'absolute',
    top: 3,
    width: THUMB,
    height: THUMB + 0,
    borderRadius: THUMB / 2,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: ORANGE,
  },
  rangeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  rangeText: { fontFamily: FONT.regular, fontSize: 14, color: TEXT },

  /* price boxes */
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  valueBox: {
    width: '47.8%',
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  dollar: { width: 18, height: 18, marginRight: 5 },
  valueText: { fontFamily: FONT.regular, fontSize: 12, color: TEXT },

  /* listing information */
  infoRow: { flexDirection: 'row' },
  infoCol: { flex: 1 },
  infoLabel: { fontFamily: FONT.medium, fontSize: 12, lineHeight: 18, color: TEXT },
  infoBox: {
    height: 34,
    justifyContent: 'center',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  infoInput: {
    padding: 0,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: TEXT,
  },

  /* laundry */
  laundryRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  radioRow: { flexDirection: 'row', alignItems: 'center' },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: ORANGE,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: ORANGE },
  radioLabel: { fontFamily: FONT.regular, fontSize: 12, color: TEXT },

  /* chips */
  chipRow: { flexDirection: 'row' },
  chipFlex: { flex: 1 },
  chip: {
    height: 29,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  chipOn: { backgroundColor: ORANGE, borderColor: ORANGE },
  chipText: { fontFamily: FONT.regular, fontSize: 11, color: GREY },
  chipTextOn: { fontFamily: FONT.medium, color: '#FFFFFF' },
});

export default FilterScreen;