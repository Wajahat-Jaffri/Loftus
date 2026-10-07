import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { COLORS, FONT, SelectField } from './ListingControls';
import { USER_PROPERTIES } from '../../constants/listingData';

const CLOSE_PNG = require('../../assets/icons/Close.png');

/**
 * "Create listing for" modal (Figma: card 345 wide, radius 24, padding 16 / 24, gap 24).
 * Pick a property first, then Sale / Rent appear (card grows from 131 to 199 high).
 */
const CreateListingModal = ({ visible, onClose, onSelectType }) => {
  const [selected, setSelected] = useState(null);

  const close = () => {
    setSelected(null);
    onClose?.();
  };

  const choose = (type) => {
    const property = selected;
    setSelected(null);
    onSelectType?.(type, property);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={close}
    >
      <Pressable style={styles.overlay} onPress={close}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Create listing for</Text>
            <TouchableOpacity
              onPress={close}
              activeOpacity={0.7}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Image source={CLOSE_PNG} style={styles.closeIcon} resizeMode="contain" />
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <SelectField
              value={selected ? selected.label : ''}
              placeholder="Select.."
              title="Select property"
              options={USER_PROPERTIES.map((p) => p.label)}
              onSelect={(label) => setSelected(USER_PROPERTIES.find((p) => p.label === label))}
            />
          </View>

          {selected ? (
            <View style={styles.buttons}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.btn, { backgroundColor: COLORS.orange }]}
                onPress={() => choose('Sale')}
              >
                <Text style={styles.btnText}>Sale</Text>
              </TouchableOpacity>
              <View style={{ width: 10 }} />
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.btn, { backgroundColor: COLORS.blue }]}
                onPress={() => choose('Rent')}
              >
                <Text style={styles.btnText}>Rent</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  card: {
    alignSelf: 'stretch',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
  },
  titleRow: {
    height: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FONT.semi,
    fontSize: 20,
    lineHeight: 27,
    color: '#000000',
    includeFontPadding: false,
  },
  closeBtn: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  closeIcon: { width: 18, height: 18, tintColor: '#000000' },
  field: { marginTop: 24 },
  buttons: { marginTop: 24, flexDirection: 'row' },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontFamily: FONT.medium,
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
    includeFontPadding: false,
  },
});

export default CreateListingModal;
