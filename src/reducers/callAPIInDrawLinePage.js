import produce from 'immer';

export const INIT_CALL_DRAWLINE_API = 'INIT_CALL_DRWALINE_API';
export const LOADING_CALL_DRAWLINE_API = 'LOADING_CALL_DRAWLINE_API';
export const SUCCESS_CALL_DRAWLINE_API = 'SUCCESS_CALL_DRAWLINE_API';
export const FAILURE_CALL_DRAWLINE_API = 'FAILURE_CALL_DRAWLINE_API';

const initialState={
    loadingCallAPI:false,
    failureCallAPI:null,
    successCallAPI:false,
    dataFromAPI:null,
    api_type:null,
};

const reducer = (state=initialState,action)=>{
    return produce(state,(draft)=>{
        switch(action.type){
            case INIT_CALL_DRAWLINE_API:{
                draft.loadingCallAPI=false;
                draft.failureCallAPI=null;
                draft.successCallAPI=false;
                draft.dataFromAPI=null;
                draft.api_type=null;
                break;
            }
            case LOADING_CALL_DRAWLINE_API:{
                draft.loadingCallAPI=true;
                draft.failureCallAPI=null;
                draft.successCallAPI=false;
                draft.dataFromAPI=null;
                draft.api_type=null;
                break;
            }
            case SUCCESS_CALL_DRAWLINE_API:{
                draft.loadingCallAPI=false;
                draft.successCallAPI=true;
                draft.dataFromAPI=action.data;
                draft.api_type=action.api_type;
                break;
            }
            case FAILURE_CALL_DRAWLINE_API:{
                draft.loadingCallAPI=false;
                draft.failureCallAPI=action.data;
                draft.api_type=null;
                break;
            }
        }
    })
}

export default reducer;