import React,{useState,useContext,useCallback,useRef,memo,useMemo, useEffect} from 'react';
import {ClassContext,ADDSUBCLASS,DELETESUBCLASS,MODIFYSUBCLASS} from '../Static';
import { Input,Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus,faUndo,faTrash } from '@fortawesome/free-solid-svg-icons';
import s from './ClassList.module.scss';

const SubClass =memo(({keyProp,subClassname,subClassColor,highClass,isOpen})=>{ 
    const [mode,setMode]=useState(isOpen);
    const [color,setColor]=useState('#eb3a34');
    const [highClassName,setHighClassName]=useState(highClass);
    const [subClassName,setSubClassName]=useState('');
    const {dispatch}=useContext(ClassContext);
    
    const isModify=useMemo(()=>{
        if(!mode&&subClassName!==''){
            return true;
        }
        return false;
    },[mode])

    const id = useMemo(()=>{
        return keyProp?keyProp:`${highClass}_${Date.now()}`
    },[mode])
    
    useEffect(()=>{
        console.log(subClassName);
        console.log(color);
        console.log(highClassName);
        if(mode){
            setColor(subClassColor);
            setSubClassName(subClassname);
            setHighClassName(highClass);
        }else{
            const optionsArr=document.querySelector(`#${id}`).children;
            for(let i =0;i<optionsArr.length;i++){
                if(optionsArr[i].value===subClassColor){
                    optionsArr[i].selected=true; break;
                }
            }
        }
    },[mode])
    const onClickAddBtn = ()=>{
        console.log(subClassName);
        if(subClassName===''||subClassName===undefined){
            alert("추가할 class의 이름을 입력해주세요");
            return false;
        }
        if(!isModify){
            const obj = {type:ADDSUBCLASS,key:`_${Date.now()}`,color,nameClass:subClassName,highClassName:highClassName}
            dispatch(obj);
        }else{
            const obj ={type:MODIFYSUBCLASS,key:keyProp,color,nameClass:subClassName};
            dispatch(obj);
        }
    }
    const onClickDelete=()=>{
        dispatch({type:DELETESUBCLASS,keyProp});
    }
    const onClickChangeMode =()=>{
        setMode(!mode);
    }
    const onChangeColor = (e)=>{
        setColor(e.target.value);
    }

    const onChangeSubClassName = (e)=>{
        console.log(e.target.value);
        setSubClassName(e.target.value);
    }

    return (
        <div className={s.SubClass}>
            <p style={{width:'100%',height:'100%',display:'flex',flexDirection: 'row',
                justifyContent:'space-around',alignItems:'center'}}>
                {
                    !mode?
                    (<>
                        <Input id={id} style={{padding:'0px',width:'60px',height:'25.5px'}} onChange={onChangeColor} className="selectClassColor" type={"select"}>
                            <option value={"#eb3a34"} style={{backgroundColor:"#eb3a34"}}>red</option>
                            <option value={"#e65d0e"} style={{backgroundColor:"#e65d0e"}}>orange</option>
                            <option value={"#edc307"} style={{backgroundColor:"#edc307"}}>yellow</option>
                            <option value={"#a0ed07"} style={{backgroundColor:"#a0ed07"}}>light-green</option>
                            <option value={"#07f74b"} style={{backgroundColor:"#07f74b"}}>green</option>
                            <option value={"#07dff7"} style={{backgroundColor:"#07dff7"}}>light-blue</option>
                            <option value={"#0717f7"} style={{backgroundColor:"#0717f7"}}>blue</option>
                            <option value={"#9309e3"} style={{backgroundColor:"#9309e3"}}>purple</option>
                            <option value={"#f705e7"} style={{backgroundColor:"#f705e7"}}>pink</option>
                            <option value={"#f70279"} style={{backgroundColor:"#f70279"}}>hot-pink</option>
                        </Input>   
                        <Input style={{width:'110px',height:'25.5px',fontSize:'10.5px'}} onChange={onChangeSubClassName} type="text" className="typeClassName" value={subClassName}/>
                        <Button style={{border:'none',backgroundColor:'#040620',width:'25.5px',height:'25.5px',display:'flex',flexDirection: 'row',
                        justifyContent:'space-around',alignItems:'center'}} onClick={onClickAddBtn}>
                            {<FontAwesomeIcon icon={faPlus}/>}
                        </Button>
                        {isModify&&
                        <Button style={{backgroundColor:'#040620',width:'25.5px',height:'25.5px',display:'flex',flexDirection: 'row',
                        justifyContent:'space-around',alignItems:'center'}} onClick={onClickChangeMode}>
                            {<FontAwesomeIcon icon={faUndo}/>}
                        </Button>}
                    </>):
                    (<>
                        <span style={{display:'flex',flexDirection: 'row'
                        ,alignItems:'center',width:'25.5px',height:'25.5px'}}>
                            <Input style={{margin:'0',width:'18.5px',height:'18.5px'}}
                            type="checkbox" id={`${subClassName}_${color}`}/>
                            </span>
                        <span style={{display:'block',margin:'0px',width:'25.5px',height:'25.5px',borderRadius:'15px',backgroundColor:`${color}`}}></span>
                        <span style={{display:'block',margin:'0px',width:'70px',height:'25.5px', lineHeight:'30px'}}>{subClassName}</span>
                        <Button style={{border:'none',backgroundColor:'#040620',width:'25.5px',height:'25.5px',display:'flex',flexDirection: 'row',
                        justifyContent:'space-around',alignItems:'center'}} onClick={onClickChangeMode}>
                            {<FontAwesomeIcon icon={faUndo}/>}
                        </Button>
                        <Button style={{border:'none',backgroundColor:'#040620',width:'25.5px',height:'25.5px',display:'flex',flexDirection: 'row',
                        justifyContent:'space-around',alignItems:'center'}} onClick={onClickDelete}>
                            {<FontAwesomeIcon icon={faTrash}/>}
                        </Button>
                    </>)
                }
            </p>
        </div>
    )    
})

export default SubClass;
