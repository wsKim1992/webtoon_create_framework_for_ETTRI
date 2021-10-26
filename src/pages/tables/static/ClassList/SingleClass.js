import React,{useMemo,useState,memo, useEffect,useContext} from "react";
import {
    Input,
    Button,
    Collapse,
    Navbar
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrash,faPlus,faCaretSquareDown,faCaretSquareUp} from '@fortawesome/free-solid-svg-icons';
import { ClassContext,DELETEHIGHCLASS,ADDSUBCLASS } from "../Static";
import SubClass from "./SubClass";
import s from './ClassList.module.scss';

const SingleClass = memo(({classTag})=>{
    const [toggleSubClass,setToggleSubClass] = useState(false)
    const {dispatch,classArr}=useContext(ClassContext);
    const subClassList = useMemo(()=>{
        const subClassArr = [];
        Object.keys(classArr).forEach((key)=>{
          
            if(classArr[key].highClassName===classTag){
                subClassArr.push({...classArr[key],'keyProp':key})}
        })
        return subClassArr;
    },[classArr])
    const onClickDelete = (e)=>{
        e.preventDefault();
        dispatch({type:DELETEHIGHCLASS,nameClass:classTag})
    }

    const onClickAddSubClass=(e)=>{
        e.preventDefault();
        setToggleSubClass(!toggleSubClass);
    }

    const onClickToggleSubClass=(e)=>{
        e.preventDefault();
        setToggleSubClass(!toggleSubClass);
    }

    return(
        <>
            <div className={s.ClassComponent}>
                <p style={{margin:'0',width:'40px',height:'45px',
                display:'flex',flexDirection: 'row',
                justifyContent:'space-around',
                alignItems:'center'}}>
                    <Input style={{margin:'0',width:'20px',height:'20px'}}
                    type="checkbox" id={`${classTag}`}/>
                </p> 
                <p style={{margin:'0',width:'40px',height:'45px',
                display:'flex',flexDirection:'row',justifyContent:'space-around',
                alignItems:'center'}}>
                    <Button onClick={onClickToggleSubClass} style={{backgroundColor:'#040620',width:'30px',height:'30px',border:'none',display:'flex',
                        flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        {toggleSubClass?<FontAwesomeIcon icon={faCaretSquareUp}/>:<FontAwesomeIcon icon={faCaretSquareDown}/>}
                    </Button>
                </p>
                <p style={{ lineHeight:'43.5px',margin:'0',width:'110px',height:'43.5px'}}>{classTag}</p>
                <Button onClick={onClickDelete} style={{border:'none',backgroundColor:'#040620',width:'30px',height:'30px',display:'flex',
                    flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
                <Button onClick={onClickAddSubClass} style={{border:'none',backgroundColor:'#040620',width:'30px',height:'30px',display:'flex',
                    flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                    <FontAwesomeIcon icon={faPlus}/>
                </Button>
            </div>
            {
                toggleSubClass
                &&
                <>
                    <SubClass highClass={classTag} isOpen={false} />
                    <div className={s.SubClassCollapse}>
                        {
                            subClassList.map((v,i)=>(
                                v&&
                                <SubClass key={`${v.keyProp}`} keyProp={`${v.keyProp}`} subClassColor={v.color} subClassname={v.nameClass} highClass={v.highClassName} isOpen={true}/>
                            ))
                        }
                    </div>
                </>
            }
        </>
    )
})



export default SingleClass;