import React,{memo,useContext,useState,useCallback,useEffect} from "react";
import styled from "styled-components";
import 'antd/dist/antd.css';
import { Switch } from 'antd';
import {TOGGLE_SHOW_HINT,PaintStateContext} from '../Layout/PaintLayout';

const ShowPointComponent = styled.div`
    width:100%;height:100%;
    .toggle-show-toggle-box{
        width:100%;height:100%;
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:space-between;
        h2{
            width:auto;height:25px;
            font-size:var(--paint-canvas-func-title);
            line-height:25px;font-weight:bold;
        }
        .switch-box{
            width:auto;height:50px;
        }
    }
`;

const ShowPoint = memo(()=>{
    const {show_pointer,PaintStateDispatch} = useContext(PaintStateContext);
    const [check,setCheck] = useState(false);

    useEffect(()=>{
        setCheck(show_pointer);
    },[show_pointer])

    const onChangeCheckValue = useCallback((evt)=>{
        PaintStateDispatch({type:TOGGLE_SHOW_HINT});
    },[])

    return (
        <ShowPointComponent>
            <div className="toggle-show-toggle-box">
                <h2>
                    힌트보이기
                </h2>
                <Switch checked={check} onChange={onChangeCheckValue}/>
            </div>
        </ShowPointComponent>
    )
});

export default ShowPoint;
