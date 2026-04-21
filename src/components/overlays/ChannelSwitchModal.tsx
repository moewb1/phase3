import React, { useEffect, useMemo, useRef } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppImage } from '../common/AppImage';
import { strings } from '../../localization/strings';
import { useAppStore } from '../../store/AppStore';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

interface ChannelSwitchModalProps {
  visible: boolean;
  onClose: () => void;
}

function SheetBackdrop(
  backdropProps: React.ComponentProps<typeof BottomSheetBackdrop>,
): React.JSX.Element {
  return (
    <BottomSheetBackdrop
      {...backdropProps}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.45}
      pressBehavior="close"
    />
  );
}

export function ChannelSwitchModal({
  visible,
  onClose,
}: ChannelSwitchModalProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);
  const { channels, selectedChannel, switchChannel } = useAppStore();
  const snapPoints = useMemo(() => ['36%'], []);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
      return;
    }

    sheetRef.current?.dismiss();
  }, [visible]);

  function handleSelectChannel(channelId: string) {
    switchChannel(channelId);
    sheetRef.current?.dismiss();
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      backdropComponent={SheetBackdrop}
      backgroundStyle={styles.sheetBackground}
      enablePanDownToClose
      handleIndicatorStyle={styles.handleIndicator}
      onDismiss={onClose}
      snapPoints={snapPoints}>
      <BottomSheetView
        style={[styles.sheetContent, { paddingBottom: spacing.xl + insets.bottom }]}>
        <Text style={styles.title}>{strings.overlay.channelSwitch.title}</Text>
        <View style={styles.list}>
          {channels.map(channel => {
            const active = channel.id === selectedChannel.id;

            return (
              <Pressable
                key={channel.id}
                style={styles.channelRow}
                onPress={() => handleSelectChannel(channel.id)}>
                <AppImage source={{ uri: channel.avatarUrl }} style={styles.avatar} />
                <View style={styles.copyColumn}>
                  <Text style={styles.channelName}>{channel.title}</Text>
                  <Text style={styles.channelSubtitle}>{channel.subtitle}</Text>
                </View>
                {active ? <Check color={colors.primary} size={18} strokeWidth={2.6} /> : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    ...shadows.overlay,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  handleIndicator: {
    backgroundColor: colors.borderDark,
    width: 44,
  },
  sheetContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
  channelRow: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
  },
  avatar: {
    borderRadius: radius.pill,
    height: 42,
    width: 42,
  },
  copyColumn: {
    flex: 1,
  },
  channelName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  channelSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
