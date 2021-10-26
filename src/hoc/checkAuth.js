import React,{useEffect, useMemo} from 'react';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router';

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
        console.log('router check Auth');
        useEffect(()=>{
            if(shouldAuthChecked){
                const flag = !isFetching&&isAuthenticated;
                if(!flag){props.history.push('/login');}
            }else{
                const flag = !isAuthenticated;
                if(!flag){props.history.push('/');}
            }
        },[isFetching,isAuthenticated])

        return (<RequestedComponent/>)
    }

    return ReturnRequestedComponent;
}
