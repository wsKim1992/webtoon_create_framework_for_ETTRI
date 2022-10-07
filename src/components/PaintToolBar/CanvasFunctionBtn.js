import React, { memo, useContext, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush, faEraser, faEyeDropper } from "@fortawesome/free-solid-svg-icons";
import { faHand } from '@fortawesome/free-regular-svg-icons';
import { PaintStateContext, CHANGE_MODE,CHANGE_API_MODE, canvasMode } from '../Layout/PaintLayout';
import { useSelector } from 'react-redux';


const CanvasFunctionBtnComponent = styled.div`
    width:100%;height:100%;
    display:flex;
    flex-direction:row;
    .toolbar-section{
        width:50%;height:100%;
        h2{
            width:100%;height:auto;
            font-size:var(--paint-canvas-func-title);
            font-weight:bold;
            line-height:15px;
            padding:5px 0;
        }
        .button-list-box{
            width:100%;height:calc(100% - 25px);
            display:flex;flex-direction:row;
            justify-content:space-around;
            align-items:center;
            button{
                display:block;
                width:48px;height:48px;
                border-radius:4.5px;
                box-sizing:border-box;
                line-height:45px;text-align:center;
                font-size:var(--paint-canvas-func-icon);
                border:1px solid #4b544d;
                color:#4b544d;
                background-color:#fff;
                &:hover{
                    border:1px solid #bbc7be;
                    color:#bbc7be;background-color:#4b544d;
                }
                &.on{
                    border:1px solid #bbc7be;
                    color:#bbc7be;background-color:#4b544d;
                }
            }
        }
    }
    
`;

const findElement = (element, findCondition, endCondition) => {
    const flag = element.tagName.toUpperCase() === findCondition || element.classList.contains(findCondition);
    if (flag) {
        return element;
    } else {
        const endFlag = element.tagName.toUpperCase() === endCondition
            || element.classList.contains(endCondition);
        if (endFlag) return null;
        return findElement(element.parentElement, findCondition, endCondition);
    }
}

const CanvasFunctionBtn = memo(() => {
    const { PaintStateDispatch, pen,api_mode } = useContext(PaintStateContext);
    const {loadingCallAPI} = useSelector(state=>state.callAPIPaintReducer)

    const choosePenMode = useCallback((evt) => {
        const { target: thisElement } = evt;
        const element = findElement(thisElement, 'canvas-mode-button', 'button-list-box');
        if (element) {
            const { mode } = element.dataset;
            PaintStateDispatch({ type: CHANGE_MODE, mode });
        }
    }, [])

    const chooseAPIMode = useCallback((evt)=>{
        console.log(`loadingCallAPI :${loadingCallAPI}`);
        if(pen.src)return false;
        if(loadingCallAPI)return false;
        const {target:thisElement} = evt;
        const element = findElement(thisElement,'canvas-mode-button', 'button-list-box');
        if(element){
            const {index} = element.dataset;
            PaintStateDispatch({type:CHANGE_API_MODE,api_mode:parseInt(index)});
        }
    },[pen.src,loadingCallAPI])

    return (
        <CanvasFunctionBtnComponent>
            <div className="toolbar-section">
                <h2>도구</h2>
                <div onClick={choosePenMode} className="button-list-box">
                    <button className={`canvas-mode-button ${pen.mode === canvasMode.BRUSH ? 'on' : ''}`} data-mode={canvasMode.BRUSH}>
                        <FontAwesomeIcon icon={faPaintBrush} />
                    </button>
                    <button className={`canvas-mode-button ${pen.mode === canvasMode.COLOR_PICKER ? 'on' : ''}`} data-mode={canvasMode.COLOR_PICKER}>
                        <FontAwesomeIcon icon={faEyeDropper} />
                    </button>
                </div>
            </div>
            <div className="toolbar-section">
                <h2>Painting 방식</h2>
                <div onClick={chooseAPIMode} className="button-list-box">
                    <button data-index="1" className={`canvas-mode-button ${api_mode === 1 ? 'on' : ''}`}>
                        1
                    </button>
                    <button data-index="2" className={`canvas-mode-button ${api_mode === 2 ? 'on' : ''}`}>
                        2
                    </button>
                </div>
            </div>
        </CanvasFunctionBtnComponent>
    )
});

export default CanvasFunctionBtn;