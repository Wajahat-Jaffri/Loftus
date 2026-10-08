import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import { COLORS, FONT } from '../listing/ListingControls';
import { LEASE_PROPERTIES } from '../../constants/leaseData';

const CLOSE_PNG = require('../../assets/icons/Close.png');

const ChevronDown = ({ color = '#515151' }) => (
  <View style={styles.chevronBox}>
    <View style={[styles.chevron, { borderColor: color }]} />
  </View>
);

/* shared shell: 20% overlay over the whole screen, white card 345 wide, radius 14, centered */
const ModalShell = ({ visible, title, onClose, children }) => {
  const { height } = useWindowDimensions();
  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.card, { maxHeight: height - 40 }]} onPress={() => {}}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <View style={styles.closeBox}>
                <Image source={CLOSE_PNG} style={styles.closeIcon} resizeMode="contain" />
              </View>
            </TouchableOpacity>
          </View>
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const Field = ({ label, placeholder, value, onChangeText, keyboardType, autoCapitalize }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.input}>
      <TextInput
        style={styles.inputText}
        placeholder={placeholder}
        placeholderTextColor="#515151"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
      />
    </View>
  </View>
);

const SubmitButton = ({ onPress }) => (
  <TouchableOpacity activeOpacity={0.85} style={styles.submit} onPress={onPress}>
    <Text style={styles.submitText}>Submit</Text>
  </TouchableOpacity>
);

/**
 * "Leases Modal" - New Tenant Information (Figma 345 x 531):
 * Select Property, error toast when the property has no offers, "Or" divider, External Invite.
 * onSubmit({ property, tenant })
 */
export const LeaseCreateModal = ({ visible, onClose, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [property, setProperty] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showRequired, setShowRequired] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShowRequired(false);
      setOpen(false);
      setProperty(null);
      setTenantId(null);
      setName('');
      setEmail('');
    }
  }, [visible]);

  const noOffers = !property || property.offerTenants.length === 0;

  const submit = () => {
    // the lease belongs to a property, so one must be chosen (its address is shown on Create Lease)
    if (!property) {
      setShowRequired(true);
      return;
    }
    if (name.trim() || email.trim()) {
      onSubmit?.({ property, tenant: { name: name.trim(), email: email.trim() } });
      return;
    }
    const t = property?.offerTenants.find((x) => x.id === tenantId);
    if (property && t) onSubmit?.({ property, tenant: t });
  };

  return (
    <ModalShell visible={visible} title="New Tenant Information" onClose={onClose}>
      <View style={styles.block}>
        <Text style={styles.label}>Select Property</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.input, showRequired && !property && styles.inputError]}
          onPress={() => setOpen((o) => !o)}
        >
          <Text style={styles.selectText}>{property ? property.name : 'Property'}</Text>
          <ChevronDown />
        </TouchableOpacity>
        {showRequired && !property ? <Text style={styles.required}>Required</Text> : null}
      </View>

      {open && (
        <View style={styles.dropdown}>
          {LEASE_PROPERTIES.map((p, i) => (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.7}
              style={[styles.option, i !== LEASE_PROPERTIES.length - 1 && styles.optionDivider]}
              onPress={() => {
                setProperty(p);
                setShowRequired(false);
                setTenantId(null);
                setOpen(false);
              }}
            >
              <Text style={[styles.optionText, property?.id === p.id && styles.optionTextOn]}>
                {p.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {noOffers ? (
        <View style={[styles.errToast, styles.gap]}>
          <Text style={styles.errText}>No offer(s) available!</Text>
        </View>
      ) : (
        <View style={[styles.gap, { alignSelf: 'stretch' }]}>
          {property.offerTenants.map((t) => (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.8}
              style={[styles.tenantPick, tenantId === t.id && styles.tenantPickOn]}
              onPress={() => setTenantId(t.id)}
            >
              <Text style={[styles.optionText, tenantId === t.id && styles.optionTextOn]}>
                {t.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={[styles.orRow, styles.gap]}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.orLine} />
      </View>

      <Text style={[styles.subTitle, styles.gap]}>External Invite</Text>

      <View style={styles.gap}>
        <Field label="Name" placeholder="Enter name" value={name} onChangeText={setName} />
      </View>
      <View style={styles.gap}>
        <Field
          label="Email"
          placeholder="Enter email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <SubmitButton onPress={submit} />
    </ModalShell>
  );
};

/**
 * "Modal" - New Tenant Information (Figma 345 x 314) and its cost variants:
 * two labelled pill inputs + Submit.
 * fields = [{ key, label, placeholder, keyboardType }]
 */
export const InfoFormModal = ({ visible, title, fields, onClose, onSubmit }) => {
  const [values, setValues] = useState({});

  useEffect(() => {
    if (!visible) setValues({});
  }, [visible]);

  return (
    <ModalShell visible={visible} title={title} onClose={onClose}>
      {fields.map((f) => (
        <View key={f.key} style={styles.block}>
          <Field
            label={f.label}
            placeholder={f.placeholder}
            keyboardType={f.keyboardType}
            autoCapitalize={f.autoCapitalize}
            value={values[f.key] || ''}
            onChangeText={(t) => setValues((v) => ({ ...v, [f.key]: t }))}
          />
        </View>
      ))}
      <SubmitButton
        onPress={() => {
          const ok = fields.every((f) => (values[f.key] || '').trim());
          if (ok) onSubmit?.(values);
        }}
      />
    </ModalShell>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 32,
  },
  titleRow: { height: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: {
    flex: 1,
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    includeFontPadding: false,
  },
  closeBox: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  closeIcon: { width: 19, height: 19, tintColor: '#000000' },

  block: { marginTop: 14 },
  fieldWrap: {},
  gap: { marginTop: 14 },
  label: {
    height: 21,
    marginBottom: 4,
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#404040',
    includeFontPadding: false,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 50,
    paddingHorizontal: 11, // Figma 12 minus the border
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  inputText: {
    flex: 1,
    padding: 0,
    height: 18,
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#515151',
    includeFontPadding: false,
  },
  inputError: { borderColor: '#E5322D' },
  required: {
    marginTop: 4,
    marginLeft: 12,
    fontFamily: FONT.regular,
    fontSize: 11,
    lineHeight: 16,
    color: '#E5322D',
    includeFontPadding: false,
  },
  selectText: {
    fontFamily: FONT.medium,
    fontSize: 12,
    lineHeight: 18,
    color: '#515151',
    includeFontPadding: false,
  },
  chevronBox: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  chevron: {
    width: 7.8,
    height: 7.8,
    borderRightWidth: 1.6,
    borderBottomWidth: 1.6,
    transform: [{ rotate: '45deg' }, { translateY: -2.4 }],
  },

  dropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  option: { paddingVertical: 12, paddingHorizontal: 16 },
  optionDivider: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  optionText: {
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#515151',
    includeFontPadding: false,
  },
  optionTextOn: { fontFamily: FONT.medium, color: COLORS.orange },
  tenantPick: {
    height: 44,
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 14,
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 6,
  },
  tenantPickOn: { borderColor: COLORS.orange },

  errToast: {
    height: 44,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: '#F2DEDE',
    justifyContent: 'center',
  },
  errText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 20,
    color: '#C94D4D',
    includeFontPadding: false,
  },

  orRow: { height: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  orLine: { flex: 1, height: 1, backgroundColor: '#BDBFBE' },
  orText: {
    marginHorizontal: 10,
    fontFamily: FONT.regular,
    fontSize: 12,
    lineHeight: 18,
    color: '#565656',
    includeFontPadding: false,
  },
  subTitle: {
    height: 24,
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#000000',
    includeFontPadding: false,
  },

  submit: {
    marginTop: 14,
    height: 50,
    borderRadius: 50,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});
