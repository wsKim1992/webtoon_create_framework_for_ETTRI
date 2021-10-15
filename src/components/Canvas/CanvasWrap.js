import React,{memo,useMemo,useState,useRef,useReducer,useEffect, useContext,createContext} from 'react';
import s from './Canvas.module.scss';
import Canvas from './Canvas';
import { PenManagerContext,actions } from '../Layout/Layout'; 
import {Input,Label,Button} from 'reactstrap';
import axios from 'axios';
import ListGroup from 'reactstrap/lib/ListGroup';
import ListGroupItem from 'reactstrap/lib/ListGroupItem';
import { useHistory } from 'react-router-dom';
const sampleImgList1= ['sample1_imgToPen/1_input.png','sample1_imgToPen/2_input.png'
    ,'sample1_imgToPen/3_input.png','sample1_imgToPen/4_input.png'
    ,'sample1_imgToPen/5_input.png','sample1_imgToPen/6_input.png'];

const sampleImgList2=[
    'sample2_simpleContiToPen/1_input.png','sample2_simpleContiToPen/2_input.png'
    ,'sample2_simpleContiToPen/3_input.png'
]

const sampleImgList3=[
    'sample3_detailContiToPen/1_input.png','sample3_detailContiToPen/2_input.png'
    ,'sample3_detailContiToPen/3_input.png'
]


const initialSampleState = {sampleImgList:sampleImgList1,sampleImgOffset:0}

export const sampleContext = createContext({sampleStateDispatch:()=>{},sampleState:initialSampleState})
export const onProgressContext = createContext({onProgress:false});

const sampleImgReducer=(state,action)=>{
    const type = action.type;
    switch(type){
        case 'change_dir':{
            const apiType = action.apiType;
            console.log(`apiType : ${apiType}`);
            let sampleImgList;
            if(apiType==="/request_image"){
                sampleImgList = sampleImgList1;
            }else if(apiType==="/request_simple_conti_to_penline"){
                sampleImgList = sampleImgList2;
            }else{
                sampleImgList = sampleImgList3;
            }
            return {...state,sampleImgList,sampleImgOffset:0}
        }
        case 'change_offset':{
            const arrLen = state.sampleImgList.length;
            const offsetNow = state.sampleImgOffset;
            const direction = action.direction;
            if(direction==='forth'){
                const sampleImgOffset = offsetNow+1>=arrLen?0:offsetNow+1;
                console.log(`sampleImgOffset:${sampleImgOffset}`)
                return {...state,sampleImgOffset};
            }else if(direction==='back'){
                const sampleImgOffset = offsetNow-1<0?arrLen-1:offsetNow-1;
                console.log(`sampleImgOffset:${sampleImgOffset}`)
                return {...state,sampleImgOffset};
            }
        }
        default:return {...state};
    }
}

const CanvasWrap = memo(({canvasWrapWidth,canvasWrapHeight})=>{
    const [sampleState,sampleStateDispatch]=useReducer(sampleImgReducer,initialSampleState)
    const {pen,penStateDispatch}=useContext(PenManagerContext);
    const canvasWrapRef = useRef(null);
    const [srcJson , setSrcJson] = useState({});
    const [onProgress,setOnProgress] = useState(false);
    useEffect(()=>{ 
        document.querySelector(".label").style.backgroundColor="#0390fc";
    },[])

    const sampleSrcData = useMemo(()=>{
        return {sampleStateDispatch,sampleImgList:sampleState.sampleImgList,sampleImgOffset:sampleState.sampleImgOffset}
    },[sampleState])
    const onProgressFlag = useMemo(()=>{
        return {onProgress}
    },[onProgress])
    const onClickLabel = (evt)=>{
        let labelList = document.querySelectorAll(".label")
        labelList.forEach(l=>{
            l.style.backgroundColor="#0f0544";
        })
        evt.currentTarget.style.backgroundColor="#0390fc";
        setTimeout(()=>{
            const apiType = document.querySelector('input[name="selectApiAddr"]:checked').value;
            sampleStateDispatch({type:'change_dir',apiType});
        },0)
    }

    const apiToServer=async(request_url)=>{
        try{
            //jwt 토큰 유효성 검사 
            const confirmTokenRespHeader = {headers:{
                'Authorization':localStorage.getItem('token'),
                'content-type':'application/json'}
            };
            console.log(`token : ${localStorage.getItem('token')}`);
            const confirmTokenResp = await axios.patch('/user/confirm_jwt',{},confirmTokenRespHeader);
            const {success}=confirmTokenResp.data;
            if(!success){
                alert("부적절한 사용자 입니다!");
                return false;
            }
            //jwt 토큰 유효기간 지나면 재발급받은 후 localStorage 재설정.
            if(confirmTokenResp.data?.token)localStorage.setItem('token',confirmTokenResp.data.token);
            
            //이미지 data 를 api 서버로 전송
            const decodeImgData = atob(pen.src1.split(',')[1]);
            let asciiArr = [];
            for(let i = 0 ;i<decodeImgData.length;i++){
                asciiArr.push(decodeImgData.charCodeAt(i))
            }
            let formData = new FormData();
            const imgUpload = new Blob([new Uint8Array(asciiArr)],{'type':'image/jpeg'});
            formData.append('input_image',imgUpload);
            
            const config = {
                'content-type':'multipart/form-data',
            };
            setOnProgress(true)
            
            axios.post(request_url,formData,config)
            .then((resp)=>{
                setSrcJson(resp.data);
                let img = new Image();
                img.onload = ()=>{
                    let tempCanvas = document.createElement('canvas');
                    tempCanvas.width=720;tempCanvas.height=720;
                    let tempCtx = tempCanvas.getContext('2d');
                    tempCtx.drawImage(img,0,0,tempCanvas.width,tempCanvas.height);
                    penStateDispatch({type:actions.CHANGE_SRC,index:2,bs64:tempCanvas.toDataURL('image/png')});
                }
                img.src = `/${resp.data.output_modeO_path[0]}`;
                setOnProgress(false);
            })
            .catch(err=>{
                if(err.response.state>=500)alert("서버 점검중..");
                else if(err.response.state>=400)alert("입력 data 오류! .jpg,.png 파일을 업로드해주세요!");
                setOnProgress(false);
                return false;
            });
        }catch(err){
            alert('서버점검중...');
            return false;
        }
    }

    const onClickTransformBtn=async (evt)=>{
        evt.preventDefault();

        const apiSelectRadio = document.querySelector('input[name="selectApiAddr"]:checked')?.value; 
        
        switch(apiSelectRadio){
            case '/request_image':{
                apiToServer(apiSelectRadio);
                document.querySelector('#object').checked=true;
                document.querySelector('input[name="withOutBackground"]').checked=false;
                document.querySelector('input[name="chooseLineWidth"]').checked=false;
                document.querySelector('input[name="lineWidthType"]').checked=false;
                let labelList = document.querySelectorAll(".listGroupItem");
                labelList.forEach(l=>{
                    l.style.backgroundColor="#0f0544";
                })
                let objHumanlabelList = document.querySelectorAll(".objectHumanLabel");
                objHumanlabelList.forEach(l=>{
                    l.style.backgroundColor="#0f0544";
                })
                document.querySelector('#objectLabelId').style.backgroundColor='#0390fc';
                break ;
            }
            case '/request_simple_conti_to_penline':{
                
                setSrcJson({});
                const inputFileName = `${sampleSrcData.sampleImgList[sampleSrcData.sampleImgOffset].split('/')[1].split('_')[0]}_input.png`;
                const outputFileName = `${sampleSrcData.sampleImgList[sampleSrcData.sampleImgOffset].split('/')[1].split('_')[0]}_output.png`;
             
                const newSrc = sampleSrcData.sampleImgList[sampleSrcData.sampleImgOffset].replace(inputFileName,outputFileName);
           
                let img = new Image();
                img.src = `/static/sample/sample_img/${newSrc}`;
                img.onload = ()=>{
                    let tempCanvas = document.createElement('canvas');
                    tempCanvas.width=720;tempCanvas.height=720;
                    let tempCtx = tempCanvas.getContext('2d');
                    tempCtx.drawImage(img,0,0,tempCanvas.width,tempCanvas.height);
                    penStateDispatch({type:actions.CHANGE_SRC,index:2,bs64:tempCanvas.toDataURL('image/png')});
                }
                
                break;
            }
            case '/request_complicated_conti_to_penline':{
             
                setSrcJson({});
                const inputFileName = `${sampleSrcData.sampleImgList[sampleSrcData.sampleImgOffset].split('/')[1].split('_')[0]}_input.png`;
                const outputFileName = `${sampleSrcData.sampleImgList[sampleSrcData.sampleImgOffset].split('/')[1].split('_')[0]}_output.png`;
                
                const newSrc = sampleSrcData.sampleImgList[sampleSrcData.sampleImgOffset].replace(inputFileName,outputFileName);
               
                let img = new Image();
                img.src = `/static/sample/sample_img/${newSrc}`;
                img.onload = ()=>{
                    let tempCanvas = document.createElement('canvas');
                    tempCanvas.width=720;tempCanvas.height=720;
                    let tempCtx = tempCanvas.getContext('2d');
                    tempCtx.drawImage(img,0,0,tempCanvas.width,tempCanvas.height);
                    penStateDispatch({type:actions.CHANGE_SRC,index:2,bs64:tempCanvas.toDataURL('image/png')});
                }
                break;
            }
            default:break ;
        }
    }

    const onClickLineWidthTypeLabel = (e)=>{
        const chooseLineWidth = document.querySelector('input[name="chooseLineWidth"]').checked;
        if(!chooseLineWidth){
            alert("팬선 변경을 click 해주세요");
            return false;
        }
        let labelList = document.querySelectorAll(".listGroupItem")
        const labelChoosen=e.currentTarget;
        labelList.forEach(l=>{
            l.style.backgroundColor="#0f0544";
        })
        e.currentTarget.style.backgroundColor="#0390fc";
        setTimeout(()=>{
            try{    
                const keyVal = document.querySelector('input[name="lineWidthType"]:checked')?.value;
                const withOutBackground = document.querySelector('input[name="withOutBackground"]').checked;
                const objectOrHuman = document.querySelector('input[name="objectOrHuman"]:checked').value;
                let key = objectOrHuman==='human'?'_modeP_':'_modeO_';
                key =  `output${withOutBackground?'_rembg':''}${key}path`;
                const img = new Image();
                img.src=`/${srcJson[key][keyVal]}`;
                img.onload=()=>{
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width=720;tempCanvas.height=720;
                    tempCanvas.getContext('2d').drawImage(img,0,0,tempCanvas.width,tempCanvas.height);
                    penStateDispatch({type:actions.CHANGE_SRC,index:2,bs64:tempCanvas.toDataURL('image/jpeg')});
                }
            }catch(err){
                labelChoosen.style.backgroundColor="#0f0544";
                alert("이미지를 업로드해주세요!");
            }
            
        },100)
    }

    const onChangeCheckBackground = (e)=>{
        console.log(e.currentTarget.checked);
        const checked = e.currentTarget.checked;
        try{
            const objectOrHuman =document.querySelector('input[name="objectOrHuman"]:checked').value;
   
            let keyStr = objectOrHuman==='human'?'_modeP_':'_modeO_';
            keyStr = `output${checked?'_rembg':''}${keyStr}path`;
          
            let img = new Image();
            img.src = `/${srcJson[keyStr][0]}`;
            img.onload=()=>{
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width=720;tempCanvas.height=720;
                tempCanvas.getContext('2d').drawImage(img,0,0,tempCanvas.width,tempCanvas.height);
                penStateDispatch({type:actions.CHANGE_SRC,index:2,bs64:tempCanvas.toDataURL('image/jpeg')});
            }
        }catch(err){
            return false;
        }
    }
    
    const onChangePenLineWidth = (e)=>{
        const checked = e.currentTarget.checked;
        const backgroundChecked = document.querySelector('input[name="withOutBackground"]').checked;
        const objectOrHuman = document.querySelector('input[name="objectOrHuman"]:checked').value;
        try{
            if(!checked){
                let labelList = document.querySelectorAll(".listGroupItem");
                labelList.forEach(l=>{
                    l.style.backgroundColor="#0f0544";
                })
                let key = objectOrHuman==='human'?'_modeP_':'_modeO_';
                key = `output${backgroundChecked?'_rembg':''}${key}path`
                let img = new Image();
                img.src = `/${srcJson[key][0]}`;
                img.onload=()=>{
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width=720;tempCanvas.height=720;
                    tempCanvas.getContext('2d').drawImage(img,0,0,tempCanvas.width,tempCanvas.height);
                    penStateDispatch({type:actions.CHANGE_SRC,index:2,bs64:tempCanvas.toDataURL('image/jpeg')});
                }
            }
        }catch(err){
            return false;
        }
    }
    
    const onClickChooseObjectOrHuman=(e)=>{
        let labelList = document.querySelectorAll('.objectHumanLabel');
        labelList.forEach(label=>{
            label.style.backgroundColor='#0f0544'
        })
        e.currentTarget.style.backgroundColor='#0390fc'
        setTimeout(()=>{
            try{
                const checkedRadio = document.querySelector('input[name="objectOrHuman"]:checked');
                const checkedValue = checkedRadio.value;
                const backgroundChecked = document.querySelector('input[name="withOutBackground"]').checked;
                let key = checkedValue==='human'?'_modeP_':'_modeO_';
                key = `output${backgroundChecked?'_rembg':''}${key}path`;
                
                let img = new Image();
                img.src = `/${srcJson[key][0]}`;
                img.onload=()=>{
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width=720;tempCanvas.height=720;
                    tempCanvas.getContext('2d').drawImage(img,0,0,tempCanvas.width,tempCanvas.height);
                    penStateDispatch({type:actions.CHANGE_SRC,index:2,bs64:tempCanvas.toDataURL('image/jpeg')});
                }
            }catch(err){
                return false;
            }
        },100)
    }

    return(
        <React.Fragment>
            <div style={{width:canvasWrapWidth,height:canvasWrapHeight}}>
                <div className={s.selectApiTypeWrap}>
                    <div className={s.btnWrap} >
                        <Input defaultChecked id="imgTosketch" type="radio" name="selectApiAddr" value="/request_image"/>
                        <Button style={{borderRadius:"12.5px 0 0 12.5px"}}>
                            <Label className="label" onClick={onClickLabel} style={{borderRadius:"12.5px 0 0 12.5px"}} htmlFor="imgTosketch">
                                이미지를 팬선으로 변환
                            </Label>
                        </Button>
                    </div>
                    <div className={s.btnWrap}>
                        <Input id="sketchToPen" type="radio" name="selectApiAddr" value="/request_simple_conti_to_penline"/>
                        <Button>
                            <Label className="label" onClick={onClickLabel} htmlFor="sketchToPen"> 간단 콘티를 팬선으로 변환</Label>
                        </Button>
                    </div>
                    <div className={s.btnWrap}>
                        <Input id="contiToChar" type="radio" name="selectApiAddr" value="/request_complicated_conti_to_penline"/>
                        <Button style={{borderRadius:"0 12.5px 12.5px 0"}}>
                            <Label className="label" onClick={onClickLabel} style={{borderRadius:"0 12.5px 12.5px 0"}} htmlFor="contiToChar">상세 콘티를 팬선으로 변환</Label>
                        </Button>
                    </div>
                </div>
                <div ref={canvasWrapRef} className={s.canvasWrap}>
                    <sampleContext.Provider value={sampleSrcData}>
                        <onProgressContext.Provider value={onProgressFlag}>
                            <Canvas
                                index={1} 
                                canvasWidth = {parseFloat(canvasWrapWidth*0.35)}/>
                            <div className={s.callApiBtnWrap}>
                                <Button onClick={onClickTransformBtn}>
                                    변환
                                </Button>
                            </div>
                            <Canvas index={2} canvasWidth = {parseFloat(canvasWrapWidth*0.35)}/>
                        </onProgressContext.Provider>
                    </sampleContext.Provider>
                    <div className={s.canvasOptionWrap}>
                        <div className={s.canvasOption}>
                            <ListGroup className={s.optionListWrap}>
                                <ListGroupItem>
                                    <p>
                                        <Input defaultChecked id="object" type="radio" name="objectOrHuman" value="object"/>
                                        <Input id="human" type="radio" name="objectOrHuman" value="human"/>
                                        <span className={s.chooseObjectOrHuman}>
                                            <Label id="objectLabelId" className="objectHumanLabel" onClick={onClickChooseObjectOrHuman} style={{backgroundColor:'#0390fc'}} defaultChecked htmlFor="object">사물중심</Label>
                                            <Label id="humanLabelId" className="objectHumanLabel" onClick={onClickChooseObjectOrHuman} htmlFor="human">인물중심</Label>
                                        </span>
                                    </p>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <p>
                                        <span>
                                            <input onChange={onChangeCheckBackground} type="checkbox" name="withOutBackground" id="withOutBackground" value="withOutBackground"/>
                                        </span>
                                        <Label htmlFor="withOutBackground">배경제거</Label>
                                    </p>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <p>
                                        <span>
                                            <input onChange={onChangePenLineWidth} type="checkbox" name="chooseLineWidth" id="chooseLineWidth" value="chooseLineWidth"/>
                                        </span>
                                        <Label htmlFor="chooseLineWidth">펜선 선택</Label>
                                    </p>
                                </ListGroupItem>
                            </ListGroup>
                            <ListGroup className={s.changePenLineWrap}>
                                {/* <ListGroupItem>
                                    <Input type="radio" name="lineWidthType" value="0" id="original"/>
                                    <Label  onClick={onClickLineWidthTypeLabel} htmlFor="original">output_path</Label>
                                </ListGroupItem> */}
                                <ListGroupItem>
                                    <Input type="radio" name="lineWidthType" value="1" id="opt1_path"/>
                                    <Label className="listGroupItem" onClick={onClickLineWidthTypeLabel} htmlFor="opt1_path">option1</Label>
                                </ListGroupItem>
                                <ListGroupItem> 
                                    <Input type="radio" name="lineWidthType" value="2" id="opt2_path"/>
                                    <Label className="listGroupItem" onClick={onClickLineWidthTypeLabel} htmlFor="opt2_path">option2</Label>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Input type="radio" name="lineWidthType" value="3" id="opt3_path"/>
                                    <Label className="listGroupItem" onClick={onClickLineWidthTypeLabel} htmlFor="opt3_path">option3</Label>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Input type="radio" name="lineWidthType" value="4" id="opt4_path"/>
                                    <Label className="listGroupItem" onClick={onClickLineWidthTypeLabel} htmlFor="opt4_path">option4</Label>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    </div>
                </div>
                
            </div>
        </React.Fragment>
    )
})

export default CanvasWrap;


