import React, { useEffect, useState } from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { StyleSheet, Text, View } from 'react-native';
import { strings } from '../../localization/strings';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { AppButton } from '../common/AppButton';

interface EditPlaylistSheetProps {
  sheetRef: React.RefObject<BottomSheetModal | null>;
  initialDescription: string;
  initialName: string;
  openToken: number;
  onSave: (values: { description: string; name: string }) => void;
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
    />
  );
}

export function EditPlaylistSheet({
  sheetRef,
  initialDescription,
  initialName,
  openToken,
  onSave,
}: EditPlaylistSheetProps): React.JSX.Element {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialDescription, initialName, openToken]);

  function handleClose() {
    sheetRef.current?.dismiss();
  }

  function handleSave() {
    onSave({
      description: description.trim(),
      name: name.trim(),
    });
    sheetRef.current?.dismiss();
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      backdropComponent={SheetBackdrop}
      backgroundStyle={styles.sheetBackground}
      enablePanDownToClose
      snapPoints={['58%']}>
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>{strings.myPlaylistDetails.edit.title}</Text>

        <View style={styles.field}>
          <Text style={styles.label}>{strings.myPlaylistDetails.edit.nameLabel}</Text>
          <BottomSheetTextInput
            placeholder={strings.myPlaylistDetails.edit.namePlaceholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{strings.myPlaylistDetails.edit.descriptionLabel}</Text>
          <BottomSheetTextInput
            multiline
            placeholder={strings.myPlaylistDetails.edit.descriptionPlaceholder}
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.textarea]}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.actions}>
          <AppButton
            label={strings.common.actions.cancel}
            style={styles.action}
            variant="outlined"
            onPress={handleClose}
          />
          <AppButton
            label={strings.common.actions.save}
            style={styles.action}
            onPress={handleSave}
          />
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
  textarea: {
    minHeight: 140,
    paddingTop: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  action: {
    flex: 1,
  },
});
