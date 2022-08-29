import { combineReducers } from 'redux';
import callAPIReducer from './callAPIReducer';
import callAPIInDrawLineReducer from './callAPIInDrawLinePage';
import MediaReducer from './MediaReducer';
import callAPIPaintReducer from './callAPIInPaintReducer';

export default combineReducers({
  callAPIReducer,
  MediaReducer,
  callAPIInDrawLineReducer,
  callAPIPaintReducer
});
