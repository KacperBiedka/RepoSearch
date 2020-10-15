import { actionTypes } from "../actions";

export default (
  state = {
    searchError: null,
  },
  action
) => {
  switch (action.type) {
    case actionTypes.UPDATE_SEARCH_ERROR:
      return {
        ...state,
        searchError: action.payload,
      };
    default:
      return state;
  }
};
