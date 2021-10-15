import {
     LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS,
} from '../actions/user';

const authenticated = localStorage.getItem('authenticated');
export default function auth(state = {
    isFetching: false,
    isAuthenticated: authenticated,
    userInfo:null
}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return Object.assign({}, state, {
                isFetching: false,
                isAuthenticated: true,isLoginFailed:false,
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
        case LOGOUT_SUCCESS:
            return Object.assign({}, state, {
                isAuthenticated: false,
                userInfo:null
            });
        default:
            return state;
    }
}
