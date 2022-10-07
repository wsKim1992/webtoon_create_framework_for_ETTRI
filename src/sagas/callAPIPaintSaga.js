import axios from 'axios';
import {fork,all,call,takeLatest,put,} from "redux-saga/effects";
import {
    LOADING_CALL_PAINT_API,
    SUCCESS_CALL_PAINT_API,
    FAILURE_CALL_PAINT_API
} from '../reducers/callAPIInPaintReducer';

const loadAPIDataFunction = (requestData,api_mode)=>{
    const config = {
        'content-type':'multipart/form-data',
    };
    console.log(`api_mode : ${api_mode}`);
    switch (api_mode){
        case 1 :{
            return axios.post('/hint_colorize_v2',requestData,config);
        }
        case 2 : {
            return axios.post('/hint_colorize_v3',requestData,config);
        }
        default:{
            return axios.post('/hint_colorize',requestData,config);
        }
    }
    
}

function* loadAPIDataRequest(action){
    try{
        const resp = yield call(loadAPIDataFunction,action.data,action.api_mode);
        yield put({type:SUCCESS_CALL_PAINT_API,data:resp.data.output_path});
    }catch(err){
        if(err.response){
            const {status} = err.response;
            if(status>=400&&status<500){
                yield put({type:FAILURE_CALL_PAINT_API,data:'데이터 입력 오류'})
            }else if(500<=status){
                yield put({type:FAILURE_CALL_PAINT_API,data:'서버 점검중...'})
            }
        }else{
            yield put({type:FAILURE_CALL_PAINT_API,data:'데이터 입력 오류'})
        }
    }
}

function* loadAPIDataSaga(){
    yield takeLatest(LOADING_CALL_PAINT_API,loadAPIDataRequest);
}

export default function* callAPIPaintSaga(){
    yield all([
        fork(loadAPIDataSaga),
    ])
}