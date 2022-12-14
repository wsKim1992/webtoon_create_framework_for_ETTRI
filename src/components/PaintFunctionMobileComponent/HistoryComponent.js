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
import { useSelector } from 'react-redux';

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

const HistoryComponent = memo(()=>{
    const { PaintStateDispatch, pen, history } = useContext(PaintStateContext);
    const {loadingCallAPI} = useSelector(state=>state.callAPIPaintReducer)
    const onClickSampleList = useCallback(async(evt)=>{
        if(loadingCallAPI){return false;}
        
        const {target:thisElement} = evt;
        const findCondition = 'IMG';
        const endCondition = 'mobile-history-list';
        const element = findElement(thisElement,findCondition,endCondition);
        if(element){
            console.log(element);
            try{
                console.log(element.src);
                const bs64 = await adjustSize(element.src);
                PaintStateDispatch({type:DRAW_BACKGROUND,bs64});
            }catch(err){
                console.error(err);
                alert("이미지 rendering 에러!");
                return false;
            }
        }
    },[loadingCallAPI]);

    const onClickHistoryList = useCallback((evt)=>{
        const {target:thisElement} = evt;
        const endCondition = 'mobile-history-list';
        const findCondition = 'mobile-history-record';
        const element=findElement(thisElement,findCondition,endCondition);
        if(element){
            const {idx} = element.dataset;
            PaintStateDispatch({type:CHANGE_HISTORY,offset:Number(idx)});
        }
    },[]);

    return (
        <div className="mobile-history-component">
            {
                !pen.src &&
                <div onClick={onClickSampleList} className="mobile-history-list">
                    <div className="mobile-history-record">
                        <img className="img" src={sampleSketch1} alt="sampe-sketch" />
                    </div>
                    <div className="mobile-history-record">
                        <img className="img" src={sampleSketch2} alt="sampe-sketch" />
                    </div>
                    <div className="mobile-history-record">
                        <img className="img" src={sampleSketch3} alt="sampe-sketch" />
                    </div>
                    <div className="mobile-history-record">
                        <img className="img" src={sampleSketch4} alt="sampe-sketch" />
                    </div>
                    <div className="mobile-history-record">
                        <img className="img" src={sampleSketch5} alt="sampe-sketch" />
                    </div>
                    <div className="mobile-history-record">
                        <img className="img" src={sampleSketch6} alt="sampe-sketch" />
                    </div>
                    <div className="mobile-history-record">
                        <img className="img" src={sampleSketch7} alt="sampe-sketch" />
                    </div>
                    <div className="mobile-history-record">
                        <img className="img" src={sampleSketch8} alt="sampe-sketch" />
                    </div>
                    <div className="mobile-history-record">
                        <img className="img" src={sampleSketch8} alt="sampe-sketch" />
                    </div>
                    <div className="mobile-history-record">
                        <img className="img" src={sampleSketch8} alt="sampe-sketch" />
                    </div>
                    <div className="mobile-history-record">
                        <img className="img" src={sampleSketch8} alt="sampe-sketch" />
                    </div>
                </div>
            }
            {
                pen.src&&(
                    <div onClick={onClickHistoryList} className="mobile-history-list">
                        {
                            history.history_record_array.map((v,i)=>(
                                <div data-idx={i} key={`${i}_key`} className={`${history.history_offset===i?'mobile-history-record on':'mobile-history-record'}`}>
                                    <img src={v.bs64} alt="sampe-sketch" />
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    )
})

export default HistoryComponent;