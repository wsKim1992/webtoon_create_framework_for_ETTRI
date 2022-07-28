import {all,fork} from 'redux-saga/effects';
import callAPISaga from './callAPISaga';

export default function* rootSaga(){
    yield all([
        fork(callAPISaga)
    ])
}