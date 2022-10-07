import {all,fork} from 'redux-saga/effects';
import callAPISaga from './callAPISaga';
import callAPIDrawLineSaga from './callAPIDrawLineSaga';
import callAPIPaintSaga from './callAPIPaintSaga';

export default function* rootSaga(){
    yield all([
        fork(callAPISaga),
        fork(callAPIDrawLineSaga),
        fork(callAPIPaintSaga)
    ])
}