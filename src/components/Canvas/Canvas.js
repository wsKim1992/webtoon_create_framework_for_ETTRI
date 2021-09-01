import React,{useState,useCallback,useContext,useMemo,memo,useRef, useEffect,forwardRef} from 'react';
import s from './Canvas.module.scss';
import { actions,modes,PenManagerContext } from '../Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo,faRedo } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'reactstrap';

const drawImage = (src,canvasRef,canvasCtx)=>{
    let img = new Image();
    img.src=src;
    img.onload = ()=>{
        canvasCtx.drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height);
    }
}

const Canvas = memo(({index})=>{
    const canvasRef = useRef(null);
    const [canvasCtx,setCanvasCtx] = useState(null);
    const [isDraw,setIsDraw]=useState(false);
    const {pen,history,penStateDispatch}=useContext(PenManagerContext);
    const srcHistory = index===1?history.src1History:history.src2History;
    const [offset,setOffset]=useState(0);
    console.log(pen);
    const canvasFunctionList={
        [modes.BRUSH]:{
            mouseDown:(e)=>{
                if(!isDraw){
                    setIsDraw(true);
                }
            },
            mouseMove:(e)=>{
                const {offsetX,offsetY}=e.nativeEvent;
                if(isDraw){
                    canvasCtx.lineTo(offsetX,offsetY);
                    canvasCtx.stroke();
                }else{
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(offsetX,offsetY);
                }
            },
            mouseUp:(e)=>{
                e.preventDefault();
                setIsDraw(false);
                setOffset(prevOffset=>prevOffset+1);
                penStateDispatch({type:actions.CHANGE_SRC,offset,index,bs64:canvasRef.current.toDataURL('image/jpeg')});
            },
        },
        [modes.COLOR_PICKER]:{
            mouseDown:(e)=>{
                const {nativeEvent} = e;
                const {offsetX,offsetY}=nativeEvent;
                const colorData = canvasCtx.getImageData(offsetX,offsetY,1,1).data;
                let colorHex = ['#',];
                colorData.forEach((v,i)=>{
                    if(i===colorData.length-1){return false;}
                    let colorToHex=v.toString(16);
                    if(colorToHex.length<2){colorToHex=`0${colorToHex}`}
                    colorHex.push(colorToHex);
                })
                colorHex=colorHex.join('');
                penStateDispatch({type:actions.CHANGE_STROKE_STYLE,strokeStyle:colorHex});
            },
            mouseMove:(e)=>{
                return false;
            },
            mouseUp:(e)=>{
                return false;
            },
        }
    }

    useEffect(()=>{
        const ctx = canvasRef.current.getContext('2d',{alpha:true});
        canvasRef.current.width = 720;
        canvasRef.current.height =720;
        setCanvasCtx(ctx);
        ctx.fillStyle='#fff';
        ctx.fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
        penStateDispatch({type:actions.CHANGE_SRC,index,bs64:canvasRef.current.toDataURL('image/jpeg')})
    },[])

    useEffect(()=>{
        const ctx = canvasRef.current.getContext('2d',{alpha:true});
        ctx.lineWidth=pen.lineWidth;
        ctx.strokeStyle=pen.strokeStyle;
    },[pen.strokeStyle,pen.lineWidth])
    
    useEffect(()=>{
        drawImage(index===1?pen.src1:pen.src2,canvasRef,canvasCtx);
    },[index===1?pen.src1:pen.src2])

    const onBeforeBtnClicked = (e)=>{
        e.preventDefault();
        if(offset<=0){
            return false;
        }
        drawImage(srcHistory[offset-1],canvasRef,canvasCtx);
        setOffset(prevOffset=>prevOffset-1);
    }

    const onAfterBtnClicked = (e)=>{
        e.preventDefault();
        if(offset>=srcHistory.length-1){
            return false;
        }
        drawImage(srcHistory[offset+1],canvasRef,canvasCtx);
        setOffset(prevOffset=>prevOffset+1);
    }

    return(
        <div>
            <div className={s.btnListWrap}>
                <div className={s.btnWrap}>
                    <Button onClick={onBeforeBtnClicked}>
                        <FontAwesomeIcon icon={faUndo} />
                    </Button>
                </div>
                <div className={s.btnWrap}>
                    <Button onClick={onAfterBtnClicked}>
                        <FontAwesomeIcon icon={faRedo} />
                    </Button>
                </div>
            </div>
            <canvas 
                onMouseDown={canvasFunctionList[pen.mode].mouseDown}
                onMouseUp={canvasFunctionList[pen.mode].mouseUp}
                onMouseMove={canvasFunctionList[pen.mode].mouseMove}
                ref={canvasRef} className={s.canvas}/>
        </div>
    )
})

export default Canvas;