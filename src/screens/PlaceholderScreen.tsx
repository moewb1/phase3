import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppButton } from '../components/common/AppButton';
import { AppScaffold } from '../components/common/AppScaffold';
import { ScreenScrollView } from '../components/common/ScreenScrollView';
import { strings } from '../localization/strings';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { shadows } from '../theme/shadows';
import { spacing } from '../theme/spacing';
import type { RootStackParamList } from '../types/navigation';

type PlaceholderScreenProps = NativeStackScreenProps<RootStackParamList, 'Placeholder'>;

export function PlaceholderScreen({
  navigation,
  route,
}: PlaceholderScreenProps): React.JSX.Element {
  const screenTitle = route.params.title ?? strings.common.entities.page;
  const requestedPath = route.params.requestedPath;

  function handleGoHome() {
    navigation.navigate('Home');
  }

  return (
    <AppScaffold navigation={navigation} showFloatingChat={false}>
      <ScreenScrollView contentContainerStyle={styles.container}>
        <View style={styles.glowOrb} />
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>{strings.placeholder.badge}</Text>
          </View>
          <Text style={styles.title}>{strings.placeholder.notFound}</Text>
          <Text style={styles.subtitle}>{screenTitle}</Text>
          {requestedPath ? (
            <View style={styles.pathPill}>
              <Text style={styles.pathText}>{requestedPath}</Text>
            </View>
          ) : null}
          <Text style={styles.message}>
            {route.params.message ?? strings.placeholder.defaultMessage}
          </Text>
          <AppButton
            label={strings.common.actions.backToHome}
            onPress={handleGoHome}
          />
        </View>
      </ScreenScrollView>
    </AppScaffold>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  glowOrb: {
    backgroundColor: colors.primarySoft,
    borderRadius: 120,
    height: 160,
    left: spacing.lg,
    opacity: 0.85,
    position: 'absolute',
    top: spacing.xxxl,
    width: 160,
  },
  card: {
    ...shadows.overlay,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    gap: spacing.lg,
    padding: spacing.xxxl,
    width: '100%',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceNeutral,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeLabel: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 17,
    fontWeight: '700',
  },
  pathPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceDark,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pathText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  message: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
});
