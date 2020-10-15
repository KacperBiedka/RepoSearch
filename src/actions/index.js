export const actionTypes = {
  UPDATE_SEARCH_ERROR: "UPDATE_SEARCH_ERROR",
};

export const updateSearchError = (error) => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.UPDATE_SEARCH_ERROR,
      payload: error,
    });
  };
};
