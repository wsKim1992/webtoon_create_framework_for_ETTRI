import axios from 'axios';
import {fork,all,call,takeLatest,put} from "redux-saga/effects";
import {
    LOADING_CALL_DRAWLINE_API,
    SUCCESS_CALL_DRAWLINE_API,
    FAILURE_CALL_DRAWLINE_API
}from '../reducers/callAPIInDrawLinePage';
import {api_result_type} from '../components/Layout/DrawLineLayout';

const loadAPIDataFunction = (requestData,api_type)=>{
    switch(api_type){
        case api_result_type.REMOVE_BACKGROUND:{
            const config = {
                'content-type':'multipart/form-data',
            };
            return axios.post('/request_image',requestData,config).then(resp=>resp.data.input_path[1]);
        }
        case api_result_type.CONVERT_INTO_LINE:{
            const config = {
                'content-type':'multipart/form-data',
            };
            return axios.post('/request_image',requestData,config).then(resp=>{
                console.log(resp.data);
                return resp.data.output_modeP_path[0];
            });

        }
        case api_result_type.CARTOONIZE:{
            const config = {
                'content-type':'multipart/form-data',
            };
            return axios.post('/cartoonize',requestData,config).then(resp=>`/${resp.data.output_path}`);
        }
        case api_result_type.COLORIZE:{
            const config = {
                'content-type':'multipart/form-data',
            };
            return axios.post('/request_image',requestData,config).then(resp=>{
                let formData= new FormData();
                formData.append('img_path',resp.data.input_path[0]);
                formData.append('line_path',resp.data.output_modeP_path[0])
                return axios.post('/colorize',formData,config);
            }).then(resp=>(resp.data.output_path));
        }
        case api_result_type.CHANGE_FACIAL_EXPRESSION:{
            const config = {
                'content-type':'multipart/form-data',
            };
            return axios.post('/animation',requestData,config).then(resp=>resp.data.output_path);
        }
    }
}

function* loadAPIDataRequest(action){
    try{
        const respData = yield call(loadAPIDataFunction,action.data,action.api_type);
        console.log(respData);
        yield put({type:SUCCESS_CALL_DRAWLINE_API,data:respData,api_type:action.api_type});
    }catch(err){
        console.error(err);
        if(err.response){
            const {status} = err.response;
            if(status>=400&&status<500){
                yield put({type:FAILURE_CALL_DRAWLINE_API,data:'데이터 입력 오류'})
            }else if(500<=status){
                yield put({type:FAILURE_CALL_DRAWLINE_API,data:'서버 점검중...'})
            }
        }else{
            yield put({type:FAILURE_CALL_DRAWLINE_API,data:'데이터 입력 오류'})
        }
    }
}

function* loadAPIDataSaga(){
    yield takeLatest(LOADING_CALL_DRAWLINE_API,loadAPIDataRequest);
}

export default function* callAPIDrawLineSaga(){
    yield all([
        fork(loadAPIDataSaga)
    ])
}
