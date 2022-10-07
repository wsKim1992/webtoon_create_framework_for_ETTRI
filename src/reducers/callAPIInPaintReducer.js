import produce from 'immer';

export const INIT_CALL_PAINT_API = 'INIT_CALL_PAINT_API';
export const LOADING_CALL_PAINT_API = 'LOADING_CALL_PAINT_API';
export const SUCCESS_CALL_PAINT_API = 'SUCCESS_CALL_PAINT_API';
export const FAILURE_CALL_PAINT_API = 'FAILURE_CALL_PAINT_API';

const initialState={
    loadingCallAPI:false,
    failureCallAPI:null,
    successCallAPI:false,
    dataFromAPI:null,
}

const reducer = (state=initialState,action)=>{
    return produce(state,(draft)=>{
        switch(action.type){
            case INIT_CALL_PAINT_API:{
                draft.loadingCallAPI=false;
                draft.failureCallAPI=null;
                draft.successCallAPI=false;
                draft.dataFromAPI=null;
                break;
            }
            case LOADING_CALL_PAINT_API:{
                draft.loadingCallAPI=true;
                draft.failureCallAPI=null;
                draft.successCallAPI=false;
                draft.dataFromAPI=null;
                break;
            }
            case SUCCESS_CALL_PAINT_API:{
                draft.loadingCallAPI=false;
                draft.successCallAPI=true;
                draft.dataFromAPI=action.data;
                break;
            }
            case FAILURE_CALL_PAINT_API:{
                draft.loadingCallAPI=false;
                draft.failureCallAPI=action.data;
                break;
            }
        }
    })
}

export default reducer;