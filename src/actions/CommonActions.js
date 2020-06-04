import { createAction } from 'typesafe-actions';
import * as COMMON from '../constants/Common';

export const addUserRecordAction = createAction(COMMON.ADD_USER_RECORD, (resolve) => (params) => resolve({ data: { params } }));
export const cleanUserRecordAction = createAction(COMMON.CLEAN_USER_RECORD, (resolve) => (params) => resolve({ data: { params } }));