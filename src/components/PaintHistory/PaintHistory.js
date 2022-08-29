import React, { memo, useContext,useCallback } from 'react';
import { PaintStateContext, DRAW_BACKGROUND,CHANGE_HISTORY ,adjustSize} from '../Layout/PaintLayout';
import sampleSketch1 from '../../assets/sample_sketch/1.png';
import sampleSketch2 from '../../assets/sample_sketch/2.png';
import sampleSketch3 from '../../assets/sample_sketch/3.png';
import sampleSketch4 from '../../assets/sample_sketch/4.png';
import sampleSketch5 from '../../assets/sample_sketch/5.png';
import sampleSketch6 from '../../assets/sample_sketch/6.png';
import sampleSketch7 from '../../assets/sample_sketch/7.png';
import sampleSketch8 from '../../assets/sample_sketch/8.png';

const findElement = (element,findCondition,endCondition)=>{
    const flag = element.tagName.toUpperCase()===findCondition||element.classList.contains(findCondition);
    if(flag){
        return element;
    }else{
        const endFlag = element.tagName.toUpperCase()===endCondition
            ||element.classList.contains(endCondition);
        if(endFlag)return null;
        return findElement(element.parentElement,findCondition,endCondition);
    }
}

const PaintHistory = memo(() => {
    const { PaintStateDispatch, pen, history } = useContext(PaintStateContext);

    const onClickSampleList = useCallback(async(evt)=>{
        
        const {target} = evt;
        const findCondition = 'IMG';
        const endCondition = 'sample-list';
        const element = findElement(target,findCondition,endCondition);
        if(element){
            try{
                const bs64 = await adjustSize(element.src);
                PaintStateDispatch({type:DRAW_BACKGROUND,bs64});
            }catch(err){
                console.error(err);
                alert("이미지 rendering 에러!");
                return false;
            }
        }
    },[]);

    const onClickHistoryList = useCallback((evt)=>{
        const {target:thisElement} = evt;
        const endCondition = 'history-list';
        const findCondition = 'history-record';
        const element=findElement(thisElement,findCondition,endCondition);
        if(element){
            const {idx} = element.dataset;
            PaintStateDispatch({type:CHANGE_HISTORY,offset:Number(idx)});
        }
    },[]);

    return (
        <>
            {
                !pen.src &&
                <div onClick={onClickSampleList} className="sample-list">
                    <div className="history-record">
                        <img src={sampleSketch1} alt="sampe-sketch" />
                    </div>
                    <div className="history-record">
                        <img src={sampleSketch2} alt="sampe-sketch" />
                    </div>
                    <div className="history-record">
                        <img src={sampleSketch3} alt="sampe-sketch" />
                    </div>
                    <div className="history-record">
                        <img src={sampleSketch4} alt="sampe-sketch" />
                    </div>
                    <div className="history-record">
                        <img src={sampleSketch5} alt="sampe-sketch" />
                    </div>
                    <div className="history-record">
                        <img src={sampleSketch6} alt="sampe-sketch" />
                    </div>
                    <div className="history-record">
                        <img src={sampleSketch7} alt="sampe-sketch" />
                    </div>
                    <div className="history-record">
                        <img src={sampleSketch8} alt="sampe-sketch" />
                    </div>
                </div>
            }
            {
                pen.src&&(
                    <div onClick={onClickHistoryList} className="history-list">
                        {
                            history.history_record_array.map((v,i)=>(
                                <div data-idx={i} key={`${i}_key`} className={`${history.history_offset===i?'history-record on':'history-record'}`}>
                                    <img src={v.bs64} alt="sampe-sketch" />
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </>
    )
});

export default PaintHistory;
