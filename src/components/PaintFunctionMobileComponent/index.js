import React, { memo, useContext, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBullseye, faWrench, faChevronRight, faChevronLeft, faPalette } from "@fortawesome/free-solid-svg-icons";
//import { faArrowTo } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';
import { 
    findElement, PaintStateContext , 
    CHANGE_MODE,CHANGE_HISTORY,
    DRAW_BACKGROUND,CHANGE_COLOR,
    TOGGLE_SHOW_HINT
} from '../Layout/PaintLayout'
import ToolBoxComponent from './ToolBoxComponent';
import PaletteComponent from './PaletteComponent';
import HistoryComponent from './HistoryComponent';
import {isMobile} from 'react-device-detect';

const MobileComponentBox = styled.div`
    width:100%;height:100%;
    display:flex;
    flex-direction:row;
    justify-content:space-evenly;
    align-items:center;
    position:relative;
    .btn-box{
        width:20%;height:100%;
        border-right:1px solid rgba(45,45,45,0.35);
        font-size:var(--paint-canvas-func-icon);
        color:#000;
        text-align:center;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:space-evenly;
        cursor:pointer;
        user-select:none;
        >svg{
            text-align:center;
        }
        &:last-child{
            border-right:none;
        }
        &:hover{
            color:#fff;
            background:#669DFD;
        }
        &.on{
            color:#fff;
            background:#669DFD;
        }
        &.disable{
            color:rgba(45,45,45,0.3);
        }
    }
    .mobile-history-component{
        position:absolute;
        bottom:105%;
        width:100%;height:155.5px;
        background-color:#fff;
        .mobile-history-list{
            width:100%;height:100%;
            white-space:nowrap;
            overflow-x:scroll;
            ${isMobile?'-ms-overflow-style:none;scrollbar-width:none;&::-webkit-scrollbar{display:none;}':''}
            
            .mobile-history-record{
                display:inline-block;
                width:135.5px;height:135.5px;
                border-radius:4.5px;
                box-sizing:border-box;
                border:1.5px solid rgba(45,45,45,0.65);
                cursor:pointer;
                margin:0 10.5px;
                img{
                    display:block;
                    height:100%;width:100%;
                    object-fit:contain;
                }
                &.on{
                    border:5.5px solid #669DFD;
                }
                &:hover{
                    border:5.5px solid #669DFD;
                }
            }
        }
    }
    .mobile-button-list-box{
        position:absolute;
        bottom:105%;left:50%;
        transform:translateX(-50%);
        padding:10.5px;
        border-radius:4.5px;
        background-color:rgba(0,0,0,0.45);
        box-sizing:border-box;
        display:flex;
        .mobile-canvas-mode-button{
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
    .color-picker-component{
        position:absolute;
        bottom:105%;left:50%;
        transform:translateX(-50%);
        width:auto;height:auto;
        .chrome-picker{
            width:100%;
            margin:17.5px auto;
        }
    }
    @media screen and (max-width:550px){
        .mobile-history-component{
            height:125px;
            .mobile-history-list{
               .mobile-history-record{
                height:105px;
               }
            }
        }
    }
    @media screen and (max-width:550px){
        .mobile-history-component{
            height:125px;
            .mobile-history-list{
               .mobile-history-record{
                height:105px;
               }
            }
        }
        .btn-box{
            >span{
                display:none;
            }
        }
    }
`;

const PaintFunctionMobileComponent = memo(() => {
    const { PaintStateDispatch,pen,history } = useContext(PaintStateContext);
    const functionList = ['Tool','After','Before','Pallete','Show-Hint','History'];
    const [functionNow,setFunctionNow]=useState('');
    const onClickContainer = useCallback((evt)=>{
        const {target:thisElement} = evt;
        const findCondition='btn-box';
        const endCondition = 'mobile-function-container';
        const element = findElement(thisElement,findCondition,endCondition);
        if(element){
            const {func}=element.dataset;
            switch(func){
                case 'Tool':{
                    if(!pen.src) break;
                    if(functionNow==='Tool')setFunctionNow('');
                    else setFunctionNow('Tool');
                    break;
                }
                case 'After':{
                    if(!pen.src) break;
                    const offsetNow = history.history_offset;
                    let newOffset; 
                    if(offsetNow-1<0){newOffset=history.history_record_array.length-1;}
                    else{newOffset=offsetNow-1}
                    PaintStateDispatch({type:CHANGE_HISTORY,offset:newOffset});
                    break;
                }
                case 'Before':{
                    if(!pen.src) break;
                    const offsetNow = history.history_offset;
                    let newOffset; 
                    if(offsetNow+1>history.history_record_array.length-1){
                        newOffset=0;
                    }else{
                        newOffset=offsetNow+1;
                    }
                    PaintStateDispatch({type:CHANGE_HISTORY,offset:newOffset});
                    break;
                }
                case 'Pallete':{
                    if(!pen.src) break;
                    if(functionNow==='Pallete')setFunctionNow('');
                    else setFunctionNow('Pallete');
                    break;
                }
                case 'Show-Hint':{
                    if(!pen.src) break;
                    PaintStateDispatch({type:TOGGLE_SHOW_HINT});
                    break;
                }
                case 'History':{
                    if(functionNow==='History')setFunctionNow('');
                    else setFunctionNow('History');
                    break;
                }
            }
        }
    },[pen,history.history_offset,functionNow,history.history_record_array]);

    return (
        <>
        <MobileComponentBox onClick={onClickContainer} className="mobile-function-container">
            {functionNow==='History'&&<HistoryComponent/>}
            {functionNow==='Pallete'&&<PaletteComponent/>}
            {functionNow==='Tool'&&<ToolBoxComponent/>}
            <p data-func="Tool" className={`${pen.src?functionNow==='Tool'?'btn-box on':'btn-box':'btn-box disable'}`}>
                <FontAwesomeIcon icon={faWrench} />
                <span>Tool</span>
            </p>
            <p data-func="After" className={`${pen.src?functionNow==='After'?'btn-box on':'btn-box':'btn-box disable'}`}>
                <FontAwesomeIcon icon={faChevronLeft} />
                <span>After</span>
            </p>
            <p data-func="Before" className={`${pen.src?functionNow==='Before'?'btn-box on':'btn-box':'btn-box disable'}`}>
                <FontAwesomeIcon icon={faChevronRight} />
                <span>Before</span>
            </p>
            <p data-func="Pallete" className={`${pen.src?functionNow==='Pallete'?'btn-box on':'btn-box':'btn-box disable'}`}>
                <FontAwesomeIcon icon={faPalette} />
                <span>Pallete</span>
            </p>
            <p data-func="Show-Hint" className={`${pen.src?functionNow==='Show-Hint'?'btn-box on':'btn-box':'btn-box disable'}`}>
                <FontAwesomeIcon icon={faBullseye} />
                <span>Show Hint</span>
            </p>
            <p data-func="History" className={`${functionNow==='History'?'btn-box on':'btn-box'}`}>
                <FontAwesomeIcon icon={faBars} />
                <span>
                    {pen.src?'History':'Sample'}
                </span>
            </p>
        </MobileComponentBox>
        </>
    )

})

export default PaintFunctionMobileComponent;