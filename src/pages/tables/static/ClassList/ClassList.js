import React,{useState,memo, useEffect,useRef} from 'react';
import { 
    FormGroup,
    Input,
    DropdownMenu,
    DropdownItem,
    Nav,
    NavItem,
    ButtonGroup,
    Button,
    Label,
} from 'reactstrap';
import s from './ClassList.module.scss';
import SingleClass from './SingleClass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus,faTrash} from '@fortawesome/free-solid-svg-icons';
const ClassList = memo(()=>{

    const [classListArr,setClassListArr] = useState([]);
    const typeClassNameRef = useRef(null);
    const colorSelectRef = useRef(null);
    
    useEffect(()=>{
        console.log("Class List");
    },[]);

    const addClass = (classObj)=>{
        setClassListArr({...classListArr,classObj});
    }

    const onClickAddClassBtn=(event)=>{
        event.preventDefault();
        const newClassName = typeClassNameRef.current.value;
        const newColorSelected = colorSelectRef.current.value;
        const obj = {newClassName,newColorSelected};
        console.log(obj);
        //addClass(obj);
    }
    return(
        <Nav className={`${s.dropdownMenu}`}>
            <NavItem className={s.ClassComponent}>
                <Input style={{width:'70px',height:'43.5px'}} ref={colorSelectRef} className="selectClassColor" type={"select"}>
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
                <Input style={{width:'130px',height:'43.5px'}} ref={typeClassNameRef} type="text" className="typeClassName" placeholder="type Class Name"/>
                <Button style={{width:'65px',height:'43.5px'}} id="addClassBtn" onClick={onClickAddClassBtn}>
                    <FontAwesomeIcon icon={faPlus}/>
                </Button>
            </NavItem>
            
            <NavItem className={s.ClassComponent}>
                <SingleClass classTag={'plastic'} color={"#eb3a34"}/>
            </NavItem>
            <NavItem className={s.ClassComponent}>
                <SingleClass classTag={'plastic'} color={"#eb3a34"}/>
            </NavItem>
            <NavItem className={s.ClassComponent}>
                <SingleClass classTag={'plastic'} color={"#eb3a34"}/>
            </NavItem>
            <NavItem className={s.ClassComponent}>
                <SingleClass classTag={'plastic'} color={"#eb3a34"}/>
            </NavItem>
            
        </Nav>     
    )
})

export default ClassList;

