import { applyMiddleware, compose, createStore } from 'redux';
import {
  createTransform,
  persistStore,
  persistCombineReducers
} from 'redux-persist';
import storage from 'redux-persist/es/storage';
import thunkMiddleware from 'redux-thunk';
import { reducers } from './modules';
import autoSave from './middleware/autoSave';

const blacklistTransform = createTransform((state, key) => {
  return key !== 'audio'
    ? {
      ...state,
      // Don't carry over error or pending states
      pending: false
    }
    : {
      ...state,
      // Force pause on audio if it was playing
      isPaused: true
    };
});

const config = {
  key: 'root',
  storage,
  transforms: [blacklistTransform]
};

const rootReducer = persistCombineReducers(config, reducers);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = state => {
  const store = createStore(
    rootReducer,
    state,
    composeEnhancers(applyMiddleware(autoSave, thunkMiddleware))
  );

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./modules', () => {
        store.replaceReducer(rootReducer);
      });
    }
  }

  const persistor = persistStore(store);

  return { persistor, store };
};

export default configureStore;
