import React,{memo,forwardRef, useEffect} from 'react';
import s from './Canvas.module.scss';
import Canvas from './Canvas';

const CanvasWrap = memo((props)=>{
   
    return(
        <div className={s.canvasWrap}>
            <Canvas index={1}/>
            <Canvas index={2}/>
        </div>
    )
})

export default CanvasWrap;


