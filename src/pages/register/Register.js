import React,{useState,useEffect,useRef} from 'react';
import {useDispatch,useSelector} from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { Container, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap';
import { updateRegisterState,sendEmailRequest,
    TYPE_EMAIL,TYPE_CODE,TYPE_PASSWORD,FINISHED,initState,sendEmailFailed,sendRegistFailed, REGISTER_SUCCESS, SEND_EMAIL_FAILED } from '../../actions/register';
import styled from 'styled-components'

const EntireWrap = styled.div`
    width:auto;
    height:auto;
    position: absolute;
    top: 42%;
    left: 50%;
    margin-left: -280px;
    margin-top: -170px;
`

const NewContainer = styled(Container)`
    width:560px;
    background-color:#fff;
    padding:20px;
    border-radius:15px;
`

const NewFormGroup = styled(FormGroup)`
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    height:58px;
`

const NewInputGroup = styled(InputGroup)`
    width:100%;
    height:100%;
`
const NewInputGroupAddon = styled(InputGroupAddon)`
    width:21%;
    height:100%;
    margin-right:10px;
`
const NewInputGroupText= styled(InputGroupText)`
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-item : center;
`
const NewInputTag =styled(Input)`
    width:46%;
    height:100%;
    margin-right:10px; 
    &:focus{
        background-color:white;
    }
`

const NewInputGroupTextSpan = styled.span`
    display:inline-block;
    width:100%;

`
const StyledButtonWrap = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-evenly;
    align-item : center;
    height:auto;
`

const StyledButton = styled(Button)`
    display:block;
    width:21%;
    height:100%;
    margin:0;
    border-radius:5px;
    text-align:center;
    background-color:#2477ff;
    border:none;
`

const StyledEnterCodeButton = styled(Button)`
    display:block;
    width:25%;
    height:100%;
    margin:0;
    text-align:center;
    color:'#fff';
    background-color:#ffc107;
`

const StyledPTag = styled.p`
    display:block;
    width:100%;
    height:43.7%;
    margin:10px 0 10px 0;
    text-align:center;
    color:#454545;
`

const MessageTag = styled.p`
    width:100%;
    height:20px;
    font-size:12.5px;
    line-height:20px;
    color:#454545;
`

const Register =(props)=> {
    const {isFetching,errorMessage,registerState
        ,sendEmailMessage,compareCodeMessage,typePasswordMessage,errorCode} = useSelector(state=>state.register);
    const dispatch = useDispatch();
    const [email,setEmail]=useState('');
    const [code,setCode]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');

    const emailRef = useRef(null);
    const codeRef = useRef(null);
    const passwordRef= useRef(null);
    const confirmPasswordRef = useRef(null);

    const changeEmail=(event)=>{
        setEmail( event.target.value);
    }

    const changeCode=(event)=>{
        setCode(event.target.value);
    } 

    const changePassword=(event)=> {
        setPassword(event.target.value);
    }

    const changeConfirmPassword=(event)=>{
        setConfirmPassword(event.target.value);
    }

    useEffect(()=>{
        return()=>{
            dispatch(initState());
        }
    },[])


    const isPasswordValid=()=> {
       return password && password === confirmPassword;
    }

    

    const onClickSubmit=(e)=>{
        e.preventDefault();
        registerState===TYPE_EMAIL?
            dispatch(updateRegisterState(email))
            :dispatch(sendEmailRequest(email));
    }

    const onClickSubmitCode = (e)=>{
        e.preventDefault();
        if(registerState!==TYPE_CODE){
            dispatch(sendEmailFailed('이메일을 입력하고 \'이메일로 인증코드 받기\' 버튼을 click 해주세요!'));
            return false;
        }
        dispatch(updateRegisterState(code));
    }

    const onClickRegister=(e)=>{
        e.preventDefault();
        if(registerState===FINISHED){return false;}
        if (isPasswordValid()) {
            dispatch(updateRegisterState({password,history:props.history}));
        }else {
            dispatch(sendRegistFailed("비밀번호가 같지 않습니다."));
        }
    }

    return (
        <div className="auth-page">
            <EntireWrap>
            <h1 style={{color:'#fff',fontSize:'25.5px'}}>회원가입</h1>
            <NewContainer>
                <p style={{color:'#000'}} className="widget-auth-info">
                    {registerState!==TYPE_PASSWORD?
                        <span>
                            계정의 아이디는 메일주소를 사용합니다.  <br/>
                            계정생성을 위하여 아이디로 사용할 메일주소를 입력해주세요. 
                        </span>:
                        <span>
                            계정의 비밀번호를 설정해주세요
                        </span>
                    }
                </p>
                <form >
                    
                    {(registerState!==TYPE_PASSWORD
                        &&
                        registerState!==FINISHED)
                        && 
                        (
                            <>
                                <NewFormGroup className="mt">
                                    <NewInputGroup className="input-group-no-border">
                                        <NewInputGroupAddon addonType="prepend">
                                            <NewInputGroupText style={{borderRadius:'10px'}}>
                                                <i className="la la-user text-white"/>
                                                <NewInputGroupTextSpan>Email</NewInputGroupTextSpan>
                                            </NewInputGroupText>
                                        </NewInputGroupAddon>
                                        <NewInputTag ref={emailRef} id="email" value={email}
                                                style={{boxShadow:'0 0 2.5px #454545',color:'#454545',backgroundColor:'#fff',borderRadius:'7.5px'}} onChange={changeEmail} type="email"
                                                required name="email" placeholder="Email"/>
                                        <StyledButton onClick={onClickSubmit} type="submit" color="danger" size="sm" >
                                            {isFetching&&(<span>email 전송중..</span>)}
                                            {!isFetching&&registerState===TYPE_EMAIL?`이메일로 인증코드 받기`:'인증번호 다시 받기'}
                                        </StyledButton>
                                    </NewInputGroup>
                                </NewFormGroup>
                                <MessageTag style={(errorCode&(1<<0))&&errorMessage?{color:'red'}:null}>
                                    {sendEmailMessage}
                                </MessageTag>
                                <NewFormGroup className="mt">
                                    <NewInputGroup className="input-group-no-border">
                                        <NewInputGroupAddon addonType="prepend">
                                            <NewInputGroupText style={{borderRadius:'10px'}}>
                                                <i className="la la-user text-white"/>
                                                <NewInputGroupTextSpan>Code</NewInputGroupTextSpan>
                                            </NewInputGroupText>
                                        </NewInputGroupAddon>
                                        <NewInputTag  ref={codeRef} id="register_code"  value={code}
                                                style={{boxShadow:'0 0 2.5px #454545',color:'#454545',backgroundColor:'#fff',borderRadius:'7.5px'}} onChange={changeCode} type="code"
                                                required name="code" placeholder="code"/>
                                        <StyledButton onClick={onClickSubmitCode} type="submit" color="danger" size="sm" >
                                            {isFetching?(<span>인증코드 전송중..</span>):(<span>인증코드 입력</span>)}
                                        </StyledButton>
                                    </NewInputGroup>
                                </NewFormGroup>
                                <MessageTag style={(errorCode&(1<<1))&&errorMessage?{color:'red'}:null}>
                                    {compareCodeMessage}
                                </MessageTag>
                            </>
                        )
                    }
                    {(registerState===TYPE_PASSWORD||registerState===FINISHED)&&(
                        <>
                            <NewFormGroup>
                                <NewInputGroup className="input-group-no-border">
                                    <NewInputGroupAddon addonType="prepend">
                                        <NewInputGroupText>
                                            <i className="la la-lock text-white"/>
                                            <NewInputGroupTextSpan>비밀번호</NewInputGroupTextSpan>
                                        </NewInputGroupText>
                                    </NewInputGroupAddon>
                                    <NewInputTag style={{boxShadow:'0 0 2.5px #454545',color:'#454545',backgroundColor:'#fff',borderRadius:'7.5px'}} ref={passwordRef} id="password" value={password}
                                            onChange={changePassword} type="password"
                                            required name="password" placeholder="Password"/>
                                </NewInputGroup>
                            </NewFormGroup>
                            <MessageTag>
                                {''}
                            </MessageTag>
                            <NewFormGroup>
                                {/* <Label for="confirmPassword">Confirm</Label> */}
                                <NewInputGroup className="input-group-no-border">
                                    <NewInputGroupAddon addonType="prepend">
                                        <NewInputGroupText>
                                            <i className="la la-lock text-white"/>
                                            <NewInputGroupTextSpan>비밀번호 <br/>확인</NewInputGroupTextSpan>
                                        </NewInputGroupText>
                                    </NewInputGroupAddon>
                                    <NewInputTag ref={confirmPasswordRef} id="confirmPassword" value={confirmPassword}
                                            onChange={changeConfirmPassword}  type="password"
                                            style={{boxShadow:'0 0 2.5px #454545',backgroundColor:'#fff',color:'#454545',borderRadius:'7.5px'}}
                                            required name="confirmPassword" placeholder="Confirm"/>
                                    {   registerState!==FINISHED&&
                                        <StyledButton onClick={onClickRegister} style={registerState===FINISHED?{backgroundColor:'#2477ff'}:null} type="submit"  size="sm" >
                                            {isFetching?(<span>user 정보 등록중..</span>):(<span>Register</span>)}
                                        </StyledButton>
                                    }
                                </NewInputGroup>
                                
                            </NewFormGroup>
                            <MessageTag style={(errorCode&(1<<2))&&errorMessage?{color:'red'}:null}>
                                {typePasswordMessage}
                            </MessageTag>
                        </>
                    )}
                    <StyledButtonWrap>
                        <StyledPTag>
                            계정이 있으시면 로그인을 해주세요!
                        </StyledPTag>
                    </StyledButtonWrap>
                    <StyledButtonWrap>
                        <Link className="d-block text-center mb-4" to="login">로그인 화면으로</Link>
                    </StyledButtonWrap>
                </form>
            </NewContainer>
            </EntireWrap>
        </div>
    );
}

export default withRouter(Register);

