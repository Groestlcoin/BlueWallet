/* eslint react/prop-types: "off", react-native/no-inline-styles: "off" */
import React, { useState } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from '@rneui/themed';

import loc from '../loc';
import { useTheme } from './themes';

interface IHash {
  [key: string]: string;
}

type ArrowPickerProps = {
  onChange: (key: string) => void;
  items: IHash;
  isItemUnknown: boolean;
};

export const ArrowPicker = (props: ArrowPickerProps) => {
  const keys = Object.keys(props.items);
  const [keyIndex, setKeyIndex] = useState(0);

  const { colors } = useTheme();

  const stylesHook = {
    text: {
      color: colors.foregroundColor,
    },
  };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={loc.send.dynamic_prev}
        onPress={() => {
          Keyboard.dismiss();
          let newIndex = keyIndex;
          if (keyIndex <= 0) {
            newIndex = keys.length - 1;
          } else {
            newIndex--;
          }
          setKeyIndex(newIndex);
          props.onChange(keys[newIndex]);
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
          },
          styles.wrapperCustom,
        ]}
      >
        <Icon size={24} name="chevron-left" type="ionicons" />
      </Pressable>
      <View style={{ width: 200 }}>
        <Text style={[styles.text, stylesHook.text]}>{props.isItemUnknown ? loc.send.fee_custom : keys[keyIndex]}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={loc.send.dynamic_next}
        onPress={() => {
          Keyboard.dismiss();
          let newIndex = keyIndex;
          if (keyIndex + 1 >= keys.length) {
            newIndex = 0;
          } else {
            newIndex++;
          }
          setKeyIndex(newIndex);
          props.onChange(keys[newIndex]);
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
          },
          styles.wrapperCustom,
        ]}
      >
        <Icon size={24} name="chevron-right" type="ionicons" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperCustom: {
    borderRadius: 8,
    padding: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  text: { fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
});
