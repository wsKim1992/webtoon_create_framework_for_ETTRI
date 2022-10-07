import React,{memo,useState,useCallback,useContext, useEffect} from "react";
import { ChromePicker } from "react-color";
import {CHANGE_COLOR,PaintStateContext} from '../Layout/PaintLayout';
import 'antd/dist/antd.css';
import { useSelector } from "react-redux";

const PaletteComponent = memo(()=>{
    const {loadingCallAPI} = useSelector(state=>state.callAPIPaintReducer)
    const [sketchPickerColor,setSketchPickerColor] = useState({
        r: "241",
        g: "112",
        b: "19",
        a: "1",
    });
    const {PaintStateDispatch,pen}=useContext(PaintStateContext);
    const onChangeColor = useCallback((color)=>{
        if(loadingCallAPI){
            return false;
        }
        PaintStateDispatch({type:CHANGE_COLOR,strokeStyle:color.hex});
    },[PaintStateDispatch,loadingCallAPI]);
    useEffect(()=>{
        setSketchPickerColor(pen.strokeStyle);
    },[pen.strokeStyle]);
    return(
        <div className="color-picker-component">
            <ChromePicker
                onChange={(color)=>onChangeColor(color)}
                color={sketchPickerColor}
                style={{width:'100%'}}
            />
        </div>
    )
})

export default PaletteComponent;