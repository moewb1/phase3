import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ArrowLeft, EllipsisVertical, Lightbulb, Play, Smile, X } from 'lucide-react-native';
import { strings } from '../../localization/strings';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface ChatSupportConversationViewProps {
  topInset: number;
  bottomInset: number;
  onBack: () => void;
  onClose: () => void;
}

export function ChatSupportConversationView({
  topInset,
  bottomInset,
  onBack,
  onClose,
}: ChatSupportConversationViewProps): React.JSX.Element {
  const [draftValue, setDraftValue] = useState('');

  return (
    <View style={styles.container}>
      <View style={[styles.header, { minHeight: 56 + topInset, paddingTop: topInset }]}>
        <Pressable hitSlop={10} style={styles.headerIconButton} onPress={onBack}>
          <ArrowLeft color={colors.white} size={20} strokeWidth={2.5} />
        </Pressable>

        <View style={styles.headerCenter}>
          <View style={styles.brandMark}>
            <Play color={colors.primary} fill={colors.primary} size={12} strokeWidth={2.6} />
          </View>
          <Text style={styles.headerTitle}>{strings.chat.conversation.title}</Text>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.headerIconButton}>
            <EllipsisVertical color={colors.white} size={18} strokeWidth={2.4} />
          </View>
          <Pressable hitSlop={10} style={styles.headerIconButton} onPress={onClose}>
            <X color={colors.white} size={20} strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>

      <View style={styles.noticeBanner}>
        <Lightbulb color={colors.lightbulb} size={16} strokeWidth={2.2} />
        <Text style={styles.noticeText}>{strings.chat.conversation.notice}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.threadContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.threadSpacer} />
      </ScrollView>

      <View style={[styles.composer, { paddingBottom: spacing.md + bottomInset }]}>
        <View style={styles.composerField}>
          <Smile color={colors.textCaptionAlt} size={19} strokeWidth={2.2} />
          <TextInput
            placeholder={strings.chat.conversation.composerPlaceholder}
            placeholderTextColor={colors.textCaptionAlt}
            style={styles.composerInput}
            value={draftValue}
            onChangeText={setDraftValue}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
  },
  headerIconButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: spacing.sm,
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 15,
    height: 30,
    justifyContent: 'center',
    marginRight: spacing.sm,
    width: 30,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
  },
  headerActions: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  noticeBanner: {
    alignItems: 'flex-start',
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  noticeText: {
    color: colors.textBodyStrong,
    flex: 1,
    fontSize: 12.5,
    fontWeight: '500',
    lineHeight: 17,
    marginLeft: 10,
  },
  threadContent: {
    flexGrow: 1,
  },
  threadSpacer: {
    flex: 1,
    minHeight: 320,
  },
  composer: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  composerField: {
    alignItems: 'center',
    borderColor: colors.borderSoft,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  composerInput: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    marginLeft: spacing.sm,
    paddingVertical: spacing.sm,
  },
});
