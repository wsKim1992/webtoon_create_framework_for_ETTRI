import React,{createContext,useState, useReducer,useMemo, useEffect} from 'react';

import { useSelector } from 'react-redux';
import { withRouter} from 'react-router';
import Hammer from 'rc-hammerjs';

import Header from '../Header';
import Sidebar from '../Sidebar';
import s from './Layout.module.scss';
import CanvasWrap from '../Canvas/CanvasWrap';

//canvas context 의 상태값을 바꿔주는 역할
export const actions={
    CHANGE_STROKE_STYLE:"change_strokeStyle",
    CHANGE_LINE_WIDTH:"change_lineWidth",
    CHANGE_SCALE:"change_scale",
    CHANGE_HISTORY_FRONT:"change_history_FRONT",
    CHANGE_HISTORY_BACK:"change_history_BACK",
    CHANGE_MODE : "change_mode",
    CHANGE_BACKGROUND_IMG:"change_background_img",
    CHANGE_SRC:"change_src",
    CHANGE_TO_SAMPLE:"change_to_sample",
    CHANGE_SRC2ARR_OFFSET_FRONT:"change_src2arr_offset_front",
    CHANGE_SRC2ARR_OFFSET_BACK:"change_src2arr_offset_back",
    CHANGE_SRC1ARR_OFFSET_BACK:"change_src1arr_offset_front",
    CHANGE_SRC1ARR_OFFSET_FRONT:"change_src1arr_offset_back",
    ON_PROGRESS:"on_progress",
    INIT:"init",
}

export const modes = {
  BRUSH:"brush",ERASER:"eraser",GEOMETRY_CIRCLE:"geometry-circle",
  GEOMETRY_SQUARE :"geometry-square",GEOMETRY_POLYGON:"geometry-polygon",
  COLOR_PICKER:"color-picker",TEXT:"text",UPLOAD:"upload",FILLUP:"fill-up",
}

const InitialState = {
  
  onProgress:false,
  pen:{
    mode:modes.BRUSH,
    lineWidth:4,
    strokeStyle:'#000',
    scaleFactor:1,
    originalSrc:null,
    src1:null,
    src2:null,
    src1Scale:1,
    src2Scale:1,
    src1Arr:null,
    src1ArrOffset:0,
    src2Arr:null,
    src2ArrOffset:0,
  },
  history:{
    src1Offset:0,
    src1History:[],
    src2History:[],
  }
}

export const PenManagerContext = createContext({onProgress:false,pen:InitialState.pen
  ,history:InitialState.history
  ,penStateDispatch:()=>{}});

const penReducer = (state,action)=>{
  const type = action.type;
  switch(type){
    case actions.ON_PROGRESS:{
      return {...state,onProgress:true}

    }
    case actions.CHANGE_MODE:{
        const mode = action.mode;
        let pen = {}
        if(mode===modes.ERASER){
            pen = {...state.pen,mode:modes.BRUSH,strokeStyle:'#fff'}
        }else{
            pen = {...state.pen,mode};
        }
        return {...state,pen};
    }
    case actions.CHANGE_BACKGROUND_IMG:{
        const {bs64,index} = action;
        let srcHistory = [bs64]; 
        const history = index===1?
        {...state.history,src1History:srcHistory,src1Offset:srcHistory.length-1}
        :{...state.history,src2History:srcHistory};
        let newPen = null;
        if(index===1){
          newPen={...state.pen,src1:bs64,isSample:false,originalSrc:action.originalSrc}
        }else{
          if(action.src2Arr){
            newPen={...state.pen,src2:bs64,isSample:false,src2Arr:action.src2Arr}
          }else{
            newPen={...state.pen,src2:bs64,isSample:false}
          }
        }
        if(state.onProgress)return{...state,pen:newPen,history,onProgress:false}
        else return {...state,pen:newPen,history};
        /* return {...state,pen:newPen,history}; */
      }
    case actions.CHANGE_STROKE_STYLE:{
      const strokeStyle=action.strokeStyle;
      const newPen = {...state.pen,strokeStyle:strokeStyle}
      return{...state,pen:newPen};
    }
    case actions.CHANGE_LINE_WIDTH:{
      const boldness = action.boldness;
      const newPen = {...state.pen,lineWidth:boldness}
      return {...state,pen:newPen};
    }
    case actions.CHANGE_SRC:{
        const {index,bs64,originalSrc} = action;
        let history = {...state.history};
        let srcHistory = index===1?history.src1History:history.src2History;
        let src = index===1?{...state.src1}:{...state.src2};
        let offset = history.src1Offset;
        if(index===1&&offset<srcHistory.length-1){
            srcHistory=srcHistory.slice(0,offset+1);
        }
        src = bs64;
        srcHistory.push(src);
        const pen = index===1?{...state.pen,src1:src,originalSrc}:{...state.pen,src2:src};
        const newHistory = index===1?{...state.history,src1History:srcHistory,src1Offset:srcHistory.length-1}:{...state.history,src2History:srcHistory}
        
        return {...state,pen,history:newHistory};
    }
    case actions.CHANGE_HISTORY_BACK:{
        const {pen,history}=state;
        if(history.src1Offset-1<0){return state;}
        pen.src1 = history.src1History[history.src1Offset-1];
        history.src1Offset-=1;
        return {...state,pen,history};
    }
    case actions.CHANGE_HISTORY_FRONT:{
        const {pen,history}=state;
        if(history.src1Offset+1>=history.src1History.length){return state;}
        pen.src1 = history.src1History[history.src1Offset+1];
        history.src1Offset+=1;
        return {...state,pen,history};
    }
    case actions.CHANGE_SRC2ARR_OFFSET_FRONT:{
        const {src2ArrOffset}={...state.pen};
        const nextOffset=src2ArrOffset+1<state.pen.src2Arr.length?src2ArrOffset+1:0;
        const src2 = state.pen.src2Arr[nextOffset];
        const pen = {...state.pen,src2ArrOffset:nextOffset,src2}
        return {...state,pen}
    }
    case actions.CHANGE_SRC2ARR_OFFSET_BACK:{
    
        const {src2ArrOffset}={...state.pen};
        const nextOffset=src2ArrOffset-1>=0?src2ArrOffset-1:state.pen.src2Arr.length-1;
        const src2 = state.pen.src2Arr[nextOffset];
        const pen = {...state.pen,src2ArrOffset:nextOffset,src2}
        return {...state,pen}
    }
    case actions.INIT:{
        const history = {...state.history};
        history.src1History=[];
        history.src2History=[];
        history.src1Offset=0;
        const pen = {...state.pen};
        pen.src1=null;
        pen.src2=null;
        pen.src1Arr=null;
        pen.originalSrc=null;
        pen.src2Arr=null;
        pen.src1ArrOffset=0;
        pen.src2ArrOffset=0;
        return {...state,isSample:false,history,pen}
    }
    default:{
      return state
    }
  }
}

const Layout =()=> {
  const [PenState,penStateDispatch]=useReducer(penReducer,InitialState);
  const [entireWidth,setEntireWidth]=useState(window.innerWidth);
  const [entireHeight,setEntireHeight] = useState(window.innerHeight);
  
  const {
    sidebarPosition,
    sidebarVisibility,
  }= useSelector(state=>state.navigation);

  const penData = useMemo(()=>{
    return {isSample:PenState.isSample,penStateDispatch:penStateDispatch,pen:PenState.pen,history:PenState.history,onProgress:PenState.onProgress}
  },[PenState])

  const {isFetching,userInfo}=useSelector(state=>state.auth);

  useEffect(()=>{
    window.addEventListener("resize",(e)=>{
      setEntireWidth(window.innerWidth); 
      setEntireHeight(window.innerHeight);
    })
  },[])


  return (

    <div
      className={[
        s.root,
        'sidebar-' + sidebarPosition,
        'sidebar-' + sidebarVisibility,
      ].join(' ') }
    >
      {!isFetching&&userInfo&&
        <div className={s.wrap} style={{width:entireWidth*0.971,height:entireHeight}}>
          <PenManagerContext.Provider value={penData}>
            <Header headerWidth={entireWidth*0.971} />
              <Hammer >
                <main className={s.content} style={{width:entireWidth*0.971}}>
                    <Sidebar sidebarWidth={parseFloat(entireWidth*0.03)}/>
                    <CanvasWrap canvasWrapWidth={entireWidth*0.971} canvasWrapHeight={entireHeight*0.936}/>
                </main>
              </Hammer>
          </PenManagerContext.Provider>
        </div>}
    </div>
  );
  
}


export default withRouter(Layout);