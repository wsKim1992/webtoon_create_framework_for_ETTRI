import React ,{useState,memo, useContext, useMemo, useCallback,useRef} from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowCircleLeft,faArrowCircleRight} from "@fortawesome/free-solid-svg-icons";
import s from './ListGroup.module.scss';
import { Collapse } from 'reactstrap';
import Pallete from './Pallete/Pallete'
import ControllBold from './ControllBold/ControllBold';
import { ListManagerContext,SELECTED,DESELECTED } from '../Sidebar';
import { PenManagerContext,actions } from '../../Layout/Layout'; 

const ListGroup = memo(({toolInfo,color,id})=>{
    /* const [isCollapse,setIsCollapse]=useState(false); */
    const {haveChild} = toolInfo;
    const {fontClass,toolType,selected,actionType}=toolInfo;
    const actImmediatly = toolInfo?.actImmediatly;
    const {dispatch}=useContext(ListManagerContext)
    const {penStateDispatch}=useContext(PenManagerContext);
    const mode = toolInfo?.mode;
    const isCollapse = useMemo(()=>{
        return haveChild&&selected},
    [selected]);

    const onClickList = useCallback(()=>{
        let evtType = selected?DESELECTED:SELECTED;
        if(toolType==='history'){evtType='history_selected';}
        else if(color){
            evtType='color_selected';
        }
        dispatch({type:evtType,id});
        if(!haveChild&&actImmediatly===undefined){
            console.log(mode);
            penStateDispatch({type:actionType,mode});
        }else{
            if(actImmediatly){
                switch(actionType){
                    case actions.CHANGE_STROKE_STYLE:{
                        penStateDispatch({type:actionType,strokeStyle:color})
                        break;
                    }
                    case actions.CHANGE_HISTORY:{
                        const isBack=fontClass===faArrowCircleLeft?true:false;
                        break;
                    }
                    default:{break;}
                }
            }
        }

    },[selected])

    const AtagClassName = useMemo(()=>{
        return selected?s.selected:'';
    },[selected])

    const renderFontAwesomeIcon = useCallback(()=>{
        return toolType==='upload'?
        (
            <>
                <input id="imgUpload" onChange={toolInfo.func} type="file" style={{display:'none'}}/>
                <label htmlFor="imgUpload" style={{width:25,height:25,margin:0}}>
                    <FontAwesomeIcon className={s.icon} icon={fontClass}/>
                </label>
            </>
        )
        :
        (<FontAwesomeIcon className={s.icon} icon={fontClass}/>)
    },[])

    return (
        <React.Fragment>
            <li className={[s.headerLink].join(' ')} onClick={onClickList}>
                <a className={AtagClassName} style={ color&&{color:color}}>
                    {renderFontAwesomeIcon()}
                </a>
            </li>
            {
                haveChild
                &&
                toolType==='historyList'
                &&
                <Collapse className={s.panel} isOpen={isCollapse}>
                    <ul>
                        {
                            toolInfo.fontClassList
                            &&
                            toolInfo.fontClassList.map((value,key)=>(
                                <ListGroup key={key} toolInfo={{actImmediatly:true,actionType:actionType,haveChild:false,fontClass:value,toolType:'history'}} />
                            ))
                        }
                    </ul>
                </Collapse>
            }
            {
                haveChild
                &&
                toolType==='pallete'
                &&
                <Collapse className={s.color_picker_panel} isOpen={isCollapse}>
                    <Pallete actionType={actionType}/>
                </Collapse>
            }
            {
                haveChild
                &&
                toolType==='bolderness'
                &&
                <Collapse className={s.ControllBold_wrap} isOpen={isCollapse}>
                    <ControllBold basicBoldness={4} actionType={actionType}/>
                </Collapse>
            }
        </React.Fragment>
    )
})

ListGroup.propTypes={
    toolInfo:PropTypes.object.isRequired,
    haveChild:PropTypes.bool,
    color:PropTypes.string,
    id:PropTypes.number
}


export default ListGroup;