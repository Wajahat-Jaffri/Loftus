import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import { ICONS } from '../../assets';

const CHEVRON_PNG = require('../../assets/icons/ChevronDown.png');
const PLUS_PNG = require('../../assets/icons/Plus.png');

export const COLORS = {
  orange: '#FF6C40',
  orangeLight: '#FFC4B2',
  blue: '#00ACFC',
  red: '#E5322D',
  text: '#1C1C1C',
  border: '#E3E3E3',
  grey: '#9E9E9E',
  placeholder: '#8C8C8C',
  // Figma form tokens
  fieldBorder: '#C2C2C2',
  fieldText: '#404040',
  label: '#6A6A6A',
};

export const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semi: 'Poppins-SemiBold',
};

/* ---------- helpers ---------- */

export const sanitizeMoney = (t) => {
  const cleaned = t.replace(/[^0-9.]/g, '');
  const [int, ...rest] = cleaned.split('.');
  return rest.length ? `${int}.${rest.join('').slice(0, 2)}` : int;
};

export const formatMoney = (value) => {
  if (value === '' || value == null) return '$0';
  const [int, dec] = String(value).split('.');
  const withCommas = (int || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `$${withCommas}${dec ? `.${dec}` : ''}`;
};

export const isValidDate = (s) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s || '');
  if (!m) return false;
  const d = +m[1];
  const mo = +m[2];
  const y = +m[3];
  const dt = new Date(y, mo - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const prettyDate = (s) => {
  if (!isValidDate(s)) return s || '-';
  const [d, m, y] = s.split('/');
  return `${MONTHS[+m - 1]} ${+d}, ${y}`;
};

const pad = (n) => String(n).padStart(2, '0');

/* Vertical stack with a fixed gap (RN gap is not available on older versions) */
export const Stack = ({ gap = 16, style, children }) => {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <View style={style}>
      {items.map((child, i) => (
        <View key={child.key != null ? child.key : i} style={i > 0 ? { marginTop: gap } : null}>
          {child}
        </View>
      ))}
    </View>
  );
};

/* ---------- small icons (kept for other screens) ---------- */

export const Chevron = ({ size = 6, color = COLORS.text }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRightWidth: 1.4,
      borderBottomWidth: 1.4,
      borderColor: color,
      transform: [{ rotate: '45deg' }],
      marginTop: -3,
    }}
  />
);

export const CloseIcon = ({ size = 14, color = COLORS.text, thickness = 1.6 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        position: 'absolute',
        width: size,
        height: thickness,
        backgroundColor: color,
        borderRadius: 1,
        transform: [{ rotate: '45deg' }],
      }}
    />
    <View
      style={{
        position: 'absolute',
        width: size,
        height: thickness,
        backgroundColor: color,
        borderRadius: 1,
        transform: [{ rotate: '-45deg' }],
      }}
    />
  </View>
);

export const PlusIcon = ({ size = 9, color = COLORS.orange, thickness = 1.4 }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{ position: 'absolute', width: size, height: thickness, backgroundColor: color }}
    />
    <View
      style={{ position: 'absolute', width: thickness, height: size, backgroundColor: color }}
    />
  </View>
);

export const BackArrow = () => (
  <View
    style={{
      width: 10,
      height: 10,
      borderLeftWidth: 1.8,
      borderBottomWidth: 1.8,
      borderColor: COLORS.text,
      transform: [{ rotate: '45deg' }],
      marginLeft: 4,
    }}
  />
);

/* ---------- text link button ("+ Add", "+ Credit Card") ---------- */

export const AddLink = ({ label = 'Add', onPress, style }) => (
  <TouchableOpacity
    style={[styles.addLink, style]}
    activeOpacity={0.7}
    onPress={onPress}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  >
    <Image source={PLUS_PNG} style={styles.addPlus} resizeMode="contain" />
    <Text style={styles.addLinkText}>{label}</Text>
  </TouchableOpacity>
);

/* ---------- form controls ---------- */

export const FieldLabel = ({ children }) => (
  <View style={styles.labelBox}>
    <Text style={styles.label}>{children}</Text>
  </View>
);

/* Figma money / number fields are 343 wide (2px narrower than date and select fields) */
const NARROW = { marginRight: 2 };

export const MoneyField = ({ label, value, onChangeText, containerStyle }) => (
  <View style={[styles.fieldWrap, NARROW, containerStyle]}>
    {!!label && <FieldLabel>{label}</FieldLabel>}
    <View style={[styles.inputBox, styles.inputBoxEnd]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(t) => onChangeText(sanitizeMoney(t))}
        keyboardType="decimal-pad"
        placeholderTextColor={COLORS.placeholder}
      />
      <Image source={ICONS.currencyDollar} style={styles.currencyIcon} resizeMode="contain" />
    </View>
  </View>
);

export const SuffixField = ({ label, value, onChangeText, suffix, containerStyle }) => (
  <View style={[styles.fieldWrap, NARROW, containerStyle]}>
    {!!label && <FieldLabel>{label}</FieldLabel>}
    <View style={[styles.inputBox, styles.inputBoxEnd]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/[^0-9]/g, ''))}
        keyboardType="number-pad"
        maxLength={3}
        placeholderTextColor={COLORS.placeholder}
      />
      <Text style={styles.suffix}>{suffix}</Text>
    </View>
  </View>
);

/* ---------- calendar picker ---------- */

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const parseDate = (s) => {
  const [d, m, y] = s.split('/').map(Number);
  return new Date(y, m - 1, d);
};

const CalendarModal = ({ visible, value, onClose, onPick }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  useEffect(() => {
    if (visible) {
      const base = isValidDate(value) ? parseDate(value) : new Date();
      setYear(base.getFullYear());
      setMonth(base.getMonth());
    }
  }, [visible, value]);

  const prev = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };
  const next = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null)];
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const selected = isValidDate(value) ? parseDate(value) : null;
  const isSelected = (d) =>
    selected &&
    d &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === d;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.centerBackdrop} onPress={onClose}>
        <Pressable style={styles.calendarCard} onPress={() => {}}>
          <View style={styles.calHeader}>
            <TouchableOpacity
              onPress={prev}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.calNav}
            >
              <View style={[styles.navArrow, { transform: [{ rotate: '45deg' }] }]} />
            </TouchableOpacity>
            <Text style={styles.calTitle}>
              {MONTHS[month]} {year}
            </Text>
            <TouchableOpacity
              onPress={next}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.calNav}
            >
              <View style={[styles.navArrow, { transform: [{ rotate: '-135deg' }] }]} />
            </TouchableOpacity>
          </View>

          <View style={styles.calRow}>
            {WEEKDAYS.map((w, i) => (
              <View key={`${w}-${i}`} style={styles.calCell}>
                <Text style={styles.calWeekday}>{w}</Text>
              </View>
            ))}
          </View>

          {rows.map((row, ri) => (
            <View key={ri} style={styles.calRow}>
              {row.map((d, ci) => (
                <TouchableOpacity
                  key={ci}
                  disabled={!d}
                  activeOpacity={0.7}
                  style={styles.calCell}
                  onPress={() => onPick(`${pad(d)}/${pad(month + 1)}/${year}`)}
                >
                  {!!d && (
                    <View style={[styles.calDay, isSelected(d) && styles.calDaySelected]}>
                      <Text style={[styles.calDayText, isSelected(d) && styles.calDayTextSelected]}>
                        {d}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

/* dd/mm/yyyy box with the calendar icon on the right (Figma: 48 high, icon 24) */
export const DateField = ({ label, value, onChangeText, containerStyle }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.fieldWrap, containerStyle]}>
      {!!label && <FieldLabel>{label}</FieldLabel>}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.inputBox, styles.inputBoxBetween]}
        onPress={() => setOpen(true)}
      >
        <Text style={[styles.dateText, !value && { color: COLORS.placeholder }]}>
          {value || 'dd/mm/yyyy'}
        </Text>
        <Image source={ICONS.calendar} style={styles.calendarIcon} resizeMode="contain" />
      </TouchableOpacity>
      <CalendarModal
        visible={open}
        value={value}
        onClose={() => setOpen(false)}
        onPick={(v) => {
          onChangeText(v);
          setOpen(false);
        }}
      />
    </View>
  );
};

/**
 * Dropdown (fully round, 48 high).
 * variant="box"   -> full width (text 14)
 * variant="small" -> half width used for the open house start / end time (text 12)
 */
export const SelectField = ({
  label,
  value,
  placeholder = 'Select..',
  options = [],
  onSelect,
  variant = 'box',
  title,
  containerStyle,
}) => {
  const [open, setOpen] = useState(false);
  const small = variant === 'small';

  return (
    <View style={[small ? styles.smallWrap : styles.fieldWrap, containerStyle]}>
      {!!label && <FieldLabel>{label}</FieldLabel>}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.inputBox, styles.inputBoxBetween, small && styles.inputBoxSmall]}
        onPress={() => setOpen(true)}
      >
        <Text numberOfLines={1} style={small ? styles.smallText : styles.selectText}>
          {value || placeholder}
        </Text>
        <Image
          source={CHEVRON_PNG}
          style={[styles.caret, small && { marginLeft: 4 }]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>{title || label || 'Select'}</Text>
            {options.length === 0 ? (
              <Text style={styles.emptyText}>No options available</Text>
            ) : (
              <FlatList
                data={options}
                keyExtractor={(o, i) => `${o}-${i}`}
                renderItem={({ item }) => {
                  const selected = item === value;
                  return (
                    <TouchableOpacity
                      style={styles.optionRow}
                      activeOpacity={0.7}
                      onPress={() => {
                        onSelect?.(item);
                        setOpen(false);
                      }}
                    >
                      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

/* Orange pill button. Figma: 345 x 50, text 14/500 */
export const PrimaryButton = ({ label, onPress, color = COLORS.orange, style, textStyle }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.primaryBtn, { backgroundColor: color }, style]}
  >
    <Text style={[styles.primaryText, textStyle]}>{label}</Text>
  </TouchableOpacity>
);

/* White rows: label (14, #202020) on the left, value (14, #4B5563) on the right */
export const SummaryRows = ({ rows, gap = 0 }) => (
  <View>
    {rows.map((r, i) => (
      <View key={r.label} style={[styles.summaryRow, i > 0 && gap ? { marginTop: gap } : null]}>
        <Text style={styles.summaryLabel}>{r.label}</Text>
        <Text style={[styles.summaryValue, r.small && styles.summaryValueSmall]} numberOfLines={1}>
          {r.value}
        </Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  fieldWrap: { alignSelf: 'stretch' },
  labelBox: { paddingHorizontal: 4, height: 18, marginBottom: 4, justifyContent: 'center' },
  label: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.label,
    includeFontPadding: false,
  },
  inputBox: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
    borderRadius: 50,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  inputBoxEnd: { justifyContent: 'flex-end' },
  inputBoxBetween: { justifyContent: 'space-between' },
  // half width time pickers: tighter padding so "Select Start Time" fits on one line
  inputBoxSmall: { paddingHorizontal: 12 },
  input: {
    flex: 1,
    height: 46,
    fontFamily: FONT.regular,
    fontSize: 14,
    color: COLORS.fieldText,
    paddingVertical: 0,
    paddingHorizontal: 0,
    includeFontPadding: false,
  },
  currencyIcon: { width: 24, height: 24, marginLeft: 8 },
  suffix: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.placeholder,
    marginLeft: 8,
    includeFontPadding: false,
  },
  calendarIcon: { width: 24, height: 24, tintColor: COLORS.placeholder },
  dateText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.fieldText,
    includeFontPadding: false,
  },
  selectText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.fieldText,
    includeFontPadding: false,
  },
  caret: { width: 20, height: 20, tintColor: COLORS.fieldText, marginLeft: 8 },

  smallWrap: { flex: 1 },
  smallText: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.fieldText,
    includeFontPadding: false,
  },

  addLink: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
  },
  addPlus: { width: 16, height: 16, marginRight: 4 },
  addLinkText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.orange,
    includeFontPadding: false,
  },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: '55%',
  },
  sheetTitle: { fontFamily: FONT.semi, fontSize: 14, color: COLORS.text, marginBottom: 8 },
  optionRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  optionText: { fontFamily: FONT.regular, fontSize: 13, color: COLORS.text },
  optionTextSelected: { fontFamily: FONT.medium, color: COLORS.orange },
  emptyText: { fontFamily: FONT.regular, fontSize: 12, color: COLORS.grey, paddingVertical: 12 },

  primaryBtn: {
    height: 50,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  summaryRow: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  summaryLabel: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 18,
    color: '#202020',
    includeFontPadding: false,
  },
  summaryValue: {
    flexShrink: 1,
    marginLeft: 16,
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 18,
    color: '#4B5563',
    includeFontPadding: false,
  },
  summaryValueSmall: { fontSize: 12, color: '#4E4E4E', maxWidth: 227 },

  /* calendar */
  centerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  calendarCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14 },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calNav: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  navArrow: {
    width: 8,
    height: 8,
    borderLeftWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: COLORS.text,
  },
  calTitle: { fontFamily: FONT.semi, fontSize: 13, color: COLORS.text },
  calRow: { flexDirection: 'row' },
  calCell: { flex: 1, height: 36, alignItems: 'center', justifyContent: 'center' },
  calWeekday: { fontFamily: FONT.medium, fontSize: 10, color: COLORS.grey },
  calDay: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  calDaySelected: { backgroundColor: COLORS.orange },
  calDayText: { fontFamily: FONT.regular, fontSize: 11, color: COLORS.text },
  calDayTextSelected: { color: '#FFFFFF', fontFamily: FONT.medium },
});
