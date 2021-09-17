import React,{useState,useCallback,useContext,useMemo,memo,useRef, useEffect,forwardRef} from 'react';
import s from './Canvas.module.scss';
import { actions,modes,PenManagerContext } from '../Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo,faRedo,faImage,faSave, faSearchMinus, faSearchPlus} from '@fortawesome/free-solid-svg-icons';
import { Button } from 'reactstrap';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';

const drawImage = (src,canvasRef,canvasCtx)=>{
    let img = new Image();
    img.src=src;
    img.onload = ()=>{
        canvasCtx.drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height);
    }
}

const getTempCanvas = (src,w,h)=>{
    let img = new Image();
    img.width=w;img.height=h;
    img.src = src;
    return img;
}

const Canvas = memo(({index,canvasWidth})=>{
    const canvasRef = useRef(null);
    const btnListWrapRef = useRef(null);
    const [canvasCtx,setCanvasCtx] = useState(null);
    const [isDraw,setIsDraw]=useState(false);
    const {pen,history,penStateDispatch}=useContext(PenManagerContext);
    const srcHistory = index===1?history.src1History:history.src2History;
    const [offset,setOffset]=useState(0);
    const [prevX,setPrevX] = useState(0);
    const [prevY,setPrevY] = useState(0);
    const [startX,setStartX] = useState(0);
    const [startY,setStartY] = useState(0);

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
        },
        [modes.GEOMETRY_SQUARE]:{
            mouseDown:(e)=>{
                const {nativeEvent}=e;
                setIsDraw(true);
                setPrevX(nativeEvent.offsetX);
                setPrevY(nativeEvent.offsetY);
            },
            mouseMove:(e)=>{
                if(!isDraw){return false;}
                const {offsetX,offsetY}=e.nativeEvent;
                const width = offsetX-prevX;
                const height = offsetY-prevY;
                let img = new Image();
                img.onload=function(){
                    canvasCtx.drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height);
                    canvasCtx.strokeRect(prevX,prevY,width,height);
                };
                img.src = srcHistory[offset];
            },
            mouseUp:(e)=>{
                setIsDraw(false);
                setPrevX(0);setPrevY(0);
                penStateDispatch({type:actions.CHANGE_SRC,index,offset,bs64:canvasRef.current.toDataURL('image/jpeg')});
                setOffset(prevOffset=>prevOffset+1);
            }
        },
        [modes.GEOMETRY_CIRCLE]:{
            mouseDown:(e)=>{
                const {offsetX,offsetY} = e.nativeEvent;
                setIsDraw(true);
                setPrevX(offsetX);setPrevY(offsetY);
            },
            mouseMove:(e)=>{
                if(!isDraw){return false;}
                const {offsetX,offsetY} = e.nativeEvent;
                const radius = Math.sqrt(Math.pow((offsetX-prevX),2)+Math.pow((offsetY-prevY),2));
                let img = new Image();
                img.onload=function(){
                    canvasCtx.drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height);
                    canvasCtx.beginPath();
                    canvasCtx.arc(prevX,prevY,radius,0,Math.PI*2);
                    canvasCtx.stroke();
                };
                img.src = srcHistory[offset];
            },
            mouseUp:(e)=>{
                setIsDraw(false);
                setPrevX(0);setPrevY(0);
                penStateDispatch({type:actions.CHANGE_SRC,index,offset,bs64:canvasRef.current.toDataURL('image/jpeg')});
                setOffset(prevOffset=>prevOffset+1);
            }
        },
        [modes.GEOMETRY_POLYGON]:{
            mouseDown:(e)=>{
                const {offsetX,offsetY}=e.nativeEvent;
                if(!isDraw){
                    console.log("start draw polygon")
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(offsetX,offsetY);
                    setIsDraw(true);
                    setStartX(offsetX);setStartY(offsetY);
                }else{
                    //canvasCtx.moveTo(prevX,prevY);
                    canvasCtx.lineTo(offsetX,offsetY);
                    canvasCtx.stroke();
                }
                setPrevX(offsetX);setPrevY(offsetY);
                penStateDispatch({type:actions.CHANGE_SRC,index,offset,bs64:canvasRef.current.toDataURL('image/jpeg')});
                setOffset(prevOffset=>prevOffset+1);
            },
            mouseMove:async (e)=>{
                if(!isDraw){return false;}
                const {offsetX,offsetY}=e.nativeEvent;
                let img = new Image();
                img.src = srcHistory[offset];
                img.onload=await function(){}
                canvasCtx.drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height);
                canvasCtx.beginPath();
                canvasCtx.moveTo(prevX,prevY);
                canvasCtx.lineTo(offsetX,offsetY);
                canvasCtx.stroke();
            },
            mouseUp:(e)=>{
                const {offsetX,offsetY}=e.nativeEvent;
                const dist = Math.sqrt(Math.pow((startX-offsetX),2)+Math.pow((startY-offsetY),2));
                console.log(dist)
                if(dist<=canvasCtx.lineWidth){
                    canvasCtx.closePath();
                    canvasCtx.stroke();
                    setIsDraw(false);
                    setPrevX(0);setPrevY(0);
                    setStartX(0);setStartY(0);
                    penStateDispatch({type:actions.CHANGE_SRC,index,offset,bs64:canvasRef.current.toDataURL('image/jpeg')});
                    setOffset(prevOffset=>prevOffset+1);
                }
            }
        }
    }
    const onChangeInputFile=index===1?(e)=>{
        const file = e.target.files[0];
        if(file&&file.type.match('image/*')){
            let fileReader = new FileReader();
            fileReader.onload=(e)=>{
                penStateDispatch({type:actions.CHANGE_BACKGROUND_IMG,bs64:e.target.result,offset});
            }
            fileReader.readAsDataURL(file)
        }
    }:null
    useEffect(()=>{
        const ctx = canvasRef.current.getContext('2d',{alpha:true});
        console.log(`canvas Width : ${canvasWidth}`)
        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasWidth;

        setCanvasCtx(ctx);
        ctx.fillStyle='#fff';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
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

    useEffect(()=>{
        const src = index===1?pen.src1:pen.src2;
        const tmpCanvas = getTempCanvas(src,canvasRef.current.width,canvasRef.current.height);
        const scale = index===1?pen.src1Scale:pen.src2Scale;
        console.log(`${scale}`);
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        let sw = scale>=1? w/scale:w*scale;
        let sh = scale>=1? h/scale:h*scale;
        canvasRef.current.getContext('2d').lineWidth*=scale
        canvasRef.current.getContext('2d').drawImage(tmpCanvas,0,0,sw,sh,0,0,w,h);
    },[index===1?pen.src1Scale:pen.src2Scale])

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

    const onEnlargeScaleBtnClicked = (e)=>{
        e.preventDefault();
        penStateDispatch({type:actions.CHANGE_SCALE,index,scaleType:'plus'});
    }

    const onReduceScaleBtnClicked = (e)=>{
        e.preventDefault();
        penStateDispatch({type:actions.CHANGE_SCALE,index,scaleType:'minus'});
    }

    return(
        <div>
            <div ref={btnListWrapRef} className={s.btnListWrap}>
                <div className={s.historyBtnListWrap}>
                    <div className={s.historyBtnWrap}>
                        <Button onClick={onBeforeBtnClicked}>
                            <FontAwesomeIcon style={{width:10.5,height:10.5}} icon={faUndo} />
                        </Button>
                    </div>
                    <div className={s.historyBtnWrap}>
                        <Button onClick={onAfterBtnClicked}>
                            <FontAwesomeIcon style={{width:10.5,height:10.5}} icon={faRedo} />
                        </Button>
                    </div>
                </div>
                <div className={s.historyBtnListWrap}>
                    <div className={s.historyBtnWrap}>
                        <Button onClick={onEnlargeScaleBtnClicked}>
                            <FontAwesomeIcon icon={faSearchPlus} />
                        </Button>
                    </div>
                    <div className={s.historyBtnWrap}>
                        <Button onClick={onReduceScaleBtnClicked}>
                            <FontAwesomeIcon icon={faSearchMinus} />
                        </Button>
                    </div>
                </div>
                <div className={s.inputLabelBtnWrap}>
                    <Button>
                        {index===1
                            &&
                        <Label htmlFor={s.loadImage}>
                            <span>Load Image</span><FontAwesomeIcon style={{width:12.5,height:12.5}} icon={faImage} />
                        </Label>}
                        {index===2
                            &&
                        <Label>
                            <span>Save Image</span><FontAwesomeIcon style={{width:12.5,height:12.5}} icon={faSave} />
                        </Label>}
                    </Button>
                </div>
            </div>
            {index===1&&<Input id={s.loadImage} onChange={onChangeInputFile} type="file" accept="image/*"/>}
            
            <canvas 
            style={{width:canvasWidth,height:canvasWidth}}
            id={`canvas${index}`}
            className={s.canvas}
            onDrag={(e)=>{console.log(e)}}
            onMouseDown={canvasFunctionList[pen.mode].mouseDown}
            onMouseUp={canvasFunctionList[pen.mode].mouseUp}
            onMouseMove={canvasFunctionList[pen.mode].mouseMove}
            ref={canvasRef} className={s.canvas}/>
           
        </div>
    )
})

export default Canvas;