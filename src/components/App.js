import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, withRouter,Redirect } from 'react-router';
import { HashRouter,BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

/* eslint-disable */
import ErrorPage from '../pages/error';
/* eslint-enable */

import '../styles/theme.scss';
import LayoutComponent from '../components/Layout';
import Login from '../pages/login';
import Register from '../pages/register';
import { logoutUser,loginError,receiveLogin,requestLogout } from '../actions/user';
import axios from 'axios';

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

const PrivateRoute = ({dispatch,component,isLoginFailed,...rest}) => {
    if (!Login.isAuthenticated(JSON.parse(localStorage.getItem('authenticated')))) {
        console.log('privateRoute login');
        dispatch(requestLogout());
        return (<Redirect to="/login"/>)
    } else {
        return ( // eslint-disable-line
            <Route {...rest} render={props => (React.createElement(component, props))}/>
        );
    } 
}

const App = (props)=> {
    const {userInfo,isAuthenticated} = useSelector(state=>state.auth);
    const dispatch = useDispatch();

    //f5 눌렀을 때도 user 정보가 유지되게 하기 위해..
    useEffect(()=>{
        if(!userInfo&&localStorage.getItem('token')){
            //userInfo dispatch 해서 업데이트..
            const headers = {headers :{'Authorization':localStorage.getItem('token')}};
            axios.get('/user/authenticate_user',headers)
            .then(resp=>{
                const {success,email}=resp.data;
                if(success){
                    dispatch(receiveLogin({email}));
                }else{
                    console.log('authenticate fail');
                    localStorage.removeItem('authenticated');
                    localStorage.removeItem('token');
                }
            })
            .catch(err=>{
                localStorage.removeItem('authenticated');
                localStorage.removeItem('token');
            })
        }
    },[userInfo,isAuthenticated])
    return (
        <div>
            <ToastContainer
                autoClose={5000}
                hideProgressBar
                closeButton={<CloseButton/>}
            />
            <BrowserRouter>
                <Switch>
                    {/* <authenticatedRouter path="/app" userInfo={userInfo} component={LayoutComponent}/> */}
                    <PrivateRoute  path="/app" dispatch={dispatch} component={LayoutComponent}/>
                    <Route path="/" exact  render={() => <Redirect to="/app"/>}/>
                    <Route path="/register" exact component={Register}/>
                    <Route path="/login" exact component={Login}/>
                    {/* <Route path="/app" exact render={() => React.createElement(LayoutComponent)}/> */}
                    
                </Switch>
            </BrowserRouter>
        </div>

    );
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
});

//export default connect(mapStateToProps)(App);

export default withRouter(App);