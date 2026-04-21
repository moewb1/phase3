import { Platform } from 'react-native';

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#0F1120',
      shadowOpacity: 0.08,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
    },
    android: {
      elevation: 4,
    },
    default: {},
  }),
  overlay: Platform.select({
    ios: {
      shadowColor: '#05050A',
      shadowOpacity: 0.22,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 18 },
    },
    android: {
      elevation: 10,
    },
    default: {},
  }),
};
