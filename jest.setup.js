/* eslint-env jest */

import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  Reanimated.default.call = () => undefined;

  return Reanimated;
});

global.__reanimatedWorkletInit = () => {};

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();

  return {
    clear: jest.fn(async () => {
      store.clear();
    }),
    getAllKeys: jest.fn(async () => Array.from(store.keys())),
    getItem: jest.fn(async key => store.get(key) ?? null),
    multiGet: jest.fn(async keys =>
      keys.map(key => [key, store.get(key) ?? null]),
    ),
    removeItem: jest.fn(async key => {
      store.delete(key);
    }),
    setItem: jest.fn(async (key, value) => {
      store.set(key, value);
    }),
  };
});

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { TextInput, View } = require('react-native');

  const MockBottomSheetModal = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      present: jest.fn(),
      dismiss: jest.fn(),
    }));

    return <View>{props.children}</View>;
  });

  return {
    BottomSheetBackdrop: ({ children }) => <View>{children}</View>,
    BottomSheetModal: MockBottomSheetModal,
    BottomSheetModalProvider: ({ children }) => <View>{children}</View>,
    BottomSheetScrollView: ({ children }) => <View>{children}</View>,
    BottomSheetTextInput: TextInput,
    BottomSheetView: ({ children }) => <View>{children}</View>,
  };
});

jest.mock('lottie-react-native', () => 'LottieView');

jest.mock('@d11/react-native-fast-image', () => {
  const React = require('react');
  const { Image } = require('react-native');

  const MockFastImage = React.forwardRef((props, ref) =>
    React.createElement(Image, { ...props, ref }),
  );

  MockFastImage.resizeMode = {
    center: 'center',
    contain: 'contain',
    cover: 'cover',
    stretch: 'stretch',
  };
  MockFastImage.priority = {
    high: 'high',
    low: 'low',
    normal: 'normal',
  };
  MockFastImage.cacheControl = {
    cacheOnly: 'cacheOnly',
    immutable: 'immutable',
    web: 'web',
  };
  MockFastImage.transition = {
    fade: 'fade',
    none: 'none',
  };
  MockFastImage.preload = jest.fn();
  MockFastImage.clearMemoryCache = jest.fn(async () => undefined);
  MockFastImage.clearDiskCache = jest.fn(async () => undefined);

  return {
    __esModule: true,
    default: MockFastImage,
  };
});
