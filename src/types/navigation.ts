export type RootStackParamList = {
  Home: undefined;
  SearchResults: {
    initialQuery?: string;
  };
  PlaylistDetails: {
    projectId: number;
    titleOverride?: string;
  };
  MyPlaylists: undefined;
  MyPlaylistDetails: {
    playlistId: string;
  };
  Placeholder: {
    title: string;
    message?: string;
  };
};
