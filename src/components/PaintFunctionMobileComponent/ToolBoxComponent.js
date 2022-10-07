import React, { memo, useState, useContext, useCallback } from 'react';
import { findElement } from '../Layout/PaintLayout';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush ,faEraser  ,faEyeDropper} from "@fortawesome/free-solid-svg-icons";
import { faHand} from '@fortawesome/free-regular-svg-icons';
import {PaintStateContext,CHANGE_MODE,canvasMode} from '../Layout/PaintLayout';
import { useSelector } from 'react-redux';

const ToolBoxComponent = memo(() => {
    const {loadingCallAPI} = useSelector(state=>state.callAPIPaintReducer)
    const {PaintStateDispatch,pen} = useContext(PaintStateContext);

    const choosePenMode = useCallback((evt)=>{
        if(loadingCallAPI)return false;
        const {target:thisElement}=evt;
        const element = findElement(thisElement,'mobile-canvas-mode-button','mobile-button-list-box');
        if(element){
            const {mode}= element.dataset;
            PaintStateDispatch({type:CHANGE_MODE,mode});
        }
    },[loadingCallAPI])

    return (
        <div onClick={choosePenMode} className="mobile-button-list-box">
            <button className={`mobile-canvas-mode-button ${pen.mode === canvasMode.BRUSH ? 'on' : ''}`} data-mode={canvasMode.BRUSH}>
                <FontAwesomeIcon icon={faPaintBrush} />
            </button>
            <button className={`mobile-canvas-mode-button ${pen.mode === canvasMode.ERASER ? 'on' : ''}`} data-mode={canvasMode.ERASER}>
                <FontAwesomeIcon icon={faEraser} />
            </button>
            <button className={`mobile-canvas-mode-button ${pen.mode === canvasMode.HOLD_AND_DRAG ? 'on' : ''}`} data-mode={canvasMode.HOLD_AND_DRAG}>
                <FontAwesomeIcon icon={faHand} />
            </button>
            <button className={`mobile-canvas-mode-button ${pen.mode === canvasMode.COLOR_PICKER ? 'on' : ''}`} data-mode={canvasMode.COLOR_PICKER}>
                <FontAwesomeIcon icon={faEyeDropper} />
            </button>
        </div>
    )
})

export default ToolBoxComponent;