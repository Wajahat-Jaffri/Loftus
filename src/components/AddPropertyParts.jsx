import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const ORANGE = '#FF6C40';
export const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semibold: 'Poppins-SemiBold',
};
const BORDER = '#C2C2C2';
const TEXT = '#404040';

export const AP_ICONS = {
  check: require('../assets/icons/Check.png'),
  chevron: require('../assets/icons/ChevronDown.png'),
  plus: require('../assets/icons/Plus.png'),
  upload: require('../assets/icons/Upload.png'),
  uploadPicture: require('../assets/icons/ImageAdd.png'),
  imageSolid: require('../assets/icons/ImageSolid.png'),
  mapExpand: require('../assets/icons/MapExpand.png'),
  close: require('../assets/icons/Close.png'),
};

/** Puts a fixed gap between children without using `rowGap`. */
export const Stack = ({ gap, children }) => {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <>
      {items.map((c, i) => (
        <View key={i} style={i > 0 ? { marginTop: gap } : null}>
          {c}
        </View>
      ))}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* Stepper: label above active dot, 345 x 6 track, 14px dots           */
/* ------------------------------------------------------------------ */
export const Stepper = ({ steps, current }) => {
  const [w, setW] = useState(0);
  // Figma dot centres: 47, 131, 215, 299 of 345
  const center = (i) => (w * (47 + 84 * i)) / 345;
  const LABEL_W = 120;
  const labelLeft = Math.min(
    Math.max(center(current) - LABEL_W / 2, 0),
    Math.max(w - LABEL_W, 0)
  );

  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      <View style={styles.stepLabelBox}>
        {w > 0 && (
          <Text style={[styles.stepLabel, { left: labelLeft, width: LABEL_W }]}>
            {steps[current]}
          </Text>
        )}
      </View>
      <View style={styles.trackArea}>
        <View style={styles.track} />
        {w > 0 &&
          steps.map((s, i) => {
            const reached = i <= current;
            return (
              <View
                key={s}
                style={[
                  styles.dot,
                  { left: center(i) - 7 },
                  reached ? styles.dotOn : styles.dotOff,
                ]}
              >
                {i < current ? (
                  <Image source={AP_ICONS.check} style={styles.dotCheck} resizeMode="contain" />
                ) : null}
              </View>
            );
          })}
      </View>
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Form fields (48 high, border 1 #C2C2C2, fully round)                */
/* ------------------------------------------------------------------ */
export const Group = ({ label, children }) => (
  <View>
    <View style={styles.labelBox}>
      <Text style={styles.label}>{label}</Text>
    </View>
    <View style={styles.labelGap}>{children}</View>
  </View>
);

export const TextBox = ({
  value,
  onChangeText,
  keyboardType,
  maxLength,
  suffix,
  autoCapitalize = 'words',
}) => (
  <View style={styles.field}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      maxLength={maxLength}
      autoCapitalize={autoCapitalize}
      style={[styles.input, !!suffix && styles.inputRight]}
      placeholderTextColor="#B5B5B5"
      underlineColorAndroid="transparent"
    />
    {!!suffix && <Text style={styles.suffix}>{suffix}</Text>}
  </View>
);

export const TextArea = ({ value, onChangeText }) => (
  <View style={styles.area}>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      multiline
      textAlignVertical="top"
      style={styles.areaInput}
      underlineColorAndroid="transparent"
    />
  </View>
);

export const SelectBox = ({ value, options, onChange, placeholder = 'Select..' }) => {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.field, styles.fieldBetween]}
        onPress={() => setOpen((o) => !o)}
      >
        <Text style={styles.selectText} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Image
          source={AP_ICONS.chevron}
          style={[styles.caret, open && { transform: [{ rotate: '180deg' }] }]}
          resizeMode="contain"
        />
      </TouchableOpacity>
      {open && (
        <View style={styles.menu}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }} keyboardShouldPersistTaps="handled">
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.menuItem}
                onPress={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.selectText,
                    opt === value && { color: ORANGE, fontFamily: FONT.medium },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Checkboxes: 22px box, 3 columns (108 / 121.5 / 90), gap 12          */
/* ------------------------------------------------------------------ */
const CheckItem = ({ label, checked, onPress }) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.checkRow} onPress={onPress}>
    <View style={[styles.checkBox, checked && styles.checkBoxOn]}>
      {checked ? (
        <Image source={AP_ICONS.check} style={styles.checkTick} resizeMode="contain" />
      ) : null}
    </View>
    <Text style={styles.checkLabel} numberOfLines={1}>
      {label}
    </Text>
  </TouchableOpacity>
);

const COL_FLEX = [108, 121.5, 90];

export const CheckColumns = ({ columns, selected, onToggle }) => (
  <View style={styles.checkCols}>
    {columns.map((items, ci) => (
      <View key={ci} style={[{ flex: COL_FLEX[ci] }, ci > 0 && { marginLeft: 12 }]}>
        {items.map((it, i) => (
          <View key={it} style={i > 0 ? { marginTop: 16 } : null}>
            <CheckItem label={it} checked={selected.includes(it)} onPress={() => onToggle(it)} />
          </View>
        ))}
      </View>
    ))}
  </View>
);

/* ------------------------------------------------------------------ */
/* Buttons / headings                                                   */
/* ------------------------------------------------------------------ */
export const PrimaryButton = ({ title, onPress, outlined, height = 50, style }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[
      styles.btn,
      { height },
      outlined ? styles.btnOutlined : styles.btnFilled,
      style,
    ]}
  >
    <Text style={[styles.btnText, outlined && { color: ORANGE }]}>{title}</Text>
  </TouchableOpacity>
);

export const SectionTitle = ({ children }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

/* ------------------------------------------------------------------ */
/* Media step                                                           */
/* ------------------------------------------------------------------ */
export const DefaultImageBox = ({ onUpload }) => (
  <View style={styles.defaultBox}>
    <Image source={AP_ICONS.imageSolid} style={styles.imageSolid} resizeMode="contain" />
    <TouchableOpacity activeOpacity={0.8} style={styles.uploadInner} onPress={onUpload}>
      <Text style={styles.uploadInnerText}>Upload</Text>
    </TouchableOpacity>
  </View>
);

export const MediaRow = ({ label, onPress }) => (
  <TouchableOpacity activeOpacity={0.8} style={styles.mediaRow} onPress={onPress}>
    <Text style={styles.mediaLabel}>{label}</Text>
    <Image source={AP_ICONS.uploadPicture} style={styles.mediaIcon} resizeMode="contain" />
  </TouchableOpacity>
);

export const CustomMediaRow = ({ label, onChangeLabel, onUpload, onRemove }) => (
  <View style={styles.customWrap}>
    <View style={[styles.mediaRow, styles.customRow]}>
      <View style={styles.customLeft}>
        <Text style={styles.addLabel}>Add label</Text>
        <TextInput
          value={label}
          onChangeText={onChangeLabel}
          style={styles.labelInput}
          underlineColorAndroid="transparent"
        />
      </View>
      <TouchableOpacity activeOpacity={0.7} onPress={onUpload}>
        <Image source={AP_ICONS.uploadPicture} style={styles.mediaIcon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.removeBadge}
      onPress={onRemove}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
    >
      <Image source={AP_ICONS.close} style={styles.removeIcon} resizeMode="contain" />
    </TouchableOpacity>
  </View>
);

/* Map card: 345 x 215 (radius 12) with the white expand button at top 12 / right 3. */
export const MapCard = ({ onExpand, style }) => (
  <View style={[styles.mapCard, style]}>
    <Image source={require('../assets/images/MapCard.png')} style={styles.mapCardImage} resizeMode="stretch" />
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.mapExpand}
      onPress={onExpand}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Image source={AP_ICONS.mapExpand} style={styles.mapExpandIcon} resizeMode="contain" />
    </TouchableOpacity>
  </View>
);

export const AddLink = ({ onPress }) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.addLink} onPress={onPress}>
    <Image source={AP_ICONS.plus} style={styles.addPlus} resizeMode="contain" />
    <Text style={styles.addText}>Add</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mapCard: { width: '100%', aspectRatio: 345 / 215, borderRadius: 12, overflow: 'hidden', backgroundColor: '#E6EBEE' },
  mapCardImage: { width: '100%', height: '100%' },
  mapExpand: { position: 'absolute', top: 12, right: 3, width: 36, height: 36 },
  mapExpandIcon: { width: 36, height: 36 },
  /* stepper */
  stepLabelBox: { height: 21 },
  stepLabel: {
    position: 'absolute',
    top: 0,
    textAlign: 'center',
    fontFamily: FONT.semibold,
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.28,
    color: ORANGE,
    includeFontPadding: false,
  },
  trackArea: { height: 14, marginTop: 8 },
  track: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 4,
    height: 6,
    borderRadius: 50,
    backgroundColor: '#ECECEC',
  },
  dot: {
    position: 'absolute',
    top: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOn: { backgroundColor: ORANGE },
  dotOff: { backgroundColor: '#FFB9A5' },
  dotCheck: { position: 'absolute', width: 10, height: 10, tintColor: '#FFFFFF' },

  /* fields */
  labelBox: { paddingHorizontal: 4 },
  label: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#6A6A6A',
    includeFontPadding: false,
  },
  labelGap: { marginTop: 4 },
  field: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 50,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
  },
  fieldBetween: { justifyContent: 'space-between' },
  input: {
    flex: 1,
    height: 30,
    padding: 0,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: TEXT,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  inputRight: { textAlign: 'right', marginRight: 8 },
  suffix: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#8C8C8C',
    includeFontPadding: false,
  },
  area: {
    height: 212,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 24,
    paddingHorizontal: 15,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  areaInput: {
    flex: 1,
    padding: 0,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: TEXT,
    includeFontPadding: false,
  },
  selectText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: TEXT,
    includeFontPadding: false,
  },
  caret: { width: 20, height: 20, tintColor: TEXT, marginLeft: 8 },
  menu: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    overflow: 'hidden',
  },
  menuItem: { paddingVertical: 10, paddingHorizontal: 15 },

  /* checkboxes */
  checkCols: { flexDirection: 'row', alignItems: 'flex-start' },
  checkRow: { height: 22, flexDirection: 'row', alignItems: 'center' },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#A5A5A5',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxOn: { backgroundColor: ORANGE, borderColor: ORANGE },
  checkTick: { width: 14, height: 14, tintColor: '#FFFFFF' },
  checkLabel: {
    flex: 1,
    marginLeft: 8,
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#222222',
    includeFontPadding: false,
  },

  /* buttons & headings */
  btn: { borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  btnFilled: { backgroundColor: ORANGE },
  btnOutlined: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: ORANGE },
  btnText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
  sectionTitle: {
    marginVertical: -3.5,
    fontFamily: FONT.medium,
    fontSize: 18,
    lineHeight: 24,
    color: '#444444',
    includeFontPadding: false,
  },

  /* media */
  defaultBox: {
    height: 179,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 24,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSolid: { width: 46, height: 46 },
  uploadInner: {
    alignSelf: 'stretch',
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadInnerText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: TEXT,
    includeFontPadding: false,
  },
  mediaRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F3F3F3',
  },
  mediaLabel: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: TEXT,
    includeFontPadding: false,
  },
  mediaIcon: { width: 20, height: 20 },
  customWrap: { height: 55 },
  customRow: { position: 'absolute', left: 0, right: 0, top: 3 },
  customLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  addLabel: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#929292',
    marginRight: 8,
    includeFontPadding: false,
  },
  labelInput: {
    width: 176,
    height: 31,
    padding: 0,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    fontFamily: FONT.regular,
    fontSize: 12,
    color: TEXT,
    includeFontPadding: false,
  },
  removeBadge: {
    position: 'absolute',
    top: -4,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: '#F84949',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: { width: 12, height: 12, tintColor: '#FFFFFF' },
  addLink: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  addPlus: { width: 16, height: 16, marginRight: 4 },
  addText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: ORANGE,
    includeFontPadding: false,
  },
});
