export const strings = {
  common: {
    actions: {
      addToPlaylist: 'Add to playlist',
      backToHome: 'Back to home',
      cancel: 'Cancel',
      delete: 'Delete',
      save: 'Save',
      search: 'Search',
      seeMore: 'See More',
      share: 'Share',
      showLess: 'Show less',
      showMore: 'Show more',
      sortBy: 'Sort by',
      viewArtist: 'View artist',
    },
    entities: {
      page: 'Page',
      song: 'Song',
    },
    playlist: {
      defaultDescription: 'Add your playlist description here.',
      newName: 'New Playlist',
      private: 'Private',
      public: 'Public',
      songCount: (count: number) => `${count} songs`,
    },
    share: {
      playlist: (name: string, description: string) => `${name} • ${description}`,
    },
    sort: {
      date: 'Date',
      dateAdded: 'Date Added',
      name: 'Name',
      selected: (label: string) => `Sort by ${label}`,
    },
  },
  store: {
    channels: {
      moeWb: {
        subtitle: '83.3K Subscribers • 2K Videos',
        title: 'Moe WB',
      },
      thematicTeam: {
        subtitle: 'Support account • Product updates',
        title: 'Thematic Team',
      },
    },
    errors: {
      missingProvider: 'useAppStore must be used inside AppStoreProvider.',
    },
    notifications: {
      achievedBadge: 'You achieved a new badge!',
      eightMinutesAgo: '8 minutes ago',
      eighteenMinutesAgo: '18 minutes ago',
    },
  },
  footer: {
    caption: '© 2026 Thematic. All rights reserved.',
    copy: ['Trending Music for Creators', 'Free & Copyright-Safe'],
    primaryLinks: [
      'About Thematic',
      'How It Works',
      'Blog',
      'Help Center',
      'Affiliate Program',
      'Pricing',
    ],
    secondaryLinks: ['Creator Toolkit', 'Contact Us'],
  },
  chat: {
    conversation: {
      composerPlaceholder: 'Enter your message...',
      notice:
        "Sorry, we are not available now. We've got your message though and we'll reply to you as soon as we can.",
      title: 'Thematic Team',
    },
    home: {
      conversationPreview:
        'Thanks for reaching out 👋 How can I help you today?',
      conversationTime: '6 hours ago',
      conversationsTitle: 'Your conversations',
      exploreKnowledgeBase: 'Explore our knowledge base',
      findAnswerTitle: 'Find an answer',
      greeting: 'Hello 👋',
      helpLinks: ['Creator Help Center', 'Artist Help Center', "FAQ's"],
      newConversation: 'New conversation',
      searchPlaceholder: 'Search for articles',
      startAnotherTitle: 'Start another conversation',
      subtitle: 'Got a question? We would love to help you!',
      teamLabel: 'Thematic Team',
      unavailableLabel: "We'll be back:",
      unavailableTime: '19:00',
    },
  },
  songActions: {
    premium: 'Unlock music access with Premium',
    similar: 'Find Similar',
  },
  playlistPicker: {
    createNew: 'Create new playlist',
    emptyCopy: 'Create your first playlist, then add songs to it from here.',
    emptyTitle: 'No playlists yet',
    meta: (songCount: number, privacy: string) => `${songCount} songs • ${privacy}`,
    subtitle: 'Choose where you want to save this song.',
    title: 'Choose a playlist',
  },
  overlay: {
    channelSwitch: {
      title: 'Switch to',
    },
    menu: {
      title: 'Menu',
      upgradePlan: 'Upgrade Plan',
    },
    notifications: {
      all: 'All',
      markAllAsRead: 'Mark all as read',
      milestone: 'Milestone',
      title: 'Notifications',
      unread: 'Unread',
    },
    profile: {
      switchAccount: 'Switch Account',
    },
  },
  menu: {
    headerLinks: {
      contact: 'Contact Us',
      discover: 'Discover',
      help: 'Help Center',
      home: 'Home',
      how: 'How it Works',
      licenses: 'Licenses',
      logout: 'Log out',
      playlists: 'Playlists',
      points: '100 Points',
      privacy: 'Privacy and Terms',
      songs: 'Songs',
      trackfluencer: 'Trackfluencer',
    },
    profileLinks: {
      licenses: 'Licenses & Downloads',
      playlists: 'My Playlists',
      points: 'Points',
      profile: 'View Profile',
      settings: 'Settings',
      signout: 'Sign out',
      trackfluencer: 'Trackfluencer',
    },
  },
  placeholder: {
    badge: '404',
    defaultMessage:
      'This route intentionally lands on the default 404 screen in the mobile build.',
    notFound: 'Page not found',
    opensDefaultScreen: (title: string) =>
      `${title} opens the default 404 screen in this build.`,
    routesDefaultScreen: (title: string) =>
      `${title} routes to the default 404 screen in this mobile build.`,
    searchRoutesDefaultScreen: (query: string) =>
      query
        ? `Search for "${query}" routes to the default 404 screen in this mobile build.`
        : 'Search routes to the default 404 screen in this mobile build.',
  },
  home: {
    aesthetic: {
      defaultLabel: 'K pop',
      description: 'Songs matched to your personal vibe',
      title: 'Your Aesthetic',
    },
    curatedDescription: 'Curated playlists based on your video themes',
    error: 'Failed to load your recommendations.',
    jumpBack: {
      description: 'Quickly access your most frequently listened-to music',
      title: 'Jump Back To',
    },
    madeFor: (channelTitle: string) => `Made for ${channelTitle}`,
    playlistsFor: (channelTitle: string) => `Playlists for ${channelTitle}`,
    weeklyMatches: {
      description:
        'The best songs matched to your video themes and favorite types of music. Updated every week ✌️',
      title: 'Weekly Matches Just for You',
    },
  },
  myPlaylists: {
    addNewPlaylist: 'Add new playlist',
    emptyCopy:
      'Your playlists start empty. Add a real song from the app or create a blank playlist here.',
    emptyTitle: 'No playlists yet',
    tabs: {
      collections: 'Thematic Collections',
      forYou: 'For You',
      playlists: 'My Playlists',
    },
    title: 'Your Music, Your Rhythm Discover Playlists for Every Mood',
  },
  myPlaylistDetails: {
    edit: {
      descriptionLabel: 'Playlist description',
      descriptionPlaceholder: 'Playlist description',
      nameLabel: 'Playlist name',
      namePlaceholder: 'Playlist name',
      title: 'Edit playlist',
    },
    emptyPlaylist: {
      copy: 'Add a real song from Home or Playlist Details to start filling it.',
      title: 'This playlist is empty',
    },
    emptySearch: {
      copy: 'Add a real song from the app and it will appear here.',
      title: 'No songs yet',
    },
    hero: {
      meta: (owner: string, songCount: number, privacy: string) =>
        `by ${owner} • ${songCount} songs • ${privacy}`,
    },
    missing: 'Playlist not found',
  },
  playlistDetails: {
    defaultDescription: 'A curated playlist for your next upload.',
    defaultOwner: 'Thematic',
    error: 'Failed to load this playlist.',
    eyebrow: 'PLAYLIST',
    heroMeta: (owner: string, songCount: number) => `by ${owner} • ${songCount} songs`,
    moreToExplore: 'More to Explore',
    saved: 'Saved',
    savePlaylist: 'Save playlist',
  },
} as const;
