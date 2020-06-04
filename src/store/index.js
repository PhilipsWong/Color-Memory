/* global window */
import { applyMiddleware, compose, createStore } from 'redux';
import { persistReducer, persistStore, createTransform } from 'redux-persist';
import { createEpicMiddleware } from 'redux-observable';
import AsyncStorage from '@react-native-community/async-storage';
import reducers from '../reducers';
import epics from '../epics';
import Reactotron from './ReactotronConfig';

export default (initialState) => {
  const initialCommon = {
    // userRecord: [],
  };

  // Redux Persist config
  const config = {
    key: 'root',
    storage: AsyncStorage,
    transforms: [
      createTransform(
        (state) => state,
        (state) => ({ ...state, ...initialCommon }),
        { whitelist: ['common'] },
      ),
    ],
  };

  const reducer = persistReducer(config, reducers);

  const epicMiddleware = createEpicMiddleware();

  const middlewares = [epicMiddleware];

  const composeEnhancers = (
    window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) || compose;

  const enhancer = composeEnhancers(
    applyMiddleware(...middlewares),
    Reactotron.createEnhancer()
  );

  const store = createStore(
    reducer,
    initialState,
    enhancer,
  );

  epicMiddleware.run(epics);

  const persistor = persistStore(
    store,
    undefined,
    () => {
      // I18n.locale = store.getState().common.locale;
    },
  );

  return { persistor, store };
};
