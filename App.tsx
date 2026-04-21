import React from 'react';
import { StatusBar } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AppStoreProvider } from './src/store/AppStore';
import { colors } from './src/theme/colors';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppStoreProvider>
          <BottomSheetModalProvider>
            <StatusBar
              animated
              backgroundColor={colors.headerBackground}
              barStyle="light-content"
            />
            <RootNavigator />
          </BottomSheetModalProvider>
        </AppStoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
