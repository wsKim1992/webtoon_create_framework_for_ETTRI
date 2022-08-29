import React,{memo,useState,useEffect,useRef,useContext} from "react";
import CanvasControllerButtonlist from "./CanvasControllerButtonlist";
import {
    PaintStateContext,canvasMode,
    UPDATE_PAINT_AXIS,DELETE_PAINT_AXIS,INIT_CANVAS,
    CHANGE_STROKE_STYLE,settingCanvasSize,drawImage, CHANGE_COLOR,
    drawPointsOnCanvas
} from '../Layout/PaintLayout';

const CanvasWrap = memo(()=>{
    const canvasRef = useRef(null);
    
    const {pen,show_pointer,history,paint_axis_arr,PaintStateDispatch} = useContext(PaintStateContext);

    const [isDraw,setIsDraw] = useState(false);
    const [prevX,setPrevX] = useState(-1);
    const [prevY,setPrevY] = useState(-1);

    const canvasFunctionList = {
        [canvasMode.BRUSH]:{
            onMouseDown:(e)=>{
                const {offsetX,offsetY} = e.nativeEvent;
                setIsDraw(true);
                setPrevX(offsetX);setPrevY(offsetY);
            },
            onMouseMove:(e)=>{return false;},
            onMouseUp:(e)=>{
                if(!isDraw)return false;
                const radius=canvasRef.current.getContext('2d').lineWidth*2;
                canvasRef.current.getContext('2d').beginPath();
                canvasRef.current.getContext('2d').arc(prevX,prevY,radius,0,Math.PI*2);
                canvasRef.current.getContext('2d').stroke();
                PaintStateDispatch({type:UPDATE_PAINT_AXIS,axisX:prevX,axisY:prevY})
                setIsDraw(false);
                setPrevX(-1);setPrevY(-1);
            }
            
        },
        [canvasMode.ERASER]:{
            onMouseDown:(e)=>{
                const {nativeEvent}=e;
                setIsDraw(true);
                setPrevX(nativeEvent.offsetX);
                setPrevY(nativeEvent.offsetY);
            },
            onMouseMove:(e)=>{
                if(!isDraw){
                    return false;
                }
                const {offsetX,offsetY}=e.nativeEvent;
                const width = offsetX-prevX;
                const height = offsetY-prevY;
                //canvasRef.current.getContext('2d').strokeRect(prevX,prevY,width,height);
                let img = new Image();
                img.onload = function(){
                    canvasRef.current.getContext('2d').drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height);
                    canvasRef.current.getContext('2d').strokeRect(prevX,prevY,width,height);
                }
                img.src=pen.src;
            },
            onMouseUp:(e)=>{
                const {offsetX,offsetY} = e.nativeEvent;
                setIsDraw(false);
                setPrevX(-1);setPrevY(-1);
                drawImage(pen.src,canvasRef.current);
                PaintStateDispatch({type:DELETE_PAINT_AXIS,prevX,prevY,axisX:offsetX,axisY:offsetY});
            }
            
        },
        [canvasMode.HOLD_AND_DRAG]:{
            onMouseDown:(e)=>{},
            onMouseMove:(e)=>{},
            onMouseUp:(e)=>{}
            
        },
        [canvasMode.COLOR_PICKER]:{
            onMouseDown:(e)=>{
                const {nativeEvent} = e;
                const {offsetX,offsetY}=nativeEvent;
                const colorData = canvasRef.current.getContext('2d').getImageData(offsetX,offsetY,1,1).data;
                let colorHex=['#'];
                colorData.forEach((v,i)=>{
                    if(i==colorData.length-1){return false;}
                    let colorToHex = v.toString(16);
                    if(colorToHex.length<2){colorToHex=`0${colorToHex}`}
                    colorHex.push(colorToHex);
                })
                colorHex = colorHex.join('');
                PaintStateDispatch({type:CHANGE_COLOR,strokeStyle:colorHex});
            },
            onMouseMove:(e)=>{
                return false;
            },
            onMouseUp:(e)=>{
                return false;
            }
            
        }
    }

    useEffect(()=>{
        window.addEventListener("resize",settingCanvasSize);
        return ()=>{
            canvasRef.current=null;
            PaintStateDispatch({type:INIT_CANVAS});
            window.removeEventListener("resize",settingCanvasSize);
        }
    },[]);

    useEffect(()=>{
        if(canvasRef.current){
            canvasRef.current.getContext('2d').strokeStyle=pen.strokeStyle;
        }
    },[canvasRef.current,pen.strokeStyle])

    useEffect(()=>{
        if(canvasRef.current){
            const {width:canvasWidth,height:canvasHeight}=settingCanvasSize();
            canvasRef.current.width = canvasWidth;
            canvasRef.current.height = canvasHeight;
            canvasRef.current.getContext('2d').fillStyle = "#fff";
            canvasRef.current.getContext('2d').fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
            canvasRef.current.getContext('2d').strokeStyle=pen.strokeStyle;
            canvasRef.current.getContext('2d').lineWidth=pen.lineWidth;
        }
    },[canvasRef.current]);
    
    useEffect(()=>{
        if(canvasRef.current&&pen.src){
            if(show_pointer&&paint_axis_arr.length>0){
                drawPointsOnCanvas(canvasRef.current,pen.src,paint_axis_arr,history)
            }else{
                drawImage(pen.src,canvasRef.current);
            }
        }
    },[canvasRef.current,pen.src,show_pointer,paint_axis_arr,history]);

    return (
        <div className="canvas-wrap">
            <div className="canvas-box">
                <canvas 
                    ref={canvasRef}
                    onMouseDown={canvasFunctionList[pen.mode].onMouseDown}
                    onMouseMove={canvasFunctionList[pen.mode].onMouseMove}
                    onMouseUp={canvasFunctionList[pen.mode].onMouseUp}
                />
            </div>
            <CanvasControllerButtonlist/>
        </div>
    )
})

export default CanvasWrap;