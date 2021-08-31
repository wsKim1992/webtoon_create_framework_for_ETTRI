import React,{useState,useCallback,useContext,useMemo,memo,useRef, useEffect,forwardRef} from 'react';
import s from './Canvas.module.scss';
import { actions, PenManagerContext } from '../Layout/Layout';

const Canvas = memo(({index})=>{
    const canvasRef = useRef(null);
    const [canvasCtx,setCanvasCtx] = useState(null);
    const [isDraw,setIsDraw]=useState(false);
    const {pen,history,penStateDispatch}=useContext(PenManagerContext);

    useEffect(()=>{
        const ctx = canvasRef.current.getContext('2d',{alpha:true});
        canvasRef.current.width = 720;
        canvasRef.current.height =1000;
        setCanvasCtx(ctx);
        ctx.fillStyle='#fff';
        ctx.fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
    },[])

    useEffect(()=>{
        const ctx = canvasRef.current.getContext('2d',{alpha:true});
        ctx.lineWidth=pen.lineWidth;
        ctx.strokeStyle=pen.strokeStyle;
    },[pen.strokeStyle,pen.lineWidth])
    
    useEffect(()=>{
        console.log('src1 changed')
        let img = new Image();
        img.src = index===1?pen.src1:pen.src2;
        img.onload=()=>{
            canvasCtx.drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height);
        }
    },[index===1?pen.src1:pen.src2])

    const onMouseDown=(e)=>{
        const {nativeEvent}=e;
        if(!isDraw){
            const offsetX=nativeEvent.offsetX;const offsetY=nativeEvent.offsetY;
            setIsDraw(true);
        }
    }

    const onMouseMove=(e)=>{
        const {offsetX,offsetY}=e.nativeEvent;
        if(isDraw){
            canvasCtx.lineTo(offsetX,offsetY);
            canvasCtx.stroke();
        }else{
            canvasCtx.beginPath();
            canvasCtx.moveTo(offsetX,offsetY);
        }
    }

    const onMouseUp=(e)=>{
        e.preventDefault();
        setIsDraw(false);
        //penStateDispatch({type:actions.CHANGE_BACKGROUND_IMG,bs64:canvasRef.current.toDataURL('image/jpeg')});
    }

    return(
        <div>
            <canvas 
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseUp}
                ref={canvasRef} className={s.canvas}/>
        </div>
    )
})

export default Canvas;