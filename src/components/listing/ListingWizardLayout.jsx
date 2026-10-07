import React, { useEffect, useState } from 'react';
import { View, ScrollView, Keyboard, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../ScreenHeader';
import ListingStepper from './ListingStepper';
import { PrimaryButton } from './ListingControls';

/**
 * Shared frame of the Create Listing wizards.
 *   header (52)  ->  stepper (50)  ->  scrolling content  ->  Next button (345 x 50)
 *
 * footerInScroll = true  : the button sits under the content (long pages: Identity, Confirmation)
 * footerInScroll = false : the button is pinned 64px above the bottom edge (Figma top 698)
 */
const ListingWizardLayout = ({
  title,
  steps,
  current,
  onBack,
  onNext,
  nextLabel = 'Next',
  footerInScroll = false,
  footerGap = 32,
  children,
}) => {
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboard(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboard(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScreenHeader title={title} onBack={onBack} />
      <ListingStepper steps={steps} current={current} />

      <ScrollView
        key={current}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: footerInScroll ? 48 : 130 },
        ]}
      >
        {children}
        {footerInScroll ? (
          <PrimaryButton label={nextLabel} onPress={onNext} style={{ marginTop: footerGap }} />
        ) : null}
      </ScrollView>

      {!footerInScroll && !keyboard ? (
        <View style={styles.footer} pointerEvents="box-none">
          <PrimaryButton label={nextLabel} onPress={onNext} />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 15 },
  footer: { position: 'absolute', left: 15, right: 15, bottom: 64 },
});

export default ListingWizardLayout;
