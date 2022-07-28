import { combineReducers } from 'redux';
import callAPIReducer from './callAPIReducer';
import MediaReducer from './MediaReducer';

export default combineReducers({
  callAPIReducer,
  MediaReducer
});
