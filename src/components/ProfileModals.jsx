import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';

const ORANGE = '#FF6C40';
const FONT = {
  regular: 'Poppins-Regular',
  medium: 'Poppins-Medium',
  semi: 'Poppins-SemiBold',
};
const OVERLAY = 'rgba(0,0,0,0.2)';

const cameraIcon = require('../assets/icons/CameraIcon.png');
const libraryIcon = require('../assets/icons/PhotoLibrary.png');

const CameraGlyph = ({ style }) => (
  <Image source={cameraIcon} style={[styles.sheetIcon, style]} resizeMode="contain" />
);
const GalleryGlyph = ({ style }) => (
  <Image source={libraryIcon} style={[styles.sheetIcon, style]} resizeMode="contain" />
);

/* ------------------------------------------------------------------ */
/* Update Email / Phone modal: 343x269, radius 24, padding 16/24, gap 24 */
/* ------------------------------------------------------------------ */
export const UpdateModal = ({
  visible,
  title,
  description,
  placeholder,
  icon,
  keyboardType,
  onCancel,
  onSubmit,
}) => {
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
      <Pressable style={styles.overlay} onPress={close}>
        <Pressable style={styles.modal} onPress={() => {}}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.desc}>{description}</Text>
          </View>

          <View style={styles.input}>
            <Image source={icon} style={styles.inputIcon} resizeMode="contain" />
            <TextInput
              style={styles.inputText}
              value={value}
              onChangeText={setValue}
              placeholder={placeholder}
              placeholderTextColor="#AFAFAF"
              keyboardType={keyboardType}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, styles.btnOutline]} activeOpacity={0.8} onPress={close}>
              <Text style={[styles.btnText, { color: ORANGE }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnFilled]} activeOpacity={0.85} onPress={submit}>
              <Text style={[styles.btnText, { color: '#FFFFFF' }]}>Submit</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

/* ------------------------------------------------------------------ */
/* Upload photo bottom sheet: 375x186, radius 14 14 0 0                  */
/* ------------------------------------------------------------------ */
export const PhotoSheet = ({ visible, onClose, onTakePhoto, onChoosePhoto }) => (
  <Modal visible={visible} transparent statusBarTranslucent animationType="slide" onRequestClose={onClose}>
    <Pressable style={styles.sheetOverlay} onPress={onClose}>
      <Pressable style={styles.sheet} onPress={() => {}}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>Upload your photo</Text>

        <TouchableOpacity style={[styles.sheetRow, { top: 78 }]} activeOpacity={0.7} onPress={onTakePhoto}>
          <CameraGlyph style={{ top: 3 }} />
          <Text style={[styles.sheetText, { top: 6 }]}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.sheetRow, { top: 116 }]} activeOpacity={0.7} onPress={onChoosePhoto}>
          <GalleryGlyph style={{ top: 6 }} />
          <Text style={[styles.sheetText, { top: 6 }]}>Choose from Library</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: OVERLAY, alignItems: 'center', justifyContent: 'center' },
  modal: {
    width: 343,
    height: 269,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
    elevation: 6,
  },
  title: {
    fontFamily: FONT.semi,
    fontSize: 20,
    lineHeight: 30,
    color: '#000000',
    textAlign: 'center',
    includeFontPadding: false,
  },
  desc: {
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    color: '#404040',
    marginTop: 4,
    includeFontPadding: false,
  },
  input: {
    height: 48,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(192,192,192,0.4)',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: { width: 20, height: 20, marginRight: 8, tintColor: '#AFAFAF' },
  inputText: {
    flex: 1,
    padding: 0,
    fontFamily: FONT.regular,
    fontSize: 12,
    color: '#404040',
    includeFontPadding: false,
  },
  btnRow: { flexDirection: 'row' },
  btn: { flex: 1, height: 44, borderRadius: 50, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { borderWidth: 1, borderColor: ORANGE, marginRight: 10 },
  btnFilled: { backgroundColor: ORANGE },
  btnText: { fontFamily: FONT.medium, fontSize: 14, lineHeight: 21, includeFontPadding: false },

  sheetOverlay: { flex: 1, backgroundColor: OVERLAY, justifyContent: 'flex-end' },
  sheet: {
    height: 186,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: -4, height: 9 },
    shadowOpacity: 0.25,
    shadowRadius: 16.6,
  },
  handle: {
    position: 'absolute',
    top: 10,
    left: 167.5,
    width: 40,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: '#BABABA',
  },
  sheetTitle: {
    position: 'absolute',
    top: 30,
    left: 121,
    fontFamily: FONT.semi,
    fontSize: 16,
    lineHeight: 24,
    color: '#414247',
    includeFontPadding: false,
  },
  sheetRow: { position: 'absolute', left: 0, right: 0, height: 32 },
  sheetIcon: { position: 'absolute', left: 18, width: 24, height: 24 },
  sheetText: {
    position: 'absolute',
    left: 54,
    fontFamily: FONT.medium,
    fontSize: 16,
    lineHeight: 24,
    color: '#414247',
    includeFontPadding: false,
  },
});
