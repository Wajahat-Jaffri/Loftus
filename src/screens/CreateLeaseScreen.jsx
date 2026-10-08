import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import { InfoFormModal } from '../components/lease/LeaseModals';
import { FONT } from '../components/listing/ListingControls';
import { LEASE_PROPERTIES, addLease } from '../constants/leaseData';

const PLUS_PNG = require('../assets/icons/Plus.png');
const CHECK_PNG = require('../assets/icons/Check.png');
const CLOUD_UP = require('../assets/icons/CloudArrowUp.png');
const WARNING = require('../assets/icons/WarningTriangle.png');

/* colours taken from the web "Create Lease" page */
const ORANGE = '#FF6C40';
const BLUE = '#088FFF';
const TITLE = '#444444';
const LABEL = '#5E5E5E';
const FIELD_BORDER = '#EBEBEB';
const BAND = '#E7EEF3';
const ERROR = '#F0476F';

const money = (t) => t.replace(/[^0-9.]/g, '');
let uid = 0;
const newRow = () => ({ id: ++uid, name: '', amount: '' });

/* grey filled circle with a white "?" (web help icon) */
const HelpIcon = () => (
  <View style={styles.help}>
    <Text style={styles.helpText}>?</Text>
  </View>
);

/* thin circle with an x (web remove icon) */
const RemoveIcon = ({ onPress, style }) => (
  <TouchableOpacity
    style={[styles.remove, style]}
    activeOpacity={0.7}
    onPress={onPress}
    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  >
    <View style={[styles.removeLine, { transform: [{ rotate: '45deg' }] }]} />
    <View style={[styles.removeLine, { transform: [{ rotate: '-45deg' }] }]} />
  </TouchableOpacity>
);

const RoundPlus = ({ color, size, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[
      styles.roundPlus,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
    ]}
  >
    <Image source={PLUS_PNG} style={{ width: size * 0.42, height: size * 0.42, tintColor: '#FFFFFF' }} resizeMode="contain" />
  </TouchableOpacity>
);

const Label = ({ children, help }) => (
  <View style={styles.labelRow}>
    <Text style={styles.label}>{children}</Text>
    {help ? <HelpIcon /> : null}
  </View>
);

const Field = ({ value, onChangeText, placeholder, keyboardType, maxLength, dollar, error, mono }) => (
  <View style={[styles.field, error && styles.fieldError]}>
    <TextInput
      style={[styles.fieldText, mono && styles.fieldMono]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#8A8A8A"
      keyboardType={keyboardType}
      maxLength={maxLength}
      autoCorrect={false}
    />
    {dollar ? <Text style={styles.dollar}>$</Text> : null}
  </View>
);

/* MM/DD/YYYY mask: "__ / __ / ____" placeholder */
const maskDate = (t) => {
  const d = t.replace(/[^0-9]/g, '').slice(0, 8);
  const a = d.slice(0, 2);
  const b = d.slice(2, 4);
  const c = d.slice(4, 8);
  return [a, b, c].filter((x, i) => x || (i === 0 && false)).join('/');
};

const CostSection = ({ title, rows, setRows }) => {
  const update = (id, key, v) =>
    setRows((l) => l.map((r) => (r.id === id ? { ...r, [key]: v } : r)));
  return (
    <View style={styles.costCard}>
      <Text style={styles.costTitle}>{title}</Text>
      {rows.map((r) => (
        <View key={r.id} style={styles.band}>
          <View style={styles.bandInput}>
            <TextInput
              style={styles.bandText}
              value={r.name}
              onChangeText={(t) => update(r.id, 'name', t)}
              placeholder="Expense Name"
              placeholderTextColor="#333333"
              autoCorrect={false}
            />
          </View>
          <View style={[styles.bandInput, { marginLeft: 10 }]}>
            <TextInput
              style={styles.bandText}
              value={r.amount}
              onChangeText={(t) => update(r.id, 'amount', money(t))}
              placeholder="Cost"
              placeholderTextColor="#333333"
              keyboardType="numeric"
            />
            <Text style={styles.dollar}>$</Text>
          </View>
          <RemoveIcon
            style={styles.bandRemove}
            onPress={() => setRows((l) => l.filter((x) => x.id !== r.id))}
          />
        </View>
      ))}
      <View style={styles.plusWrap}>
        <RoundPlus color={BLUE} size={28} onPress={() => setRows((l) => [...l, newRow()])} />
      </View>
    </View>
  );
};

const CreateLeaseScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const property = route?.params?.property || LEASE_PROPERTIES[0];
  const tenant = route?.params?.tenant;

  const [monthToMonth, setMonthToMonth] = useState(false);
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    rent: '',
    deposit: '',
    nsf: '',
    lateFee: '',
  });
  const [lateRequired, setLateRequired] = useState(false);
  const set = (k, fn = (x) => x) => (t) => setForm((f) => ({ ...f, [k]: fn(t) }));

  const [tenants, setTenants] = useState([tenant || { name: 'George Phillipe' }]);
  const [recurring, setRecurring] = useState([newRow(), newRow()]);
  const [oneTime, setOneTime] = useState([newRow(), newRow()]);
  const [tenantModal, setTenantModal] = useState(false);

  const confirm = () => {
    if (!form.lateFee.trim()) {
      setLateRequired(true);
      return;
    }
    const clean = (rows) =>
      rows.filter((r) => r.name.trim() || r.amount).map((r) => ({ name: r.name.trim() || '-', amount: r.amount || '0' }));
    addLease({
      address: property.address,
      tenants,
      recurring: clean(recurring),
      oneTime: clean(oneTime),
      terms: {
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        rentAmount: form.rent ? `$${form.rent}` : undefined,
        securityDeposit: form.deposit ? `$${form.deposit}` : undefined,
        lateFee: form.lateFee ? `$${form.lateFee}` : undefined,
        nsfFee: form.nsf ? `$${form.nsf}` : undefined,
        monthToMonth: monthToMonth ? 'Yes' : 'No',
      },
    });
    navigation.navigate('Leases');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader title="Create Lease" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.content, { paddingBottom: 32 + insets.bottom }]}
      >
        {/* Property Address */}
        <View style={styles.addressBlock}>
          <Text style={styles.addrTitle}>Property Address</Text>
          <Text style={styles.addrText}>{property.address}</Text>
        </View>
        <View style={styles.divider} />

        {/* Upload PDF */}
        <View style={styles.uploadWrap}>
          <TouchableOpacity activeOpacity={0.85} style={styles.upload} onPress={() => {}}>
            <Image source={CLOUD_UP} style={styles.uploadIcon} resizeMode="contain" />
            <Text style={styles.uploadText}>Upload PDF</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        {/* form */}
        <View style={styles.form}>
          <View style={styles.checkRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.checkBox, monthToMonth && styles.checkBoxOn]}
              onPress={() => setMonthToMonth((v) => !v)}
            >
              {monthToMonth ? (
                <Image source={CHECK_PNG} style={styles.checkMark} resizeMode="contain" />
              ) : null}
            </TouchableOpacity>
            <Text style={styles.checkText}>Continue Month-to-Month</Text>
            <HelpIcon />
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Label help>Payment Start Date</Label>
              <Field
                value={form.startDate}
                onChangeText={set('startDate', maskDate)}
                placeholder="__ / __ / ____"
                keyboardType="numeric"
                maxLength={10}
                mono
              />
            </View>
            <View style={styles.col}>
              <Label>Lease End Date</Label>
              <Field
                value={form.endDate}
                onChangeText={set('endDate', maskDate)}
                placeholder="__ / __ / ____"
                keyboardType="numeric"
                maxLength={10}
                mono
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Label>Rent Amount</Label>
              <Field value={form.rent} onChangeText={set('rent', money)} keyboardType="numeric" dollar />
            </View>
            <View style={styles.col}>
              <Label>Security Deposit</Label>
              <Field value={form.deposit} onChangeText={set('deposit', money)} keyboardType="numeric" dollar />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Label help>Non-Sufficient Funds Fee</Label>
              <Field value={form.nsf} onChangeText={set('nsf', money)} keyboardType="numeric" dollar />
            </View>
            <View style={styles.col}>
              <Label help>Late Fee</Label>
              <Field
                value={form.lateFee}
                onChangeText={(t) => {
                  setLateRequired(false);
                  set('lateFee', money)(t);
                }}
                keyboardType="numeric"
                dollar
                error={lateRequired}
              />
              {lateRequired ? (
                <View style={styles.requiredRow}>
                  <Image source={WARNING} style={styles.requiredIcon} resizeMode="contain" />
                  <Text style={styles.requiredText}>Required</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Tenant(s) */}
        <Text style={styles.sectionTitle}>Tenant(s):</Text>
        {tenants.map((t, i) => (
          <View key={`${t.name}-${i}`} style={styles.tenantRow}>
            <Text style={styles.tenantName} numberOfLines={1}>
              {t.name}
            </Text>
            <RemoveIcon onPress={() => setTenants((l) => l.filter((_, x) => x !== i))} />
          </View>
        ))}
        <View style={styles.plusWrap}>
          <RoundPlus color={ORANGE} size={28} onPress={() => setTenantModal(true)} />
        </View>
        <View style={[styles.divider, { marginTop: 14 }]} />

        <CostSection title="Recurring Costs" rows={recurring} setRows={setRecurring} />
        <CostSection title="One-Time Costs" rows={oneTime} setRows={setOneTime} />

        <TouchableOpacity activeOpacity={0.85} style={styles.confirm} onPress={confirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>

      <InfoFormModal
        visible={tenantModal}
        title="New Tenant Information"
        fields={[
          { key: 'name', label: 'Name', placeholder: 'Enter name' },
          {
            key: 'email',
            label: 'Email',
            placeholder: 'Enter email',
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          },
        ]}
        onClose={() => setTenantModal(false)}
        onSubmit={(v) => {
          setTenants((l) => [...l, { name: v.name.trim(), email: v.email.trim() }]);
          setTenantModal(false);
        }}
      />
    </SafeAreaView>
  );
};

const shadow = {
  elevation: 4,
  shadowColor: '#000000',
  shadowOpacity: 0.18,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingTop: 14, paddingHorizontal: 15 },

  addressBlock: { paddingBottom: 14 },
  addrTitle: {
    fontFamily: FONT.semi,
    fontSize: 16,
    lineHeight: 24,
    color: TITLE,
    includeFontPadding: false,
  },
  addrText: {
    marginTop: 2,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#A0A0A0',
    includeFontPadding: false,
  },
  divider: { height: 1, backgroundColor: '#F1F1F1' },

  uploadWrap: { paddingVertical: 14, alignItems: 'center' },
  upload: {
    height: 40,
    paddingHorizontal: 22,
    borderRadius: 20,
    backgroundColor: ORANGE,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow,
  },
  uploadIcon: { width: 22, height: 22, tintColor: '#FFFFFF', marginRight: 6 },
  uploadText: {
    fontFamily: FONT.semi,
    fontSize: 13,
    lineHeight: 20,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  form: { paddingTop: 14 },
  checkRow: { height: 20, flexDirection: 'row', alignItems: 'center' },
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#D3D3D3',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxOn: { backgroundColor: ORANGE, borderColor: ORANGE },
  checkMark: { width: 10, height: 10, tintColor: '#FFFFFF' },
  checkText: {
    marginLeft: 8,
    marginRight: 6,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#6B6B6B',
    includeFontPadding: false,
  },

  help: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#8D8D8D',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  helpText: {
    fontFamily: FONT.semi,
    fontSize: 9,
    lineHeight: 12,
    color: '#FFFFFF',
    includeFontPadding: false,
  },

  row: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between' },
  col: { width: 168.5 },
  labelRow: { height: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  label: {
    flexShrink: 0,
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 18,
    color: LABEL,
    includeFontPadding: false,
  },
  field: {
    height: 40,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 4,
    backgroundColor: '#FEFEFE',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldError: { borderColor: '#F7B6C5' },
  fieldText: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    height: 24,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#404040',
    includeFontPadding: false,
  },
  fieldMono: { letterSpacing: 1 },
  dollar: {
    marginLeft: 6,
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#9A9A9A',
    includeFontPadding: false,
  },
  requiredRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center' },
  requiredIcon: { width: 10, height: 10, tintColor: ERROR, marginRight: 3 },
  requiredText: {
    fontFamily: FONT.regular,
    fontSize: 9,
    lineHeight: 12,
    color: ERROR,
    includeFontPadding: false,
  },

  sectionTitle: {
    marginTop: 22,
    fontFamily: FONT.semi,
    fontSize: 16,
    lineHeight: 24,
    color: TITLE,
    includeFontPadding: false,
  },
  tenantRow: {
    marginTop: 10,
    height: 40,
    borderWidth: 1,
    borderColor: FIELD_BORDER,
    borderRadius: 4,
    backgroundColor: '#FEFEFE',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tenantName: {
    flex: 1,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#404040',
    includeFontPadding: false,
  },

  plusWrap: { marginTop: 12, alignItems: 'center' },
  roundPlus: { alignItems: 'center', justifyContent: 'center', ...shadow },

  costCard: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#EDF3FA',
    borderRadius: 4,
    backgroundColor: '#FDFDFD',
    paddingHorizontal: 12,
    paddingTop: 14,
    paddingBottom: 14,
  },
  costTitle: {
    marginBottom: 10,
    fontFamily: FONT.semi,
    fontSize: 14,
    lineHeight: 21,
    color: TITLE,
    includeFontPadding: false,
  },
  band: {
    marginBottom: 8,
    marginRight: 6,
    padding: 6,
    borderRadius: 4,
    backgroundColor: BAND,
    flexDirection: 'row',
  },
  bandInput: {
    flex: 1,
    height: 34,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bandText: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    height: 24,
    fontFamily: FONT.regular,
    fontSize: 11,
    color: '#333333',
    includeFontPadding: false,
  },
  bandRemove: { position: 'absolute', top: -8, right: -9 },

  remove: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeLine: { position: 'absolute', width: 8, height: 1, backgroundColor: '#9A9A9A' },

  confirm: {
    marginTop: 24,
    alignSelf: 'center',
    height: 40,
    minWidth: 120,
    paddingHorizontal: 28,
    borderRadius: 20,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  confirmText: {
    fontFamily: FONT.medium,
    fontSize: 13,
    lineHeight: 20,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});

export default CreateLeaseScreen;
