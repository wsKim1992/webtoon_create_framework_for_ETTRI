import React from 'react';
import { Switch, Route, withRouter,Redirect } from 'react-router';
import {BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Auth from '../hoc/checkAuth';

import '../styles/theme.scss';
import Layout from '../components/Layout/Layout';
import Login from '../pages/login';
import Register from '../pages/register';

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

const App = (props)=> {
    
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


export default withRouter(App);