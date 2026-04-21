import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatSupportConversationView } from './ChatSupportConversationView';
import { ChatSupportHomeView } from './ChatSupportHomeView';
import { colors } from '../../theme/colors';

interface ChatSupportModalProps {
  visible: boolean;
  onClose: () => void;
}

type ChatView = 'home' | 'conversation';

export function ChatSupportModal({
  visible,
  onClose,
}: ChatSupportModalProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<ChatView>('home');

  useEffect(() => {
    if (!visible) {
      setView('home');
    }
  }, [visible]);

  return (
    <Modal animationType="slide" onRequestClose={onClose} visible={visible}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        {view === 'home' ? (
          <ChatSupportHomeView
            bottomInset={insets.bottom}
            topInset={insets.top}
            onClose={onClose}
            onStartConversation={() => setView('conversation')}
          />
        ) : null}

        {view === 'conversation' ? (
          <ChatSupportConversationView
            bottomInset={insets.bottom}
            topInset={insets.top}
            onBack={() => setView('home')}
            onClose={onClose}
          />
        ) : null}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
    flex: 1,
  },
});
