import {applyMiddleware,compose,createStore} from 'redux';
import createSagaMiddleware from "@redux-saga/core";
import reducer from "../reducers";
import rootSaga from "../sagas";

const configureStore=()=>{
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];
    const enhancer = compose(applyMiddleware(...middlewares));
    const store = createStore(reducer,enhancer);
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
};

export default configureStore();