import React from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { lottieAssets } from '../../assets';
import { spacing } from '../../theme/spacing';

export function Loader(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <LottieView
        autoPlay
        loop
        source={lottieAssets.loading}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxxl,
  },
  animation: {
    height: 120,
    width: 120,
  },
});
