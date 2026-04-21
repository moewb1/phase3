export type RootStackParamList = {
  Home: undefined;
  PlaylistDetails: {
    projectId: number;
    titleOverride?: string;
  };
  MyPlaylists: undefined;
  MyPlaylistDetails: {
    playlistId: string;
  };
  Placeholder: {
    title?: string;
    message?: string;
    requestedPath?: string;
  };
};
