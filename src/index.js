import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import { Provider as StoreProvider } from 'react-redux';
import { NativeRouter } from 'react-router-native';
import { PersistGate } from 'redux-persist/es/integration/react';

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
          <NativeRouter>
            <App />
          </NativeRouter>
        </AuthProvider>
      </PersistGate>
    </StoreProvider>
  </ThemeProvider>
);
