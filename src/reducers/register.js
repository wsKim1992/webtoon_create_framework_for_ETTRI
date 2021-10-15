import { SEND_EMAIL,SEND_EMAIL_SUCCESS,SEND_EMAIL_FAILED
    ,COMPARE_CODE,COMPARE_CODE_SUCCESS,COMPARE_CODE_FAILED
    ,REGISTER,REGISTER_SUCCESS,REGISTER_FAILURE
    ,TYPE_EMAIL,TYPE_CODE,TYPE_PASSWORD
} from '../actions/register';

export default function register(state = {
    isFetching: false,
    errorMessage: '',
    registerState:TYPE_EMAIL,//'type_code','type_password','register_info',
    email:'',
    code:''
}, action) {
    console.log(action.type);
    switch (action.type) {
        
        case SEND_EMAIL:{
            const email = action.email;
            return{...state,email,isFetching:true}
        }
        case SEND_EMAIL_SUCCESS:{
            return{...state,isFetching:false,registerState:TYPE_CODE}
        }
        case SEND_EMAIL_FAILED:{
            return{...state,isFetching:false,email:''}
        }
        case COMPARE_CODE:{
            const code = action.code;
            return{...state,isFetching:true,code}
        }
        case COMPARE_CODE_SUCCESS:{
            return {...state,isFetching:false,registerState:TYPE_PASSWORD}
        }
        case COMPARE_CODE_FAILED:{
            return {...state,isFetching:false,code:''}
        }
        case REGISTER:{
            return {...state,isFetching:true};
        }
        case REGISTER_SUCCESS:{
            return {...state,isFetching:false,email:'',code:'',registerState:TYPE_EMAIL};
        }
        case REGISTER_FAILURE:{
            return {...state,isFetching:false};
        }
        default:return state; 
    }
}
