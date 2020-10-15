import { combineReducers } from "redux";
import searchReducer from "./searchReducer";

// Even though we are only using a single reducer this will come useful as the application grows
export default combineReducers({
  searchReducer,
});
