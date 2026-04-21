import React, { useMemo } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ChevronRight,
  Download,
  LogOut,
  Music4,
  Settings,
  Sparkles,
  UserRound,
} from 'lucide-react-native';
import type { NavigationProp } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppImage } from '../common/AppImage';
import { profileFlyoutLinks } from '../../constants/menu';
import { strings } from '../../localization/strings';
import { useAppStore } from '../../store/AppStore';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';
import type { RootStackParamList } from '../../types/navigation';

const iconMap = {
  licenses: Download,
  playlists: Music4,
  trackfluencer: Sparkles,
  points: Sparkles,
  profile: UserRound,
  settings: Settings,
  signout: LogOut,
};

interface ProfileFlyoutProps {
  navigation: NavigationProp<RootStackParamList>;
  visible: boolean;
  onClose: () => void;
  onSwitchAccount: () => void;
}

export function ProfileFlyout({
  navigation,
  visible,
  onClose,
  onSwitchAccount,
}: ProfileFlyoutProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { selectedChannel } = useAppStore();
  const backdropStyle = useMemo(
    () => [styles.backdrop, { paddingTop: insets.top + 37 }],
    [insets.top],
  );

  function handleNavigate(
    link: (typeof profileFlyoutLinks)[number],
  ) {
    onClose();

    if (link.route === 'MyPlaylists') {
      navigation.navigate('MyPlaylists');
      return;
    }

    navigation.navigate('Placeholder', {
      title: link.label,
      requestedPath: link.path,
      message: strings.placeholder.opensDefaultScreen(link.label),
    });
  }

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <Pressable style={backdropStyle} onPress={onClose}>
        <Pressable style={styles.card} onPress={event => event.stopPropagation()}>
          <View style={styles.channelRow}>
            <AppImage source={{ uri: selectedChannel.avatarUrl }} style={styles.avatar} />
            <View style={styles.channelCopy}>
              <Text style={styles.channelName}>{selectedChannel.title}</Text>
              <Text style={styles.channelSubtitle}>{selectedChannel.subtitle}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          {profileFlyoutLinks.slice(0, 5).map(link => {
            const Icon = iconMap[link.id];
            return (
              <Pressable
                key={link.id}
                style={styles.linkRow}
                onPress={() => handleNavigate(link)}>
                <View style={styles.linkLeft}>
                  <Icon color={colors.white} size={18} strokeWidth={2.1} />
                  <Text style={styles.linkLabel}>{link.label}</Text>
                </View>
              </Pressable>
            );
          })}
          <View style={styles.divider} />
          <Pressable style={styles.linkRow} onPress={onSwitchAccount}>
            <View style={styles.linkLeft}>
              <UserRound color={colors.white} size={18} strokeWidth={2.1} />
              <Text style={styles.linkLabel}>{strings.overlay.profile.switchAccount}</Text>
            </View>
            <ChevronRight color={colors.textMuted} size={16} strokeWidth={2.1} />
          </Pressable>
          {profileFlyoutLinks.slice(5).map(link => {
            const Icon = iconMap[link.id];
            return (
              <Pressable
                key={link.id}
                style={styles.linkRow}
                onPress={() => handleNavigate(link)}>
                <View style={styles.linkLeft}>
                  <Icon color={colors.white} size={18} strokeWidth={2.1} />
                  <Text style={styles.linkLabel}>{link.label}</Text>
                </View>
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.overlaySoft,
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  card: {
    ...shadows.overlay,
    alignSelf: 'flex-end',
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.lg,
    width:'100%',
    marginTop: spacing.xxxl,
    paddingTop: spacing.lg,
  },
  channelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    borderRadius: radius.pill,
    height: 44,
    width: 44,
  },
  channelCopy: {
    flex: 1,
  },
  channelName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },
  channelSubtitle: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    backgroundColor: colors.borderDark,
    height: 1,
    marginVertical: spacing.lg,
  },
  linkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: spacing.lg,
  },
  linkLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  linkLabel: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
