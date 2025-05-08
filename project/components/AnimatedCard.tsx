import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  style?: ViewStyle;
}

export default function AnimatedCard({
  children,
  delay = 0,
  style,
}: AnimatedCardProps) {
  return (
    <MotiView
      from={{
        opacity: 0,
        translateY: 20,
      }}
      animate={{
        opacity: 1,
        translateY: 0,
      }}
      transition={{
        type: 'timing',
        duration: 600,
        delay,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }}
      style={[styles.container, style]}
    >
      {children}
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});