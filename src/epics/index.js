import { combineEpics } from 'redux-observable';
import commonEpic from './CommonEpic';

const epics = combineEpics(
  ...commonEpic,
);

export default epics;
