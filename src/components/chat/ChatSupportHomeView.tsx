import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Bot,
  ChevronRight,
  MoonStar,
  Play,
  Search,
  X,
} from 'lucide-react-native';
import { AppImage } from '../common/AppImage';
import { strings } from '../../localization/strings';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

const SUPPORT_AGENT_AVATAR =
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80';

interface ChatSupportHomeViewProps {
  topInset: number;
  bottomInset: number;
  onClose: () => void;
  onStartConversation: () => void;
}

export function ChatSupportHomeView({
  topInset,
  bottomInset,
  onClose,
  onStartConversation,
}: ChatSupportHomeViewProps): React.JSX.Element {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: topInset + spacing.xl, paddingBottom: bottomInset + spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.brandMark}>
          <Play color={colors.primary} fill={colors.primary} size={18} strokeWidth={2.5} />
        </View>
        <Pressable hitSlop={12} onPress={onClose}>
          <X color={colors.black} size={30} strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Text style={styles.greeting}>{strings.chat.home.greeting}</Text>
        <Text style={styles.subtitle}>{strings.chat.home.subtitle}</Text>
      </View>

      <SupportCard title={strings.chat.home.conversationsTitle}>
        <View style={styles.previewRow}>
          <View style={styles.previewAvatar}>
            <Bot color={colors.textSecondary} size={28} strokeWidth={1.8} />
          </View>
          <View style={styles.previewCopy}>
            <Text numberOfLines={1} style={styles.previewTitle}>
              {strings.chat.home.conversationPreview}
            </Text>
            <Text numberOfLines={1} style={styles.previewMeta}>
              {`${strings.chat.home.teamLabel} | ${strings.chat.home.conversationTime}`}
            </Text>
          </View>
          <ChevronRight color={colors.primary} size={24} strokeWidth={2.6} />
        </View>
      </SupportCard>

      <SupportCard title={strings.chat.home.startAnotherTitle}>
        <View style={styles.startRow}>
          <AppImage source={{ uri: SUPPORT_AGENT_AVATAR }} style={styles.agentAvatar} />
          <View style={styles.availabilityRow}>
            <MoonStar color={colors.primary} size={18} strokeWidth={2.2} />
            <Text style={styles.availabilityLabel}>
              {strings.chat.home.unavailableLabel}
            </Text>
            <Text style={styles.availabilityTime}>{strings.chat.home.unavailableTime}</Text>
          </View>
        </View>

        <Pressable style={styles.startButton} onPress={onStartConversation}>
          <Play color={colors.primary} fill={colors.primary} size={18} strokeWidth={2.6} />
          <Text style={styles.startButtonLabel}>{strings.chat.home.newConversation}</Text>
        </Pressable>
      </SupportCard>

      <SupportCard title={strings.chat.home.findAnswerTitle}>
        <View style={styles.searchShell}>
          <Text style={styles.searchPlaceholder}>{strings.chat.home.searchPlaceholder}</Text>
          <View style={styles.searchAction}>
            <Search color={colors.white} size={24} strokeWidth={2.3} />
          </View>
        </View>

        <View style={styles.helpLinks}>
          {strings.chat.home.helpLinks.map(link => (
            <View key={link} style={styles.helpLinkRow}>
              <Text style={styles.helpLinkLabel}>{link}</Text>
              <ChevronRight color={colors.primary} size={22} strokeWidth={2.6} />
            </View>
          ))}
        </View>

        <Text style={styles.knowledgeBaseLink}>
          {strings.chat.home.exploreKnowledgeBase}
        </Text>
      </SupportCard>
    </ScrollView>
  );
}

function SupportCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F7F6F2',
    flex: 1,
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 12,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  hero: {
    marginBottom: spacing.xl,
    marginTop: spacing.sm,
  },
  greeting: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 28,
    marginTop: spacing.sm,
  },
  card: {
    ...shadows.card,
    backgroundColor: colors.white,
    borderRadius: 14,
    gap: spacing.lg,
    padding: spacing.xl,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 28,
  },
  previewRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  previewAvatar: {
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: radius.pill,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  previewCopy: {
    flex: 1,
    gap: 2,
  },
  previewTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 25,
  },
  previewMeta: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
  startRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
  },
  agentAvatar: {
    backgroundColor: colors.surfaceNeutral,
    borderRadius: radius.pill,
    height: 56,
    width: 56,
  },
  availabilityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  availabilityLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 25,
  },
  availabilityTime: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 25,
  },
  startButton: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight:40,
    maxHeight: 74,
  },
  startButtonLabel: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 25,
    marginLeft: spacing.md,
  },
  searchShell: {
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
    borderColor: '#E5E5E5',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    maxHeight: 60,
    overflow: 'hidden',
  },
  searchPlaceholder: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    paddingHorizontal: spacing.lg,
  },
  searchAction: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    height: '100%',
    justifyContent: 'center',
    width: 76,
  },
  helpLinks: {
    gap: spacing.md,
  },
  helpLinkRow: {
    alignItems: 'center',
    borderColor: '#ECEAEA',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 78,
    paddingHorizontal: spacing.lg,
  },
  helpLinkLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
  },
  knowledgeBaseLink: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 27,
    marginTop: spacing.sm,
  },
});
