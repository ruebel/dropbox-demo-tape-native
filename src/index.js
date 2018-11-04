import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { StatusBar } from 'react-native';

import App from './components/App';
import AuthProvider from './AuthProvider';

import theme from './styles/theme';
import configureStore from './store';

const { persistor, store } = configureStore();

export default () => (
  <ThemeProvider theme={theme}>
    <StoreProvider store={store}>
      <PersistGate persistor={persistor}>
        <AuthProvider>
          <StatusBar barStyle="light-content" />
          <ActionSheetProvider>
            <App />
          </ActionSheetProvider>
        </AuthProvider>
      </PersistGate>
    </StoreProvider>
  </ThemeProvider>
);
