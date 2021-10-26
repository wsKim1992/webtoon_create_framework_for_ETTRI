import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import reducers from './reducers';

//validity 를 check 하는 middleware

const enhancer = compose(
  applyMiddleware(ReduxThunk)
  ,window.__REDUX_DEVTOOLS_EXTENSION__ &&window.__REDUX_DEVTOOLS_EXTENSION__()
)
const store = createStore(
  reducers,
  applyMiddleware(ReduxThunk)
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
/* serviceWorker.unregister(); */
