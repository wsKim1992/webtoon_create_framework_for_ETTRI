import React,{useReducer,useEffect} from 'react';
import s from './Sidebar.module.scss';
import {faBrush,faEraser,faFill,faVectorSquare,
    faDrawPolygon,faImage,faArrowCircleLeft,faArrowCircleRight,
    faBars,faPalette, faEyeDropper,faCircle,faFont,faSearch,faBold} from "@fortawesome/free-solid-svg-icons";
import ListGroup from "./ListGroup/ListGroup";


const fontIconList = [
    {haveChild:false,fontClass:faBrush,toolName:null,toolType:'brush'},
    {haveChild:false,fontClass:faEyeDropper,toolName:null,toolType:'colorPicker'},
    {haveChild:false,fontClass:faEraser,toolName:null,toolType:'eraser'},
    {haveChild:false,fontClass:faFill,toolName:null,toolType:'fill'},
    {haveChild:false,fontClass:faVectorSquare,toolName:null,toolType:'geometry',shape:'square'},
    {haveChild:false,fontClass:faCircle,toolName:null,toolType:'geometry',shape:'circle'},
    {haveChild:false,fontClass:faDrawPolygon,toolName:null,toolType:'geometry',shape:'polygon'},
    {haveChild:false,fontClass:faImage,toolName:null,toolType:'upload'},
    {haveChild:true,fontClass:faPalette,toolName:null,toolType:'pallete'},
    {haveChild:true,fontClass:faBold,toolName:null,toolType:'bolderness'},
    {haveChild:false,fontClass:faSearch,toolName:null,toolType:'enlarge'},
    {haveChild:false,fontClass:faFont,toolName:null,toolType:'text'},
    {haveChild:true,fontClass:faBars,toolName:null,toolType:'historyList',fontClassList:[faArrowCircleLeft,faArrowCircleRight]},
]

const iconListReducer=(state,action)=>{
    const Type = action.type;
    switch (Type){
        case 'selected':{

            
        };
        case 'deselected':{

        };
        default:return {...state} 
    }
}

const Sidebar = ()=> {
    const [IconListState,IconListStateDispatch]=useReducer(iconListReducer,fontIconList);
    return (
        <nav className={s.root}>
            <header className={s.logo}>
                <span className="fw-bold"></span>
            </header>
            <ul className={s.nav}>
                {
                    fontIconList.map((v,key)=>(
                        <ListGroup key={`${v.fontClass}_${key}`} toolInfo={v} id={key}/>
                    ))
                }
            </ul>
            
        </nav>
    );
    
}


export default Sidebar;
