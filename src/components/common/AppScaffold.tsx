import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import type { RootStackParamList } from '../../types/navigation';
import { useAppStore } from '../../store/AppStore';
import { ThematicHeader } from './ThematicHeader';
import { MenuOverlay } from '../overlays/MenuOverlay';
import { NotificationsFlyout } from '../overlays/NotificationsFlyout';
import { ProfileFlyout } from '../overlays/ProfileFlyout';
import { ChannelSwitchModal } from '../overlays/ChannelSwitchModal';
import { ChatSupportModal } from '../chat/ChatSupportModal';
import { FloatingChatButton } from './FloatingChatButton';

interface AppScaffoldProps {
  navigation: NavigationProp<RootStackParamList>;
  children: React.ReactNode;
  showFloatingChat?: boolean;
}

export function AppScaffold({
  navigation,
  children,
  showFloatingChat = true,
}: AppScaffoldProps): React.JSX.Element {
  const { selectedChannel } = useAppStore();
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [switchChannelVisible, setSwitchChannelVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <View style={styles.container}>
      <ThematicHeader
        avatarUrl={selectedChannel.avatarUrl}
        onPressLogo={() => navigation.navigate('Home')}
        onPressMenu={() => setMenuVisible(true)}
        onPressNotifications={() => setNotificationsVisible(true)}
        onPressProfile={() => setProfileVisible(true)}
      />
      <View style={styles.content}>{children}</View>
      {showFloatingChat ? (
        <FloatingChatButton onPress={() => setChatVisible(true)} />
      ) : null}
      <MenuOverlay
        navigation={navigation}
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
      />
      <NotificationsFlyout
        notificationsVisible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
      <ProfileFlyout
        navigation={navigation}
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
        onSwitchAccount={() => {
          setProfileVisible(false);
          setSwitchChannelVisible(true);
        }}
      />
      <ChannelSwitchModal
        visible={switchChannelVisible}
        onClose={() => setSwitchChannelVisible(false)}
      />
      <ChatSupportModal
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
