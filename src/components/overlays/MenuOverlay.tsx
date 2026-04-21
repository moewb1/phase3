import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X } from 'lucide-react-native';
import { headerMenuLinks } from '../../constants/menu';
import { strings } from '../../localization/strings';
import { colors } from '../../theme/colors';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import type { RootStackParamList } from '../../types/navigation';
import { buildPlaceholderPath } from '../../utils/placeholder';
import { AppButton } from '../common/AppButton';

interface MenuOverlayProps {
  navigation: NavigationProp<RootStackParamList>;
  visible: boolean;
  onClose: () => void;
}

export function MenuOverlay({
  navigation,
  visible,
  onClose,
}: MenuOverlayProps): React.JSX.Element {
  const [query, setQuery] = useState('');
  const trimmedQuery = query.trim();

  function openPlaceholder(title: string, requestedPath: string, message?: string) {
    onClose();
    navigation.navigate('Placeholder', {
      title,
      requestedPath,
      message: message ?? strings.placeholder.routesDefaultScreen(title),
    });
  }

  function handleNavigation(link: (typeof headerMenuLinks)[number]) {
    onClose();

    if (link.route === 'Home') {
      navigation.navigate('Home');
      return;
    }

    if (link.route === 'MyPlaylists') {
      navigation.navigate('MyPlaylists');
      return;
    }

    navigation.navigate('Placeholder', {
      title: link.label,
      requestedPath: link.path,
      message: strings.placeholder.routesDefaultScreen(link.label),
    });
  }

  function submitSearch(sectionLabel = strings.common.actions.search) {
    openPlaceholder(
      sectionLabel,
      buildPlaceholderPath('/search', { keyword: trimmedQuery }),
      strings.placeholder.searchRoutesDefaultScreen(trimmedQuery),
    );
  }

  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <View style={styles.topRow}>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X color={colors.menuCloseIcon} size={24} strokeWidth={2.2} />
            </Pressable>
            <Text style={styles.title}>{strings.overlay.menu.title}</Text>
            <View style={styles.topSpacer} />
          </View>
          <View style={styles.searchWrap}>
            <View style={styles.searchRow}>
              <TextInput
                placeholder={strings.common.actions.search}
                placeholderTextColor={colors.menuPlaceholder}
                returnKeyType="search"
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={() => submitSearch()}
              />
              <View style={styles.searchDivider} />
              <Pressable
                hitSlop={10}
                style={styles.searchAction}
                onPress={() => submitSearch()}>
                <Search color={colors.menuIconMuted} size={22} strokeWidth={2.2} />
              </Pressable>
            </View>
          </View>
          <View style={styles.linkList}>
            {headerMenuLinks.map(link => (
              <Pressable
                key={link.id}
                style={styles.linkRow}
                onPress={() => handleNavigation(link)}>
                <Text style={styles.linkLabel}>{link.label}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.bottomAction}>
            <AppButton
              label={strings.overlay.menu.upgradePlan}
              onPress={() =>
                openPlaceholder(strings.overlay.menu.upgradePlan, '/upgrade')
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.menuBackground,
    flex: 1,
    height:'100%',
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    height: 48,
    justifyContent: 'center',
    marginLeft: 20,
    width: 48,
  },
  title: {
    color: colors.white,
    flex: 1,
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
  },
  topSpacer: {
    width: 76,
  },
  content: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  searchWrap: {
    alignItems: 'center',
    marginBottom: spacing.xxxl * 1.5,
    marginTop: spacing.xl,
  },
  searchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '54%',
  },
  searchInput: {
    color: colors.white,
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    minHeight: 40,
    paddingVertical: 0,
  },
  searchDivider: {
    backgroundColor: colors.menuDivider,
    height: 24,
    marginHorizontal: spacing.md,
    width: 2,
  },
  searchAction: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  linkList: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  linkRow: {
    paddingVertical: spacing.sm,
  },
  linkLabel: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
  },
  bottomAction: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxxl,
  },
});
