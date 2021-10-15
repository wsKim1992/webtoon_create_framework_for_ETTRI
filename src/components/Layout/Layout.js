import React,{createContext, useRef,useState, useReducer,useMemo, useEffect} from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { Switch, Route, withRouter, Redirect } from 'react-router';
/* import {BrowserRouter} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group'; */
import Hammer from 'rc-hammerjs';
import TableStatic from '../../pages/tables/static';
/* import MapsGoogle from '../../pages/components/maps/google';
import CoreTypography from '../../pages/typography'; */
/* import Dashboard from '../../pages/dashboard'; */

import Header from '../Header';
import Sidebar from '../Sidebar';
import { openSidebar, closeSidebar } from '../../actions/navigation';
import s from './Layout.module.scss';
import CanvasWrap from '../Canvas/CanvasWrap';

//canvas context 의 상태값을 바꿔주는 역할
export const actions={
  CHANGE_STROKE_STYLE:"change_strokeStyle",
  CHANGE_LINE_WIDTH:"change_lineWidth",
  CHANGE_SCALE:"change_scale",
  CHANGE_HISTORY:"change_history",
  CHANGE_MODE : "change_mode",
  CHANGE_BACKGROUND_IMG:"change_background_img",
  CHANGE_SRC:"change_src",
  CHANGE_TO_SAMPLE:"change_to_sample"
}

//canvas 에 그릴때 pen의 모드& canvas의 상태를 설정해주는 변수 
//pen의 모드:1.brush 2.eraser 3.geometry 4.color-picker
export const modes = {
  BRUSH:"brush",ERASER:"eraser",GEOMETRY_CIRCLE:"geometry-circle",
  GEOMETRY_SQUARE :"geometry-square",GEOMETRY_POLYGON:"geometry-polygon",
  COLOR_PICKER:"color-picker",TEXT:"text",UPLOAD:"upload",FILLUP:"fill-up",
}

const InitialState = {
  isSample:false,
  pen:{
    mode:modes.BRUSH,
    lineWidth:4,
    strokeStyle:'#000',
    scaleFactor:1,
    src1:null,
    src2:null,
    src1Scale:1,
    src2Scale:1,
  },
  history:{
    src1History:[],
    src2History:[],
  }
}

export const PenManagerContext = createContext({isSample:InitialState.isSample,pen:InitialState.pen
  ,history:InitialState.history
  ,penStateDispatch:()=>{}});

const penReducer = (state,action)=>{
  const type = action.type;
  switch(type){
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
      const bs64 = action.bs64;
      let offset = action?.offset;
      let history = {...state.history};
      let src1History = history.src1History;
      if(offset&&offset<src1History.length-1){
        src1History=src1History.slice(0,offset+1);
      }
      src1History.push(bs64);
      history = {...state.history,src1History};
      const newPen = {...state.pen,src1:bs64};
      return {...state,pen:newPen,history};
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
      const {index,bs64} = action;
      let history = {...state.history};
      let srcHistory = index===1?history.src1History:history.src2History;
      let src = index===1?{...state.src1}:{...state.src2};
      let offset = action?.offset;
      if(offset&&offset<srcHistory.length-1){
        srcHistory=srcHistory.slice(0,offset+1);
      }
      src = bs64;
      srcHistory.push(src);
      const pen = index===1?{...state.pen,src1:src}:{...state.pen,src2:src};
      const newHistory = index===1?{...state.history,src1History:srcHistory}:{...state.history,src2History:srcHistory}
      return {...state,pen,history:newHistory};
    }
    case actions.CHANGE_SCALE:{
      const {index,scaleType}=action;
      let pen = {...state.pen};
      let scale = index===1?pen.src1Scale:pen.src2Scale;
      scaleType==='plus' ? scale*=2:scale/=2;
      if(scaleType==='minus'&&scale<1){return{...state};}
      else if(scaleType==='plus'&&scale>16){return {...state};} 
      pen = index===1? {...state.pen,src1Scale:scale}:{...state.pen,src2Scale:scale};
      return {...state,pen}
    }
    case actions.CHANGE_TO_SAMPLE:{
      const {bs64}=action;
      const isSample = !state.isSample;
      const newHistory = {...state.history,src1History:[bs64]};
      const pen = {...state.pen,src1:bs64}
      return {...state,isSample,history:newHistory,pen};
    }
    default:{
      return{...state}
    }
  }
}

const Layout =()=> {
  const [PenState,penStateDispatch]=useReducer(penReducer,InitialState);
  const [entireWidth,setEntireWidth]=useState(window.innerWidth);
  const [entireHeight,setEntireHeight] = useState(window.innerHeight);
  const wrapRef = useRef(null);
  const {
    sidebarOpened,
    sidebarPosition,
    sidebarVisibility,
  }= useSelector(state=>state.navigation);
  const penData = useMemo(()=>{
    return {isSample:PenState.isSample,penStateDispatch:penStateDispatch,pen:PenState.pen,history:PenState.history}
  },[PenState])

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
      <div className={s.wrap} style={{width:entireWidth*0.971,height:entireHeight}}>
      <PenManagerContext.Provider value={penData}>
        <Header headerWidth={entireWidth*0.971} />
          <Hammer >
            <main className={s.content} style={{width:entireWidth*0.971}}>
              <Sidebar sidebarWidth={parseFloat(entireWidth*0.03)}/>
              <CanvasWrap canvasWrapWidth={entireWidth*0.971} canvasWrapHeight={entireHeight*0.936}/>
              <TableStatic/>
              {/* <TransitionGroup>
                <CSSTransition
                  key={props.location.key}
                  classNames="fade"
                  timeout={200}
                >
                  <BrowserRouter>
                    <Switch>
                      <Route path="/app/main" exact render={() => <Redirect to="/app/tables" />} />
                      <Route path="/app/tables" exact component={TableStatic} />
                    </Switch>
                  </BrowserRouter> 
                </CSSTransition>
              </TransitionGroup> */}
            </main>
          </Hammer>
        </PenManagerContext.Provider>
      </div>
    </div>
  );
  
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
    sidebarPosition: store.navigation.sidebarPosition,
    sidebarVisibility: store.navigation.sidebarVisibility,
  };
}

export default withRouter(Layout);

//export default withRouter(connect(mapStateToProps)(Layout));
