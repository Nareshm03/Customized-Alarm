import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

interface AnimatedButtonProps {
  onPress: () => void;
  text: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

export default function AnimatedButton({
  onPress,
  text,
  style,
  textStyle,
  disabled = false,
}: AnimatedButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, style]}
    >
      <MotiView
        from={{
          scale: 1,
          opacity: 1,
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          type: 'timing',
          duration: 200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }}
      >
        <Text style={[styles.text, textStyle]}>{text}</Text>
      </MotiView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#7B2CBF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});