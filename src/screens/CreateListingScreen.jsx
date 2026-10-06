import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  BackHandler,
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ListingStepper from '../components/listing/ListingStepper';
import SaleDetailsStep from '../components/listing/steps/SaleDetailsStep';
import OpenHouseStep from '../components/listing/steps/OpenHouseStep';
import ConfirmationStep from '../components/listing/steps/ConfirmationStep';
import DurationStep from '../components/listing/steps/DurationStep';
import PaymentStep from '../components/listing/steps/PaymentStep';
import {
  COLORS,
  FONT,
  BackArrow,
  PrimaryButton,
  isValidDate,
} from '../components/listing/ListingControls';
import {
  TIME_OPTIONS,
  LISTING_FEE_PER_MONTH,
  PROCESSING_FEE,
} from '../constants/listingData';

const EMPTY_FORM = {
  price: '',
  hoaFee: '',
  condoFee: '',
  offerDeadline: '',
  hoaFrequency: '',
  condoFrequency: '',
};

const CreateListingScreen = ({ navigation, route }) => {
  const type = route?.params?.type || 'Sale';
  const property = route?.params?.property;
  const steps = [type, 'Open House', 'Confirmation', 'Duration', 'Payment'];

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [openHouses, setOpenHouses] = useState([]);
  const [months, setMonths] = useState('');
  // TODO: load the user's saved cards from your backend.
  const [cards, setCards] = useState(['************4242']);
  const [selectedCard, setSelectedCard] = useState('');

  const monthsNum = Number(months) || 0;
  const totalListingFee = monthsNum * LISTING_FEE_PER_MONTH;
  const fees = {
    totalListingFee,
    processingFee: PROCESSING_FEE,
    totalDue: totalListingFee + PROCESSING_FEE,
  };

  const goBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else navigation.goBack();
  };

  // Android hardware back button -> previous step
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step > 0) {
        setStep((s) => s - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [step]);

  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const addOpenHouse = () =>
    setOpenHouses((l) => [
      ...l,
      { id: `${Date.now()}-${Math.random()}`, date: '', start: '', end: '' },
    ]);
  const removeOpenHouse = (id) => setOpenHouses((l) => l.filter((h) => h.id !== id));
  const updateOpenHouse = (id, patch) =>
    setOpenHouses((l) => l.map((h) => (h.id === id ? { ...h, ...patch } : h)));

  const submit = () => {
    const payload = { type, property, form, openHouses, months: monthsNum, fees, card: selectedCard };
    // TODO: send `payload` to your API here.
    console.log('Create listing payload:', payload);
    Alert.alert('Listing created', 'Your listing has been submitted successfully.', [
      { text: 'OK', onPress: () => navigation.navigate('Listings') },
    ]);
  };

  const handleNext = () => {
    if (step === 0) {
      if (!form.price) return Alert.alert('Missing info', 'Please enter the price.');
      if (form.offerDeadline && !isValidDate(form.offerDeadline)) {
        return Alert.alert('Invalid date', 'Please select a valid date.');
      }
    }

    if (step === 1) {
      for (const h of openHouses) {
        if (!isValidDate(h.date) || !h.start || !h.end) {
          return Alert.alert(
            'Open house',
            'Please fill date, start time and end time for every open house.'
          );
        }
        if (TIME_OPTIONS.indexOf(h.end) <= TIME_OPTIONS.indexOf(h.start)) {
          return Alert.alert('Open house', 'End time must be after the start time.');
        }
      }
    }

    if (step === 3 && monthsNum <= 0) {
      return Alert.alert('Duration', 'Please enter the number of months.');
    }

    if (step === 4) {
      if (!selectedCard) return Alert.alert('Payment', 'Please choose a card.');
      return submit();
    }

    setStep((s) => s + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <SaleDetailsStep type={type} form={form} onChange={onChange} />;
      case 1:
        return (
          <OpenHouseStep
            openHouses={openHouses}
            onAdd={addOpenHouse}
            onRemove={removeOpenHouse}
            onUpdate={updateOpenHouse}
          />
        );
      case 2:
        return <ConfirmationStep type={type} form={form} openHouses={openHouses} />;
      case 3:
        return <DurationStep months={months} onChange={setMonths} fees={fees} />;
      default:
        return (
          <PaymentStep
            cards={cards}
            selectedCard={selectedCard}
            onSelect={setSelectedCard}
            onAddCard={(c) => setCards((l) => [...l, c])}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={goBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <View style={styles.headerBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ListingStepper steps={steps} current={step} />
          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton label="Next" onPress={handleNext} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  flex: { flex: 1 },
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FONT.medium, fontSize: 13, color: COLORS.text },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
  footer: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, backgroundColor: '#FFFFFF' },
});

export default CreateListingScreen;