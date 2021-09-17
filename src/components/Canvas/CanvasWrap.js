import React,{memo,forwardRef,useRef,useEffect, useContext} from 'react';
import s from './Canvas.module.scss';
import Canvas from './Canvas';
import { PenManagerContext,actions } from '../Layout/Layout'; 
import {Input,Label,Button} from 'reactstrap';
import axios from 'axios';

const CanvasWrap = memo(({canvasWrapWidth,canvasWrapHeight})=>{
    const {pen,penStateDispatch}=useContext(PenManagerContext);
    const canvasWrapRef = useRef(null);

    const onClickLabel = (evt)=>{
        let labelList = document.querySelectorAll(".label")
        labelList.forEach(l=>{
            l.style.backgroundColor="#0f0544";
        })
        evt.currentTarget.style.backgroundColor="#020202";
        const currentId= evt.currentTarget.getAttribute("for");
    }

    const onClickTransformBtn=async (evt)=>{
        evt.preventDefault();
        const decodeImgData = atob(pen.src1.split(',')[1]);
        let asciiArr = [];
        for(let i = 0 ;i<decodeImgData.length;i++){
            asciiArr.push(decodeImgData.charCodeAt(i))
        }
        let formData = new FormData();
        const imgUpload = new Blob([new Uint8Array(asciiArr)],{'type':'image/jpeg'});
        formData.append('input_image',imgUpload);
        
        const config = {'content-type':'multipart/form-data'};
        let resp = await axios.post('/request_image',formData,config);
        let img = new Image();
        img.onload = ()=>{
            let tempCanvas = document.createElement('canvas');
            tempCanvas.width=720;tempCanvas.height=720;
            let tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(img,0,0,tempCanvas.width,tempCanvas.height);
            penStateDispatch({type:actions.CHANGE_SRC,index:2,bs64:tempCanvas.toDataURL('image/png')})
        }
        img.src = `/${resp.data}`;
    }

    return(
        <React.Fragment>
            <div style={{width:canvasWrapWidth,height:canvasWrapHeight}}>
                <div className={s.selectApiTypeWrap}>
                    <div className={s.btnWrap} >
                        <Input id="imgTosketch" type="radio" name="selectApiAddr" value="http://nestyle.ai:9000/api1/imgTosketch"/>
                        <Button style={{borderRadius:"12.5px 0 0 12.5px"}}>
                            <Label className="label" onClick={onClickLabel} style={{borderRadius:"12.5px 0 0 12.5px"}} htmlFor="imgTosketch">
                                사진을 팬선으로 변환
                            </Label>
                        </Button>
                    </div>
                    <div className={s.btnWrap}>
                        <Input id="sketchToPen" type="radio" name="selectApiAddr" value="http://nestyle.ai:9000/api1/sketchToPen"/>
                        <Button>
                            <Label className="label" onClick={onClickLabel} htmlFor="sketchToPen"> 스케치를 팬선으로 변환</Label>
                        </Button>
                    </div>
                    <div className={s.btnWrap}>
                        <Input id="contiToChar" type="radio" name="selectApiAddr" value="http://nestyle.ai:9000/api1/contiToChar"/>
                        <Button style={{borderRadius:"0 12.5px 12.5px 0"}}>
                            <Label className="label" onClick={onClickLabel} style={{borderRadius:"0 12.5px 12.5px 0"}} htmlFor="contiToChar">콘티를 캐릭터로 변환</Label>
                        </Button>
                    </div>
                </div>
                <div ref={canvasWrapRef} className={s.canvasWrap}>
                    <Canvas index={1} canvasWidth = {parseFloat(canvasWrapWidth*0.35)}/>
                    <div className={s.callApiBtnWrap}>
                        <Button onClick={onClickTransformBtn}>
                            변환
                        </Button>
                    </div>
                    <Canvas index={2} canvasWidth = {parseFloat(canvasWrapWidth*0.35)}/>
                </div>
            </div>
        </React.Fragment>
    )
})

export default CanvasWrap;


