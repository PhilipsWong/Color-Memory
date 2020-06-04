import * as COMMON from '../constants/Common';

const initialState = {
  userRecord: [],
};

export default (state = initialState, action) => {
  switch (action.type) {

    case COMMON.ADD_USER_RECORD: {
      if (action.payload.data && action.payload.data.params !== undefined && Object.keys(action.payload.data.params).length > 0) {
        return {
          ...state,
          userRecord: [...state.userRecord, action.payload.data.params],
        };
      }
    }

    case COMMON.CLEAN_USER_RECORD: {
      return {
        ...state,
        userRecord: [],
      };
    }

    default:
      return state;
  }
};
