import React,{useState,useCallback,useContext,useMemo,memo,useRef, useEffect,forwardRef} from 'react';
import s from './Canvas.module.scss';
import { actions,modes,PenManagerContext } from '../Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft,faChevronRight,faUndo,faRedo,faImage,faSave, faSearchMinus, faSearchPlus} from '@fortawesome/free-solid-svg-icons';
import { Button} from 'reactstrap';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import { sampleContext } from './CanvasWrap';
import { onProgressContext } from './CanvasWrap';
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
    const {pen,history,penStateDispatch,isSample}=useContext(PenManagerContext);
    const srcHistory = index===1?history.src1History:history.src2History;
    const [offset,setOffset]=useState(0);
    const [prevX,setPrevX] = useState(0);
    const [prevY,setPrevY] = useState(0);
    const [startX,setStartX] = useState(0);
    const [startY,setStartY] = useState(0);
    /* const sampleImgList= useRef(['sample1_imgToPen/1_input.png','sample1_imgToPen/2_input.png'
    ,'sample1_imgToPen/3_input.png','sample1_imgToPen/4_input.png'
    ,'sample1_imgToPen/5_input.png','sample1_imgToPen/6_input.png'
    ,'sample2_simpleContiToPen/1_input.png','sample2_simpleContiToPen/2_input.png'
    ,'sample2_simpleContiToPen/3_input.png','sample3_detailContiToPen/1_input.png'
    ,'sample3_detailContiToPen/2_input.png','sample3_detailContiToPen/3_input.png']);
    const [sampleImgOffset,setSampleImgOffset] = useState(0); */
    const {sampleStateDispatch,sampleImgList,sampleImgOffset}=useContext(sampleContext);
    const {onProgress} = useContext(onProgressContext);
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
        e.currentTarget.value='';
    }:null
    useEffect(()=>{
        if(canvasRef.current){
            const ctx = canvasRef.current.getContext('2d',{alpha:true});
            console.log(`canvas Width : ${canvasWidth}`);
            canvasRef.current.width = canvasWidth;
            canvasRef.current.height = canvasWidth;

            setCanvasCtx(ctx);
            ctx.fillStyle='#fff';
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
            //sample 이미지 1번 canvas에 반영되게 하기..
            if(index===1){
                let img = new Image();  
                img.src = `/static/sample/sample_img/${sampleImgList[sampleImgOffset]}`;
                img.onload = ()=>{
                    canvasRef.current.getContext('2d').drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height);
                    penStateDispatch({type:actions.CHANGE_SRC,index,bs64:canvasRef.current.toDataURL('image/jpeg')})
                }
            }else{
                penStateDispatch({type:actions.CHANGE_SRC,index,bs64:canvasRef.current.toDataURL('image/jpeg')})
            }
        }
    },[])

    useEffect(()=>{
        console.log(`onProgress : ${onProgress}`);
    },[onProgress])

    useEffect(()=>{
        let tempImg = new Image();  
        tempImg.src = `/static/sample/sample_img/${sampleImgList[sampleImgOffset]}`;
        tempImg.onload = ()=>{
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width = 720;tempCanvas.height = 720;
            tempCanvas.getContext('2d').drawImage(tempImg,0,0,tempCanvas.width,tempCanvas.height);
            penStateDispatch({type:actions.CHANGE_TO_SAMPLE,bs64:tempCanvas.toDataURL('image/png')});
        }
    },[sampleImgList,sampleImgOffset])

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
        console.log(`index : ${index} scale : ${scale}`);
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        let sw = w/scale;
        let sh = h/scale;
        console.log(`w : ${w} , h : ${h}`);
        console.log(`sw : ${sw} , sh : ${sh}`);
        //canvasRef.current.getContext('2d').lineWidth*=scale;
        // scale 이 줄었는 늘었는지 확인 할 수 있는 변수 & 로직이 필요...
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

    const onConvertToSample=(e)=>{
        e.preventDefault();
        if(!isSample){
            let tempImg = new Image();
            const src = `/static/sample/sample_img/${sampleImgList[0]}`;
            tempImg.src = src;
            console.log(src);
            tempImg.onload = ()=>{
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = 720;tempCanvas.height = 720;
                tempCanvas.getContext('2d').drawImage(tempImg,0,0,tempCanvas.width,tempCanvas.height);
                penStateDispatch({type:actions.CHANGE_TO_SAMPLE,bs64:tempCanvas.toDataURL('image/png')});
            }
        }else{
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 720; tempCanvas.height = 720;
            tempCanvas.getContext('2d').fillStyle='#fff';
            tempCanvas.getContext('2d').fillRect(0,0,tempCanvas.width,tempCanvas.height);
            penStateDispatch({type:actions.CHANGE_TO_SAMPLE,bs64:tempCanvas.toDataURL('image/png')});
        }
    }

    const onClickToNextSample=(e)=>{
        e.preventDefault();
        sampleStateDispatch({type:'change_offset',direction:'forth'});
    }

    const onClickToPrevSample=(e)=>{
        e.preventDefault();
        sampleStateDispatch({type:'change_offset',direction:'back'});
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
                {/* {index===1&&<div className={s.historyBtnListWrap}>
                    <div className={s.historyBtnWrap} style={{width:'100%'}}>
                        <Button onClick={onConvertToSample} style={{width:'100%',fontSize:7.5}}>
                            To Sample
                        </Button>
                    </div>
                </div>} */}
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
            <div>
                {  
                    index===1&&
                    <span style={{backgroundColor:'#0f0544',position:"absolute",top:'45%',left:'1.5%',zIndex:'20'}}>
                        <Button style={{backgroundColor:'#0f0544',border:'none'}} onClick={onClickToPrevSample}>
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </Button>
                    </span>
                }
                <canvas 
                style={{width:canvasWidth,height:canvasWidth}}
                id={`canvas${index}`}
                className={s.canvas}
                onMouseDown={canvasFunctionList[pen.mode].mouseDown}
                onMouseUp={canvasFunctionList[pen.mode].mouseUp}
                onMouseMove={canvasFunctionList[pen.mode].mouseMove}
                ref={canvasRef} className={s.canvas}/>
                {
                    index===1&&
                    <span style={{backgroundColor:'#0f0544',position:"absolute",top:'45%',right:'1.5%',zIndex:'20'}}>
                        <Button style={{backgroundColor:'#0f0544',border:'none'}} onClick={onClickToNextSample}>
                            <FontAwesomeIcon icon={faChevronRight}/>
                        </Button>
                    </span>
                }
                {
                    index===2&&
                    onProgress&&
                    (
                        <div style={{width:canvasWidth,height:canvasWidth,position:"absolute",top:0,left:0,zIndex:'20'}}>
                            <img src= "/static/gif/giphy.gif" style={{ color:'#0f0544',display:'block',width:'100%',height:'100%'}}/>
                        </div>
                    )
                }
            </div>
        </div>
    )
})

export default Canvas;