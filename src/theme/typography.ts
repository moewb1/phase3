import { Platform, Text, TextInput } from 'react-native';

export const fontFamilies = {
  regular:
    Platform.OS === 'android' ? 'PlusJakartaSans-Regular' : 'Plus Jakarta Sans',
  semibold:
    Platform.OS === 'android'
      ? 'PlusJakartaSans-SemiBold'
      : 'Plus Jakarta Sans',
  bold: Platform.OS === 'android' ? 'PlusJakartaSans-Bold' : 'Plus Jakarta Sans',
  extraBold:
    Platform.OS === 'android'
      ? 'PlusJakartaSans-ExtraBold'
      : 'Plus Jakarta Sans',
} as const;

export function applyGlobalTypography(): void {
  const defaultTextStyle = {
    fontFamily: fontFamilies.regular,
  } as const;

  const TextComponent = Text as typeof Text & {
    defaultProps?: {
      style?: unknown;
    };
  };
  const TextInputComponent = TextInput as typeof TextInput & {
    defaultProps?: {
      style?: unknown;
    };
  };

  TextComponent.defaultProps = TextComponent.defaultProps ?? {};
  TextComponent.defaultProps.style = [
    defaultTextStyle,
    TextComponent.defaultProps.style,
  ];

  TextInputComponent.defaultProps = TextInputComponent.defaultProps ?? {};
  TextInputComponent.defaultProps.style = [
    defaultTextStyle,
    TextInputComponent.defaultProps.style,
  ];
}
