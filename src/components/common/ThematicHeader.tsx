import React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { imageAssets } from '../../assets';
import { AppImage } from './AppImage';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ThematicHeaderProps {
  avatarUrl: string;
  onPressLogo: () => void;
  onPressMenu: () => void;
  onPressNotifications: () => void;
  onPressProfile: () => void;
}

export function ThematicHeader({
  avatarUrl,
  onPressLogo,
  onPressMenu,
  onPressNotifications,
  onPressProfile,
}: ThematicHeaderProps): React.JSX.Element {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.row}>
        <Pressable hitSlop={12} onPress={onPressLogo}>
          <AppImage
            resizeMode="contain"
            source={imageAssets.logo}
            style={styles.logo}
          />
        </Pressable>
        <Pressable style={styles.menuButton} onPress={onPressMenu}>
          <Menu color={colors.white} size={26} strokeWidth={2.3} />
        </Pressable>
        <View style={styles.actions}>
          <Pressable style={styles.notificationButton} onPress={onPressNotifications}>
            <Bell color={colors.white} size={21} strokeWidth={2.3} />
            <View style={styles.notificationDot} />
          </Pressable>
          <Pressable style={styles.avatarRing} onPress={onPressProfile}>
            <AppImage source={{ uri: avatarUrl }} style={styles.avatar} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.headerBackground,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 68,
    paddingHorizontal: spacing.lg,
  },
  logo: {
    height: 48,
    width: 124,
  },
  menuButton: {
    alignItems: 'center',
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  notificationButton: {
    alignItems: 'center',
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  notificationDot: {
    backgroundColor: colors.notificationDot,
    borderRadius: 4,
    height: 7,
    position: 'absolute',
    right: 6,
    top: 6,
    width: 7,
  },
  avatarRing: {
    alignItems: 'center',
    borderColor: colors.avatarRing,
    borderRadius: 19,
    borderWidth: 1.5,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  avatar: {
    borderRadius: 16,
    height: 32,
    width: 32,
  },
});
