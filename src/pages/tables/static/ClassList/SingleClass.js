import React,{useCallback,useMemo,memo,useContext} from "react";
import {
    Dropdown, 
    DropdownToggle, 
    DropdownMenu,
    DropdownItem,
    Input,
    Label,
    Button,
    Nav,
    NavItem
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrash} from '@fortawesome/free-solid-svg-icons';

const SingleClass = memo(({classTag,color})=>{
    
    return(
        <>
            <p style={{margin:'0',width:'40px',height:'45px',
            display:'flex',flexDirection: 'row',
            justifyContent:'space-around',
            alignItems:'center'}}>
                <Input style={{margin:'0',width:'20px',height:'20px'}}
                type="checkbox" id={`${classTag}_${color}`}/>
            </p>
            <Input style={{width:'70px',height:'43.5px'}} type={"select"}>
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
            <p style={{ lineHeight:'43.5px',margin:'0',width:'70px',height:'43.5px'}}>{classTag}</p>
            <Button style={{width:'65px',height:'43.5px'}}>
                <FontAwesomeIcon icon={faTrash}/>
            </Button>
            
        </>
    )
})

export default SingleClass;