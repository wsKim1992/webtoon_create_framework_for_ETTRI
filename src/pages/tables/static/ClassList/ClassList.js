import React,{useState,memo, useEffect,useContext,useCallback,useRef} from 'react';
import { 
    Input,
    Nav,
    NavItem,
    Button
} from 'reactstrap';
import s from './ClassList.module.scss';
import SingleClass from './SingleClass';
import AddClass from './AddClass';
import { ClassContext } from '../Static';

const ClassList = memo(()=>{
    const {highClass}=useContext(ClassContext);
    return(
        <Nav className={`${s.dropdownMenu}`}>
            <NavItem className={s.ClassComponent}>
                <AddClass/>
            </NavItem>
            {
                Object.keys(highClass).map((v,idx)=>{
                    if(v){
                        return (
                            <NavItem key={`${v}_${idx}_${Date.now()}`}>
                                <SingleClass key={`${v}_${idx}`} classTag={v} />
                            </NavItem>)
                    }
                })
            }
        </Nav>     
    )
})

export default ClassList;

