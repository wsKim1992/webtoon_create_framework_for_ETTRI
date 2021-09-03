import React,{memo,forwardRef, useEffect} from 'react';
import s from './Canvas.module.scss';
import Canvas from './Canvas';
import Button from 'reactstrap/lib/Button';
import {Input} from 'reactstrap';
import Label from 'reactstrap/lib/Label';

const CanvasWrap = memo((props)=>{
   
    return(
        <React.Fragment>
            <div>
                <div className={s.selectApiTypeWrap}>
                    <div className={s.btnWrap}>
                        <Input checked id="imgTosketch" type="radio" name="selectApiAddr" value="http:nestyle.ai:9000/api1"/>
                        <Button><Label htmlFor="imgTosketch">이미지를 스케치로</Label></Button>
                    </div>
                    <div className={s.btnWrap}>
                        <Input id="sketchToPen" type="radio" name="selectApiAddr" value="http:nestyle.ai:9000/api1"/>
                        <Button><Label htmlFor="sketchToPen"> 스케치를 팬선으로</Label></Button>
                    </div>
                    <div className={s.btnWrap}>
                        <Input id="contiToChar" type="radio" name="selectApiAddr" value="http:nestyle.ai:9000/api1"/>
                        <Button><Label htmlFor="contiToChar">콘티를 캐릭터로</Label></Button>
                    </div>
                </div>
                <div className={s.canvasWrap}>
                    <Canvas index={1}/>
                    <div className={s.callApiBtnWrap}>
                        <Button>
                            call API
                        </Button>
                    </div>
                    <Canvas index={2}/>
                </div>
            </div>
        </React.Fragment>
    )
})

export default CanvasWrap;


