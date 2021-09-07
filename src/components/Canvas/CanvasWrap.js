import React,{memo,forwardRef,useRef, useEffect} from 'react';
import s from './Canvas.module.scss';
import Canvas from './Canvas';
import {Input,Label,Button} from 'reactstrap';

const CanvasWrap = memo((props)=>{
    const onClickLabel = (evt)=>{
        let labelList = document.querySelectorAll(".label")
        labelList.forEach(l=>{
            l.style.backgroundColor="#0f0544";
        })
        evt.currentTarget.style.backgroundColor="#020202";
        const currentId= evt.currentTarget.getAttribute("for");
        console.log(document.querySelector(`#${currentId}`).value);
    }
    return(
        <React.Fragment>
            <div>
                <div className={s.selectApiTypeWrap}>
                    <div className={s.btnWrap} >
                        <Input id="imgTosketch" type="radio" name="selectApiAddr" value="http://nestyle.ai:9000/api1/imgTosketch"/>
                        <Button style={{borderRadius:"12.5px 0 0 12.5px"}}>
                            <Label className="label" onClick={onClickLabel} style={{borderRadius:"12.5px 0 0 12.5px"}} htmlFor="imgTosketch">
                                이미지를 스케치로 변환
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
                <div className={s.canvasWrap}>
                    <Canvas index={1}/>
                    <div className={s.callApiBtnWrap}>
                        <Button>
                            변환
                        </Button>
                    </div>
                    <Canvas index={2}/>
                </div>
            </div>
        </React.Fragment>
    )
})

export default CanvasWrap;


