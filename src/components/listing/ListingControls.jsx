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

export const COLORS = {
  orange: '#FF6C40',
  orangeLight: '#FFC4B2',
  blue: '#00AEEF',
  red: '#E5322D',
  text: '#1C1C1C',
  border: '#E3E3E3',
  grey: '#9E9E9E',
  placeholder: '#A8A8A8',
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

/* ---------- small icons ---------- */

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

export const AddLink = ({ label, onPress }) => (
  <TouchableOpacity
    style={styles.addLink}
    activeOpacity={0.7}
    onPress={onPress}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  >
    <PlusIcon />
    <Text style={styles.addLinkText}>{label}</Text>
  </TouchableOpacity>
);

/* ---------- form controls ---------- */

export const FieldLabel = ({ children }) => <Text style={styles.label}>{children}</Text>;

export const MoneyField = ({ label, value, onChangeText }) => (
  <View style={styles.fieldWrap}>
    {!!label && <FieldLabel>{label}</FieldLabel>}
    <View style={styles.inputBox}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(t) => onChangeText(sanitizeMoney(t))}
        keyboardType="decimal-pad"
      />
      <Image source={ICONS.currencyDollar} style={styles.currencyIcon} resizeMode="contain" />
    </View>
  </View>
);

export const SuffixField = ({ label, value, onChangeText, suffix }) => (
  <View style={styles.fieldWrap}>
    {!!label && <FieldLabel>{label}</FieldLabel>}
    <View style={styles.inputBox}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
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

export const DateField = ({ label, value, onChangeText, containerStyle }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.fieldWrap, containerStyle]}>
      {!!label && <FieldLabel>{label}</FieldLabel>}
      <TouchableOpacity activeOpacity={0.8} style={styles.inputBox} onPress={() => setOpen(true)}>
        <Text style={[styles.selectText, !value && { color: COLORS.placeholder }]}>
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
 * Dropdown (fully round).
 * variant="box"   -> full width pill (height 40)
 * variant="small" -> small pill used for time pickers
 */
export const SelectField = ({
  label,
  value,
  placeholder = 'Select...',
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
        style={small ? styles.smallBox : styles.inputBox}
        onPress={() => setOpen(true)}
      >
        <Text
          numberOfLines={1}
          style={[
            small ? styles.smallText : styles.selectText,
            !value && { color: small ? COLORS.text : COLORS.placeholder },
          ]}
        >
          {value || placeholder}
        </Text>
        <Chevron size={small ? 5 : 6} />
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

export const PrimaryButton = ({ label, onPress, color = COLORS.orange, style, textStyle }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.primaryBtn, { backgroundColor: color }, style]}
  >
    <Text style={[styles.primaryText, textStyle]}>{label}</Text>
  </TouchableOpacity>
);

/* List rows with divider lines (Confirmation / Duration screens) */
export const SummaryRows = ({ rows }) => (
  <View>
    {rows.map((r) => (
      <View key={r.label} style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>{r.label}</Text>
        <Text style={styles.summaryValue}>{r.value}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  fieldWrap: { marginBottom: 12 },
  label: { fontFamily: FONT.regular, fontSize: 9, color: '#555555', marginBottom: 5, marginLeft: 4 },
  inputBox: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: COLORS.text,
    paddingVertical: 0,
  },
  currencyIcon: { width: 18, height: 18 },
  suffix: { fontFamily: FONT.regular, fontSize: 9, color: COLORS.grey },
  calendarIcon: { width: 14, height: 14, tintColor: '#777777' },
  selectText: { flex: 1, fontFamily: FONT.regular, fontSize: 11, color: COLORS.text },

  smallWrap: { flex: 1 },
  smallBox: {
    height: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  smallText: { fontFamily: FONT.regular, fontSize: 8.5, color: COLORS.text, marginRight: 6 },

  addLink: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  addLinkText: { fontFamily: FONT.regular, fontSize: 10, color: COLORS.orange, marginLeft: 4 },

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
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: FONT.medium, fontSize: 12, color: '#FFFFFF' },

  summaryRow: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  summaryLabel: { fontFamily: FONT.regular, fontSize: 10, color: COLORS.text },
  summaryValue: { fontFamily: FONT.regular, fontSize: 10, color: COLORS.text },

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