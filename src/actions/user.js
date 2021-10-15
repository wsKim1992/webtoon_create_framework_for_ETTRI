import axios from "axios";

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

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

export function requestLogout() {
    console.log('logoutUser');
    if(localStorage.getItem('token')){
        return (dispatch) => {
            axios.post('/user/logout')
            .then(resp=>{
                const {success,message}=resp.data;
                console.log(message);
                if(success){
                    localStorage.removeItem('authenticated');
                    localStorage.removeItem('token');
                    dispatch(receiveLogout());
                }else{
                    dispatch(loginError(message));
                }
            })
            .catch(err=>{
                console.error(err);
                alert('서버 점검중..');
            })
        };
    }else{
        return(dispatch)=>{
            dispatch(receiveLogout());
        }
    }
}

export function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
    };
}

// Logs the user out
export function logoutUser() {
    return{
        type:LOGOUT_SUCCESS
    }
}

export function loginUser(creds) {
    return (dispatch) => {
        const dataToSend={
            email:creds.email,
            password:creds.password
        }
        const headers = {'content-type':'application/json'};
        
        axios.post('/user/login',dataToSend,headers)
        .then(resp=>{
            const {success,message,userInfo}=resp.data;
            console.log(message)
            if(success){
                localStorage.setItem('authenticated',true);
                if(resp.data?.token)localStorage.setItem('token',resp.data.token);
                return dispatch(receiveLogin(userInfo));
            }else{
                alert(message);
                dispatch(loginError(message));
            }
        })
        .catch(err=>{
            console.error(err);
            alert('서버 점검중..');
            dispatch(loginError('서버 점검중..'));
        })
        /* dispatch(receiveLogin());

        if (creds.email.length > 0 && creds.password.length > 0) {
            localStorage.setItem('authenticated', true)
        } else {
            dispatch(loginError('Something was wrong. Try again'));
        } */
    }
}


