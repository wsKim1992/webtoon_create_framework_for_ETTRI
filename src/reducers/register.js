import { INIT,SEND_EMAIL,SEND_EMAIL_SUCCESS,SEND_EMAIL_FAILED
    ,COMPARE_CODE,COMPARE_CODE_SUCCESS,COMPARE_CODE_FAILED
    ,REGISTER,REGISTER_SUCCESS,REGISTER_FAILURE
    ,TYPE_EMAIL,TYPE_CODE,TYPE_PASSWORD,FINISHED
    ,ERROR_TYPE_EMAIL,ERROR_TYPE_CODE,ERROR_TYPE_PASSWORD
} from '../actions/register';

export default function register(state = {
    isFetching: false,
    errorMessage: false,
    registerState:TYPE_EMAIL,//'type_code','type_password','register_info',
    email:'',
    code:'',
    errorCode:0,
    sendEmailMessage:'이메일을 입력 해주세요',
    compareCodeMessage: '이메일로 받은 인증코드를 입력해주세요.',
    typePasswordMessage: '비밀번호를 입력하고 등록버튼을 눌러주세요.'
}, action) {
    switch (action.type) {
        case INIT:{
            return {...state,registerState:TYPE_EMAIL,email:'',code:'',errorCode:0,errorMessage: false
            ,sendEmailMessage:'전송된 메일의 인증코드를 입력하면 비밀번호를 만들수 있습니다.'
            ,compareCodeMessage: '이메일로 받은 인증코드를 입력해주세요.'
            ,typePasswordMessage: '비밀번호를 입력하고 등록버튼을 눌러주세요.'}
        }
        case SEND_EMAIL:{
            const email = action.email;
            return{...state,email,isFetching:true}
        }
        case SEND_EMAIL_SUCCESS:{
            let {errorCode} = state;
            if(errorCode&(1<<0)){errorCode=errorCode&6;}
            return{...state,isFetching:false,errorCode,errorMessage:false,registerState:TYPE_CODE,sendEmailMessage:action.message}
        }
        case SEND_EMAIL_FAILED:{
            let {errorCode} = state;
            errorCode = errorCode | ERROR_TYPE_EMAIL;
            return{...state,isFetching:false,errorCode,errorMessage:true,sendEmailMessage:action.message}
        }
        case COMPARE_CODE:{
            const code = action.code;
            return{...state,isFetching:true,code}
        }
        case COMPARE_CODE_SUCCESS:{
            let {errorCode} = state;
            errorCode= 0;
            return {...state,isFetching:false,errorCode,errorMessage:false,registerState:TYPE_PASSWORD,compareCodeMessage:action.message}
        }
        case COMPARE_CODE_FAILED:{
            let {errorCode} = state;
            errorCode= errorCode|ERROR_TYPE_CODE;
            return {...state,isFetching:false,errorCode,errorMessage:true,code:'',compareCodeMessage:action.message}
        }
        case REGISTER:{
            return {...state,isFetching:true};
        }
        case REGISTER_SUCCESS:{
            let {errorCode} = state;
            errorCode= 0;
            return {...state,registerState:FINISHED,isFetching:false,errorCode,errorMessage:false,typePasswordMessage:action.message};
        }
        case REGISTER_FAILURE:{
            let {errorCode} = state;
            errorCode= errorCode|ERROR_TYPE_PASSWORD;
            return {...state,isFetching:false,errorCode,errorMessage:true,typePasswordMessage:action.message};
        }
        default:return state; 
    }
}
