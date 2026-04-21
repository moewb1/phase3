import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Music4, Plus } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppScaffold } from '../components/common/AppScaffold';
import { SortMenu } from '../components/common/SortMenu';
import { ScreenScrollView } from '../components/common/ScreenScrollView';
import { MyPlaylistDraftCard } from '../components/playlists/MyPlaylistDraftCard';
import { strings } from '../localization/strings';
import { useAppStore } from '../store/AppStore';
import { colors } from '../theme/colors';
import { radius } from '../theme/radius';
import { spacing } from '../theme/spacing';
import type { PlaylistDraft } from '../types/app';
import type { RootStackParamList } from '../types/navigation';

type MyPlaylistsScreenProps = NativeStackScreenProps<RootStackParamList, 'MyPlaylists'>;
type PlaylistTab = 'collections' | 'playlists' | 'forYou';

interface PlaylistTabsProps {
  activeTab: PlaylistTab;
  onChange: (tab: PlaylistTab) => void;
}

interface PlaylistDraftListProps {
  playlists: PlaylistDraft[];
  onOpenPlaylist: (playlistId: string) => void;
}

interface PlaylistTabButtonProps {
  active: boolean;
  label: string;
  tab: PlaylistTab;
  onChange: (tab: PlaylistTab) => void;
}

interface PlaylistDraftCardItemProps {
  playlist: PlaylistDraft;
  onOpenPlaylist: (playlistId: string) => void;
}

const PLAYLIST_TABS: Array<{ key: PlaylistTab; label: string }> = [
  { key: 'collections', label: strings.myPlaylists.tabs.collections },
  { key: 'playlists', label: strings.myPlaylists.tabs.playlists },
  { key: 'forYou', label: strings.myPlaylists.tabs.forYou },
];

export function MyPlaylistsScreen({ navigation }: MyPlaylistsScreenProps): React.JSX.Element {
  const { playlistDrafts, createPlaylist } = useAppStore();
  const [tab, setTab] = useState<PlaylistTab>('playlists');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');

  function handleCreatePlaylist() {
    const nextPlaylistId = createPlaylist(strings.common.playlist.newName);
    navigation.navigate('MyPlaylistDetails', {
      playlistId: nextPlaylistId,
    });
  }

  function handleOpenPlaylist(playlistId: string) {
    navigation.navigate('MyPlaylistDetails', { playlistId });
  }

  const sortedPlaylists = [...playlistDrafts].sort((leftPlaylist, rightPlaylist) => {
    if (sortBy === 'name') {
      return leftPlaylist.name.localeCompare(rightPlaylist.name);
    }

    return (
      new Date(rightPlaylist.updatedAt).getTime() -
      new Date(leftPlaylist.updatedAt).getTime()
    );
  });

  return (
    <AppScaffold navigation={navigation}>
      <ScreenScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{strings.myPlaylists.title}</Text>
        <PlaylistTabs activeTab={tab} onChange={setTab} />
        <View style={styles.controls}>
          <Pressable style={styles.addButton} onPress={handleCreatePlaylist}>
            <Plus color={colors.text} size={18} strokeWidth={2.4} />
            <Text style={styles.addButtonLabel}>{strings.myPlaylists.addNewPlaylist}</Text>
          </Pressable>
          {sortedPlaylists.length > 0 ? (
            <View style={styles.sortRow}>
              <SortMenu
                labels={{
                  date: strings.common.sort.date,
                  name: strings.common.sort.name,
                }}
                showSelectedValue
                value={sortBy}
                onChange={setSortBy}
              />
            </View>
          ) : null}
        </View>
        {sortedPlaylists.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Music4 color={colors.primary} size={28} strokeWidth={2.1} />
            </View>
            <Text style={styles.emptyTitle}>{strings.myPlaylists.emptyTitle}</Text>
            <Text style={styles.emptyCopy}>{strings.myPlaylists.emptyCopy}</Text>
          </View>
        ) : (
          <PlaylistDraftList
            playlists={sortedPlaylists}
            onOpenPlaylist={handleOpenPlaylist}
          />
        )}
      </ScreenScrollView>
    </AppScaffold>
  );
}

function PlaylistTabs({ activeTab, onChange }: PlaylistTabsProps): React.JSX.Element {
  return (
    <View style={styles.tabs}>
      {PLAYLIST_TABS.map(item => (
        <PlaylistTabButton
          key={item.key}
          active={activeTab === item.key}
          label={item.label}
          tab={item.key}
          onChange={onChange}
        />
      ))}
    </View>
  );
}

function PlaylistDraftList({
  playlists,
  onOpenPlaylist,
}: PlaylistDraftListProps): React.JSX.Element {
  return (
    <View style={styles.playlistsColumn}>
      {playlists.map(playlist => (
        <PlaylistDraftCardItem
          key={playlist.id}
          playlist={playlist}
          onOpenPlaylist={onOpenPlaylist}
        />
      ))}
    </View>
  );
}

function PlaylistTabButton({
  active,
  label,
  tab,
  onChange,
}: PlaylistTabButtonProps): React.JSX.Element {
  function handleSelect() {
    onChange(tab);
  }

  return (
    <Text style={[styles.tab, active && styles.tabActive]} onPress={handleSelect}>
      {label}
    </Text>
  );
}

function PlaylistDraftCardItem({
  playlist,
  onOpenPlaylist,
}: PlaylistDraftCardItemProps): React.JSX.Element {
  function handleOpenPlaylist() {
    onOpenPlaylist(playlist.id);
  }

  return (
    <MyPlaylistDraftCard
      imageUrl={playlist.artworkUrls[0]}
      isPrivate={playlist.isPrivate}
      songCount={playlist.songs.length}
      title={playlist.name}
      onPress={handleOpenPlaylist}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.xl,
    padding: spacing.xl,
    paddingBottom: spacing.xl,
  },
  title: {
    alignSelf: 'center',
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 38,
    maxWidth: 320,
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tab: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
    color: colors.text,
  },
  controls: {
    gap: spacing.lg,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.lg,
  },
  addButtonLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  sortRow: {
    alignItems: 'flex-end',
  },
  playlistsColumn: {
    gap: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  emptyIcon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceNeutral,
    borderRadius: radius.pill,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  emptyCopy: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    maxWidth: 320,
    textAlign: 'center',
  },
});
