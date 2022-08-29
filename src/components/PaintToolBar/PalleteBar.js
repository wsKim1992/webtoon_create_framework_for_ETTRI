import React,{memo,useState,useCallback,useContext, useEffect} from "react";
import styled from "styled-components";
import 'antd/dist/antd.css';
import { ChromePicker } from "react-color";
import {CHANGE_COLOR,PaintStateContext,findElement} from '../Layout/PaintLayout';

const PalleteBarComponent = styled.div`
    width:100%;height:100%;
    .pallete-component-container{
        width:100%;height:auto;
        .pallete-component-wrapper{
            width:100%;height:auto;
            padding:10px;box-sizing:border-box;
            display:flex;
            flex-wrap:wrap;
            flex-direction:row;
            align-items:center;
            justify-content:left;
            .color{
                width:27px;height:27px;
                border-radius:100%;
                box-sizing:border-box;
                padding:2px;
                margin:2.5px;
                cursor:pointer;
                &.on{
                    padding:0px;
                    border:2.5px solid #669DFD;
                }
            }
        }
    }
    .chrome-picker{
        width:100%;
        margin:17.5px auto;
    }
    .color-picker-title{
        width:100%;height:auto;
        font-size:var(--paint-canvas-func-title);
        font-weight:bold;
        line-height:15px;
        padding:5px 0;
    }
`;


const PalleteBar = memo(()=>{
    const {PaintStateDispatch,pen}=useContext(PaintStateContext);
    const [sketchPickerColor,setSketchPickerColor] = useState({
        r: "241",
        g: "112",
        b: "19",
        a: "1",
    });

    useEffect(()=>{
        setSketchPickerColor(pen.strokeStyle);
    },[pen.strokeStyle]);

    const onChangeColor = useCallback((color)=>{
        PaintStateDispatch({type:CHANGE_COLOR,strokeStyle:color.hex})
    },[]);

    const onClickPallate = useCallback((evt)=>{
        const {target} = evt;
        const endCondition = 'pallete-component-wrapper';
        const findCondition = 'color';
        const element = findElement(target,findCondition,endCondition);
        if(element){
            const {color:strokeStyle} = element.dataset;
            PaintStateDispatch({type:CHANGE_COLOR,strokeStyle});
        }
    })

    return (
        <PalleteBarComponent>
            <h2 className="color-picker-title">팔래트</h2>
            <div className="pallete-component-container">
                <div onClick={onClickPallate} className="pallete-component-wrapper">
                    <p data-color={'#D66064'} className={`${sketchPickerColor==='#D66064'?'color on':'color'}`} style={{backgroundColor:'#D66064'}}></p>
                    <p data-color={'#F2A789'} className={`${sketchPickerColor==='#F2A789'?'color on':'color'}`} style={{backgroundColor:'#F2A789'}}></p>
                    <p data-color={'#FFE29A'} className={`${sketchPickerColor==='#FFE29A'?'color on':'color'}`} style={{backgroundColor:'#FFE29A'}}></p>
                    <p data-color={'#DBC0A2'} className={`${sketchPickerColor==='#DBC0A2'?'color on':'color'}`} style={{backgroundColor:'#DBC0A2'}}></p>
                    <p data-color={'#A0D2F2'} className={`${sketchPickerColor==='#A0D2F2'?'color on':'color'}`} style={{backgroundColor:'#A0D2F2'}}></p>

                    <p data-color={'#CDCDCD'} className={`${sketchPickerColor==='#CDCDCD'?'color on':'color'}`} style={{backgroundColor:'#CDCDCD'}}></p>
                    <p data-color={'#EED7DF'} className={`${sketchPickerColor==='#EED7DF'?'color on':'color'}`} style={{backgroundColor:'#EED7DF'}}></p>
                    <p data-color={'#FFFFFF'} className={`${sketchPickerColor==='#FFFFFF'?'color on':'color'}`} style={{backgroundColor:'#FFFFFF'}}></p>
                    <p data-color={'#B90B0E'} className={`${sketchPickerColor==='#B90B0E'?'color on':'color'}`} style={{backgroundColor:'#B90B0E'}}></p>
                    <p data-color={'#EA402F'} className={`${sketchPickerColor==='#EA402F'?'color on':'color'}`} style={{backgroundColor:'#EA402F'}}></p>

                    <p data-color={'#F4CE2E'} className={`${sketchPickerColor==='#F4CE2E'?'color on':'color'}`} style={{backgroundColor:'#F4CE2E'}}></p>
                    <p data-color={'#86C541'} className={`${sketchPickerColor==='#86C541'?'color on':'color'}`} style={{backgroundColor:'#86C541'}}></p>
                    <p data-color={'#5180D3'} className={`${sketchPickerColor==='#5180D3'?'color on':'color'}`} style={{backgroundColor:'#5180D3'}}></p>
                    <p data-color={'#8589A2'} className={`${sketchPickerColor==='#8589A2'?'color on':'color'}`} style={{backgroundColor:'#8589A2'}}></p>
                    <p data-color={'#FECFD7'} className={`${sketchPickerColor==='#FECFD7'?'color on':'color'}`} style={{backgroundColor:'#FECFD7'}}></p>

                    <p data-color={'#FDEAD9'} className={`${sketchPickerColor==='#FDEAD9'?'color on':'color'}`} style={{backgroundColor:'#FDEAD9'}}></p>
                    <p data-color={'#682220'} className={`${sketchPickerColor==='#682220'?'color on':'color'}`} style={{backgroundColor:'#682220'}}></p>
                    <p data-color={'#B7615C'} className={`${sketchPickerColor==='#B7615C'?'color on':'color'}`} style={{backgroundColor:'#B7615C'}}></p>
                    <p data-color={'#F0B744'} className={`${sketchPickerColor==='#F0B744'?'color on':'color'}`} style={{backgroundColor:'#F0B744'}}></p>
                    <p data-color={'#84CD8D'} className={`${sketchPickerColor==='#84CD8D'?'color on':'color'}`} style={{backgroundColor:'#84CD8D'}}></p>

                    <p data-color={'#555C91'} className={`${sketchPickerColor==='#555C91'?'color on':'color'}`}  style={{backgroundColor:'#555C91'}}></p>
                    <p data-color={'#7A63A4'} className={`${sketchPickerColor==='#7A63A4'?'color on':'color'}`}  style={{backgroundColor:'#7A63A4'}}></p>
                    <p data-color={'#FFB3C5'} className={`${sketchPickerColor==='#FFB3C5'?'color on':'color'}`}  style={{backgroundColor:'#FFB3C5'}}></p>
                    <p data-color={'#FBCFB1'} className={`${sketchPickerColor==='#FBCFB1'?'color on':'color'}`}  style={{backgroundColor:'#FBCFB1'}}></p>
                </div>
            </div>
            <h2 className="color-picker-title">색상 선택</h2>
            <ChromePicker
                onChange={(color)=>onChangeColor(color)}
                color={sketchPickerColor}
                style={{width:'100%'}}
            />
        </PalleteBarComponent>
    )
});

export default PalleteBar;
