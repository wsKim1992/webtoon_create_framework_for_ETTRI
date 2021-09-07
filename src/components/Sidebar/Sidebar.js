import React,{useReducer,useMemo,createContext,memo,useContext} from 'react';
import s from './Sidebar.module.scss';
import {faBrush,faEraser,faFill,faVectorSquare,
    faDrawPolygon,faSquare,faImage,faArrowCircleLeft,faArrowCircleRight,
    faBars,faPalette, faEyeDropper,faCircle,faFont,faSearch,faBold} from "@fortawesome/free-solid-svg-icons";
import ListGroup from "./ListGroup/ListGroup";
import {actions,modes,PenManagerContext} from '../Layout/Layout';

export const ListManagerContext = createContext({dispatch:()=>{},currentSelectedId:-1}); 
export const SELECTED ='selected'
export const DESELECTED = 'deselected';   
export const MAX_BOLDNESS = 20;

const iconListReducer=(state,action)=>{
    const Type = action.type;
    switch (Type){
        case SELECTED:{
            const id = action.id;
            const currentSelectedId=state.currentSelectedId;
            const newList = {...state.IconList[id],selected:true};
            const newIconList=[...state.IconList];
            newIconList[id]=newList;
            if(currentSelectedId!==-1){
                const currentSelectedList={...state.IconList[currentSelectedId],selected:false};
                newIconList[currentSelectedId]=currentSelectedList;
            }
            
            return {...state,IconList:newIconList,currentSelectedId:id}
        };
        case DESELECTED:{
            const id = action.id;
            const newList = {...state.IconList[id],selected:false}
            const newIconList = [...state.IconList];
            newIconList[id]=newList;
            return {...state,IconList:newIconList,currentSelectedId:-1};
        }
        default:return {...state} 
    }
}

const Sidebar = memo(()=> {

    /* const onChangeInputFile=(e)=>{
        const file = e.target.files[0];
        if(file.type.match('image/*')){
            let fileReader = new FileReader();
            fileReader.onload=(e)=>{
                penStateDispatch({type:actions.CHANGE_BACKGROUND_IMG,bs64:e.target.result});
            }
            fileReader.readAsDataURL(file)
        }
    } */
    const fontIconList = [
        {haveChild:false,fontClass:faSquare,selected:false,toolType:'brush',actionType:'NO_ACTION'},
        {haveChild:false,fontClass:faBrush,selected:false,toolType:'brush',actionType:actions.CHANGE_MODE,mode:modes.BRUSH},
        {haveChild:false,fontClass:faEyeDropper,selected:false,toolType:'colorPicker',actionType:actions.CHANGE_MODE,mode:modes.COLOR_PICKER},
        {haveChild:false,fontClass:faEraser,selected:false,toolType:'eraser',actionType:actions.CHANGE_MODE,mode:modes.ERASER},
        {haveChild:false,fontClass:faFill,selected:false,toolType:'fill',actionType:actions.CHANGE_MODE,mode:modes.FILLUP},
        {haveChild:false,fontClass:faVectorSquare,selected:false,toolType:'geometry',shape:'square',actionType:actions.CHANGE_MODE,mode:modes.GEOMETRY_SQUARE},
        {haveChild:false,fontClass:faCircle,selected:false,toolType:'geometry',shape:'circle',actionType:actions.CHANGE_MODE,mode:modes.GEOMETRY_CIRCLE},
        {haveChild:false,fontClass:faDrawPolygon,selected:false,toolType:'geometry',shape:'polygon',actionType:actions.CHANGE_MODE,mode:modes.GEOMETRY_POLYGON},
        /* {haveChild:false,fontClass:faImage,selected:false,toolType:'upload',func:onChangeInputFile}, */
        {haveChild:true,fontClass:faPalette,selected:false,toolType:'pallete',actionType:actions.CHANGE_STROKE_STYLE,actImmediatly:false},
        {haveChild:true,fontClass:faBold,selected:false,toolType:'bolderness',actionType:actions.CHANGE_LINE_WIDTH,actImmediatly:false},
        {haveChild:false,fontClass:faSearch,selected:false,toolType:'enlarge',actionType:actions.CHANGE_SCALE,actImmediatly:false},
        {haveChild:false,fontClass:faFont,selected:false,toolType:'text',actionType:actions.CHANGE_MODE,mode:modes.TEXT},
        {haveChild:true,fontClass:faBars,selected:false,toolType:'historyList',fontClassList:[faArrowCircleLeft,faArrowCircleRight],actionType:actions.CHANGE_HISTORY,actImmediatly:false},
    ]

    const initialState = {IconList:fontIconList};
    const [state,IconListDispatch]=useReducer(iconListReducer,initialState);
    const value = useMemo(()=>({dispatch:IconListDispatch}),[]);
    return (
        <nav className={s.root}>
            <header className={s.logo}>
                <span className="fw-bold"></span>
            </header>
            <ListManagerContext.Provider value={value}>
                <ul className={s.nav}>
                    {
                        state.IconList.map((v,key)=>(
                            <ListGroup key={`${v.fontClass}_${key}`} toolInfo={v} id={key}/>
                        ))
                    }
                </ul>
            </ListManagerContext.Provider>
        </nav>
    );
})


export default Sidebar;
