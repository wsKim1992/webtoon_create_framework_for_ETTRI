import axios from 'axios';
import {fork,all,call,takeLatest,put} from "redux-saga/effects";
import {
    LOADING_CALL_API,
    SUCCESS_CALL_API,
    FAILURE_CALL_API
}from '../reducers/callAPIReducer';

const loadAPIDataFunction=(requestData,globalState)=>{
    console.log(globalState);
    switch(globalState){
        case 1:{
            const config = {
                'content-type':'multipart/form-data',
            };
            return axios.post('/request_image',requestData,config);
        }
        case 3:{
            const config = {
                'content-type':'multipart/form-data',
            };
            return axios.post('/colorize',requestData,config);
        }
        case 4:{
            const config = {
                'content-type':'multipart/form-data',
            };
            return axios.post('/animation',requestData,config);
        }
    }   
    
}

function* loadAPIDataRequest(action){
    try{
        const resp = yield call(loadAPIDataFunction,action.data,action.globalState);
        console.log(resp.data);
        yield put({type:SUCCESS_CALL_API,data:resp.data});
    }catch(err){
        if(err.response){
            const {status} = err.response;
            if(status>=400&&status<500){
                yield put({type:FAILURE_CALL_API,data:'데이터 입력 오류'})
            }else if(500<=status){
                yield put({type:FAILURE_CALL_API,data:'서버 점검중...'})
            }
        }else{
            yield put({type:FAILURE_CALL_API,data:'데이터 입력 오류'})
        }
    }
}

function* loadAPIDataSaga(){
    yield takeLatest(LOADING_CALL_API,loadAPIDataRequest);
}

export default function* callAPISaga(){
    yield all([
        fork(loadAPIDataSaga)
    ])
}