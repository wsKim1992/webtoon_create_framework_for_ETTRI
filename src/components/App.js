<<<<<<< HEAD
import React from 'react';
=======
import React, { useEffect } from 'react';
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65
import { Switch, Route, withRouter,Redirect } from 'react-router';
import {BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Auth from '../hoc/checkAuth';

import '../styles/theme.scss';
import Layout from '../components/Layout/Layout';
<<<<<<< HEAD
import Login from '../pages/login';
import Register from '../pages/register';
=======
import PaintLayout from '../components/Layout/PaintLayout';
import DrawLineLayout from '../components/Layout/DrawLineLayout';
/* import Login from '../pages/login';
import Register from '../pages/register'; */
import {Helmet} from 'react-helmet';
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

const App = (props)=> {
<<<<<<< HEAD
    
=======
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65
    return (
        <div>
            <Helmet>
                <meta name="mobile-web-app-capable" content="yes"/>
                <link rel="manifest" href="./manifest.json"/>
            </Helmet>
            <ToastContainer
                autoClose={5000}
                hideProgressBar
                closeButton={<CloseButton/>}
            />
            <BrowserRouter>
                <Switch>
                    {/* <Route path="/app" exact component={Layout}/> */}
                    {/* <Route path="/login" exact component={Auth(Login)}/>
                    <Route path="/register" exact component={Auth(Register)}/> */}
                    <Route path = "/" exact render={()=><Redirect to="/paint"/>}/>
                    <Route path="/paint" exact component={PaintLayout}/>
                    <Route path="/drawLine" exact component={DrawLineLayout}/>
                </Switch>
            </BrowserRouter>
        </div>

    );
}


export default withRouter(App);