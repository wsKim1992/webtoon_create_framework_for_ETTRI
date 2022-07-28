import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import reducers from './reducers';
import {createGlobalStyle} from 'styled-components'
import store from "./store/configStore";
//validity 를 check 하는 middleware
/* 
const enhancer = compose(
  applyMiddleware(ReduxThunk)
  ,window.__REDUX_DEVTOOLS_EXTENSION__ &&window.__REDUX_DEVTOOLS_EXTENSION__()
) */


const GlobalStyle = createGlobalStyle`
:root{
	--main-title:22.5px;
	--canvas-function-button:11.5px;
	--canvas-function-button-icon:14.5px;
	--call-api-button:13.5px;

	--tablet-main-title:18.5px;
	--tablet-canvas-function-button:9.5px;
	--tablet-canvas-function-button-icon:12.5px;
	--tablet-call-api-button:11.5px;

	--mobile-main-title:13.5px;
}
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
	height:100%;
}
html{
	height:100%;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
button{
	outline:0;
	border:0;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
#root{
  overflow:hidden;
  height:100%;
  >div{
	height:100%;
  }
}
`;

/* const store = createStore(
  reducers,
  applyMiddleware(ReduxThunk)
);
 */


ReactDOM.render(
    <Provider store={store}>
		<GlobalStyle/>
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
