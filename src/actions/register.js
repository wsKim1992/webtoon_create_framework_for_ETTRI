import {toast} from 'react-toastify';
import axios from 'axios';
export const REGISTER = 'REGISTER';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const SEND_EMAIL = 'SEND_EMAIL';
export const SEND_EMAIL_SUCCESS = 'SEND_EMAIL_SUCCESS';
export const SEND_EMAIL_FAILED = 'SEND_EMAIL_FAILED';

export const COMPARE_CODE='COMPARE_CODE';
export const COMPARE_CODE_SUCCESS = 'COMPARE_CODE_SUCCESS';
export const COMPARE_CODE_FAILED = 'COMPARE_CODE_FAILED';
export const INIT = 'INIT';

//registerState 값들
export const TYPE_EMAIL = 'type_email';
export const TYPE_CODE = 'type_code';
export const TYPE_PASSWORD = 'type_password';
export const FINISHED = 'finished'
//에러코드 숫자
export const ERROR_TYPE_EMAIL = 1;
export const ERROR_TYPE_CODE = 2;
export const ERROR_TYPE_PASSWORD = 4;

//초기화
export const initState=()=>{
    return{type:INIT};
}

//register 상태 바꾸게 하는 action
export const updateRegisterState = (data)=>{
    return (dispatch,getState)=>{
        const {registerState} = getState().register;
        switch (registerState){
            case TYPE_EMAIL:{
                dispatch(sendEmailRequest(data));
                break;
            } 
            case TYPE_CODE:{
                dispatch(sendCodeRequest(data));
                break;
            }
            case TYPE_PASSWORD:{
                dispatch(sendRegistRequest(data));
                break;
            }
        }
    }
}
////////////////////
const callSendEmailAPI=(email)=>{
    const success= false;
    return new Promise((resolve,reject)=>{
        const headers = {headers:{'content-type':'application/json'}};
        axios.post('/user/sendMail',{email},headers)
        .then(resp=>{
            const {success,message}=resp.data;
            if(success){
                resolve({success,message})
            }else{
                reject({success,message});
            }
        })
        .catch(error=>{
            const status = error.response.status;
            const {message}=error.response.data;
            console.log(message);
            if(status>=500){reject({success:false,message:message|'서버 점검중'});}
            else if (status>=400){reject({success:false,message:message});}
        })
    })
}

//email 전송 api 호출 action
export const sendEmailRequest=(email)=>{
    //console.log(email);
    return async(dispatch,getState)=>{
        const emailRegEx =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(emailRegEx.test(String(email).toLowerCase())){
            dispatch(sendingEmail(email));
            try{
                const result =await callSendEmailAPI(email);
                dispatch(sendEmailSuccess(result.message));
                /* toast.success(result.message); */
            }catch(err){
                dispatch(sendEmailFailed(err.message));
                /* toast.error(err.message);  */  
            }
        }else{
            dispatch(sendEmailFailed('올바른 형식이 아닙니다'));
            /* toast.error('invalid Format');  */  
        }  
    }
}
//email 전송중 메세지 action
export const sendingEmail=(email)=>{
    return {type:SEND_EMAIL,email}
}
//email 전송완료 메세지 action
export const sendEmailSuccess=(message)=>{
    return {type:SEND_EMAIL_SUCCESS,message}
}
//email 전송 실패 메세지 action
export const sendEmailFailed=(message)=>{
    return {type:SEND_EMAIL_FAILED,message}
}

////////////////////
const callSendingCodeAPI=(code)=>{
    //const compareCode = '#$asp#$jsp$%nodeJS'
    return new Promise((resolve,reject)=>{
        const headers = {headers:{'content-type':'application/json',
        'Authorization':code}};
        axios.post('/user/confirm_code',{},headers)
        .then(resp=>{
            const {success,message} = resp.data;
            if(success){
                axios.defaults.headers.Authorization=code;
                resolve({message});
            }else{reject({message});}
        }).catch(err=>{
            if(err.response.status>=500){
                reject({message:'서버 점검중..'});
            }else if(err.response.status>=400){
                reject({message:err.response.data.message});
            } 
        })
        /* setTimeout(()=>{
            if(code===compareCode){resolve({success:true,msg:'code 전송 성공!'})}
            else {reject({success:false,msg:'code 전송 실패!'})}
        },100) */
    })
}

//email 입력코드 비교 api 호출 action
export const sendCodeRequest=(code)=>{
    return async(dispatch,getState)=>{
        dispatch(sendingCode());
        try{
            const {message} = await callSendingCodeAPI(code);
            dispatch(sendCodeSuccess(message));
            /* toast.success(message); */
        }catch(err){
            dispatch(sendCodeFailed(err.message))
        }
    }
}
//email 전송중 메세지 action
export const sendingCode=(code)=>{
    return{type:COMPARE_CODE,code}
}
//email 입력코드 비교 완료 메세지
export const sendCodeSuccess=(message)=>{
    return{type:COMPARE_CODE_SUCCESS,message}
}
//email 입력코드 비교 실패 메세지
export const sendCodeFailed=(message)=>{
    return{type:COMPARE_CODE_FAILED,message}
}

////////////
const callSendingRegisterAPI=(userInfo)=>{
    return new Promise((resolve,reject)=>{
        const headers = {headers:{'content-type':'application/json'}};
        axios.post('/user/register',userInfo,headers)
        .then(resp=>{
            const {success,message}=resp.data;
            if(success){
                delete axios.defaults.headers.Authorization;
                resolve({message})
            }else{reject({message})}
        }).catch(err=>{
            if(err.response.status>=500){reject({message:'서버 점검중..'});}
            else if(err.response.status>=400){reject({message:err.response.message});}
        })
    })
}

//email password 입력 api 호출 action
export const sendRegistRequest=({password,history})=>{
    return async (dispatch,getStore)=>{
        dispatch(sendingRegist());
        try{
            const userInfo = {email:getStore().register.email,password};
            const {message}= await callSendingRegisterAPI(userInfo);
            dispatch(sendRegistSuccess(message));
            /* toast.success(message); */
            //history.push('/login');
        }catch(err){
            /* toast.error(err.message); */
            dispatch(sendRegistFailed(err.message));
        }
    }
}
//register 전송중 action
export const sendingRegist=()=>{
    return {type:REGISTER}
}
//register 성공 action
export const sendRegistSuccess=(message)=>{
    return {type:REGISTER_SUCCESS,message}
}
//register 실패 action
export const sendRegistFailed=(message)=>{
    return {type:REGISTER_FAILURE,message}
}

//회원정보 등록 메세지
//회원정보 등록 완료 메세지
//회원정보 등록 실패 메세지 

export function receiveRegister() {
    return {
        type: REGISTER_SUCCESS
    };
}

export function registerError(payload) {
    return {
        type: REGISTER_FAILURE,
        payload,
    };
}

export function registerUser(payload) {
    return (dispatch) => {
        if (payload.creds.email.length > 0 && payload.creds.password.length > 0) {
            /* toast.success("You've been registered successfully"); */
            payload.history.push('/login');
        } else {
            dispatch(registerError('Something was wrong. Try again'));
        }
    }
}
