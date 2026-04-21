import { strings } from '../localization/strings';

export const headerMenuLinks = [
  { id: 'home', label: strings.menu.headerLinks.home, route: 'Home' as const, path: '/' },
  {
    id: 'discover',
    label: strings.menu.headerLinks.discover,
    route: 'Placeholder' as const,
    path: '/discover',
  },
  {
    id: 'songs',
    label: strings.menu.headerLinks.songs,
    route: 'Placeholder' as const,
    path: '/songs',
  },
  {
    id: 'playlists',
    label: strings.menu.headerLinks.playlists,
    route: 'MyPlaylists' as const,
    path: '/playlists',
  },
  {
    id: 'licenses',
    label: strings.menu.headerLinks.licenses,
    route: 'Placeholder' as const,
    path: '/licenses',
  },
  {
    id: 'trackfluencer',
    label: strings.menu.headerLinks.trackfluencer,
    route: 'Placeholder' as const,
    path: '/trackfluencer',
  },
  {
    id: 'points',
    label: strings.menu.headerLinks.points,
    route: 'Placeholder' as const,
    path: '/points',
  },
  {
    id: 'help',
    label: strings.menu.headerLinks.help,
    route: 'Placeholder' as const,
    path: '/help-center',
  },
  {
    id: 'how',
    label: strings.menu.headerLinks.how,
    route: 'Placeholder' as const,
    path: '/how-it-works',
  },
  {
    id: 'privacy',
    label: strings.menu.headerLinks.privacy,
    route: 'Placeholder' as const,
    path: '/privacy-and-terms',
  },
  {
    id: 'contact',
    label: strings.menu.headerLinks.contact,
    route: 'Placeholder' as const,
    path: '/contact-us',
  },
  {
    id: 'logout',
    label: strings.menu.headerLinks.logout,
    route: 'Placeholder' as const,
    path: '/log-out',
  },
] as const;

export const profileFlyoutLinks = [
  {
    id: 'licenses',
    label: strings.menu.profileLinks.licenses,
    route: 'Placeholder' as const,
    path: '/licenses-and-downloads',
  },
  {
    id: 'playlists',
    label: strings.menu.profileLinks.playlists,
    route: 'MyPlaylists' as const,
    path: '/my-playlists',
  },
  {
    id: 'trackfluencer',
    label: strings.menu.profileLinks.trackfluencer,
    route: 'Placeholder' as const,
    path: '/trackfluencer',
  },
  {
    id: 'points',
    label: strings.menu.profileLinks.points,
    route: 'Placeholder' as const,
    path: '/points',
  },
  {
    id: 'profile',
    label: strings.menu.profileLinks.profile,
    route: 'Placeholder' as const,
    path: '/profile',
  },
  {
    id: 'settings',
    label: strings.menu.profileLinks.settings,
    route: 'Placeholder' as const,
    path: '/settings',
  },
  {
    id: 'signout',
    label: strings.menu.profileLinks.signout,
    route: 'Placeholder' as const,
    path: '/sign-out',
  },
] as const;
