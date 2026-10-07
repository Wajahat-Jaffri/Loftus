import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  BackHandler,
  Alert,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import {
  ORANGE,
  FONT,
  AP_ICONS,
  MapCard,
  Stack,
  Stepper,
  Group,
  TextBox,
  TextArea,
  SelectBox,
  CheckColumns,
  PrimaryButton,
  SectionTitle,
  DefaultImageBox,
  MediaRow,
  CustomMediaRow,
  AddLink,
} from '../components/AddPropertyParts';

/* ---------------- options (edit freely) ---------------- */
const STEPS = ['Location', 'Description', 'Features', 'Media'];

const STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];
const PROPERTY_TYPES = ['House', 'Apartment', 'Townhouse', 'Condo', 'Duplex', 'Land'];
const HOUSE_STYLES = ['Ranch', 'Colonial', 'Victorian', 'Modern', 'Cape Cod'];
const YES_NO = ['Yes', 'No'];
const AC_OPTIONS = ['None', 'Central', 'Ductless', 'Window'];
const HEATING_OPTIONS = ['None', 'Gas', 'Electric', 'Oil'];
const FLOORING_OPTIONS = ['Hardwood', 'Carpet', 'Tile', 'Laminate'];
const COUNTERTOP_OPTIONS = ['Granite', 'Marble', 'Quartz', 'Laminate'];
const LAUNDRY_OPTIONS = ['None', 'In Unit', 'Shared'];
const PARKING_OPTIONS = ['None', 'Garage', 'Street', 'Driveway'];

// Figma only had placeholder text for the checkboxes, so these labels are samples.
const AMENITY_COLUMNS = [
  ['Fitness Center', 'Pet Friendly', 'Doorman', 'Elevator'],
  ['Business Center', 'Rooftop Deck', 'Wheelchair Ramp'],
  ['Courtyard', 'Spa', 'Clubhouse'],
];
const FEATURE_COLUMNS = [
  ['Furnished', 'Fireplace', 'Balcony', 'Garage', 'Basement', 'Dishwasher', 'Microwave'],
  ['Walk-in Closet', 'Pantry', 'Skylight', 'Hot Tub', 'Security System', 'Smart Home'],
  ['Patio', 'Garden', 'Pool', 'Storage', 'Elevator', 'Sprinklers'],
];
const MEDIA_ROWS = [
  'Kitchen',
  'Full Bathroom 1',
  'Full Bathroom 2',
  'Half Bathrooms 1',
  'Half Bathrooms 2',
];

// Demo rule: these addresses are "already owned" and open the Verify Address popup.
const TAKEN_ADDRESSES = ['1012 ocean avenue'];
// Demo: the very first check always shows the Verify Address popup (set to false to disable).
const SHOW_VERIFY_FIRST = true;


const VERIFY_TEXT =
  'This property is currently owned by another user in Loftus. We will send the current owner of this property a notification informing them that another user is claiming to be the owner of this property. If the current owner verifies that this property is no longer theirs, or if they do not have reoccurring transactions and they have not responded within 7 calendar days, then you will be granted permission to create this property on Loftus. If you would like a faster response, please attach the deed of this property below. One of our agents will review and provide feedback as quickly as possible. We thank you for your cooperation and apologize for any inconvenience this may have caused.';

const INITIAL = {
  title: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  zip: '',
  yearBuilt: '',
  propertyType: '',
  houseStyle: '',
  metro: '',
  lotSize: '',
  description: '',
  sqft: '',
  studio: 'No',
  bedrooms: '0',
  fullBaths: '0',
  halfBaths: '0',
  ac: '',
  heating: '',
  flooring: '',
  countertop: '',
  laundry: '',
  parking: '',
  parkingSpaces: '',
  guestParking: '',
};

const toggleIn = (list, item) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

const AddPropertyScreen = ({ navigation }) => {
  const scrollRef = useRef(null);
  const nextId = useRef(1);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [available, setAvailable] = useState(false);
  const [verifyVisible, setVerifyVisible] = useState(false);
  const verifyShown = useRef(false);
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();
  const [amenities, setAmenities] = useState([]);
  const [features, setFeatures] = useState([]);
  const [customRows, setCustomRows] = useState([]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const setAddress = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setAvailable(false);
  };

  const goTo = (n) => {
    setStep(n);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  const goBack = () => {
    if (step > 0) goTo(step - 1);
    else navigation?.goBack();
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step > 0) {
        goTo(step - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const checkAddress = () => {
    const missing = ['title', 'address1', 'city', 'state', 'zip'].some(
      (k) => !form[k].trim()
    );
    if (missing) {
      Alert.alert(
        'Missing details',
        'Please fill property title, address line 1, city, state and zipcode.'
      );
      return;
    }
    if (
      TAKEN_ADDRESSES.includes(form.address1.trim().toLowerCase()) ||
      (SHOW_VERIFY_FIRST && !verifyShown.current)
    ) {
      verifyShown.current = true;
      setVerifyVisible(true);
    } else {
      setAvailable(true);
    }
  };

  const pickImage = () =>
    Alert.alert('Upload', 'Image picker will open here once it is connected.');

  const finish = () =>
    Alert.alert('Property added', `${form.title || 'Your property'} was added successfully.`, [
      { text: 'OK', onPress: () => navigation?.goBack() },
    ]);

  /* ---------------- step renderers ---------------- */
  const renderLocation = () => (
    <>
      <View style={styles.fields}>
        <Stack gap={16}>
          <Group label="Property Title">
            <TextBox value={form.title} onChangeText={setAddress('title')} />
          </Group>
          <Group label="Address Line 1">
            <TextBox value={form.address1} onChangeText={setAddress('address1')} />
          </Group>
          <Group label="Address Line 2">
            <TextBox value={form.address2} onChangeText={setAddress('address2')} />
          </Group>
          <Group label="City">
            <TextBox value={form.city} onChangeText={setAddress('city')} />
          </Group>
          <Group label="State">
            <SelectBox
              value={form.state}
              options={STATES}
              onChange={(v) => {
                set('state')(v);
                setAvailable(false);
              }}
            />
          </Group>
          <Group label="Zipcode">
            <TextBox
              value={form.zip}
              onChangeText={setAddress('zip')}
              keyboardType="number-pad"
              maxLength={10}
            />
          </Group>
        </Stack>
      </View>

      {!available ? (
        <PrimaryButton
          title="Check Address Availability"
          onPress={checkAddress}
          style={styles.mt32}
        />
      ) : (
        <>
          <View style={styles.availableRow}>
            <Image source={AP_ICONS.check} style={styles.availableCheck} resizeMode="contain" />
            <Text style={styles.availableText}>Available!</Text>
          </View>
          <MapCard style={styles.mapTop} onExpand={() => navigation?.navigate('MapViewScreen')} />
          <PrimaryButton title="Next" onPress={() => goTo(1)} style={styles.mt32} />
        </>
      )}
    </>
  );

  const renderDescription = () => (
    <>
      <View style={styles.fields}>
        <Stack gap={20}>
          <Group label="Year Built">
            <TextBox
              value={form.yearBuilt}
              onChangeText={set('yearBuilt')}
              keyboardType="number-pad"
              maxLength={4}
            />
          </Group>
          <Group label="Property Type">
            <SelectBox
              value={form.propertyType}
              options={PROPERTY_TYPES}
              onChange={set('propertyType')}
            />
          </Group>
          <Group label="House Style">
            <SelectBox value={form.houseStyle} options={HOUSE_STYLES} onChange={set('houseStyle')} />
          </Group>
          <Group label="Nearest Metro">
            <TextBox
              value={form.metro}
              onChangeText={set('metro')}
              keyboardType="decimal-pad"
              suffix="mi"
            />
          </Group>
          <Group label="Lot Size">
            <TextBox
              value={form.lotSize}
              onChangeText={set('lotSize')}
              keyboardType="number-pad"
              suffix="SF"
            />
          </Group>
          <Group label="Description">
            <TextArea value={form.description} onChangeText={set('description')} />
          </Group>
        </Stack>
      </View>

      <View style={styles.mt24}>
        <SectionTitle>Amenities</SectionTitle>
        <View style={styles.mt24}>
          <CheckColumns
            columns={AMENITY_COLUMNS}
            selected={amenities}
            onToggle={(it) => setAmenities((l) => toggleIn(l, it))}
          />
        </View>
      </View>

      <PrimaryButton title="Next" onPress={() => goTo(2)} style={styles.mt24} />
    </>
  );

  const renderFeatures = () => (
    <>
      <View style={styles.fields}>
        <Stack gap={20}>
          <Group label="Square Feet">
            <TextBox value={form.sqft} onChangeText={set('sqft')} keyboardType="number-pad" />
          </Group>
          <Group label="Studio">
            <SelectBox value={form.studio} options={YES_NO} onChange={set('studio')} />
          </Group>
          <Group label="Bedrooms">
            <TextBox value={form.bedrooms} onChangeText={set('bedrooms')} keyboardType="number-pad" />
          </Group>
          <Group label="Full Bathrooms">
            <TextBox value={form.fullBaths} onChangeText={set('fullBaths')} keyboardType="number-pad" />
          </Group>
          <Group label="Half Bathrooms">
            <TextBox value={form.halfBaths} onChangeText={set('halfBaths')} keyboardType="number-pad" />
          </Group>
          <Group label="Air Conditioning">
            <SelectBox value={form.ac} options={AC_OPTIONS} onChange={set('ac')} />
          </Group>
          <Group label="Heating">
            <SelectBox value={form.heating} options={HEATING_OPTIONS} onChange={set('heating')} placeholder="Select" />
          </Group>
          <Group label="Flooring">
            <SelectBox value={form.flooring} options={FLOORING_OPTIONS} onChange={set('flooring')} placeholder="Select" />
          </Group>
          <Group label="Countertop Type">
            <SelectBox value={form.countertop} options={COUNTERTOP_OPTIONS} onChange={set('countertop')} placeholder="Select" />
          </Group>
          <Group label="Laundry">
            <SelectBox value={form.laundry} options={LAUNDRY_OPTIONS} onChange={set('laundry')} placeholder="Select" />
          </Group>
          <Group label="Parking">
            <SelectBox value={form.parking} options={PARKING_OPTIONS} onChange={set('parking')} placeholder="Select" />
          </Group>
          <Group label="Parking Spaces">
            <TextBox value={form.parkingSpaces} onChangeText={set('parkingSpaces')} keyboardType="number-pad" />
          </Group>
          <Group label="Guest Parking">
            <SelectBox value={form.guestParking} options={YES_NO} onChange={set('guestParking')} placeholder="Select" />
          </Group>
        </Stack>
      </View>

      <View style={styles.mt24}>
        <SectionTitle>Check all that apply</SectionTitle>
        <View style={styles.mt24}>
          <CheckColumns
            columns={FEATURE_COLUMNS}
            selected={features}
            onToggle={(it) => setFeatures((l) => toggleIn(l, it))}
          />
        </View>
      </View>

      <PrimaryButton title="Next" onPress={() => goTo(3)} style={styles.mt32} />
    </>
  );

  const renderMedia = () => (
    <>
      <View style={styles.mediaTop}>
        <SectionTitle>Default Image</SectionTitle>
        <View style={styles.mt24}>
          <DefaultImageBox onUpload={pickImage} />
        </View>
      </View>

      <View style={styles.mediaRows}>
        <Stack gap={16}>
          {MEDIA_ROWS.map((label) => (
            <MediaRow key={label} label={label} onPress={pickImage} />
          ))}
          {customRows.map((row) => (
            <CustomMediaRow
              key={row.id}
              label={row.label}
              onChangeLabel={(t) =>
                setCustomRows((rows) =>
                  rows.map((r) => (r.id === row.id ? { ...r, label: t } : r))
                )
              }
              onUpload={pickImage}
              onRemove={() => setCustomRows((rows) => rows.filter((r) => r.id !== row.id))}
            />
          ))}
          <View style={styles.addWrap}>
            <AddLink
              onPress={() =>
                setCustomRows((rows) => [...rows, { id: nextId.current++, label: '' }])
              }
            />
          </View>
        </Stack>
      </View>

      <PrimaryButton title="Finish" onPress={finish} />
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScreenHeader title="Add Property" onBack={goBack} />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.stepperWrap}>
          <Stepper steps={STEPS} current={step} />
        </View>

        {step === 0 && renderLocation()}
        {step === 1 && renderDescription()}
        {step === 2 && renderFeatures()}
        {step === 3 && renderMedia()}
      </ScrollView>

      {/* Verify Address popup */}
      <Modal
        visible={verifyVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setVerifyVisible(false)}
      >
        <View style={[styles.overlay, { paddingTop: insets.top + 84 }]}>
          <View style={[styles.modalCard, { maxHeight: screenH - insets.top - 84 - 16 }]}>
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.modalBlock}>
                <Text style={styles.modalTitle}>Verify Address</Text>
                <Text style={styles.modalText}>{VERIFY_TEXT}</Text>
                <TouchableOpacity activeOpacity={0.8} style={styles.modalUpload} onPress={pickImage}>
                  <Image source={AP_ICONS.upload} style={styles.modalUploadIcon} resizeMode="contain" />
                  <Text style={styles.modalUploadText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
            <View style={styles.modalButtons}>
              <PrimaryButton
                title="Cancel"
                outlined
                height={44}
                style={styles.modalBtn}
                onPress={() => setVerifyVisible(false)}
              />
              <PrimaryButton
                title="Send"
                height={44}
                style={[styles.modalBtn, { marginLeft: 10 }]}
                onPress={() => {
                  setVerifyVisible(false);
                  Alert.alert('Request sent', 'We will notify you once the address is verified.');
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddPropertyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 15, paddingBottom: 30 },

  // header ends at 52, stepper label at 59, fields at 122
  stepperWrap: { marginTop: 7 },
  fields: { marginTop: 20 },
  mt24: { marginTop: 24 },
  mt32: { marginTop: 32 },

  availableRow: {
    marginTop: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableCheck: { width: 24, height: 24, tintColor: '#4BB543', marginRight: 4 },
  availableText: {
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#4BB543',
    includeFontPadding: false,
  },

  mapTop: { marginTop: 24 },

  // media step
  mediaTop: { marginTop: 36 },
  mediaRows: { marginTop: 16, minHeight: 479, paddingBottom: 32 },
  addWrap: { marginTop: -2.5 },

  // verify popup (Figma: card 345 wide, radius 24, 84px below the header)
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 15,
  },
  modalCard: {
    alignSelf: 'stretch',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  modalScroll: { flexGrow: 0, flexShrink: 1, marginHorizontal: -4 },
  modalScrollContent: { alignItems: 'center' },
  modalBlock: { width: 304 },
  modalTitle: {
    textAlign: 'center',
    fontFamily: FONT.semibold,
    fontSize: 20,
    lineHeight: 27,
    color: '#000000',
    includeFontPadding: false,
  },
  modalText: {
    marginTop: 8,
    minHeight: 437,
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 23,
    letterSpacing: 0.14,
    color: '#404040',
    includeFontPadding: false,
  },
  modalUpload: {
    marginTop: 16,
    height: 44,
    borderWidth: 1,
    borderColor: '#C2C2C2',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalUploadIcon: { width: 20, height: 20, tintColor: '#404040', marginRight: 4 },
  modalUploadText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#404040',
    includeFontPadding: false,
  },
  modalButtons: { marginTop: 32, flexDirection: 'row' },
  modalBtn: { flex: 1 },
});
