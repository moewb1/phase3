import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

interface HomeAestheticHeroTileProps {
  title: string;
  onPress: () => void;
}

export function HomeAestheticHeroTile({
  title,
  onPress,
}: HomeAestheticHeroTileProps): React.JSX.Element {
  const petalStyles = [
    styles.petalTop,
    styles.petalTopRight,
    styles.petalBottomRight,
    styles.petalBottom,
    styles.petalBottomLeft,
    styles.petalTopLeft,
  ];

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.tile}>
        <View style={styles.loop} />
        <View style={styles.flower}>
          {petalStyles.map((petalStyle, index) => (
            <View key={index} style={[styles.petal, petalStyle]} />
          ))}
          <View style={styles.center} />
        </View>
      </View>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
  },
  tile: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 142,
    overflow: 'hidden',
    width: '100%',
  },
  loop: {
    borderColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 2,
    height: 168,
    position: 'absolute',
    right: -16,
    top: -12,
    width: 94,
  },
  flower: {
    height: 92,
    left: 22,
    position: 'absolute',
    top: 24,
    width: 92,
  },
  petal: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    height: 34,
    position: 'absolute',
    width: 34,
  },
  petalTop: {
    left: 29,
    top: 0,
  },
  petalTopRight: {
    left: 50,
    top: 14,
  },
  petalBottomRight: {
    left: 50,
    top: 44,
  },
  petalBottom: {
    left: 29,
    top: 58,
  },
  petalBottomLeft: {
    left: 8,
    top: 44,
  },
  petalTopLeft: {
    left: 8,
    top: 14,
  },
  center: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.pill,
    height: 28,
    left: 32,
    position: 'absolute',
    top: 32,
    width: 28,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    marginTop: spacing.sm,
  },
});
