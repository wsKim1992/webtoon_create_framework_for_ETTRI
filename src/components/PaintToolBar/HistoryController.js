import React , {memo,useContext,useCallback} from 'react';
import styled from 'styled-components';
import {CHANGE_HISTORY,findElement,PaintStateContext} from '../Layout/PaintLayout';

const HistoryControllerComponent = styled.div`
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
    .button-list{
        width:auto;height:50px;
        button{
            display:inline-block;
            width:auto;height:100%;
            padding:12.5px;
            border-radius:4.5px;
            border:1px solid #4b544d;color:#4b544d;
            background-color:#fff;
            font-size:var(--paint-canvas-func-title);
            box-sizing:border-box;
            &:hover{
                border:1px solid #bbc7be;
                color:#bbc7be;background-color:#4b544d;
            }
        }
        button+button{margin-left:10.5px;}
    }
`;

const HistoryController = memo(()=>{
    const {history,PaintStateDispatch} = useContext(PaintStateContext);
    const onClickButtonList = useCallback((evt)=>{
        const {target:thisElement} = evt;
        const findCondition = 'BUTTON';
        const endCondition = 'button-list';
        const element = findElement(thisElement,findCondition,endCondition);
        if(element){
            const {direction} = element.dataset;
            if(direction==='before'){
                const offsetNow = history.history_offset;
                let newOffset; 
                if(offsetNow-1<0){newOffset=history.history_record_array.length-1;}
                else{newOffset=offsetNow-1}
                PaintStateDispatch({type:CHANGE_HISTORY,offset:newOffset});
            }else if(direction==='after'){
                const offsetNow = history.history_offset;
                let newOffset; 
                if(offsetNow+1>history.history_record_array.length-1){
                    newOffset=0;
                }else{
                    newOffset=offsetNow+1;
                }
                PaintStateDispatch({type:CHANGE_HISTORY,offset:newOffset});
            }
        }
    },[history.history_offset,history.history_record_array]);

    return(
        <HistoryControllerComponent>
            <h2>편집</h2>
            <div onClick={onClickButtonList} className="button-list">
                <button data-direction="before">UnDo</button>
                <button data-direction="after">ReDo</button>
            </div>
        </HistoryControllerComponent>
    )
})

export default HistoryController;