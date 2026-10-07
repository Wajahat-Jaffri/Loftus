import React, { useState } from 'react';
import { Alert } from 'react-native';
import ListingWizardLayout from '../components/listing/ListingWizardLayout';
import { formatMoney, isValidDate } from '../components/listing/ListingControls';
import RentDetailsStep from '../components/listing/steps/RentDetailsStep';
import ScreeningStep from '../components/listing/steps/ScreeningStep';
import IdentityStep from '../components/listing/steps/IdentityStep';
import OpenHouseStep from '../components/listing/steps/OpenHouseStep';
import RentConfirmationStep from '../components/listing/steps/RentConfirmationStep';
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

const STEPS = ['Rent', 'Screening', 'Identity', 'Open House', 'Confirmation', 'Duration', 'Payment'];

// set to false to click through the steps without filling anything
const VALIDATE = true;

// Identity is prefilled with the owner's details (same sample values as the Figma frame).
// Replace with the signed-in user's profile, or use '' to start empty.
const OWNER = { firstName: 'Jerry', lastName: 'Helfer', dob: '20/02/1992' };

const CreateRentalListingScreen = ({ navigation, route }) => {
  const property = route?.params?.property;
  const propertyTitle = typeof property === 'string' ? property : property?.label;

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    availableDate: '',
    offerDeadline: '',
    leaseTerm: '',
    rent: '',
    deposit: '',
    entireHome: false,
  });
  const [screening, setScreening] = useState('Yes');
  const [identity, setIdentity] = useState({
    firstName: OWNER.firstName,
    middleName: '',
    lastName: OWNER.lastName,
    dob: OWNER.dob,
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  });
  const [openHouses, setOpenHouses] = useState([]);
  const [months, setMonths] = useState('');
  const [cards, setCards] = useState(['*************4242']);
  const [selectedCard, setSelectedCard] = useState('*************4242');

  const onForm = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const onIdentity = (key, value) => setIdentity((f) => ({ ...f, [key]: value }));

  const fail = (msg) => {
    Alert.alert('Missing information', msg);
    return false;
  };

  const validate = () => {
    if (!VALIDATE) return true;
    if (step === 0) {
      if (!isValidDate(form.availableDate)) return fail('Please pick the available date.');
      if (!isValidDate(form.offerDeadline)) return fail('Please pick the offer deadline.');
      if ((parseInt(form.leaseTerm, 10) || 0) <= 0) return fail('Please enter the lease term in months.');
      if (num(form.rent) <= 0) return fail('Please enter the rent.');
      if (num(form.deposit) <= 0) return fail('Please enter the deposit.');
    }
    if (step === 2) {
      if (!identity.firstName.trim() || !identity.lastName.trim()) {
        return fail('Please enter your first and last name.');
      }
      if (!isValidDate(identity.dob)) return fail('Please enter your date of birth (dd/mm/yyyy).');
      if (!identity.address1.trim()) return fail('Please enter your address.');
      if (!identity.city.trim()) return fail('Please enter your city.');
      if (!identity.state) return fail('Please select your state.');
      if (!identity.zip.trim()) return fail('Please enter your zip code.');
    }
    if (step === 3) {
      const msg = validateOpenHouses(openHouses);
      if (msg) return fail(msg);
    }
    if (step === 5 && (parseInt(months, 10) || 0) <= 0) {
      return fail('Please enter how many months the listing should run.');
    }
    if (step === 6 && !selectedCard) return fail('Please choose a card.');
    return true;
  };

  const onNext = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    finishListing(navigation, {
      type: 'Rent',
      title: propertyTitle,
      price: formatMoney(form.rent),
      months,
    });
  };

  const onBack = () => (step > 0 ? setStep(step - 1) : navigation.goBack());

  // long pages keep the Next button under the content (Figma top 914 / 1048)
  const longPage = step === 2 || step === 4;

  return (
    <ListingWizardLayout
      title="Add Rental Listing"
      steps={STEPS}
      current={step}
      onBack={onBack}
      onNext={onNext}
      footerInScroll={longPage}
      footerGap={step === 2 ? 32 : 24}
    >
      {step === 0 && <RentDetailsStep form={form} onChange={onForm} />}

      {step === 1 && <ScreeningStep value={screening} onChange={setScreening} />}

      {step === 2 && <IdentityStep identity={identity} onChange={onIdentity} />}

      {step === 3 && (
        <OpenHouseStep
          topOffset={openHouses.length > 1 ? 22 : 20}
          openHouses={openHouses}
          onAdd={() => setOpenHouses((l) => [...l, blankOpenHouse()])}
          onRemove={(id) => setOpenHouses((l) => l.filter((o) => o.id !== id))}
          onUpdate={(id, patch) =>
            setOpenHouses((l) => l.map((o) => (o.id === id ? { ...o, ...patch } : o)))
          }
        />
      )}

      {step === 4 && (
        <RentConfirmationStep
          form={form}
          screening={screening}
          identity={identity}
          openHouses={filledOpenHouses(openHouses)}
        />
      )}

      {step === 5 && (
        <DurationStep months={months} onChange={setMonths} fees={calcFees(months)} />
      )}

      {step === 6 && (
        <PaymentStep
          textColor="#505050"
          cards={cards}
          selectedCard={selectedCard}
          onSelect={setSelectedCard}
          onAddCard={(masked) => setCards((c) => [...c, masked])}
        />
      )}
    </ListingWizardLayout>
  );
};

export default CreateRentalListingScreen;
