import React, { useState } from 'react';
import { Alert } from 'react-native';
import ListingWizardLayout from '../components/listing/ListingWizardLayout';
import { formatMoney, isValidDate } from '../components/listing/ListingControls';
import SaleDetailsStep from '../components/listing/steps/SaleDetailsStep';
import OpenHouseStep from '../components/listing/steps/OpenHouseStep';
import ConfirmationStep from '../components/listing/steps/ConfirmationStep';
import DurationStep from '../components/listing/steps/DurationStep';
import PaymentStep from '../components/listing/steps/PaymentStep';
import {
  finishListing,
  num,
  blankOpenHouse,
  validateOpenHouses,
  filledOpenHouses,
  calcFees,
} from '../components/listing/wizardHelpers';

const STEPS = ['Sale', 'Open House', 'Confirmation', 'Duration', 'Payment'];

// set to false to click through the steps without filling anything
const VALIDATE = true;

const CreateListingScreen = ({ navigation, route }) => {
  const type = route?.params?.type || 'Sale';
  const property = route?.params?.property;
  const propertyTitle = typeof property === 'string' ? property : property?.label;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    price: '',
    hoaFee: '',
    condoFee: '',
    offerDeadline: '',
    hoaFrequency: '',
    condoFrequency: '',
  });
  const [openHouses, setOpenHouses] = useState([]);
  const [months, setMonths] = useState('');
  const [cards, setCards] = useState(['*************4242']);
  const [selectedCard, setSelectedCard] = useState('*************4242');

  const onChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const fail = (msg) => {
    Alert.alert('Missing information', msg);
    return false;
  };

  const validate = () => {
    if (!VALIDATE) return true;
    if (step === 0) {
      if (num(form.price) <= 0) return fail('Please enter the price.');
      if (!isValidDate(form.offerDeadline)) return fail('Please pick the offer deadline.');
      if (num(form.hoaFee) > 0 && !form.hoaFrequency) {
        return fail('Please select the HOA fee frequency.');
      }
      if (num(form.condoFee) > 0 && !form.condoFrequency) {
        return fail('Please select the condo fee frequency.');
      }
    }
    if (step === 1) {
      const msg = validateOpenHouses(openHouses);
      if (msg) return fail(msg);
    }
    if (step === 3 && (parseInt(months, 10) || 0) <= 0) {
      return fail('Please enter how many months the listing should run.');
    }
    if (step === 4 && !selectedCard) return fail('Please choose a card.');
    return true;
  };

  const onNext = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    finishListing(navigation, {
      type,
      title: propertyTitle,
      price: formatMoney(form.price),
      months,
    });
  };

  const onBack = () => (step > 0 ? setStep(step - 1) : navigation.goBack());

  return (
    <ListingWizardLayout
      title="Create Listing"
      steps={STEPS}
      current={step}
      onBack={onBack}
      onNext={onNext}
    >
      {step === 0 && <SaleDetailsStep type={type} form={form} onChange={onChange} />}

      {step === 1 && (
        <OpenHouseStep
          openHouses={openHouses}
          onAdd={() => setOpenHouses((l) => [...l, blankOpenHouse()])}
          onRemove={(id) => setOpenHouses((l) => l.filter((o) => o.id !== id))}
          onUpdate={(id, patch) =>
            setOpenHouses((l) => l.map((o) => (o.id === id ? { ...o, ...patch } : o)))
          }
        />
      )}

      {step === 2 && (
        <ConfirmationStep type={type} form={form} openHouses={filledOpenHouses(openHouses)} />
      )}

      {step === 3 && (
        <DurationStep months={months} onChange={setMonths} fees={calcFees(months)} />
      )}

      {step === 4 && (
        <PaymentStep
          cards={cards}
          selectedCard={selectedCard}
          onSelect={setSelectedCard}
          onAddCard={(masked) => setCards((c) => [...c, masked])}
        />
      )}
    </ListingWizardLayout>
  );
};

export default CreateListingScreen;
