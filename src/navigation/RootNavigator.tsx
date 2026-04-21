import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Loader } from '../components/common/Loader';
import { useAppStore } from '../store/AppStore';
import { colors } from '../theme/colors';
import type { RootStackParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { PlaylistDetailsScreen } from '../screens/PlaylistDetailsScreen';
import { MyPlaylistsScreen } from '../screens/MyPlaylistsScreen';
import { MyPlaylistDetailsScreen } from '../screens/MyPlaylistDetailsScreen';
import { PlaceholderScreen } from '../screens/PlaceholderScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.headerBackground,
    border: colors.border,
    notification: colors.primary,
    primary: colors.primary,
    text: colors.text,
  },
};

function LoadingRoute(): React.JSX.Element {
  return <Loader />;
}

function RootNavigator(): React.JSX.Element {
  const { hydrated } = useAppStore();

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        {!hydrated ? (
          <Stack.Screen component={LoadingRoute} name="Home" />
        ) : (
          <>
            <Stack.Screen component={HomeScreen} name="Home" />
            <Stack.Screen component={PlaylistDetailsScreen} name="PlaylistDetails" />
            <Stack.Screen component={MyPlaylistsScreen} name="MyPlaylists" />
            <Stack.Screen
              component={MyPlaylistDetailsScreen}
              name="MyPlaylistDetails"
            />
            <Stack.Screen component={PlaceholderScreen} name="Placeholder" />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
