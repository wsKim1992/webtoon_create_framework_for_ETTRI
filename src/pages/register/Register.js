import React,{useState,useMemo,useEffect,use} from 'react';
import {useDispatch,useSelector} from 'react-redux'
import PropTypes from 'prop-types';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { Container, Alert, Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap';
import { updateRegisterState,registerUser, registerError,sendEmailRequest,
    TYPE_EMAIL,TYPE_CODE,TYPE_PASSWORD, sendRegistRequest } from '../../actions/register';
import microsoft from '../../assets/microsoft.png';
import Login from '../login';
import styled from 'styled-components'

const StyledButtonWrap = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-evenly;
    align-item : center;
    height:auto;
`

const StyledButton = styled(Button)`
    display:block;
    width:33.3%;
    height:100%;
    margin:0;
    text-align:center;
    background-color:'#db2a3'
`

const StyledEnterCodeButton = styled(Button)`
    display:block;
    width:33.3%;
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
`

const Register =(props)=> {
    console.log('register page');
    const {isFetching,errorMessage,registerState} = useSelector(state=>state.register);
    const dispatch = useDispatch();

    const [email,setEmail]=useState('');
    const [code,setCode]=useState('');
    const [password,setPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');

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

    const checkPassword=()=>{
        if (isPasswordValid()) {
            if (password) {
                dispatch(registerError("Password field is empty"));
            } else {
                dispatch(registerError("Passwords are not equal"));
            }
            setTimeout(() => {
                dispatch(registerError());
            }, 3 * 1000)
        }
    }

    const isPasswordValid=()=> {
       return password && password === confirmPassword;
    }

    const doRegister=(e)=>{
        e.preventDefault();
        if (isPasswordValid()) {
            checkPassword();
        } else {
            dispatch(registerUser({
                creds: {email,password},
                history: props.history
            }));
        }
    }
    
    const {from} = props.location.state || {from: {pathname: '/app'}}; // eslint-disable-line

    // cant access login page while logged in
    if (Login.isAuthenticated(JSON.parse(localStorage.getItem('authenticated')))) {
        return (
            <Redirect to={from}/>
        );
    }

    const onClickSubmit=(e)=>{
        e.preventDefault();
        registerState===TYPE_EMAIL?
            dispatch(updateRegisterState(email))
            :dispatch(sendEmailRequest(email));
    }

    const onClickSubmitCode = (e)=>{
        e.preventDefault();
        dispatch(updateRegisterState(code));
    }

    const onClickRegister=(e)=>{
        e.preventDefault();
        if (isPasswordValid()) {
            dispatch(updateRegisterState({password,history:props.history}));
        }
    }

    return (
        <div className="auth-page">
            <Container>
                <h1>회원가입</h1>
                <p className="widget-auth-info">
                    email 을 입력해주세요
                </p>
                <form onSubmit={doRegister}>
                    {
                        errorMessage && (
                            <Alert className="alert-sm widget-middle-overflow rounded-0" color="danger">
                                {errorMessage}
                            </Alert>
                        )
                    }
                    {registerState===TYPE_EMAIL && <FormGroup className="mt">
                        <Label for="email">Email</Label>
                        <InputGroup className="input-group-no-border">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="la la-user text-white"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input id="email" className="input-transparent pl-3" value={email}
                                    onChange={changeEmail} type="email"
                                    required name="email" placeholder="Email"/>
                        </InputGroup>
                    </FormGroup>}
                    {registerState===TYPE_CODE && <FormGroup className="mt">
                        <Label for="register_code">Register Code</Label>
                        <InputGroup className="input-group-no-border">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                    <i className="la la-user text-white"/>
                                </InputGroupText>
                            </InputGroupAddon>
                            <Input id="register_code" className="input-transparent pl-3" value={code}
                                    onChange={changeCode} type="code"
                                    required name="code" placeholder="code"/>
                        </InputGroup>
                    </FormGroup>}
                    {registerState===TYPE_PASSWORD&&(
                        <>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <InputGroup className="input-group-no-border">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="la la-lock text-white"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input id="password" className="input-transparent pl-3" value={password}
                                            onChange={changePassword} type="password"
                                            required name="password" placeholder="Password"/>
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <Label for="confirmPassword">Confirm</Label>
                                <InputGroup className="input-group-no-border">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="la la-lock text-white"/>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input id="confirmPassword" className="input-transparent pl-3" value={confirmPassword}
                                            onChange={changeConfirmPassword} onBlur={checkPassword} type="password"
                                            required name="confirmPassword" placeholder="Confirm"/>
                                </InputGroup>
                            </FormGroup>
                        </>
                    )}
                    <StyledButtonWrap className="bg-widget-transparent ">
                        {registerState!==TYPE_PASSWORD&&<StyledButton onClick={onClickSubmit} type="submit" color="danger" 
                            size="sm" >
                            {isFetching&&(<span>email 전송중..</span>)}
                            {!isFetching&&registerState===TYPE_EMAIL?'이메일로 인증코드 받기':'인증번호 다시 받기'}
                        </StyledButton>}
                        {registerState===TYPE_CODE&&<StyledEnterCodeButton onClick={onClickSubmitCode} type="submit" color="danger" 
                            size="sm" >
                            {isFetching?(<span>인증코드 전송중..</span>):(<span>인증코드 입력</span>)}
                        </StyledEnterCodeButton>}
                        {registerState===TYPE_PASSWORD&&<StyledButton onClick={onClickRegister} type="submit" color="danger" 
                            size="sm" >
                            {isFetching?(<span>user 정보 등록중..</span>):(<span>Register</span>)}
                        </StyledButton>}
                    </StyledButtonWrap>
                    <StyledButtonWrap>
                        <StyledPTag>
                            Already have the account? Login now!
                        </StyledPTag>
                    </StyledButtonWrap>
                    <StyledButtonWrap>
                        <Link className="d-block text-center mb-4" to="login">Enter the account</Link>
                    </StyledButtonWrap>
                </form>
            </Container>
            <footer className="auth-footer">
                {new Date().getFullYear()} &copy; Light Blue Template - React Admin Dashboard Template Made by <a href="https://flatlogic.com" rel="noopener noreferrer" target="_blank">Flatlogic LLC</a>.                    
            </footer>
        </div>
    );
}
/* 
function mapStateToProps(state) {
    return {
        isFetching: state.register.isFetching,
        errorMessage: state.register.errorMessage,
    };
} */

export default withRouter(Register);

