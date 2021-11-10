import {
     LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS,LOGIN_REQUEST,
     LOGOUT_FAILURE,LOGOUT_REQUEST,INIT_INFO,CHECK_REQUEST
} from '../actions/user';

const authenticated = localStorage.getItem('authenticated');
export default function auth(state = {
    isFetching: false,
    isAuthenticated: authenticated,
    userInfo:null
}, action) {
    switch (action.type) {
        case CHECK_REQUEST:
            return Object.assign({},state,{
                isFetching:true
            })
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: true,
                isLoginFailed:false,
                errorMessage: '',
                userInfo:action.userInfo
            });
        case LOGIN_FAILURE:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: false,
                isLoginFailed:true,
                errorMessage: action.payload,
            });
        case LOGIN_REQUEST:
            return {...state, isFetching:true,isLoginFailed:false,
                errorMessage: ''}
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isAuthenticated: false,
                userInfo:null,
                isFetching:false
            });
        case LOGOUT_REQUEST:
            return{...state,isFetching:true}
        case LOGOUT_FAILURE:
            return{...state,isFetching:false,errorMessage:action.payload}
        case INIT_INFO:
            return {...state,isAuthenticated:false,userInfo:null,isFetching:false}
        default:
            return state;
    }
}
