import React, { useCallback } from 'react';
import { Keyboard, StyleProp, StyleSheet, TextInput, View, ViewStyle } from 'react-native';
import loc from '../loc';
import { AddressInputScanButton } from './AddressInputScanButton';
import { useTheme } from './themes';
import DeeplinkSchemaMatch from '../class/deeplink-schema-match';
import triggerHapticFeedback, { HapticFeedbackTypes } from '../blue_modules/hapticFeedback';

interface AddressInputProps {
  isLoading?: boolean;
  address?: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  inputAccessoryViewID?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  keyboardType?:
    | 'default'
    | 'numeric'
    | 'email-address'
    | 'ascii-capable'
    | 'numbers-and-punctuation'
    | 'url'
    | 'number-pad'
    | 'phone-pad'
    | 'name-phone-pad'
    | 'decimal-pad'
    | 'twitter'
    | 'web-search'
    | 'visible-password';
  skipValidation?: boolean;
}

const AddressInput = ({
  isLoading = false,
  address = '',
  testID = 'AddressInput',
  placeholder = loc.send.details_address,
  onChangeText,
  editable = true,
  inputAccessoryViewID,
  onFocus = () => {},
  onBlur = () => {},
  keyboardType = 'default',
  style,
  skipValidation = false,
}: AddressInputProps) => {
  const { colors } = useTheme();
  const stylesHook = StyleSheet.create({
    root: {
      borderColor: colors.formBorder,
      borderBottomColor: colors.formBorder,
      backgroundColor: colors.inputBackgroundColor,
    },
    input: {
      color: colors.foregroundColor,
    },
  });

  const validateAddressWithFeedback = useCallback(
    (value: string) => {
      if (skipValidation) return;
      const isBitcoinAddress = DeeplinkSchemaMatch.isBitcoinAddress(value);
      const isLightningInvoice = DeeplinkSchemaMatch.isLightningInvoice(value);
      const isValid = isBitcoinAddress || isLightningInvoice;

      triggerHapticFeedback(isValid ? HapticFeedbackTypes.NotificationSuccess : HapticFeedbackTypes.NotificationError);
      return {
        isValid,
        type: isBitcoinAddress ? 'bitcoin' : isLightningInvoice ? 'lightning' : 'invalid',
      };
    },
    [skipValidation],
  );

  const onBlurEditing = () => {
    if (!skipValidation) {
      validateAddressWithFeedback(address);
    }
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.root, stylesHook.root, style]}>
      <TextInput
        testID={testID}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#81868e"
        value={address}
        style={[styles.input, stylesHook.input]}
        editable={!isLoading && editable}
        multiline={!editable}
        inputAccessoryViewID={inputAccessoryViewID}
        clearButtonMode="while-editing"
        onFocus={onFocus}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboardType}
        {...(skipValidation ? { onBlur } : { onBlur: onBlurEditing })}
      />
      {editable ? <AddressInputScanButton isLoading={isLoading} onChangeText={onChangeText} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderWidth: 1.0,
    borderBottomWidth: 0.5,
    minHeight: 44,
    height: 44,
    alignItems: 'center',
    borderRadius: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    minHeight: 33,
  },
});

export default AddressInput;
