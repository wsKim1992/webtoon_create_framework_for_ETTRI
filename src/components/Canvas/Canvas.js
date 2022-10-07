import React,{useState,useCallback,useContext,memo,useRef, useEffect} from 'react';
import s from './Canvas.module.scss';
import { actions,modes,PenManagerContext } from '../Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft,faChevronRight,faUndo,faRedo,faImage,faSave, faSearchPlus} from '@fortawesome/free-solid-svg-icons';
import { Button} from 'reactstrap';
import Input from 'reactstrap/lib/Input';
import Label from 'reactstrap/lib/Label';
import { sampleContext } from './CanvasWrap';
import styled from 'styled-components';

const SampleButtonWrap = styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-item:center;
`
const Src2SampleArrBtnWrap=styled.div`
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-item:center;
`

const ToSampleBtn=styled(Button)`
    border:none;
    background-color: rgb(3, 144, 252);
    margin:0 auto;
`

const PrevBtnWrap = styled.span`
    border-radius:15px;
    background-color: rgb(3, 144, 252);
    margin-left:5px;
`

const NextBtnWrap = styled.span`
    border-radius:15px;
    background-color: rgb(3, 144, 252);
    margin-right:5px;
`

const drawImage = (src,canvasRef,canvasCtx,originalCanvasRef,originalCanvasCtx)=>{
    let img = new Image();
    img.src=src;
    img.onload = ()=>{
        if(originalCanvasCtx)originalCanvasCtx.drawImage(img,0,0,originalCanvasRef.current.width,originalCanvasRef.current.height);
        canvasCtx.drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height);
    }
}

const drawOriginalImage=(src,originalCanvasRef,originalCanvasCtx)=>{
    let img = new Image();
    img.src=src;
    img.onload = ()=>{
        originalCanvasRef.current.width=720;
        originalCanvasRef.current.height=720;
        originalCanvasCtx.fillStyle='#fff';
        originalCanvasCtx.fillRect(0,0,originalCanvasRef.current.width,originalCanvasRef.current.height);
        const widthOffset = (originalCanvasRef.current.width - img.width)/2;
        const heightOffset = (originalCanvasRef.current.height - img.height)/2;
        originalCanvasCtx.drawImage(img,widthOffset,heightOffset,img.width,img.height);
    }
}

const Canvas = memo(({index,canvasWidth})=>{
    const canvasRef = useRef(null);
    const originalCanvasRef =useRef(null);
    const btnListWrapRef = useRef(null);
    const [canvasCtx,setCanvasCtx] = useState(null);
    const [originalCanvasCtx,setOriginalCanvasCtx] = useState(null);
    const [isDraw,setIsDraw]=useState(false);
    const {pen,history,penStateDispatch,onProgress}=useContext(PenManagerContext);
    const srcHistory = index===1?history.src1History:history.src2History;
    const [offset,setOffset]=useState(0);
    const [prevX,setPrevX] = useState(0);
    const [prevY,setPrevY] = useState(0);
    const [startX,setStartX] = useState(0);
    const [startY,setStartY] = useState(0);
    const {sampleStateDispatch,isSample,sampleImgOffset,sampleImgList,apiType}=useContext(sampleContext);
    /* const {isFetching,userInfo}=useSelector(state=>state.auth);*/

    useEffect(()=>{
        if(index===1&&isSample){
            console.log(sampleImgOffset);
            let tempImg = new Image();  
            tempImg.src = sampleImgList[sampleImgOffset];
            tempImg.onload = ()=>{
                let tempCanvas = document.createElement('canvas');
                tempCanvas.width = 720;tempCanvas.height = 720;
                tempCanvas.getContext('2d').drawImage(tempImg,0,0,tempCanvas.width,tempCanvas.height);
                penStateDispatch({type:actions.CHANGE_BACKGROUND_IMG,index,bs64:tempCanvas.toDataURL('image/png'),originalSrc:tempCanvas.toDataURL('image/png')});
            }
        }else{
            {penStateDispatch({type:actions.INIT})};
        }
    },[isSample,sampleImgList,sampleImgOffset])

    useEffect(()=>{
        //원본 canvas 설정.
        originalCanvasRef.current.width =720;originalCanvasRef.current.height=720;
        const originalCtx = originalCanvasRef.current.getContext('2d');
        originalCtx.fillStyle='#fff';
        originalCtx.lineJoin = 'round';
        originalCtx.lineCap = 'round';

        setOriginalCanvasCtx(originalCtx);
        originalCtx.fillRect(0,0,originalCanvasRef.current.width,originalCanvasRef.current.height);
        //기존 canvas 설정
        const ctx = canvasRef.current.getContext('2d',{alpha:true});
        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasWidth;

        setCanvasCtx(ctx);
        ctx.fillStyle='#fff';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
        //sample 이미지 1번 canvas에 반영되게 하기..
        //penStateDispatch({type:actions.CHANGE_SRC,index,bs64:canvasRef.current.toDataURL('image/png'),originalSrc:originalCanvasRef.current.toDataURL('image/png')})
        
        return ()=>{
            penStateDispatch({type:actions.INIT});
        }
    },[])

    useEffect(()=>{
        if(canvasCtx){
            canvasCtx.lineWidth=pen.lineWidth;
            canvasCtx.strokeStyle=pen.strokeStyle;
        }
    },[pen.strokeStyle,pen.lineWidth,canvasCtx])
    
    useEffect(()=>{
        if(canvasCtx){
            const src = index===1?pen.src1:pen.src2;
            if(src&&!src.match('static/log')){
                drawImage(src,canvasRef,canvasCtx,originalCanvasRef,originalCanvasCtx);
            }else if(src&&src.match('static/log')){
                drawOriginalImage(src,canvasRef,canvasCtx);
            }else{
                /* setOffset(0); */
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = 720;tempCanvas.height=720; 
                tempCanvas.getContext('2d').fillStyle='#fff';
                tempCanvas.getContext('2d').fillRect(0,0,tempCanvas.width,tempCanvas.height);
                penStateDispatch({type:actions.CHANGE_BACKGROUND_IMG,index,originalSrc:tempCanvas.toDataURL('image/png'),bs64:tempCanvas.toDataURL('image/png')})
            }
        }
    },[index===1?pen.src1:pen.src2,canvasCtx])

    useEffect(()=>{
        if(canvasCtx){
            if(index===2&&onProgress){
                canvasCtx.fillStyle='#fff';
                canvasCtx.fillRect(0,0,canvasRef.current.width,canvasRef.current.height);
            }
        }
    },[onProgress,canvasCtx])

    const canvasFunctionList={
        [modes.BRUSH]:{
            mouseDown:(e)=>{
                if(!isDraw){
                    setIsDraw(true);
                }
            },
            mouseMove:(e)=>{
                const {offsetX,offsetY}=e.nativeEvent;
                const ratioX = offsetX/canvasRef.current.width;
                const ratioY = offsetY/canvasRef.current.height; 
                const originalOffsetX = originalCanvasRef.current.width * ratioX;
                const originalOffsetY = originalCanvasRef.current.height * ratioY;
                if(isDraw){
                    originalCanvasCtx.lineTo(originalOffsetX,originalOffsetY)
                    originalCanvasCtx.stroke();
                    canvasCtx.lineTo(offsetX,offsetY);
                    canvasCtx.stroke();
                }else{
                    originalCanvasCtx.beginPath();
                    originalCanvasCtx.stroke();
                    canvasCtx.beginPath();
                    canvasCtx.moveTo(offsetX,offsetY);
                }
            },
            mouseUp:(e)=>{
                e.preventDefault();
                setIsDraw(false);
                //setOffset(prevOffset=>prevOffset+1);
                penStateDispatch({type:actions.CHANGE_SRC,offset,index,originalSrc:originalCanvasRef.current.toDataURL('image/png'),bs64:canvasRef.current.toDataURL('image/png')});
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

                const ratioX = prevX/canvasRef.current.width;
                const ratioY = prevY/canvasRef.current.height; 
                const originalprevX = originalCanvasRef.current.width * ratioX;
                const originalprevY = originalCanvasRef.current.height * ratioY;
                const originalSquareWidth = originalCanvasRef.current.width*(width/canvasRef.current.width);
                const originalSquareHeight = originalCanvasRef.current.height*(height/canvasRef.current.height);

                let img = new Image();
                img.onload=function(){
                    originalCanvasCtx.drawImage(img,0,0,originalCanvasRef.current.width,originalCanvasRef.current.height);
                    originalCanvasCtx.strokeRect(originalprevX,originalprevY,originalSquareWidth,originalSquareHeight);
                    canvasCtx.drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height);
                    canvasCtx.strokeRect(prevX,prevY,width,height);
                };
                img.src = index===1?pen.src1:pen.src2;
            },
            mouseUp:(e)=>{
                setIsDraw(false);
                setPrevX(0);setPrevY(0);
                penStateDispatch({type:actions.CHANGE_SRC,index,offset,originalSrc:originalCanvasRef.current.toDataURL('image/png'),bs64:canvasRef.current.toDataURL('image/jpeg')});
                //setOffset(prevOffset=>prevOffset+1);
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
                const originalRadius = originalCanvasRef.current.width * (radius/canvasRef.current.width); 
                const ratioX = prevX/canvasRef.current.width;
                const ratioY = prevY/canvasRef.current.height; 
                const originalprevX = originalCanvasRef.current.width * ratioX;
                const originalprevY = originalCanvasRef.current.height * ratioY;
                
                let img = new Image();
                img.onload=function(){
                    originalCanvasCtx.drawImage(img,0,0,originalCanvasRef.current.width,originalCanvasRef.current.height);
                    originalCanvasCtx.beginPath();
                    originalCanvasCtx.arc(originalprevX,originalprevY,originalRadius,0,Math.PI*2);
                    originalCanvasCtx.stroke();

                    canvasCtx.drawImage(img,0,0,canvasRef.current.width,canvasRef.current.height);
                    canvasCtx.beginPath();
                    canvasCtx.arc(prevX,prevY,radius,0,Math.PI*2);
                    canvasCtx.stroke();
                };
                img.src = index===1?pen.src1:pen.src2;
            },
            mouseUp:(e)=>{
                setIsDraw(false);
                setPrevX(0);setPrevY(0);
                penStateDispatch({type:actions.CHANGE_SRC,index,offset,originalSrc:originalCanvasRef.current.toDataURL('image/png'),bs64:canvasRef.current.toDataURL('image/jpeg')});
                //setOffset(prevOffset=>prevOffset+1);
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
                //setOffset(prevOffset=>prevOffset+1);
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
        
                if(dist<=canvasCtx.lineWidth){
                    canvasCtx.closePath();
                    canvasCtx.stroke();
                    setIsDraw(false);
                    setPrevX(0);setPrevY(0);
                    setStartX(0);setStartY(0);
                    penStateDispatch({type:actions.CHANGE_SRC,index,offset,bs64:canvasRef.current.toDataURL('image/jpeg')});
                    //setOffset(prevOffset=>prevOffset+1);
                }
            }
        }
    }

    const onChangeInputFile=index===1?(e)=>{
        const file = e.target.files[0];
        if(file&&file.type.match('image/*')){
            let fileReader = new FileReader();
            fileReader.onload=(evt)=>{
                let img = new Image();
                img.src = evt.target.result;
                img.onload = ()=>{
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width=720;tempCanvas.height=720;
                    //tempCanvas.getContext('2d').drawImage(img,0,0,tempCanvas.width,tempCanvas.height);
                    tempCanvas.getContext('2d').fillStyle='#fff';
                    tempCanvas.getContext('2d').fillRect(0,0,tempCanvas.width,tempCanvas.height);
                    const widthOrHeight = img.width>img.height?true:false;
                    const widthInDraw = widthOrHeight?tempCanvas.width:parseFloat(img.width/img.height)*tempCanvas.width;
                    const heightInDraw = widthOrHeight?parseFloat(img.height/img.width)*tempCanvas.height : tempCanvas.height;
                    const offsetLength = widthOrHeight?(tempCanvas.height-heightInDraw)/2:(tempCanvas.width-widthInDraw)/2;
                    if(widthOrHeight){tempCanvas.getContext('2d').drawImage(img,0,offsetLength,widthInDraw,heightInDraw);}
                    else{tempCanvas.getContext('2d').drawImage(img,offsetLength,0,widthInDraw,heightInDraw);}
                    
                    //original 이미지 설정..
                    originalCanvasRef.current.width=widthOrHeight?img.width:img.height;
                    originalCanvasRef.current.height=widthOrHeight?img.width:img.height;
                    //originalCanvasRef.current.getContext('2d').drawImage(img,0,0,originalCanvasRef.current.width,originalCanvasRef.current.height);
                    originalCanvasRef.current.getContext('2d').fillStyle='#fff';
                    originalCanvasRef.current.getContext('2d').fillRect(0,0,originalCanvasRef.current.width,originalCanvasRef.current.height);
                    const originHeightInDraw = widthOrHeight?parseFloat(img.height/img.width)*originalCanvasRef.current.height : originalCanvasRef.current.height;
                    const originWidthInDraw = widthOrHeight?originalCanvasRef.current.width:parseFloat(img.width/img.height)*originalCanvasRef.current.width;
                    const originalOffset = widthOrHeight?(originalCanvasRef.current.height-originHeightInDraw)/2:(originalCanvasRef.current.width-originWidthInDraw)/2;
                    
                    if(widthOrHeight){originalCanvasRef.current.getContext('2d').drawImage(img,0,originalOffset,originalCanvasRef.current.width,originHeightInDraw);}
                    else{originalCanvasRef.current.getContext('2d').drawImage(img,originalOffset,0,originWidthInDraw,originalCanvasRef.current.height);}

                    penStateDispatch({type:actions.CHANGE_BACKGROUND_IMG,originalSrc:originalCanvasRef.current.toDataURL('image/jpeg'),index,offset:0,bs64:tempCanvas.toDataURL('image/jpeg')});

                }
            }
            fileReader.readAsDataURL(file);
        }
        e.target.value='';
    }:null;

    const onBeforeBtnClicked = (e)=>{
        e.preventDefault();
        penStateDispatch({type:actions.CHANGE_HISTORY_BACK});
    }

    const onAfterBtnClicked = (e)=>{
        e.preventDefault();
        penStateDispatch({type:actions.CHANGE_HISTORY_FRONT});
    }

    const onClickToNextSample=(e)=>{
        e.preventDefault();
        if(index===1){
            sampleStateDispatch({type:'change_offset',direction:'forth'})
            //penStateDispatch({type:actions.CHANGE_SRC1ARR_OFFSET_FRONT});
        }else if(index===2 &&pen.src2Arr){
            penStateDispatch({type:actions.CHANGE_SRC2ARR_OFFSET_FRONT});
        }
    }

    const onClickToPrevSample=(e)=>{
        e.preventDefault();
        if(index===1){
            sampleStateDispatch({type:'change_offset',direction:'back'})
            //penStateDispatch({type:actions.CHANGE_SRC1ARR_OFFSET_BACK});
        }else if(index===2 &&pen.src2Arr){
            penStateDispatch({type:actions.CHANGE_SRC2ARR_OFFSET_BACK});
        }
    }
    
    const downLoad = index===2?()=>{
        const filename = `${Date.now()}.png`;
        let aTag = document.createElement('a');
        aTag.setAttribute('href',pen.src2);
        aTag.setAttribute('download',filename);
        document.body.appendChild(aTag);
        aTag.click();
    }:null;

    const initializeCanvas1 = useCallback((evt)=>{
        penStateDispatch({type:actions.INIT})
        if(isSample){
            sampleStateDispatch({type:'toggle_sample_mode'});
        }
    },[])
    const onClickToSampleBtn=()=>{
        sampleStateDispatch({type:'toggle_sample_mode'});
    }

    return(
        <div style={index===2?{marginBottom:'2.5%'}:null}>
            <div ref={btnListWrapRef} className={s.btnListWrap}>
                {index===1&&<div className={s.historyBtnListWrap}>
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
                </div>}
                {index===1&&<div className = {s.inputLabelBtnWrap}>
                    <Button onClick={initializeCanvas1}>
                        <Label>
                            <span>reset</span>
                        </Label>
                    </Button>
                </div>}
                <div className={s.inputLabelBtnWrap}>
                    <Button>
                        {index===1
                        &&
                        (
                            <>
                                <Label htmlFor={s.loadImage}>
                                    <span>Load Image</span><FontAwesomeIcon style={{width:12.5,height:12.5}} icon={faImage} />
                                </Label>
                            </>
                        )}
                        {index===2
                            &&
                        <Label onClick={downLoad}>
                            <span>Save Image</span><FontAwesomeIcon style={{width:12.5,height:12.5}} icon={faSave} />
                        </Label>}
                    </Button>
                </div>
            </div>
            {index===1&&<Input id={s.loadImage} onChange={onChangeInputFile} type="file" accept="image/*"/>}
            <div>
                
                <canvas 
                style={{width:canvasWidth,height:canvasWidth}}
                id={`canvas${index}`}
                className={s.canvas}
                onMouseDown={canvasFunctionList[pen.mode].mouseDown}
                onMouseUp={canvasFunctionList[pen.mode].mouseUp}
                onMouseMove={canvasFunctionList[pen.mode].mouseMove}
                ref={canvasRef} />
                {
                    index===2&&
                    (
                        apiType==='/request_convert_face_to_penline'&&
                        (<Src2SampleArrBtnWrap style={{position:'absolute',top:'50%',left:'0%',width:'100%'}}>
                            <PrevBtnWrap>
                                <Button style={{backgroundColor:'#0f0544',border:'none'}} onClick={onClickToPrevSample}>
                                    <FontAwesomeIcon icon={faChevronLeft}/>
                                </Button>
                            </PrevBtnWrap>
                            <NextBtnWrap >
                                <Button style={{backgroundColor:'#0f0544',border:'none'}} onClick={onClickToNextSample}>
                                    <FontAwesomeIcon icon={faChevronRight}/>
                                </Button>
                            </NextBtnWrap>
                        </Src2SampleArrBtnWrap>
                        )
                    )
                }
                
               <canvas
                ref={originalCanvasRef}
                style={{display:'none'}}
               />
                
                {
                    index===2&&
                    onProgress&&
                    (
                        <div style={{width:canvasWidth,height:canvasWidth,position:"absolute",top:0,left:0,zIndex:'20'}}>
                            <img src= "/assets/gif/giphy.gif" style={{ color:'#0f0544',display:'block',width:'100%',height:'100%'}}/>
                        </div>
                    )
                }
                {
                    index===1&&
                    (
                        <SampleButtonWrap >
                            {
                                isSample&&
                                <PrevBtnWrap>
                                    <Button style={{backgroundColor:'#0f0544',border:'none'}} onClick={onClickToPrevSample}>
                                        <FontAwesomeIcon icon={faChevronLeft}/>
                                    </Button>
                                </PrevBtnWrap>
                            }
                            <ToSampleBtn  onClick={onClickToSampleBtn}>
                                샘플 이미지
                            </ToSampleBtn> 
                            {
                                isSample&&
                                <NextBtnWrap>
                                    <Button style={{backgroundColor:'#0f0544',border:'none'}} onClick={onClickToNextSample}>
                                        <FontAwesomeIcon icon={faChevronRight}/>
                                    </Button>
                                </NextBtnWrap>
                            }
                        </SampleButtonWrap>
                    )
                }
            </div>
        </div>
    )
})

export default Canvas;