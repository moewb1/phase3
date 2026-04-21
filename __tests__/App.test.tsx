/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/navigation/RootNavigator', () => {
  const mockReact = require('react');
  const { Text } = require('react-native');

  function MockRootNavigator() {
    return mockReact.createElement(Text, null, 'Root navigator');
  }

  return {
    __esModule: true,
    default: MockRootNavigator,
  };
});

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
