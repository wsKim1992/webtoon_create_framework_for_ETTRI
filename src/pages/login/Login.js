import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { connect} from 'react-redux';
import { Container, Alert, Button, FormGroup, Label, InputGroup, InputGroupAddon, Input, InputGroupText } from 'reactstrap';
import { loginUser } from '../../actions/user';
import styled from 'styled-components';

const LoginForm = styled.form`
    width:100%;
    height:100%;
    display:flex;
    flex-direction:row;
    justify-content:space-evenly;
    align-item:center;    
`

const InputWrap = styled.div`
    width:80%;
    height:100%;
`

const LoginBtnWrap = styled.div`
    width:18.5%;
    height:172px;
    display:flex;
    flex-direction:row;
    justify-content:left;
    align-item:center;
`

const LoginBtn = styled(Button)`
    margin-top:50px;
    width:45%;
    height:58.5%;
`

const RegisterBtnWrap = styled.p`
    width:80%;
    height:auto;
    text-align:left;
`

class Login extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
    };

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
        this.props.dispatch(loginUser({ email: this.state.email, password: this.state.password }));
    }

    signUp() {
        this.props.history.push('/register');
    }

    render() {
        
        const { from } = this.props.location.state || { from: { pathname: '/app' } }; // eslint-disable-line

        // cant access login page while logged in
        if (Login.isAuthenticated(JSON.parse(localStorage.getItem('authenticated')))) {
            console.log(from);
            return (
                <Redirect to={from} />
            );
        }

        return (
            <div className="auth-page">
                <Container>
                    
                        <p className="widget-auth-info">
                            Use your email to sign in.
                        </p>
                        <LoginForm id="loginForm" onSubmit={this.doLogin}>
                            {
                                this.props.errorMessage && (
                                    <Alert className="alert-sm widget-middle-overflow rounded-0" color="danger">
                                        {this.props.errorMessage}
                                    </Alert>
                                )
                            }
                            <InputWrap>
                                <FormGroup className="mt">
                                    <Label for="email">Email</Label>
                                    <InputGroup className="input-group-no-border">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="la la-user text-white"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="email" className="input-transparent pl-3" value={this.state.email} onChange={this.changeEmail} type="email"
                                            required name="email" placeholder="Email"/>
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <InputGroup className="input-group-no-border">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="la la-lock text-white"/>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input id="password" className="input-transparent pl-3" value={this.state.password}
                                            onChange={this.changePassword} type="password"
                                            required name="password" placeholder="Password"/>
                                    </InputGroup>
                                </FormGroup>
                            </InputWrap>
                            <LoginBtnWrap /* className="bg-widget auth-widget-footer" */>
                                <LoginBtn form="loginForm" type="submit" color="danger" className="auth-btn"
                                        size="sm" style={{color: '#fff'}}>
                                    <span className="auth-btn-circle" style={{marginRight: 8}}>
                                    <i className="la la-caret-right"/>
                                    </span>
                                    {this.props.isFetching ? 'Loading...' : 'Login'}
                                </LoginBtn>
                            </LoginBtnWrap>
                        </LoginForm>
                        <RegisterBtnWrap>
                            <Link className="d-block text-center mb-4" to="register">Create an Account</Link>
                        </RegisterBtnWrap>
                </Container>
                <footer className="auth-footer">
                {new Date().getFullYear()} &copy; Light Blue Template - React Admin Dashboard Template Made by <a href="https://flatlogic.com" rel="noopener noreferrer" target="_blank">Flatlogic LLC</a>.
                </footer>
            </div>
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

