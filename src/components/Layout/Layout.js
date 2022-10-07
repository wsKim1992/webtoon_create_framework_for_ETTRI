<<<<<<< HEAD
import React,{createContext,useState, useReducer,useMemo, useEffect} from 'react';

import { useSelector } from 'react-redux';
import { withRouter} from 'react-router';
import Hammer from 'rc-hammerjs';
=======
import React, { createContext, useState, useReducer, useMemo, useEffect, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65

import Header from '../Header';
import styled from 'styled-components';
import CanvasWrap from '../Canvas/CanvasWrap';
import SettingBar from '../SettingBar';
import { INIT_CALL_API } from "../../reducers/callAPIReducer";
//canvas context 의 상태값을 바꿔주는 역할
<<<<<<< HEAD
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
=======
export const actions = {
  CHANGE_STROKE_STYLE: "change_strokeStyle",
  CHANGE_LINE_WIDTH: "change_lineWidth",
  CHANGE_SCALE: "change_scale",
  CHANGE_HISTORY_FRONT: "change_history_FRONT",
  CHANGE_HISTORY_BACK: "change_history_BACK",
  CHANGE_MODE: "change_mode",
  CHANGE_BACKGROUND_IMG: "change_background_img",
  CHANGE_SRC: "change_src",
  CHANGE_TO_SAMPLE: "change_to_sample",
  CHANGE_SRC2ARR_OFFSET_FRONT: "change_src2arr_offset_front",
  CHANGE_SRC2ARR_OFFSET_BACK: "change_src2arr_offset_back",
  CHANGE_SRC1ARR_OFFSET_BACK: "change_src1arr_offset_front",
  CHANGE_SRC1ARR_OFFSET_FRONT: "change_src1arr_offset_back",
  ON_PROGRESS: "on_progress",
  CHANGE_GLOBAL_STATE: 'CHANGE_GLOBAL_STATE',
  INIT: "init",
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65
}

export const modes = {
  BRUSH: "brush", ERASER: "eraser", GEOMETRY_CIRCLE: "geometry-circle",
  GEOMETRY_SQUARE: "geometry-square", GEOMETRY_POLYGON: "geometry-polygon",
  COLOR_PICKER: "color-picker", TEXT: "text", UPLOAD: "upload", FILLUP: "fill-up",
}

const InitialState = {
<<<<<<< HEAD
  
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
=======
  globalState: 0,
  onProgress: false,
  urlObj: null,
  colorizeImg: null,
  pen: {
    mode: modes.BRUSH,
    lineWidth: 4,
    strokeStyle: '#000',
    scaleFactor: 1,
    originalSrc: null,
    src1: null,
    src2: null,
    src1Scale: 1,
    src2Scale: 1,
    src1Arr: null,
    src1ArrOffset: 0,
    src2Arr: null,
    src2ArrOffset: 0,
  },
  history: {
    src1Offset: 0,
    src1History: [],
    src2History: [],
  }
}

export const PenManagerContext = createContext({
  onProgress: false, pen: InitialState.pen
  , history: InitialState.history, globalState: 0
  , penStateDispatch: () => { }, urlObj: InitialState.urlObj, colorizeImg: InitialState.colorizeImg
});
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65

const penReducer = (state, action) => {
  const type = action.type;
<<<<<<< HEAD
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
=======
  switch (type) {
    case actions.ON_PROGRESS: {
      return { ...state, onProgress: true }

    }
    case actions.CHANGE_MODE: {
      const mode = action.mode;
      let pen = {}
      if (mode === modes.ERASER) {
        pen = { ...state.pen, mode: modes.BRUSH, strokeStyle: '#fff' }
      } else {
        pen = { ...state.pen, mode };
      }
      return { ...state, pen };
    }
    case actions.CHANGE_BACKGROUND_IMG: {
      const { bs64 } = action;
      let srcHistory = [bs64];
      const history =
        { ...state.history, src1History: srcHistory, src1Offset: srcHistory.length - 1 }
      let newPen = null;
      newPen = { ...state.pen, src1: bs64 }

      if (state.onProgress) return { ...state, pen: newPen, history, onProgress: false, globalState: 1 }
      else return { ...state, pen: newPen, history, globalState: 1, urlObj: null };
      /* return {...state,pen:newPen,history}; */
    }
    case actions.CHANGE_STROKE_STYLE: {
      const strokeStyle = action.strokeStyle;
      const newPen = { ...state.pen, strokeStyle: strokeStyle }
      return { ...state, pen: newPen };
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65
    }
    case actions.CHANGE_LINE_WIDTH: {
      const boldness = action.boldness;
<<<<<<< HEAD
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
=======
      const newPen = { ...state.pen, lineWidth: boldness }
      return { ...state, pen: newPen };
    }
    case actions.CHANGE_SRC: {
      const { bs64 } = action;
      let history = { ...state.history };
      let srcHistory = history.src1History;
      let src = { ...state.src1 };
      let offset = history.src1Offset;
      if (offset < srcHistory.length - 1) {
        srcHistory = srcHistory.slice(0, offset + 1);
      }
      src = bs64;
      srcHistory.push(src);
      const pen = { ...state.pen, src1: src };
      const newHistory = { ...state.history, src1History: srcHistory, src1Offset: srcHistory.length - 1 };

      return { ...state, pen, history: newHistory };
    }
    case actions.CHANGE_HISTORY_BACK: {
      const { pen, history } = state;
      if (history.src1Offset - 1 < 0) { return state; }
      pen.src1 = history.src1History[history.src1Offset - 1];
      history.src1Offset -= 1;
      return { ...state, pen, history };
    }
    case actions.CHANGE_HISTORY_FRONT: {
      const { pen, history } = state;
      if (history.src1Offset + 1 >= history.src1History.length) { return state; }
      pen.src1 = history.src1History[history.src1Offset + 1];
      history.src1Offset += 1;
      return { ...state, pen, history };
    }
    case actions.CHANGE_SRC2ARR_OFFSET_FRONT: {
      const { src2ArrOffset } = { ...state.pen };
      const nextOffset = src2ArrOffset + 1 < state.pen.src2Arr.length ? src2ArrOffset + 1 : 0;
      const src2 = state.pen.src2Arr[nextOffset];
      const pen = { ...state.pen, src2ArrOffset: nextOffset, src2 }
      return { ...state, pen }
    }
    case actions.CHANGE_SRC2ARR_OFFSET_BACK: {

      const { src2ArrOffset } = { ...state.pen };
      const nextOffset = src2ArrOffset - 1 >= 0 ? src2ArrOffset - 1 : state.pen.src2Arr.length - 1;
      const src2 = state.pen.src2Arr[nextOffset];
      const pen = { ...state.pen, src2ArrOffset: nextOffset, src2 }
      return { ...state, pen }
    }
    case actions.INIT: {
      const history = { ...state.history };
      history.src1History = [];
      history.src2History = [];
      history.src1Offset = 0;
      const pen = { ...state.pen };
      pen.src1 = null;
      pen.src2 = null;
      pen.src1Arr = null;
      pen.originalSrc = null;
      pen.src2Arr = null;
      pen.src1ArrOffset = 0;
      pen.src2ArrOffset = 0;
      return { ...state, isSample: false, history, pen, globalState: 0, colorizeImg: null, urlObj: null };
    }
    case actions.CHANGE_GLOBAL_STATE: {
      const { bs64, newGlobalState } = action;
      let { globalState, history, pen } = state;
      const newHistory = { ...history, src1History: [bs64], src1Offset: 0 };
      const newPen = { ...pen, src1: bs64 }
      if (globalState === 1) {
        return {
          ...state, history: newHistory, pen: newPen, globalState: newGlobalState,
          urlObj: action.urlObj, colorizeImg: null
        }
      } else if (globalState === 3) {
        return { ...state, history: newHistory, pen: newPen, globalState: newGlobalState, colorizeImg: bs64 };
      } else {
        return { ...state, history: newHistory, pen: newPen, globalState: newGlobalState };
      }
    }
    default: {
      return state
    }
  }
}

const LayoutComponent = styled.div`
  width:100%;
  height:100%;
  background-color:#bbc7be;
`;

const LayoutWrap = styled.div`
  width:100%;
  height:100%;
  .content-wrapper{
    width:100%;height:100%;
    .content-body-wrapper{
      width:100%;
      height:calc(100% - 65.5px);
      display:flex;
      flex-direction:row;
      .canvas-container{
        width:calc(100% - 315.5px);
        height:100%;
      }
      .sideBar-container{
        width:315.5px;
        height:100%;
      }
    }
  }
  @media screen and (max-width:975px){
    .content-wrapper{
      .content-body-wrapper{
        position:relative;
        height:calc(100% - 65.5px);
        .canvas-container{
          width:100%;
        }
        .sideBar-container{
          position:absolute;
          top:0;right:-315.5px;
          z-index:10;
          width:315.5px;
          height:100%;
          transition:all 0.5s ease-out;
          &.on{
            right:0px;
          }
        }
      }
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65
    }
  }
`;

export const convertIntoBase64 = (src) => {
  return new Promise((resolve, reject) => {
    const tempImg = new Image();
    tempImg.width=512;
    tempImg.height=512;
    tempImg.src = src;
    tempImg.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = tempImg.width;
      canvas.height = tempImg.height;
      canvas.getContext('2d').drawImage(tempImg, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png'));
    }
  })
};

const showSettingBarFunc = ()=>{
  const {innerWidth} = window;
    if(innerWidth<=975){
      return false;
    }else{
      return true;
    }
}

<<<<<<< HEAD
const Layout =()=> {
  const [PenState,penStateDispatch]=useReducer(penReducer,InitialState);
  const [entireWidth,setEntireWidth]=useState(window.innerWidth);
  const [entireHeight,setEntireHeight] = useState(window.innerHeight);
  
  const {
    sidebarPosition,
    sidebarVisibility,
  }= useSelector(state=>state.navigation);
=======
const Layout = () => {
  const [PenState, penStateDispatch] = useReducer(penReducer, InitialState);
  const [showSettingBar, setShowSettingBar] = useState(showSettingBarFunc());

  const toggleShowSettingBar = useCallback(() => {
    console.log('toggleShowSettingBar');
    setShowSettingBar(prev => !prev);
  }, [])

  const {
    loadingCallAPI,
    failureCallAPI,
    successCallAPI,
    dataFromAPI
  } = useSelector(state => state.callAPIReducer);

  const dispatch = useDispatch();
>>>>>>> 59052bf7d4488ecf442a3ad8bcdd7f66cb23dc65

  useEffect(() => {
    if (!loadingCallAPI && successCallAPI) {
      if (dataFromAPI) {
        try {
          if (PenState.globalState === 1) {
            console.log(dataFromAPI.input_path[1]);
            convertIntoBase64(`/${dataFromAPI.input_path[1]}`).then(result => {
              dispatch({ type: INIT_CALL_API });
              penStateDispatch({ type: actions.CHANGE_GLOBAL_STATE, bs64: result, urlObj: { ...dataFromAPI }, newGlobalState: 2 });
            });
          } else if (PenState.globalState === 3) {
            convertIntoBase64(`/${dataFromAPI.output_path}`).then(result => {
              dispatch({ type: INIT_CALL_API });
              penStateDispatch({ type: actions.CHANGE_GLOBAL_STATE, bs64: result, newGlobalState: 4 });
            });
          } else if (PenState.globalState === 4) {
            const newOutputPath = dataFromAPI.output_path.replace('logs','logs_exp');
            console.log(newOutputPath);
            convertIntoBase64(`/${dataFromAPI.output_path}`).then(result => {
              dispatch({ type: INIT_CALL_API });
              penStateDispatch({ type: actions.CHANGE_GLOBAL_STATE, bs64: result, newGlobalState: 5 });
            });
          }
        } catch (err) {
          console.log(err);
          window.alert("이미지 로드 오류 발생!");
          dispatch({ type: INIT_CALL_API });
        }
      }
    } else if (!loadingCallAPI && failureCallAPI) {
      dispatch({ type: INIT_CALL_API });
    }
  }, [
    loadingCallAPI,
    failureCallAPI,
    successCallAPI,
    dataFromAPI,
    PenState.globalState
  ])

  const onResize = useCallback(()=>{
    setShowSettingBar(showSettingBarFunc())
  },[])

  useEffect(()=>{
    window.addEventListener("resize",onResize);
    return ()=>{
      window.removeEventListener("resize",onResize);
    }
  },[])

  const penData = useMemo(() => {
    return {
      isSample: PenState.isSample, penStateDispatch: penStateDispatch, pen: PenState.pen, history: PenState.history,
      onProgress: PenState.onProgress,
      globalState: PenState.globalState,
      urlObj: PenState.urlObj,
      colorizeImg: PenState.colorizeImg
    };
  }, [PenState])

  /* const {isFetching,userInfo}=useSelector(state=>state.auth);
 */

  return (
    <LayoutComponent>
      <LayoutWrap>
        <PenManagerContext.Provider value={penData}>
          <div className="content-wrapper">
            {/* <Sidebar/> */}
            <Header toggleShowSettingBar={toggleShowSettingBar} />
            <div className="content-body-wrapper">
              <div className="canvas-container">
                <CanvasWrap />
              </div>
              <div className={`sideBar-container ${showSettingBar&&'on'}`}>
                <SettingBar />
              </div>
              
            </div>
          </div>
        </PenManagerContext.Provider>
      </LayoutWrap>
    </LayoutComponent>
  );

}


export default withRouter(Layout);