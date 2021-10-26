import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { connect, useDispatch} from 'react-redux';
import { Container, Alert, Button, FormGroup, Label, InputGroup, InputGroupAddon, Input, InputGroupText } from 'reactstrap';
import { loginUser,loginError } from '../../actions/user';
import styled from 'styled-components';

const EntireContainer = styled(Container)`
    width:600px;
    height:auto;
    position:absolute;
    top:50%;
    left:50%;
    margin:-300px -250px;
`;

const MainContainer = styled(Container)`
    display:flex;
    flex-direction:column;
    justify-content:space-evenly;
    align-item:center;
    padding:10px 25px;
    width:100%;
    height:100%;
    border-radius:10px;
    box-shadow:' 0 0 7px #454545'
`;
const NewHeader = styled.h1`
    width:100%;
    height:auto;
    text-align:center;
    color:#454545;
    font-size:30.5px;
    font-weight:bold;
    color:#fff;
`;
const LoginForm = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:space-evenly;
    align-item:center;    
`;

const NewFormGroup=styled(FormGroup)`
    margin:0;
    width:80%;
    margin:10px auto;
`;
const NewInputGroupAddon=styled(InputGroupAddon)`
    width:100.5px;
    margin-right:3.5px;
    border-radius:3.5px;
`;
const NewInputGroupText=styled(InputGroupText)`
    width:95px;
    text-align:center;
    font-size:15.5px;
    border-radius:5px;
`;
const InputWrap = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:space-evenly;
    align-item:center;
    width:100%;
    height:172px;
`;

const NewInputTagEmail = styled.input`
    background-color:white;
    color:#454545;
    height: 58px;
    box-shadow : 0px 0px 2.5px #454545;
    width:70%;
    border-radius:5px;
`;

const NewInputTagPassword = styled.input`
    background-color:white;
    width:70%;
    height: 58px;
    box-shadow : 0px 0px 2.5px #454545;
    color:#454545;
    border-radius:5px;
`;

const LoginBtnWrap = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:row;
    justify-content:space-evenly;
    align-item:center;
`;

const LoginBtn = styled(Button)`
    width:50%;
    height:35.5%;
    background-color:#0314fc;
    border:none;
    border-radius:5px;
    font-size: 24.5px;
`;

const RegisterBtnWrap = styled.p`
    width:100%;
    height:auto;
    text-align:left;
    margin:0;
`;
const RegisterBtn=styled(Link)`
    text-align:center;
    display:block;
    width:100%;
    margin:0;
`;
const FormGroupWrap = styled.div`
    width:100%;
    height:auto;
`;

class Login extends React.Component{
    
    static isAuthenticated(token) {
        if (token) return true;
    }

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        };

        this.doLogin = this.doLogin.bind(this);
        this.changeEmail = this.changeEmail.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    changeEmail(event) {
        this.setState({ email: event.target.value });
    }

    changePassword(event) {
        this.setState({ password: event.target.value });
    }

    doLogin(e) {
        e.preventDefault();
        if(this.state.email===''||this.state.password===''){
            this.props.dispatch(loginError('정보를 모두 입력해주세요'));
            return false;
        }
        this.props.dispatch(loginUser({ email: this.state.email, password: this.state.password}));
    }

    signUp() {
        this.props.history.push('/register');
    }

    render() {
        
        const { from } = this.props.location.state || { from: { pathname: '/app' } }; // eslint-disable-line

        // cant access login page while logged in
        if (Login.isAuthenticated(JSON.parse(localStorage.getItem('authenticated')))) {
            return (
                <Redirect to={from} />
            );
        }

        return (
            <EntireContainer>
                <NewHeader>웹툰 캐릭터 선화 제작 프레임워크</NewHeader>
                <MainContainer style={{backgroundColor:'#ffffff'}}>
                    <LoginForm id="loginForm">
                        {
                            this.props.errorMessage && (
                                <Alert className="alert-sm widget-middle-overflow rounded-0" color="danger">
                                    {this.props.errorMessage}
                                </Alert>
                            )
                        }
                        
                        <InputWrap>
                            <FormGroupWrap>
                                <NewFormGroup className="mt">
                                    {/* <Label for="email">Email</Label> */}
                                    <InputGroup className="input-group-no-border">
                                        <NewInputGroupAddon addonType="prepend">
                                            <NewInputGroupText>
                                                <i className="la la-user text-white"/>아이디
                                            </NewInputGroupText>
                                        </NewInputGroupAddon>
                                        <NewInputTagEmail style={{boxShadow:' 0 0 4px black'}} id="email" className="input-transparent pl-3" value={this.state.email} 
                                            onChange={this.changeEmail} type="email"
                                            required name="email"/>
                                    </InputGroup>
                                </NewFormGroup>
                                <NewFormGroup>
                                    {/* <Label for="password">Password</Label> */}
                                    <InputGroup className="input-group-no-border">
                                        <NewInputGroupAddon addonType="prepend">
                                            <NewInputGroupText>
                                                <i className="la la-lock text-white"/>비밀번호
                                            </NewInputGroupText>
                                        </NewInputGroupAddon>
                                        <NewInputTagPassword id="password" className="input-transparent pl-3" value={this.state.password}
                                            onChange={this.changePassword} type="password"
                                            required name="password"/>
                                    </InputGroup>
                                </NewFormGroup>
                                <RegisterBtnWrap>
                                    <RegisterBtn  to="register">회원가입</RegisterBtn>
                                </RegisterBtnWrap>
                            </FormGroupWrap>
                        </InputWrap>
                        <LoginBtnWrap /* className="bg-widget auth-widget-footer" */>
                            <LoginBtn onClick={this.doLogin} form="loginForm" type="submit" color="danger" className="auth-btn"
                                    size="sm" >
                                <span className="auth-btn-circle" style={{marginRight: 8}}>
                                </span>
                                {this.props.isFetching ? 'Loading...' : 'Login'}
                            </LoginBtn>
                        </LoginBtnWrap>
                    </LoginForm>
                </MainContainer>
                <footer className="auth-footer">
                {new Date().getFullYear()} &copy; Light Blue Template - React Admin Dashboard Template Made by <a href="https://flatlogic.com" rel="noopener noreferrer" target="_blank">Flatlogic LLC</a>.
                </footer>
            </EntireContainer>
        );
    }
}

function mapStateToProps(state) {
    return {
        isFetching: state.auth.isFetching,
        isAuthenticated: state.auth.isAuthenticated,
        errorMessage: state.auth.errorMessage,
    };
}

export default withRouter(connect(mapStateToProps)(Login));

