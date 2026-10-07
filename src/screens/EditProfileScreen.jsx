import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import BottomNav from '../components/BottomNav';
import ScreenHeader from '../components/ScreenHeader';
import {
  SectionTitle,
  ProfileField,
  ProfileSelect,
  SaveButton,
  SegmentedTabs,
  EditAvatarCard,
} from '../components/ProfileParts';
import { UpdateModal, PhotoSheet } from '../components/ProfileModals';
import { ICONS, IMAGES } from '../assets';

// Vertical stack with a fixed gap (works on every RN version, no rowGap needed)
const Stack = ({ gap, children }) => (
  <View style={styles.stack}>
    {React.Children.toArray(children).map((c, i) => (
      <View key={i} style={{ marginTop: i === 0 ? 0 : gap }}>
        {c}
      </View>
    ))}
  </View>
);

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
/* Tab contents                                                        */
/* ------------------------------------------------------------------ */
const AccountDetails = ({ form, setField, onEditEmail, onEditPhone }) => (
  <View>
    <SectionTitle>Basic Details</SectionTitle>
    <Stack gap={8}>
      <ProfileField label="First Name" value={form.firstName} onChangeText={(v) => setField('firstName', v)} />
      <ProfileField label="Middle Name" value={form.middleName} onChangeText={(v) => setField('middleName', v)} />
      <ProfileField label="Last name" value={form.lastName} onChangeText={(v) => setField('lastName', v)} />
      <ProfileField label="Email" value={form.email} readOnly rightText="Edit" onRightPress={onEditEmail} />
      <ProfileField label="Phone Number" value={form.phone} readOnly rightText="Edit" onRightPress={onEditPhone} />
      <ProfileField
        label="Date of birth"
        value={form.dob}
        onChangeText={(v) => setField('dob', v)}
        placeholder="DD/MM/YYYY"
        keyboardType="numbers-and-punctuation"
        rightIcon={<Image source={ICONS.calendar} style={styles.calIcon} resizeMode="contain" />}
      />
    </Stack>

    <SectionTitle style={styles.furtherTitle}>Further Details</SectionTitle>
    <Stack gap={8}>
      <ProfileField
        label="Address Line 1"
        value={form.address1}
        onChangeText={(v) => setField('address1', v)}
      />
      <ProfileField
        label="Address Line 2"
        value={form.address2}
        onChangeText={(v) => setField('address2', v)}
      />
      <ProfileSelect label="Country" value={form.country} options={COUNTRIES} onSelect={(v) => setField('country', v)} />
      <ProfileSelect label="State" value={form.state} options={STATES} onSelect={(v) => setField('state', v)} />
      <ProfileField label="City" value={form.city} onChangeText={(v) => setField('city', v)} />
      <ProfileField label="Zipcode" value={form.zip} onChangeText={(v) => setField('zip', v)} keyboardType="number-pad" />
      <ProfileField label="Profile Bio" value={form.bio} onChangeText={(v) => setField('bio', v)} multiline />
    </Stack>
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
      <SectionTitle>Change Your Password</SectionTitle>
      <Stack gap={4}>
        <ProfileField label="Old Password" value={oldPass} onChangeText={setOldPass} secureTextEntry autoCapitalize="none" />
        <ProfileField label="New Password" value={newPass} onChangeText={setNewPass} secureTextEntry autoCapitalize="none" />
        <ProfileField label="Confirm Password" value={confirmPass} onChangeText={setConfirmPass} secureTextEntry autoCapitalize="none" />
      </Stack>
      <SaveButton title="Save" onPress={save} style={{ marginTop: 50 }} />
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
      <SectionTitle>Security Questions</SectionTitle>
      <Stack gap={10}>
        {items.flatMap((it, i) => [
          <ProfileSelect
            key={`q${i}`}
            label="Select Question"
            placeholder="Select"
            value={it.q}
            options={SECURITY_QUESTIONS}
            onSelect={(v) => update(i, 'q', v)}
          />,
          <ProfileField key={`a${i}`} label="Answer" value={it.a} onChangeText={(v) => update(i, 'a', v)} />,
        ])}
      </Stack>
      <SaveButton title="Save" onPress={save} style={{ marginTop: 24 }} />
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader
        title="Edit Profile"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity
            style={styles.headerRight}
            onPress={saveProfile}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={ICONS.floppy} style={styles.headerIcon} resizeMode="contain" />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <EditAvatarCard
            compact={activeTab !== 'Account Details'}
            source={photo || IMAGES.profile}
            onPressEdit={() => setShowSheet(true)}
          />

          <View style={styles.tabsWrap}>
            <SegmentedTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
          </View>

          <View style={styles.body}>
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav active="" navigation={navigation} />

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

  headerRight: { position: 'relative', top: 0, right: 1 },
  headerIcon: { width: 24, height: 24 },

  // header ends at 52 -> card top at 67 (Figma 111 - 44)
  scrollContent: { paddingTop: 15, paddingHorizontal: 16, paddingBottom: 43 },
  // card ends 231 -> segmented control at 254
  tabsWrap: { marginTop: 23 },
  // segmented control ends 304 -> first section at 325
  body: { marginTop: 21 },

  stack: { marginTop: 10 },
  furtherTitle: { marginTop: 16 },

  calIcon: { width: 24, height: 24, marginLeft: 8 },
});
