import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, withRouter,Redirect } from 'react-router';
import { HashRouter,BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Auth from '../hoc/checkAuth';
/* eslint-disable */
import ErrorPage from '../pages/error';
/* eslint-enable */

import '../styles/theme.scss';
import Layout from '../components/Layout/Layout';
import Login from '../pages/login';
import Register from '../pages/register';
import { logoutUser,receiveLogin,logoutError } from '../actions/user';
import axios from 'axios';

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

const App = (props)=> {
    const {userInfo} = useSelector(state=>state.auth);
    const dispatch = useDispatch();

    //f5 눌렀을 때도 user 정보가 유지되게 하기 위해..
    useEffect(()=>{
        if(!userInfo&&localStorage.getItem('token')){
            //userInfo dispatch 해서 업데이트..
            const headers = {headers:{'Authorization':localStorage.getItem('token')}};
            axios.post('/user/authenticate_user',{},headers)
            .then(resp=>{
                const {success,email}=resp.data;
                if(success){
                    dispatch(receiveLogin({email}));
                }else{
                    localStorage.removeItem('authenticated');
                    localStorage.removeItem('token');
                    dispatch(logoutUser({history:props.history}));
                }
            })
            .catch(err=>{
                if(err.response.status>=500){
                    dispatch(logoutError(err.reponse.data.message))
                }else if(err.response.status>=400){
                    dispatch(logoutError(err.reponse.data.message))
                    localStorage.removeItem('authenticated');
                    localStorage.removeItem('token');
                }
            })
        }
    },[userInfo])
    return (
        <div>
            <ToastContainer
                autoClose={5000}
                hideProgressBar
                closeButton={<CloseButton/>}
            />
            <BrowserRouter>
                <Switch>
                    <Route path="/app" exact component={Auth(Layout,true)}/>
                    <Route path="/login" exact component={Auth(Login)}/>
                    <Route path="/register" exact component={Auth(Register)}/>
                    <Route path = "/" exact render={()=><Redirect to="/app"/>}/>
                    
                </Switch>
            </BrowserRouter>
        </div>

    );
}

//export default connect(mapStateToProps)(App);

export default withRouter(App);