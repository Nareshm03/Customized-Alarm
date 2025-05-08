import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function LoadingSpinner() {
  const { isDark } = useTheme();

  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/animations/loading.json')}
        autoPlay
        loop
        style={styles.animation}
        colorFilters={[
          {
            keypath: 'Spinner',
            color: isDark ? '#ffffff' : '#7B2CBF',
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 100,
    height: 100,
  },
});