import { combineReducers } from 'redux';
import commonReducer from './CommonReducer';

const reducers = combineReducers({
  common: commonReducer,
});

export default reducers;
