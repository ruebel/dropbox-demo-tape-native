import { applyMiddleware, compose, createStore } from 'redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';
import thunkMiddleware from 'redux-thunk';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createMemoryHistory';
import { reducers } from './modules';

const config = {
  key: 'root',
  storage
};

const rootReducer = persistCombineReducers(config, {
  ...reducers,
  routing: routerReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const configureStore = state => {
  const history = createHistory();
  const store = createStore(
    rootReducer,
    state,
    composeEnhancers(
      applyMiddleware(thunkMiddleware, routerMiddleware(history))
    )
  );

  if (process.env.NODE_ENV !== 'production') {
    if (module.hot) {
      module.hot.accept('./modules', () => {
        store.replaceReducer(rootReducer);
      });
    }
  }

  const persistor = persistStore(store);

  return { history, persistor, store };
};

export default configureStore;
