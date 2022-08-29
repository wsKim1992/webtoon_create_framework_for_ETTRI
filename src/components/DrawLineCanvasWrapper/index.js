import React,{memo,createContext,useReducer,useMemo, useEffect} from "react";
import styled from "styled-components";
import FunctionBtnWrapper from "./FunctionBtnWrapper";
import ImageWrapper from "./ImageWrapper";

const EntireCanvasBox = styled.div`
    width:100%;height:100%;
    .image-container{
        width:100%;height:calc(100% - 135px);
    }
    .function-btn-container{
        width:100%;
        height:135px;
    }
    @media screen and (max-width:1270px){
        .image-container{
            width:100%;height:calc(100% - 90px);
        }
        .function-btn-container{
            width:100%;
            height:80px;
        }
    }
    @media screen and (max-width:640px){
        .image-container{
            width:100%;height:calc(100% - 100px);
        }
        .function-btn-container{
            width:100%;
            height:50px;
        }
    }
`;

export const SET_WIDTH_AND_HEIGHT = 'SET_WIDTH_AND_HEIGHT';
export const INIT_STATE = 'INIT_STATE';

const initialState = {
    width:null,
    height:null,
    CanvasSizeDispatch:()=>{}
}

export const CanvasSizeContext = createContext({
    ...initialState
})

const reducer = (state,action)=>{
    const {type}=action;
    switch(type){
        case SET_WIDTH_AND_HEIGHT:{
            const {width,height}=action;
            return {...state,width:action.width,height:action.height};
        }
        case INIT_STATE:{
            return {...initialState}
        }
    }
}


const DrawLineCanvasBox = memo(()=>{
    const [CanvasSizeState,CanvasSizeDispatch] = useReducer(reducer,initialState)
    const canvasSizeData = useMemo(()=>{
        return {
            ...CanvasSizeState,
            CanvasSizeDispatch
        }
    },[CanvasSizeState]);
    
    return(
        <CanvasSizeContext.Provider value={canvasSizeData}>
            <EntireCanvasBox>
                <div className="image-container">
                    <ImageWrapper/>
                </div>
                <div className="function-btn-container">
                    <FunctionBtnWrapper/>
                </div>
            </EntireCanvasBox>
        </CanvasSizeContext.Provider>
    )
})

export default DrawLineCanvasBox;