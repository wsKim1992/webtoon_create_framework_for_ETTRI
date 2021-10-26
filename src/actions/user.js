import axios from "axios";

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';
export const INIT_INFO = 'INIT_INFO';

export const init=()=>{
    return {type:INIT_INFO}
}

export const requestLogin=()=>{
    return {type:LOGIN_REQUEST}
}

export function receiveLogin(userInfo) {
    return {
        type: LOGIN_SUCCESS,
        userInfo
    };
}

export function loginError(payload) {
    return {
        type: LOGIN_FAILURE,
        payload,
    };
}

export function loginUser(creds) {
    return (dispatch) => {
        
        
        const dataToSend={
            email:creds.email,
            password:creds.password
        }
        
        dispatch(requestLogin());
        const headers = {'content-type':'application/json','Origin':'http://1.201.8.82:9992'};
        axios.post('/user/login',dataToSend,headers)
        .then(resp=>{
            const {success,message,userInfo}=resp.data;
            if(success){
                localStorage.setItem('authenticated',true);
                if(resp.data?.token)localStorage.setItem('token',resp.data.token);
                axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
                axios.defaults.headers.post['Access-Control-Allow-Origin'] = 'http://1.201.8.82:9992';
                return dispatch(receiveLogin(userInfo));
            }else{
                dispatch(loginError(message));
            }
        })
        .catch(err=>{
            console.error(err);
            dispatch(loginError('접속에러!'));
        })
    }
}

function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
    };
}

export const logoutError=(payload)=>{
    return {
        type: LOGOUT_FAILURE,payload
    }
}

const requestLogout=()=>{
    return{type:LOGOUT_REQUEST}
}

export function logoutUser({history}) {
    console.log('logoutUser');
    if(localStorage.getItem('token')){
        return (dispatch,getState) => {
            dispatch(requestLogout());
            axios.post('/user/logout')
            .then(resp=>{
                const {success,message}=resp.data;
                if(success){
                    axios.defaults.headers.post['Content-Type'] = null;
                    axios.defaults.headers.post['Access-Control-Allow-Origin'] = null;
                    localStorage.removeItem('authenticated');
                    localStorage.removeItem('token');
                    dispatch(receiveLogout());
                    history.push('/login');
                }else{
                    dispatch(logoutError(message));
                }
            })
            .catch(err=>{
                console.error(err);
                dispatch(logoutError('서버 점검중..'));
            })
        };
    }else{
        return(dispatch)=>{
            dispatch(receiveLogout());
        }
    }
}






