import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNav from '../components/BottomNav';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Field, SelectField, PrimaryButton } from '../components/FormControls';
import { ICONS, IMAGES } from '../assets';

const ORANGE = '#FF6C40';
const TEXT = '#1C1C1C';
const LIGHT = '#C4C4C4';
const BORDER = '#E6E6E6';

const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semi: 'Poppins-SemiBold',
};

const TABS = ['Account Details', 'Change Password', 'Security Questions'];

const COUNTRIES = ['N/A', 'United States', 'Canada', 'United Kingdom', 'Pakistan', 'United Arab Emirates'];
const STATES = ['N/A', 'California', 'Texas', 'New York', 'Florida', 'Punjab', 'Sindh'];
const SECURITY_QUESTIONS = [
  'What was the name of your first pet?',
  'What is your mother’s maiden name?',
  'What was the name of your first school?',
  'In which city were you born?',
  'What was your childhood nickname?',
];

/* ------------------------------------------------------------------ */
/* Avatar card (centered on Account Details, side-by-side on others)   */
/* ------------------------------------------------------------------ */
const AvatarCard = ({ compact, photo, onPressEdit }) => (
  <View style={[styles.avatarCard, compact && styles.avatarCardCompact]}>
    <View>
      <Image source={photo || IMAGES.profile} style={styles.avatar} />
      <TouchableOpacity style={styles.avatarBadge} onPress={onPressEdit} activeOpacity={0.8}>
        <Image source={ICONS.pencilSimple} style={styles.avatarBadgeIcon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
    {compact && (
      <View style={styles.avatarInfo}>
        <Text style={styles.avatarName}>Jerry Helfer</Text>
        <Text style={styles.avatarRole}>Landlord</Text>
      </View>
    )}
  </View>
);

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */
const TabBar = ({ active, onChange }) => (
  <View style={styles.tabBar}>
    {TABS.map((t) => (
      <TouchableOpacity key={t} style={[styles.tab, active === t && styles.tabActive]} onPress={() => onChange(t)}>
        <Text style={[styles.tabText, active === t && styles.tabTextActive]}>{t}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

/* ------------------------------------------------------------------ */
/* Update Email / Phone modal                                          */
/* ------------------------------------------------------------------ */
const UpdateModal = ({ visible, title, description, placeholder, icon, keyboardType, onCancel, onSubmit }) => {
  const [value, setValue] = useState('');

  const close = () => {
    setValue('');
    onCancel();
  };

  const submit = () => {
    if (!value.trim()) {
      Alert.alert('Required', `Please enter your ${placeholder.toLowerCase()}.`);
      return;
    }
    onSubmit(value.trim());
    setValue('');
  };

  return (
    <Modal visible={visible} transparent statusBarTranslucent animationType="fade" onRequestClose={close}>
      <Pressable style={styles.modalOverlay} onPress={close}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalDesc}>{description}</Text>

          <View style={styles.modalInput}>
            <Image source={icon} style={styles.modalInputIcon} resizeMode="contain" />
            <TextInput
              style={styles.modalInputText}
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              placeholderTextColor={LIGHT}
              keyboardType={keyboardType}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.modalBtns}>
            <TouchableOpacity style={[styles.modalBtn, styles.modalBtnOutline]} onPress={close}>
              <Text style={[styles.modalBtnText, { color: ORANGE }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalBtn, styles.modalBtnFilled]} onPress={submit}>
              <Text style={[styles.modalBtnText, { color: '#FFFFFF' }]}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

/* ------------------------------------------------------------------ */
/* Upload photo bottom sheet                                           */
/* ------------------------------------------------------------------ */
const PhotoSheet = ({ visible, onClose, onTakePhoto, onChoosePhoto }) => (
  <Modal visible={visible} transparent statusBarTranslucent animationType="slide" onRequestClose={onClose}>
    <Pressable style={styles.sheetOverlay} onPress={onClose}>
      <Pressable style={styles.sheet} onPress={() => {}}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>Upload your photo</Text>

        <TouchableOpacity style={styles.sheetRow} onPress={onTakePhoto}>
          <View style={styles.cameraGlyph}>
            <View style={styles.cameraLens} />
          </View>
          <Text style={styles.sheetRowText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sheetRow} onPress={onChoosePhoto}>
          <View style={styles.galleryGlyph}>
            <View style={styles.galleryDot} />
          </View>
          <Text style={styles.sheetRowText}>Choose from Library</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </Modal>
);

/* ------------------------------------------------------------------ */
/* Tab contents                                                        */
/* ------------------------------------------------------------------ */
const AccountDetails = ({ form, setField, onEditEmail, onEditPhone }) => (
  <View>
    <Text style={styles.sectionTitle}>Basic Details</Text>
    <Field label="First Name" value={form.firstName} onChangeText={(v) => setField('firstName', v)} />
    <Field label="Middle Name" value={form.middleName} onChangeText={(v) => setField('middleName', v)} />
    <Field label="Last name" value={form.lastName} onChangeText={(v) => setField('lastName', v)} />
    <Field label="Email" value={form.email} readOnly rightText="Edit" onRightPress={onEditEmail} />
    <Field label="Phone Number" value={form.phone} readOnly rightText="Edit" onRightPress={onEditPhone} />
    <Field
      label="Date of birth"
      value={form.dob}
      onChangeText={(v) => setField('dob', v)}
      placeholder="DD/MM/YYYY"
      keyboardType="numbers-and-punctuation"
      rightIcon={<Image source={ICONS.calendar} style={styles.calIcon} resizeMode="contain" />}
    />

    <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Further Details</Text>
    <Field label="Address Line 1" value={form.address1} onChangeText={(v) => setField('address1', v)} />
    <Field label="Address Line 2" value={form.address2} onChangeText={(v) => setField('address2', v)} />
    <SelectField label="Country" value={form.country} options={COUNTRIES} onSelect={(v) => setField('country', v)} />
    <SelectField label="State" value={form.state} options={STATES} onSelect={(v) => setField('state', v)} />
    <Field label="City" value={form.city} onChangeText={(v) => setField('city', v)} />
    <Field label="Zipcode" value={form.zip} onChangeText={(v) => setField('zip', v)} keyboardType="number-pad" />
    <Field label="Profile Bio" value={form.bio} onChangeText={(v) => setField('bio', v)} multiline />
  </View>
);

const ChangePassword = () => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const save = () => {
    if (!oldPass || !newPass || !confirmPass) return Alert.alert('Required', 'Please fill in all fields.');
    if (newPass.length < 8) return Alert.alert('Weak password', 'New password must be at least 8 characters.');
    if (newPass !== confirmPass) return Alert.alert('Mismatch', 'New password and confirm password do not match.');
    // TODO: call change-password API here
    Alert.alert('Success', 'Your password has been updated.');
    setOldPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Change Your Password</Text>
      <Field label="Old Password" value={oldPass} onChangeText={setOldPass} secureTextEntry autoCapitalize="none" />
      <Field label="New Password" value={newPass} onChangeText={setNewPass} secureTextEntry autoCapitalize="none" />
      <Field label="Confirm Password" value={confirmPass} onChangeText={setConfirmPass} secureTextEntry autoCapitalize="none" />
      <PrimaryButton title="Save" onPress={save} />
    </View>
  );
};

const SecurityQuestions = () => {
  const [items, setItems] = useState([
    { q: '', a: '' },
    { q: '', a: '' },
    { q: '', a: '' },
  ]);

  const update = (i, key, value) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));

  const save = () => {
    if (items.some((it) => !it.q || !it.a.trim())) {
      return Alert.alert('Required', 'Please select a question and answer for all three.');
    }
    if (new Set(items.map((it) => it.q)).size !== items.length) {
      return Alert.alert('Duplicate questions', 'Please choose three different questions.');
    }
    // TODO: call security-questions API here
    Alert.alert('Success', 'Your security questions have been saved.');
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>Security Questions</Text>
      {items.map((it, i) => (
        <View key={i}>
          <SelectField
            label="Select Question"
            placeholder="Select"
            value={it.q}
            options={SECURITY_QUESTIONS}
            onSelect={(v) => update(i, 'q', v)}
          />
          <Field label="Answer" value={it.a} onChangeText={(v) => update(i, 'a', v)} />
        </View>
      ))}
      <PrimaryButton title="Save" onPress={save} />
    </View>
  );
};

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */
const EditProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Account Details');
  const [photo, setPhoto] = useState(null);
  const [showSheet, setShowSheet] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const [form, setForm] = useState({
    firstName: 'Jerry',
    middleName: '',
    lastName: 'Helfer',
    email: 'jerryhelder123@gmail.com',
    phone: '+1 (570) 300 - 1234',
    dob: '20/02/1992',
    address1: '',
    address2: '',
    country: 'N/A',
    state: 'N/A',
    city: '',
    zip: '',
    bio: '',
  });
  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const saveProfile = () => {
    // TODO: call update-profile API with `form` here
    Alert.alert('Saved', 'Your profile has been updated.');
  };

  // Close the sheet first, then open camera/library after the sheet's closing animation.
  const pickPhoto = (launcher) => {
    setShowSheet(false);
    setTimeout(async () => {
      try {
        const res = await launcher({ mediaType: 'photo', quality: 0.8 });
        if (res.didCancel) return;
        if (res.errorCode) {
          Alert.alert('Error', res.errorMessage || 'Could not open the picker.');
          return;
        }
        const uri = res.assets && res.assets[0] && res.assets[0].uri;
        if (uri) setPhoto({ uri });
      } catch (e) {
        Alert.alert('Error', 'Something went wrong while picking the photo.');
      }
    }, 400);
  };
  const handleTakePhoto = () => pickPhoto(launchCamera);
  const handleChoosePhoto = () => pickPhoto(launchImageLibrary);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={saveProfile}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Image source={ICONS.floppy} style={styles.saveIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <AvatarCard compact={activeTab !== 'Account Details'} photo={photo} onPressEdit={() => setShowSheet(true)} />
          <TabBar active={activeTab} onChange={setActiveTab} />

          {activeTab === 'Account Details' && (
            <AccountDetails
              form={form}
              setField={setField}
              onEditEmail={() => setShowEmailModal(true)}
              onEditPhone={() => setShowPhoneModal(true)}
            />
          )}
          {activeTab === 'Change Password' && <ChangePassword />}
          {activeTab === 'Security Questions' && <SecurityQuestions />}
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav active="Profile" navigation={navigation} />

      <UpdateModal
        visible={showEmailModal}
        title="Update Email Address"
        description="Please provide the new email address that you would like to associate with your account"
        placeholder="Email Address"
        icon={ICONS.envelope}
        keyboardType="email-address"
        onCancel={() => setShowEmailModal(false)}
        onSubmit={(v) => {
          setField('email', v);
          setShowEmailModal(false);
        }}
      />
      <UpdateModal
        visible={showPhoneModal}
        title="Update Phone Number"
        description="Please provide the new phone number that you would like to associate with your account"
        placeholder="Phone Number"
        icon={ICONS.phone}
        keyboardType="phone-pad"
        onCancel={() => setShowPhoneModal(false)}
        onSubmit={(v) => {
          setField('phone', v);
          setShowPhoneModal(false);
        }}
      />
      <PhotoSheet
        visible={showSheet}
        onClose={() => setShowSheet(false)}
        onTakePhoto={handleTakePhoto}
        onChoosePhoto={handleChoosePhoto}
      />
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },

  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FONT.medium, fontSize: 15, color: TEXT },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },

  scrollContent: { paddingHorizontal: 16, paddingBottom: 24 },

  avatarCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 8,
  },
  avatarCardCompact: { flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 12 },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeIcon: { width: 12, height: 12 },
  avatarInfo: { flex: 1, alignItems: 'center', marginRight: 72 },
  avatarName: { fontFamily: FONT.semi, fontSize: 14, color: TEXT },
  avatarRole: { fontFamily: FONT.regular, fontSize: 10, color: TEXT, marginTop: 2 },

  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: BORDER, marginTop: 14, marginBottom: 14 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 8, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: ORANGE },
  tabText: { fontFamily: FONT.regular, fontSize: 9, color: TEXT },
  tabTextActive: { fontFamily: FONT.medium, color: ORANGE },

  calIcon: { width: 18, height: 18, marginLeft: 8 },
  saveIcon: { width: 22, height: 22 },
  sectionTitle: { fontFamily: FONT.semi, fontSize: 12, color: TEXT, marginBottom: 10 },

  // Update email / phone modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', paddingHorizontal: 20 },
  modalCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16 },
  modalTitle: { fontFamily: FONT.semi, fontSize: 14, color: TEXT },
  modalDesc: { fontFamily: FONT.regular, fontSize: 10, color: TEXT, marginTop: 6, marginBottom: 14, lineHeight: 15 },
  modalInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 20,
    paddingHorizontal: 14,
  },
  modalInputIcon: { width: 16, height: 16, marginRight: 8, tintColor: LIGHT },
  modalInputText: { flex: 1, fontFamily: FONT.regular, fontSize: 11, color: TEXT, paddingVertical: 0 },
  modalBtns: { flexDirection: 'row', marginTop: 16 },
  modalBtn: { flex: 1, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  modalBtnOutline: { borderWidth: 1, borderColor: ORANGE, marginRight: 8 },
  modalBtnFilled: { backgroundColor: ORANGE, marginLeft: 8 },
  modalBtnText: { fontFamily: FONT.medium, fontSize: 12 },

  // Photo sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    paddingBottom: 28,
    paddingTop: 8,
  },
  sheetHandle: { alignSelf: 'center', width: 32, height: 3, borderRadius: 2, backgroundColor: '#C8C8C8', marginBottom: 14 },
  sheetTitle: { fontFamily: FONT.medium, fontSize: 12, color: TEXT, textAlign: 'center', marginBottom: 14 },
  sheetRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  sheetRowText: { fontFamily: FONT.regular, fontSize: 12, color: TEXT, marginLeft: 12 },
  cameraGlyph: { width: 18, height: 13, borderWidth: 1.4, borderColor: TEXT, borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  cameraLens: { width: 6, height: 6, borderRadius: 3, borderWidth: 1.3, borderColor: TEXT },
  galleryGlyph: { width: 18, height: 14, borderWidth: 1.4, borderColor: TEXT, borderRadius: 3 },
  galleryDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: TEXT, margin: 2 },
});
