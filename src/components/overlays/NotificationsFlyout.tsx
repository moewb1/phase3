import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { strings } from '../../localization/strings';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';
import { useAppStore } from '../../store/AppStore';

const notificationAccentStyles = StyleSheet.create({
  pink: {
    backgroundColor: colors.notificationAccentPink,
  },
  purple: {
    backgroundColor: colors.notificationAccentPurple,
  },
});

interface NotificationsFlyoutProps {
  notificationsVisible: boolean;
  onClose: () => void;
}

export function NotificationsFlyout({
  notificationsVisible,
  onClose,
}: NotificationsFlyoutProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { notifications } = useAppStore();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'milestone'>('all');
  const backdropStyle = useMemo(
    () => [styles.backdrop, { paddingTop: insets.top + 47 }],
    [insets.top],
  );

  const visibleNotifications = notifications.filter(notification => {
    if (activeTab === 'all') {
      return true;
    }

    return notification.category === activeTab;
  });

  return (
    <Modal animationType="fade" transparent visible={notificationsVisible}>
      <Pressable style={backdropStyle} onPress={onClose}>
        <Pressable style={styles.card} onPress={event => event.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{strings.overlay.notifications.title}</Text>
            <Text style={styles.muted}>{strings.overlay.notifications.markAllAsRead}</Text>
          </View>
          <View style={styles.tabs}>
            {(['all', 'unread', 'milestone'] as const).map(tab => (
              <Pressable
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}>
                <Text
                  style={[
                    styles.tabLabel,
                    activeTab === tab && styles.tabLabelActive,
                  ]}>
                  {tab === 'all'
                    ? strings.overlay.notifications.all
                    : tab === 'unread'
                      ? strings.overlay.notifications.unread
                      : strings.overlay.notifications.milestone}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.list}>
            {visibleNotifications.map(notification => (
              <View key={notification.id} style={styles.notificationRow}>
                <View style={[styles.accentDot, notificationAccentStyles[notification.accent]]} />
                <View style={styles.copyColumn}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationSubtitle}>
                    {notification.subtitle}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: colors.overlayLight,
    flex: 1,
    paddingRight: spacing.md,
  },
  card: {
    ...shadows.card,
    alignSelf: 'flex-end',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    minWidth: 288,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  muted: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  tabLabelActive: {
    color: colors.white,
  },
  list: {
    gap: spacing.md,
  },
  notificationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  accentDot: {
    borderRadius: radius.pill,
    height: 8,
    width: 8,
  },
  copyColumn: {
    flex: 1,
  },
  notificationTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  notificationSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
