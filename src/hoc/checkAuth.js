import React,{useState,useEffect, useMemo} from 'react';
import {useSelector,useDispatch} from 'react-redux';
import {Redirect} from 'react-router';
import {checkSessionExists,checkSessionNotExists} from '../actions/user';
import LoadingPage from '../pages/loading/Loading';
/**
 * 
 * 파라미터들 :
 *  - RequestedComponent : router에서 입력되는 component들
 *  - shouldAuthChecked : 
 *      - 서버에 session이 있어야만 들어갈 수 있는 페이지 : /app
 *      - 서버에 session이 없어야 들어갈 수 있는 페이지 : login, register
 */
export default function(RequestedComponent,shouldAuthChecked=false){
    function ReturnRequestedComponent (props){
        
        const {isFetching,isAuthenticated} = useSelector(state=>state.auth);
        const dispatch = useDispatch();
        const [allowDrawDOM,setAllowDrawDOM]=useState(false);
        
        useEffect(()=>{
            if(shouldAuthChecked){
                if(localStorage.getItem('token')&&localStorage.getItem('authenticated')){
                    // 로그인 세션 존재 여부 api 호출
                    dispatch(checkSessionExists());
                }
            }
            return ()=>{
                setAllowDrawDOM(false);
            }
        },[])

        useEffect(()=>{
            if(isFetching){setAllowDrawDOM(false)}
            else {setAllowDrawDOM(true);}
        },[isFetching])
        
        const RenderedDOM = useMemo(()=>{
            if(shouldAuthChecked){
                return isAuthenticated&&!isFetching?<RequestedComponent/>:<Redirect to="/login"/>;
            }else{
                return !isAuthenticated&&!isFetching?<RequestedComponent/>:<Redirect to="/app"/>
            }
        },[isAuthenticated])

        return (allowDrawDOM?RenderedDOM:<LoadingPage/>)
    }

    return ReturnRequestedComponent;
}
