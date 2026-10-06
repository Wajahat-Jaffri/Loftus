import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
  Modal,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGES } from '../assets';
import {
  Field,
  SelectField,
  CheckGrid,
  PrimaryButton,
  ImageGlyph,
  ORANGE,
  TEXT,
  FONT,
} from '../components/PropertyFormControls';

const STEPS = ['Location', 'Description', 'Features', 'Media'];

const STATES = [
  'Alabama', 'Arizona', 'California', 'Colorado', 'Florida', 'Georgia', 'Illinois', 'Maine',
  'Massachusetts', 'Michigan', 'New Jersey', 'New York', 'North Carolina', 'Ohio', 'Pennsylvania',
  'Texas', 'Virginia', 'Washington',
];
const PROPERTY_TYPES = ['Single Family', 'Townhouse', 'Condo', 'Apartment', 'Duplex', 'Other'];
const HOUSE_STYLES = ['Ranch', 'Colonial', 'Modern', 'Victorian', 'Craftsman', 'Cottage'];
const AMENITIES = [
  'Fitness Center', 'Business Center', 'ClubHouse', 'Gameroom', 'Play Ground', 'Pool',
  'Dog Park', 'Package Service', 'Concierge', 'Elevator',
];
const FEATURES = [
  'Attic', 'Basement', 'Pool', 'Den', 'Sunroom', 'Loft', 'Patio', 'Balcony', 'Deck', 'Backyard',
  'Front Yard', 'Pet Friendly', 'Dishwasher', 'Disposal', 'Microwave', 'Refrigerator',
  'Ice Dispenser', 'Oven', 'Furnished',
];
const YES_NO = ['No', 'Yes'];
const AC = ['None', 'Central', 'Ductless', 'Window'];
const HEATING = ['None', 'Central', 'Electric', 'Gas'];
const FLOORING = ['Hardwood', 'Carpet', 'Tile', 'Laminate'];
const COUNTERTOP = ['Marble', 'Granite', 'Quartz', 'Laminate'];
const LAUNDRY = ['In Unit', 'Laundry Facility', 'None'];
const PARKING = ['None', 'Garage', 'Street', 'Driveway', 'Lot'];
const PARKING_SPACES = ['0', '1', '2', '3', '4+'];

const VERIFY_TEXT =
  'This property is currently owned by another user in Loftus. We will send the current owner of this property a notification informing them that another user is claiming to be the owner of this property. If the current owner verifies that this property is no longer theirs, or if they do not have reoccurring transactions and they have not responded within 7 calendar days, then you will be granted permission to create this property on Loftus. If you would like a faster response, please attach the deed of this property below. One of our agents will review and provide feedback as quickly as possible. We thank you for your cooperation and apologize for any inconvenience this may have caused.';

const INITIAL_ROOMS = ['Kitchen', 'Full Bathroom 1', 'Full Bathroom 2', 'Half Bathroom 1', 'Half Bathrooms 2'];

/* ---------------- progress bar ---------------- */
const Stepper = ({ step }) => (
  <View style={styles.stepper}>
    <View style={styles.stepLine} />
    <View style={styles.stepRow}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const current = n === step;
        return (
          <View key={label} style={styles.stepSlot}>
            {current && (
              <View style={styles.stepLabelWrap}>
                <Text style={styles.stepLabel}>{label}</Text>
              </View>
            )}
            <View
              style={[
                styles.dot,
                (done || current) && styles.dotOn,
                done && styles.dotDone,
              ]}
            >
              {done ? <Text style={styles.dotTick}>✓</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  </View>
);

const AddPropertyScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [available, setAvailable] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [deedAttached, setDeedAttached] = useState(false);

  const [form, setForm] = useState({
    title: '', address1: '', address2: '', city: '', state: '', zip: '',
    yearBuilt: '', propertyType: '', houseStyle: '', metro: '', lotSize: '', description: '',
    amenities: [],
    squareFeet: '', studio: 'No', bedrooms: '0', fullBaths: '0', halfBaths: '0',
    ac: '', heating: '', flooring: '', countertop: '', laundry: '',
    parking: '', parkingSpaces: '', guestParking: '',
    features: [],
  });
  const [defaultImage, setDefaultImage] = useState(null);
  const [rooms, setRooms] = useState(INITIAL_ROOMS.map((name) => ({ name, saved: true })));

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));
  const toggle = (key) => (item) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(item) ? f[key].filter((x) => x !== item) : [...f[key], item],
    }));

  // Address changed -> must check availability again.
  const setAddress = (key) => (value) => {
    setAvailable(false);
    set(key)(value);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  // Android back button goes to the previous step first.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step > 1) {
        setStep(step - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [step]);

  const checkAvailability = () => {
    if (!form.title.trim() || !form.address1.trim() || !form.city.trim() || !form.state || !form.zip.trim()) {
      Alert.alert('Missing details', 'Please fill title, address, city, state and zipcode.');
      return;
    }
    // Demo rule: an address starting with "1012" already belongs to another user.
    if (/^1012\b/.test(form.address1.trim())) {
      setDeedAttached(false);
      setVerifyOpen(true);
    } else {
      setAvailable(true);
    }
  };

  const sendVerification = () => {
    if (!deedAttached) {
      Alert.alert('Deed needed', 'Please attach the deed or press Cancel.');
      return;
    }
    setVerifyOpen(false);
    Alert.alert('Request sent', 'We will notify you once the address is verified.');
  };

  const addRoom = () => setRooms((r) => [...r, { name: '', saved: false }]);
  const renameRoom = (i, name) => setRooms((r) => r.map((x, k) => (k === i ? { ...x, name } : x)));
  const saveRoom = (i) => setRooms((r) => r.map((x, k) => (k === i && x.name.trim() ? { ...x, saved: true } : x)));
  const removeRoom = (i) => setRooms((r) => r.filter((_, k) => k !== i));

  const finish = () => {
    const fullBaths = parseInt(form.fullBaths, 10) || 0;
    const halfBaths = parseInt(form.halfBaths, 10) || 0;
    const newProperty = {
      id: `new-${Date.now()}`,
      title: form.title.trim() || 'New Property',
      address: `${form.address1}, ${form.city}, ${form.state} ${form.zip}`,
      beds: `${parseInt(form.bedrooms, 10) || 0} Bed`,
      baths: `${fullBaths + halfBaths} Baths`,
      sqft: `${form.squareFeet || 0} sqft`,
      price: '',
      timeAgo: 'Pending review',
      images: [defaultImage || IMAGES.house1],
      description: form.description,
      facts: [
        { label: 'Deposit', value: '$0' },
        { label: 'Lease Term', value: '12' },
        { label: 'Available Date', value: '-' },
        { label: 'Online Home', value: 'No' },
        { label: 'Year Built', value: form.yearBuilt || '-' },
        { label: 'Lot Size', value: form.lotSize ? `${form.lotSize} SF` : '-' },
        { label: 'Property Type', value: form.propertyType || '-' },
        { label: 'House Style', value: form.houseStyle || '-' },
        { label: 'Nearest Metro', value: form.metro ? `${form.metro} mi` : '-' },
        { label: 'Laundry', value: form.laundry || '-' },
        { label: 'Flooring', value: form.flooring || '-' },
        { label: 'Countertop Type', value: form.countertop || '-' },
        { label: 'Air Conditioning', value: form.ac || '-' },
        { label: 'Heating', value: form.heating || '-' },
      ],
      features: form.features,
      amenities: form.amenities,
      status: 'Pending',
    };
    navigation.navigate('Properties', { newProperty });
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={goBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Property</Text>
        <View style={styles.headerBtn} />
      </View>

      <Stepper step={step} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ---------- Step 1: Location ---------- */}
        {step === 1 && (
          <>
            <Field label="Property Title" value={form.title} onChangeText={set('title')} />
            <Field label="Address Line 1" value={form.address1} onChangeText={setAddress('address1')} />
            <Field label="Address Line 2" value={form.address2} onChangeText={setAddress('address2')} />
            <Field label="City" value={form.city} onChangeText={setAddress('city')} />
            <SelectField label="State" value={form.state} options={STATES} onChange={setAddress('state')} />
            <Field
              label="Zipcode"
              value={form.zip}
              onChangeText={setAddress('zip')}
              keyboardType="number-pad"
            />

            {available ? (
              <>
                <View style={styles.availableRow}>
                  <Text style={styles.availableTick}>✓</Text>
                  <Text style={styles.availableText}>Available!</Text>
                </View>
                <View style={styles.mapBox}>
                  <Image source={IMAGES.map} style={styles.mapImage} />
                  <View style={styles.mapExpand}>
                    <Text style={styles.mapExpandText}>⤢</Text>
                  </View>
                </View>
                <PrimaryButton title="Next" onPress={next} style={styles.bottomBtn} />
              </>
            ) : (
              <PrimaryButton
                title="Check Address Availability"
                onPress={checkAvailability}
                style={styles.bottomBtn}
              />
            )}
          </>
        )}

        {/* ---------- Step 2: Description ---------- */}
        {step === 2 && (
          <>
            <Field
              label="Year Built"
              value={form.yearBuilt}
              onChangeText={set('yearBuilt')}
              keyboardType="number-pad"
            />
            <SelectField label="Property Type" value={form.propertyType} options={PROPERTY_TYPES} onChange={set('propertyType')} />
            <SelectField label="House Style" value={form.houseStyle} options={HOUSE_STYLES} onChange={set('houseStyle')} />
            <Field
              label="Nearest Metro"
              value={form.metro}
              onChangeText={set('metro')}
              keyboardType="decimal-pad"
              suffix="mi"
            />
            <Field
              label="Lot Size"
              value={form.lotSize}
              onChangeText={set('lotSize')}
              keyboardType="number-pad"
              suffix="SF"
            />
            <Field label="Description" value={form.description} onChangeText={set('description')} multiline />

            <Text style={styles.groupTitle}>Amenities</Text>
            <CheckGrid items={AMENITIES} selected={form.amenities} onToggle={toggle('amenities')} />

            <PrimaryButton title="Next" onPress={next} style={styles.bottomBtn} />
          </>
        )}

        {/* ---------- Step 3: Features ---------- */}
        {step === 3 && (
          <>
            <Field label="Square Feet" value={form.squareFeet} onChangeText={set('squareFeet')} keyboardType="number-pad" />
            <SelectField label="Studio" value={form.studio} options={YES_NO} onChange={set('studio')} />
            <Field label="Bedrooms" value={form.bedrooms} onChangeText={set('bedrooms')} keyboardType="number-pad" />
            <Field label="Full Bathrooms" value={form.fullBaths} onChangeText={set('fullBaths')} keyboardType="number-pad" />
            <Field label="Half Bathrooms" value={form.halfBaths} onChangeText={set('halfBaths')} keyboardType="number-pad" />
            <SelectField label="Air Conditioning" value={form.ac} options={AC} onChange={set('ac')} placeholder="Select.." />
            <SelectField label="Heating" value={form.heating} options={HEATING} onChange={set('heating')} placeholder="Select" />
            <SelectField label="Flooring" value={form.flooring} options={FLOORING} onChange={set('flooring')} placeholder="Select" />
            <SelectField label="Countertop Type" value={form.countertop} options={COUNTERTOP} onChange={set('countertop')} placeholder="Select" />
            <SelectField label="Laundry" value={form.laundry} options={LAUNDRY} onChange={set('laundry')} placeholder="Select" />
            <SelectField label="Parking" value={form.parking} options={PARKING} onChange={set('parking')} placeholder="Select" />
            <SelectField label="Parking Spaces" value={form.parkingSpaces} options={PARKING_SPACES} onChange={set('parkingSpaces')} placeholder="Select" />
            <SelectField label="Guest Parking" value={form.guestParking} options={YES_NO} onChange={set('guestParking')} placeholder="Select" />

            <Text style={styles.groupTitle}>Check all that apply</Text>
            <CheckGrid items={FEATURES} selected={form.features} onToggle={toggle('features')} />

            <PrimaryButton title="Next" onPress={next} style={styles.bottomBtn} />
          </>
        )}

        {/* ---------- Step 4: Media ---------- */}
        {step === 4 && (
          <>
            <Text style={styles.mediaTitle}>Default Image</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.uploadBox}
              // No picker library yet: this picks a sample photo. See notes to add a real picker.
              onPress={() => setDefaultImage(IMAGES.house2)}
            >
              {defaultImage ? (
                <Image source={defaultImage} style={styles.uploadPreview} />
              ) : (
                <>
                  <ImageGlyph size={24} />
                  <Text style={styles.uploadText}>Upload</Text>
                </>
              )}
            </TouchableOpacity>

            {rooms.map((room, i) =>
              room.saved ? (
                <View key={`${room.name}-${i}`} style={styles.roomRow}>
                  <Text style={styles.roomText}>{room.name}</Text>
                  <ImageGlyph size={12} color="#8A8A8A" />
                </View>
              ) : (
                <View key={`new-${i}`} style={[styles.roomRow, styles.roomRowEdit]}>
                  <Text style={styles.roomHint}>Add Room</Text>
                  <View style={styles.roomInputWrap}>
                    <TextInputSmall
                      value={room.name}
                      onChangeText={(t) => renameRoom(i, t)}
                      onSubmit={() => saveRoom(i)}
                    />
                  </View>
                  <TouchableOpacity onPress={() => saveRoom(i)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <ImageGlyph size={12} color="#8A8A8A" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeRoom(i)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ),
            )}

            <TouchableOpacity style={styles.addLink} onPress={addRoom}>
              <Text style={styles.addLinkText}>+ Add</Text>
            </TouchableOpacity>

            <PrimaryButton title="Finish" onPress={finish} style={styles.bottomBtn} />
          </>
        )}
      </ScrollView>

      {/* ---------- Verify Address popup ---------- */}
      <Modal visible={verifyOpen} transparent animationType="fade" onRequestClose={() => setVerifyOpen(false)}>
        <View style={styles.backdrop}>
          <View style={styles.dialog}>
            <Text style={styles.dialogTitle}>Verify Address</Text>
            <Text style={styles.dialogBody}>{VERIFY_TEXT}</Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.uploadBtn}
              // No picker library yet: this marks the deed as attached.
              onPress={() => setDeedAttached(true)}
            >
              <Text style={styles.uploadBtnText}>{deedAttached ? '✓  Deed attached' : '⤒  Upload'}</Text>
            </TouchableOpacity>

            <View style={styles.dialogButtons}>
              <PrimaryButton
                title="Cancel"
                outlined
                onPress={() => setVerifyOpen(false)}
                style={styles.dialogBtn}
              />
              <PrimaryButton title="Send" onPress={sendVerification} style={styles.dialogBtn} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Small text input used for the "Add Room" row.
const TextInputSmall = ({ value, onChangeText, onSubmit }) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    onSubmitEditing={onSubmit}
    placeholder="Room name"
    placeholderTextColor="#B5B5B5"
    style={styles.roomInput}
    returnKeyType="done"
  />
);

export default AddPropertyScreen;

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
  headerTitle: { fontFamily: FONT.medium, fontSize: 14, color: TEXT },
  backArrow: {
    width: 10,
    height: 10,
    borderLeftWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: TEXT,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },

  // progress bar
  stepper: { marginHorizontal: 36, marginTop: 8, marginBottom: 16, height: 36, justifyContent: 'flex-end' },
  stepLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 6,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#FFD9CE',
  },
  stepRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  stepSlot: { width: 14, alignItems: 'center' },
  stepLabelWrap: { position: 'absolute', bottom: 20, width: 90, alignItems: 'center' },
  stepLabel: { fontFamily: FONT.medium, fontSize: 9, color: ORANGE },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFB9A5', alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: ORANGE },
  dotDone: { width: 14, height: 14, borderRadius: 7 },
  dotTick: { color: '#FFFFFF', fontSize: 8, lineHeight: 10, fontWeight: '700' },

  content: { paddingHorizontal: 16, paddingBottom: 28 },

  groupTitle: { fontFamily: FONT.medium, fontSize: 10, color: TEXT, marginTop: 4, marginBottom: 12 },
  bottomBtn: { marginTop: 14 },

  availableRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 6 },
  availableTick: { color: '#2BA84A', fontSize: 12, marginRight: 4 },
  availableText: { fontFamily: FONT.regular, fontSize: 10, color: '#2BA84A' },
  mapBox: { height: 120, borderRadius: 10, overflow: 'hidden', marginTop: 8, backgroundColor: '#EAEAEA' },
  mapImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  mapExpand: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapExpandText: { fontSize: 11, color: TEXT },

  // media step
  mediaTitle: { fontFamily: FONT.medium, fontSize: 12, color: TEXT, marginBottom: 10 },
  uploadBox: {
    height: 110,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },
  uploadPreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  uploadText: { fontFamily: FONT.regular, fontSize: 9, color: '#8A8A8A', marginTop: 6 },
  roomRow: {
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F1F1',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  roomRowEdit: { backgroundColor: '#FFFFFF' },
  roomText: { fontFamily: FONT.regular, fontSize: 9, color: TEXT },
  roomHint: { fontFamily: FONT.regular, fontSize: 8, color: '#9A9A9A', marginRight: 8 },
  roomInputWrap: {
    flex: 1,
    height: 22,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: 8,
  },
  roomInput: { fontFamily: FONT.regular, fontSize: 9, color: TEXT, padding: 0, height: 20 },
  removeBtn: {
    position: 'absolute',
    top: -8,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E04848',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '700' },
  addLink: { alignSelf: 'flex-end', marginTop: 2 },
  addLinkText: { fontFamily: FONT.regular, fontSize: 9, color: ORANGE },

  // verify popup
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  dialog: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14 },
  dialogTitle: { fontFamily: FONT.semibold, fontSize: 13, color: '#000000', textAlign: 'center', marginBottom: 8 },
  dialogBody: { fontFamily: FONT.regular, fontSize: 9, lineHeight: 14, color: TEXT },
  uploadBtn: {
    height: 32,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  uploadBtnText: { fontFamily: FONT.regular, fontSize: 9, color: TEXT },
  dialogButtons: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  dialogBtn: { width: 100, height: 32, marginHorizontal: 6 },
});
