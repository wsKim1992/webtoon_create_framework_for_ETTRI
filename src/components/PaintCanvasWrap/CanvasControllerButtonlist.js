import React,{useState,memo,useCallback,useContext, useEffect} from 'react';
import {INIT_CANVAS,PaintStateContext,TOGGLE_CALL_API_AUTO,CALL_API_BY_CLICK_BTN} from '../Layout/PaintLayout';
/* import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare,faMinusSquare } from '@fortawesome/free-regular-svg-icons'; */


const CanvasControllerButtonlist = memo(()=>{
    const [checkAuto,setCheckAuto]=useState(false);
    const {PaintStateDispatch,isAuto} = useContext(PaintStateContext);

    useEffect(()=>{
        setCheckAuto(isAuto);
    },[isAuto])

    const onChangeCheckAuto = useCallback((evt)=>{
        PaintStateDispatch({type:TOGGLE_CALL_API_AUTO});
    },[]);

    const onClickInit = useCallback((evt)=>{
        PaintStateDispatch({type:INIT_CANVAS});
    },[]);

    const onClickPaint = useCallback(()=>{
        PaintStateDispatch({type:CALL_API_BY_CLICK_BTN});
    })

    return (
        <div className="canvas-button-list-wrap">
            <div className="init-button-wrap">
                <button onClick={onClickInit} className="init-button">
                    초기화
                </button>
            </div>
            <div className="paint-button">
                <p className="checkbox-wrap">
                    <input id="auto-paint-checkbox" type="checkbox" checked={checkAuto} onChange={(e)=>onChangeCheckAuto(e)}/>
                    <label htmlFor='auto-paint-checkbox'>Auto</label>
                </p>
                <p className="paint-button-wrap">
                    <button onClick={onClickPaint} disabled={checkAuto} className={`${checkAuto?'disalbed':''}`}>채색하기</button>
                </p>
            </div>
        </div>
    )
})

export default CanvasControllerButtonlist;