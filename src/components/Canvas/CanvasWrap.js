import React,{memo} from 'react';
import styled from 'styled-components';
import MainContentHeader from './MainContentHeader';
import Canvas from './Canvas'
/* import { PenManagerContext,actions } from '../Layout/Layout';  */

<<<<<<< HEAD
const sampleImgList1= ['/assets/sample_img/sample1_imgToPen/1_input.png'
,'/assets/sample_img/sample1_imgToPen/2_input.png'
,'/assets/sample_img/sample1_imgToPen/3_input.png'
,'/assets/sample_img/sample1_imgToPen/4_input.png'
,'/assets/sample_img/sample1_imgToPen/5_input.png'
,'/assets/sample_img/sample1_imgToPen/6_input.png'];

const sampleImgList2=[
    '/assets/sample_img/sample2_simpleContiToPen/1_input.png'
    ,'/assets/sample_img/sample2_simpleContiToPen/2_input.png'
    ,'/assets/sample_img/sample2_simpleContiToPen/3_input.png'
]

const sampleImgList3=[]


const initialSampleState = {isSample:false,apiType:'/request_image',sampleImgList:sampleImgList1,sampleImgOffset:0}

export const sampleContext = createContext({sampleStateDispatch:()=>{},sampleState:initialSampleState})

const sampleImgReducer=(state,action)=>{
    const type = action.type;
    switch(type){
        case 'toggle_sample_mode':{
            const {isSample}={...state};
            if(isSample){
                return {...state,isSample:false};
            }else{
                return {...state,isSample:true};
            }
        }
        case 'change_dir':{
            const apiType = action.apiType;
            let sampleImgList;
            if(apiType==="/request_image"){
                sampleImgList = sampleImgList1;
            }else if(apiType==="/request_simple_conti_to_penline"){
                sampleImgList = sampleImgList2;
            }else{
                sampleImgList = sampleImgList3;
            }
            return {...state,sampleImgList,sampleImgOffset:0,apiType}
        }
        case 'change_offset':{
            const arrLen = state.sampleImgList.length;
            const offsetNow = state.sampleImgOffset;
            const direction = action.direction;
            if(direction==='forth'){
                const sampleImgOffset = offsetNow+1>=arrLen?0:offsetNow+1;
                return {...state,sampleImgOffset};
            }else if(direction==='back'){
                const sampleImgOffset = offsetNow-1<0?arrLen-1:offsetNow-1;
                return {...state,sampleImgOffset};
            }
            break;
        }
        case 'init':{
            return {...state,sampleImgOffset:0};
        }
        default:return state;
    }
}

const CanvasWrap = memo(({canvasWrapWidth,canvasWrapHeight})=>{
    const [sampleState,sampleStateDispatch]=useReducer(sampleImgReducer,initialSampleState)
    const {pen,penStateDispatch,onProgress}=useContext(PenManagerContext);
    const canvasWrapRef = useRef(null);
    const [convertToWebToon,setConvertToWebToon]=useState(false);
    
    const [srcJson , setSrcJson] = useState({});
    const [inputForColorLayer,setInputForColorLayer]=useState([]);

    const confirmAPIToken=async()=>{
        try{
            const confirmTokenRespHeader = {headers:{
                'Authorization':localStorage.getItem('token'),
                'content-type':'application/json'}
            };
            const confirmTokenResp = await axios.patch('/user/confirm_jwt',{},confirmTokenRespHeader);
            const {success}=confirmTokenResp.data;
            if(!success){
                alert("부적절한 사용자 입니다!");
                return false;
            }
            
            if(confirmTokenResp.data?.token)localStorage.setItem('token',confirmTokenResp.data.token);
            return true;
        }catch(err){
            alert("서버 점검중..");
            return false;
        }
    }
    useEffect(()=>{ 
        document.querySelector(".label").style.backgroundColor="#0390fc";
        return ()=>{
            sampleStateDispatch({type:'init'});
        }
    },[])

    const sampleSrcData = useMemo(()=>{
        return {sampleStateDispatch,isSample:sampleState.isSample,sampleImgList:sampleState.sampleImgList,sampleImgOffset:sampleState.sampleImgOffset,apiType:sampleState.apiType}
    },[sampleState])

    const onClickLabel = (evt)=>{
        let labelList = document.querySelectorAll(".label")
        labelList.forEach(l=>{
            l.style.backgroundColor="#0f0544";
        })
        evt.currentTarget.style.backgroundColor="#0390fc";
        setTimeout(()=>{
            const apiType = document.querySelector('input[name="selectApiAddr"]:checked').value;
            setInputForColorLayer([]);
            sampleStateDispatch({type:'change_dir',apiType});
        },0)
    }

    const apiToServer=async(request_url,funcName,individualSrc=null)=>{
        try{

            //jwt 토큰 유효성 검사 
            /* const confirmTokenRespHeader = {headers:{
                'Authorization':localStorage.getItem('token'),
                'content-type':'application/json'}
            };
            const confirmTokenResp = await axios.patch('/user/confirm_jwt',{},confirmTokenRespHeader);
            const {success}=confirmTokenResp.data;
            if(!success){
                alert("부적절한 사용자 입니다!");
                return false;
            } */
            //jwt 토큰 유효기간 지나면 재발급받은 후 localStorage 재설정.
            /* if(confirmTokenResp.data?.token)localStorage.setItem('token',confirmTokenResp.data.token); */
            
            //이미지 data 를 api 서버로 전송
            let decodeImgData = '';
            if(individualSrc){
                decodeImgData=atob(individualSrc.split(',')[1]);
            }else{
                decodeImgData = atob(pen.originalSrc.split(',')[1]);
            }
            let asciiArr = [];
            for(let i = 0 ;i<decodeImgData.length;i++){
                asciiArr.push(decodeImgData.charCodeAt(i))
            }
            let formData = new FormData();
            const imgUpload = new Blob([new Uint8Array(asciiArr)],{'type':'image/jpeg'});
            formData.append('input_image',imgUpload);
            formData.append('function',funcName);
            const config = {
                'content-type':'multipart/form-data',
            };
            penStateDispatch({type:actions.ON_PROGRESS});
            axios.post(request_url,formData,config)
            .then((resp)=>{
                setSrcJson(resp.data);
                let img = new Image();
                img.onload = ()=>{
                    let tempCanvas = document.createElement('canvas');
                    tempCanvas.width=720;tempCanvas.height=720;
                    tempCanvas.getContext('2d').fillStyle='#fff';
                    tempCanvas.getContext('2d').fillRect(0,0,tempCanvas.width,tempCanvas.height);
                    const widthOrHeight = img.width>img.height?true:false;
                    const widthInDraw = widthOrHeight?tempCanvas.width:parseFloat(img.width/img.height)*tempCanvas.width;
                    const heightInDraw = widthOrHeight?parseFloat(img.height/img.width)*tempCanvas.height : tempCanvas.height;
                    const offsetLength = widthOrHeight?(tempCanvas.height-heightInDraw)/2:(tempCanvas.width-widthInDraw)/2;
                    if(widthOrHeight){
                        tempCanvas.getContext('2d').drawImage(img,0,offsetLength,widthInDraw,heightInDraw);
                    }else{tempCanvas.getContext('2d').drawImage(img,offsetLength,0,widthInDraw,heightInDraw);}
                    if(funcName==='image2pen'){
                        if(convertToWebToon){
                            apiToServer('/request_image','conti2pen_cyclegan',tempCanvas.toDataURL('image/png'));
                        }else{
                            penStateDispatch({type:actions.CHANGE_BACKGROUND_IMG,index:2,bs64:tempCanvas.toDataURL('image/png')});
                            setInputForColorLayer([...resp.data.input_path]);
                        }
                    }else if(Array.isArray(resp.data.output_path)){
                        penStateDispatch({type:actions.CHANGE_BACKGROUND_IMG,index:2,bs64:img.src,src2Arr:resp.data.output_path});
                    }else{
                        penStateDispatch({type:actions.CHANGE_BACKGROUND_IMG,index:2,bs64:tempCanvas.toDataURL('image/png')});
                    }
                }

                switch(funcName){
                    case 'image2pen':{
                        if(convertToWebToon){
                            img.src=`/${resp.data.output_rembg_modeO_path[0]}`;
                        }else{
                            img.src = `/${resp.data.output_modeO_path[0]}`;
                        }
                        break;
                    }
                    case 'conti2pen_cyclegan':{
                        img.src=`/${resp.data.output_path}`;
                        break;
                    }
                    case 'conti2pen_find_ae':{
                        img.src=`${resp.data.output_path[0]}`;
                        break;
                    }
                    default :{
                        break;
                    }
                }
                
            })
            .catch(err=>{
                alert("입력문제..");
                penStateDispatch({type:actions.INIT});
                return false;
            });
        }catch(err){
            alert('서버점검중...');
            penStateDispatch({type:actions.INIT});
            return false;
        }
    }

    const onClickTransformBtn=async (evt)=>{
        evt.preventDefault();
        if(onProgress){
            console.log('onProgress');
            return false;
        }

        const apiSelectRadio = sampleState.apiType;
        switch(apiSelectRadio){
            case '/request_image':{
                apiToServer(apiSelectRadio,'image2pen');
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
                if(sampleSrcData.sampleImgOffset>0){
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
                }else{
                    //api 호출
                    apiToServer('/request_image','conti2pen_cyclegan');
                }
                break;
            }
            case '/request_convert_face_to_penline':{
             
                setSrcJson({});
                apiToServer('/request_image','conti2pen_find_ae')
                break;
            }
            default:break ;
        }
    }

    const onClickLineWidthTypeLabel = (e)=>{
        const chooseLineWidth = document.querySelector('input[name="chooseLineWidth"]').checked;
        if(convertToWebToon){return false;}
        if(!chooseLineWidth){
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
            }
            
        },100)
    }

    const onChangeCheckBackground = (e)=>{

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
                document.querySelector('input:[name="lineWidthType"]').disabled=true;
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
    const onClickWebToonStyle=(evt)=>{
        if(evt.target.checked){
            document.querySelector('input[name="objectOrHuman"]').disabled=true;
            document.querySelector('input[name="chooseLineWidth"]').disabled=true;
            document.querySelector('input[name="withOutBackground"]').disabled=true;
            document.querySelector('input[name="lineWidthType"]').disabled=true;
        }else{
            document.querySelector('input[name="objectOrHuman"]').disabled=false;
            document.querySelector('input[name="chooseLineWidth"]').disabled=false;
            document.querySelector('input[name="withOutBackground"]').disabled=false;
            document.querySelector('input[name="lineWidthType"]').disabled=false;
        }
        setConvertToWebToon(evt.target.checked);
    }



    const ConvertToColorLayer=async (e)=>{
        if(convertToWebToon){
            alert("어쩔꼰대 스타일로 변환 모드를 해제해 주세요");
            return false;
        }
        if(!inputForColorLayer||inputForColorLayer.length===0){
            alert('이미지를 팬선으로 변환을 해주세요!');
            return false;
        }
        e.preventDefault();

       /*  const tokenConfirmed=await confirmAPIToken();
        console.log(tokenConfirmed);
        if(!tokenConfirmed){return false;} */

        const backgroundChecked = document.querySelector('input[name="withOutBackground"]').checked;
 
        const checkedRadio = document.querySelector('input[name="objectOrHuman"]:checked');
        const checkedValue = checkedRadio.value;
        
        let key = checkedValue==='human'?'_modeP_':'_modeO_';
        key = `output${backgroundChecked?'_rembg':''}${key}path`;
        const chooseLineWidth = document.querySelector('input[name="chooseLineWidth"]').checked
        const keyVal = chooseLineWidth?document.querySelector('input[name="lineWidthType"]:checked')?.value:0;
      
        const dataToSend = new FormData();
        dataToSend.append('img_path',backgroundChecked?inputForColorLayer[1]:inputForColorLayer[0]);
        dataToSend.append('line_path',srcJson[key][keyVal]);
        console.log(dataToSend);
        penStateDispatch({type:actions.ON_PROGRESS});
        try{
            const headers = {headers:{'content-type':'multipart/form-data'}}
            const resp=  await axios.post('/colorLayer',dataToSend,headers);
            let tempImg = new Image();
            tempImg.onload=()=>{
                const canvas = document.createElement('canvas');
                canvas.width = 720; canvas.height = 720;
                canvas.getContext('2d').drawImage(tempImg,0,0,canvas.width,canvas.height);
                penStateDispatch({type:actions.CHANGE_BACKGROUND_IMG,index:2,bs64:canvas.toDataURL('image/png')})
            }
            tempImg.src=`/${resp.data.output_path}`;
        }catch(err){
            console.log(err);
            penStateDispatch({type:actions.INIT});
            alert("서버 점검중...");
            return false;
        }
    }
=======
const MainContentContainer = styled.div`
    width:100%;height:100%;
    background-color:#bbc7be;
`;

const MainContentWrapper = styled.div`
    width:100%;height:100%;
    .function-container{
        width:100%;height:55.5px;
        box-shadow: 10.5px 0px 5px #4b544d;
        background-color:#fff;
    }
    .canvas-container1{
        width:100%;height:calc(100% - 55.5px);
        overflow-y:scroll;
    }
    @media screen and (max-width:450px){
        .function-container{
            height:45.5px;
        }
        .canvas-container1{
            width:100%;height:calc(100% - 45.5px);
        }
    }
`;
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65

const CanvasWrap = memo(()=>{
    console.log('canvas Wrap')
    return(
<<<<<<< HEAD
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
                        <Input id="sketchToPen" type="radio" name="selectApiAddr" value="/request_convert_face_to_penline"/>
                        <Button>
                            <Label  className="label" onClick={onClickLabel} htmlFor="sketchToPen">얼굴 스케치를 팬선으로 변환</Label>
                        </Button>
                    </div>
                    <div className={s.btnWrap}>
                        <Input id="contiToChar" type="radio" name="selectApiAddr" value="/request_simple_conti_to_penline"/>
                        <Button style={{borderRadius:"0 12.5px 12.5px 0"}}>
                            <Label className="label" onClick={onClickLabel} style={{borderRadius:"0 12.5px 12.5px 0"}} htmlFor="contiToChar">콘티를 팬선으로 변환</Label>
                        </Button>
                    </div>
                </div>
                <div ref={canvasWrapRef} className={s.canvasWrap}>
                    <sampleContext.Provider value={sampleSrcData}>
                        <Canvas
                            index={1} 
                            canvasWidth = {parseFloat(canvasWrapWidth*0.35)}/>
                        <div className={s.callApiBtnWrap}>
                            <Button onClick={onClickTransformBtn}>
                                변환
                            </Button>
                        </div>
                        <Canvas index={2} canvasWidth = {parseFloat(canvasWrapWidth*0.35)}/>
                        
                    </sampleContext.Provider>
                    {sampleState.apiType==='/request_image'&&<div className={s.canvasOptionWrap}>
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
                                <ListGroupItem>
                                    <p>
                                        <span>
                                            <Input onChange={onClickWebToonStyle} style={{margin:'-10px 10px'}} type="checkbox" name="to_webtoon_style" value='/request_convert_to_webtoon_style' id="to_webtoon_style"/>
                                        </span>
                                        <Label className="listGroupItem" htmlFor="to_webtoon_style">A 스타일로 변환</Label>
                                    </p>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <p style={{display:'flex',flexDirection:'row',justifyContent:'center',alignItems:'space-evenly'}}>
                                        <Button style={{border:'none',width:'80%',height:'80%',backgroundColor:'rgb(3, 144, 252)'}} onClick={ConvertToColorLayer}>Convert To Color Layer</Button>
                                    </p>
                                </ListGroupItem>
                            </ListGroup>
                        </div>
                    </div>}
=======
        <MainContentContainer>
            <MainContentWrapper>
                <div className="function-container">
                    <MainContentHeader/>
                </div>
                <div className="canvas-container1">
                    <Canvas/>
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65
                </div>
                
            </MainContentWrapper>
            
        </MainContentContainer>
    )
})

export default CanvasWrap;