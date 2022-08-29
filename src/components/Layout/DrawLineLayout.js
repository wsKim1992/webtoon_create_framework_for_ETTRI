import React, { useEffect, memo, createContext, useReducer, useMemo } from 'react';
import styled from 'styled-components';
import backgroundImage from '../../public/images/background_image.jpg';
import DrawlineInputBanner from '../DrawLineInputBanner';
import DrawlineOutputBanner from '../DrawLineOutputBanner';
import DrawLineCanvasBox from '../DrawLineCanvasWrapper';
import {useSelector,useDispatch} from "react-redux";
import {INIT_CALL_DRAWLINE_API} from '../../reducers/callAPIInDrawLinePage'
const EntireContainer = styled.div`
    width:100%;height:100%;
    background-color:#000;
    background-image:linear-gradient(259deg, rgba(255,255,255,0.3),rgba(0,0,0,0.2)), url(${backgroundImage});
    background-repeat:no-repeat;
    background-size:cover;
`;

const EntireWrapper = styled.div`
    
    width:calc(100% - 100px);height:100%;
    margin:0 auto;
    display:flex;
    #title{
        display:none;
    }
    .input-image-banner-container{
        width:255px;height:100%;
        background-color:rgba(0,0,0,0.55);
        .input-image-banner-wrapper{
            width:100%;height:100%;
            padding:20px;box-sizing:border-box;
            overflow-y:scroll;
            -ms-overflow-style:none;
            scrollbar-width:none;
            &::-webkit-scrollbar{
                display:none;
            }
            .input-image-banner-box{
                width:100%;height:100%;
                .single-image-wrapper{
                    width:100%;height:auto;
                    margin-bottom: 20px;
                    img{
                        display:block;
                        width:100%;height:auto;
                        object-fit:contain;
                    }
                    &:hover{
                        border:5.5px solid #669DFD;
                    }
                    &.on{
                        border:5.5px solid #669DFD;
                    }
                }
            }
        }
    }
    .show-image-container{
        width:calc(100% - 510px);height:100%;
        .show-image-wrapper{
            width:100%;height:100%;
            .title{
                height:55.5px;
                line-height:55.5px;
                text-align:center;
                font-size:35.5px;
                font-weight:bold;
                color:#fff;
            }
            .image-box{
                width:100%;height:calc(100% - 55.5px);
            }
        }
    }
    .output-image-banner-contain{
        width:255px;height:100%;
        background-color:rgba(0,0,0,0.55);
        .output-image-banner-wrapper{
            width:100%;height:100%;
            padding:20px;box-sizing:border-box;
            overflow-y:scroll;
            -ms-overflow-style:none;
            scrollbar-width:none;
            &::-webkit-scrollbar{
                display:none;
            }
            .output-image-banner-box{
                width:100%;height:100%;
                .single-image-wrapper{
                    width:100%;height:auto;
                    margin-bottom: 20px;
                    &:hover{
                        border:5.5px solid #669DFD;
                    }
                    &.on{
                        border:5.5px solid #669DFD;
                    }
                    img{
                        display:block;
                        width:100%;height:auto;
                        object-fit:contain;
                    }
                    
                }
            }
            
        }
    }
    
    @media screen and (max-width:1390px){
        width:100%;
        margin:none;
    }
    @media screen and (max-width:1270px){
        #title{
            display:block;
            height:35.5px;
            line-height:35.5px;
            text-align:center;
            font-size:var(--main-title);
            font-weight:bold;
            color:#fff;
        }
        flex-direction:column;
        .input-image-banner-container{
            width:100%;height:155px;
            .input-image-banner-wrapper{
                width:100%;height:100%;
                padding:10px;
                overflow-y:none;
                overflow-x:scroll;
                .input-image-banner-box{
                    width:100%;height:100%;
                    display:flex;flex-direction:row;
                    .single-image-wrapper{
                        width:auto;height:100%;
                        margin:0 10.5px;
                        img{
                            display:block;
                            width:auto;height:100%;
                            object-fit:contain;
                        }
                    }
                }
            }
        }
        .show-image-container{
            width:100%;height:calc(100% - 310px);
            .show-image-wrapper{
                width: 49.5%;
                height: 100%;
                margin: 0 auto;
                .title{
                    display:none
                }
                .image-box{
                    width:100%;height:100%;
                }
            }
        }
        .output-image-banner-contain{
            width:100%;height:155px;
            .output-image-banner-wrapper{
                width:100%;height:100%;
                padding:10px;
                overflow-y:none;
                overflow-x:scroll;
                display:flex;flex-direction:row;
                .output-image-banner-box{
                    display:flex;flex-direction:row;
                    .single-image-wrapper{
                        width:auto;height:100%;
                        margin:0 10.5px;
                        img{
                            display:block;
                            width:auto;height:100%;
                            object-fit:contain;
                        }
                    }
                }
                
            }
        }
    }
    @media screen and (max-width:940px){
        width:100%;
        flex-direction:column;
        .input-image-banner-container{
            width:100%;    height: 105px;
            .input-image-banner-wrapper{
                width:100%;height:100%;
                padding:10px;
                overflow-y:none;
                overflow-x:scroll;
                .input-image-banner-box{
                    width:100%;height:100%;
                    display:flex;flex-direction:row;
                    .single-image-wrapper{
                        width:auto;height:100%;
                        margin:0 10.5px;
                        img{
                            display:block;
                            width:auto;height:100%;
                            object-fit:contain;
                        }
                    }
                }
            }
        }
        .show-image-container{
            width:100%;height:calc(100% - 310px);
            .show-image-wrapper{
                width: 70%;
                height: 100%;
                margin: 0 auto;
                .title{
                    display:none
                }
                .image-box{
                    width:100%;height:100%;
                }
            }
        }
        .output-image-banner-contain{
            width:100%;height:105px;
            .output-image-banner-wrapper{
                width:100%;height:100%;
                padding:10px;
                overflow-y:none;
                overflow-x:scroll;
                display:flex;flex-direction:row;
                .output-image-banner-box{
                    display:flex;flex-direction:row;
                    .single-image-wrapper{
                        width:auto;height:100%;
                        margin:0 10.5px;
                        
                    }
                }
                
            }
        }
    }
    @media screen and (max-width:640px){
        #title{
            height: 45.5px;
            line-height: 45.5px;
            font-size: 30px;
            margin-bottom: 20.5px;
        }
        justify-content:center;
        .input-image-banner-container{
            width:100%;    height: 55px;
            .input-image-banner-wrapper{
                padding:2.5px;
                .input-image-banner-box{
                    width:100%;height:100%;
                    display:flex;flex-direction:row;
                    .single-image-wrapper{
                        width:auto;height:100%;
                        margin:0 5.5px;
                        &:hover{
                            border:none;
                        }
                        &.on{
                            border:1.5px solid #669DFD;
                        }
                    }
                }
            }
        }
        .show-image-container{
            width:100%;height:calc(100% - 245px);
            .show-image-wrapper{
                width: 100%;
                height: 100%;
                margin: 0 auto;
                .title{
                    display:none
                }
                .image-box{
                    width: 95%;
                    margin: 0 auto;
                    height:calc(100% - 55.5px);
                }
            }
        }
        .output-image-banner-contain{
            width:100%;height:55px;
            .output-image-banner-wrapper{
                width:100%;height:100%;
                padding:2.5px;
                .output-image-banner-box{
                    .single-image-wrapper{
                        margin:0 5.5px;
                        &:hover{
                            border:none;
                        }
                        &.on{
                            border:1.5px solid #669DFD;
                        }
                    }
                }
                
            }
        }
    }
    @media screen and (max-width:400px){
        width:100%;
        #title{
            height: 35.5px;
            line-height: 35.5px;
            font-size: 19.5px;
            margin-bottom: 15.5px;
        }
        justify-content:space-evenly;
        .input-image-banner-container{
            width:100%;    height: 55px;
            .input-image-banner-wrapper{
                .input-image-banner-box{
                    width:100%;height:100%;
                    display:flex;flex-direction:row;
                    .single-image-wrapper{
                        width:auto;height:100%;
                        margin:0 5.5px;
                    }
                }
            }
        }
        .show-image-container{
            width:100%;height:calc(100% - 155px);
            .show-image-wrapper{
                width: 100%;
                height: 100%;
                margin: 0 auto;
                .title{
                    display:none
                }
                .image-box{
                    margin:0 auto;
                    width:90%;height:100%;
                }
            }
        }
        .output-image-banner-contain{
            width:100%;height:55px;
            .output-image-banner-wrapper{
                width:100%;height:100%;
                .output-image-banner-box{
                    .single-image-wrapper{
                        margin:0 5.5px;
                    }
                }
                
            }
        }
    }
`;

export const findElement = (element,findCondition,endCondition)=>{
    const flag = element.tagName.toUpperCase()===findCondition||element.classList.contains(findCondition);
    if(flag){
        return element;
    }else{
        const endFlag = element.tagName.toUpperCase()===endCondition
            ||element.classList.contains(endCondition);
        if(endFlag)return null;
        return findElement(element.parentElement,findCondition,endCondition);
    }
}

export const convertIntoBase64WithMedia = (obj,width,height)=>{
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = obj.width;
    tempCanvas.height = obj.height;
    
    tempCanvas.getContext('2d').drawImage(obj,0,0,tempCanvas.width,tempCanvas.height);
    return tempCanvas.toDataURL('image/png');
}

export const convertIntoBase64=(src,width,height)=>{
    return new Promise((resolve,reject)=>{
        let tempImage = new Image();
        tempImage.src = src;
        tempImage.onload=()=>{
            const widthOrHeight = tempImage.width>tempImage.height;
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = width;
            tempCanvas.height= height;
            const widthInDraw = widthOrHeight?tempCanvas.width:parseFloat(tempImage.width/tempImage.height)*tempCanvas.width;
            const heightInDraw = widthOrHeight?parseFloat(tempImage.height/tempImage.width)*tempCanvas.height : tempCanvas.height;
            const offsetLength = widthOrHeight?(tempCanvas.height-heightInDraw)/2:(tempCanvas.width-widthInDraw)/2;
            if(widthOrHeight){tempCanvas.getContext('2d').drawImage(tempImage,0,offsetLength,widthInDraw,heightInDraw);}
            else{tempCanvas.getContext('2d').drawImage(tempImage,offsetLength,0,widthInDraw,heightInDraw);}
            resolve(tempCanvas.toDataURL('image/jpeg'));
        }
    })
}

export const convertIntoFile = (bs64)=>{
    const imageData = bs64.split(",")[1];
    const binaryObj = window.atob(imageData);
    const binaryArr = [];
    for(let i=0;i<binaryObj.length;i++){
        binaryArr.push(binaryObj.charCodeAt(i));
    }

    let byteArr = new Uint8Array(binaryArr);
    return new Blob([byteArr],{'type':'image/jpeg'});
}

export const UPLOAD_PERSON_IMAGE = 'UPLOAD_PERSONAL_IMAGE';
export const UPLOAD_CARTOONIZED_IMAGE = 'UPLOAD_CARTOONIZED_IMAGE';
export const CHANGE_INPUT_IMAGE = 'CHANGE_INPUT_IMAGE';
export const CHANGE_OUTPUT_IMAGE = 'CHANGE_OUTPUT_IMAGE';
export const INIT_STATE = 'INIT_STATE';

export const api_result_type = {
    REMOVE_BACKGROUND: 'REMOVE_BACKGROUND',
    CONVERT_INTO_LINE: 'CONVERT_INTO_LINE',
    CARTOONIZE: 'CARTOONIZE',
    COLORIZE: 'COLORIZE',
    CHANGE_FACIAL_EXPRESSION: 'CHANGE_FACIAL_EXPRESSION'
}

export const src_type_obj = {
    BS64: 'BS64',
    DIR_PATH: 'DIR_PATH'
}

export const img_type_obj={
    PERSON_IMAGE:'PERSON_IMAGE',
    CARTOONIZED_IMAGE:'CARTOONIZED_IMAGE'
}

const initialState = {
    input_image_src: null,
    input_image_src_type:null,
    input_image_type: null,//person_image,cartoonized_image,
    input_image_idx:-1,
    person_image_list: [],
    output_image_src: null,
    cartoonize_image_list: [],
}

export const DrawLineContext = createContext({ ...initialState, DrawLineDispatch: () => { } });

const DrawLineReducer = (state, action) => {
    const { type } = action;
    switch (type) {
        case UPLOAD_PERSON_IMAGE: {
            const { src, src_type,img_type } = action;
            const { person_image_list: prev_person_image_list } = state;
            return { 
                ...state, 
                person_image_list: [...prev_person_image_list,{ src, src_type,img_type }],
                input_image_src:src,
                input_image_src_type:src_type,
                input_image_type:img_type,
                input_image_idx:prev_person_image_list.length+3
            };
        }
        case UPLOAD_CARTOONIZED_IMAGE: {
            const { src, src_type,img_type } = action;
            const { cartoonize_image_list: prev_cartoonize_image_list } = state;
            return { ...state, 
                cartoonize_image_list: [ ...prev_cartoonize_image_list,{ src, src_type,img_type }],
                input_image_src:src,
                input_image_src_type:src_type,
                input_image_type:img_type,
                input_image_idx:prev_cartoonize_image_list.length+3
            };
        }
        case CHANGE_INPUT_IMAGE: {
            const { input_image_src, input_image_src_type,input_image_type,input_image_idx } = action;
            console.log(input_image_type);
            return { ...state, output_image_src: null,input_image_src,input_image_src_type, input_image_type,input_image_idx };
        }
        case CHANGE_OUTPUT_IMAGE: {
            const { cartoonize_image_list: prev_cartoonize_image_list } = state;
            const { output_image_src, output_image_type } = action;
            switch (output_image_type) {
                case api_result_type.REMOVE_BACKGROUND: {
                    return { ...state, output_image_src };
                }
                case api_result_type.CONVERT_INTO_LINE: {
                    return { ...state, output_image_src };
                }
                case api_result_type.CHANGE_FACIAL_EXPRESSION: {
                    return { ...state, output_image_src };
                }
                case api_result_type.CARTOONIZE: {
                    return {
                        ...state,
                        output_image_src,
                        cartoonize_image_list: [
                            ...prev_cartoonize_image_list,
                            {
                                src: output_image_src,
                                src_type: src_type_obj.DIR_PATH,
                                img_type:img_type_obj.CARTOONIZED_IMAGE

                            },
                        ],
                        input_image_src:output_image_src,
                        input_image_src_type:src_type_obj.DIR_PATH,
                        input_image_type:img_type_obj.CARTOONIZED_IMAGE,
                        input_image_idx:prev_cartoonize_image_list.length+3,
                    };
                }
                case api_result_type.COLORIZE: {
                    return {
                        ...state,
                        output_image_src,
                        cartoonize_image_list: [
                            ...prev_cartoonize_image_list,
                            {
                                src: output_image_src,
                                src_type: src_type_obj.DIR_PATH,
                                img_type:img_type_obj.CARTOONIZED_IMAGE
                            },
                        ],
                        input_image_src:output_image_src,
                        input_image_src_type:src_type_obj.DIR_PATH,
                        input_image_type:img_type_obj.CARTOONIZED_IMAGE,
                        input_image_idx:prev_cartoonize_image_list.length+3,
                    };
                }
            }

        }
        case INIT_STATE: {
            console.log(INIT_STATE);
            return { ...initialState };
        }
    }
}

const DrawLineLayout = memo(() => {
    const [DrawLineState, DrawLineDispatch] = useReducer(DrawLineReducer, initialState);
    const {
        loadingCallAPI,
        failureCallAPI,
        successCallAPI,
        dataFromAPI,
        api_type
    } = useSelector(state=>state.callAPIInDrawLineReducer);

    const dispatch = useDispatch();
    const DrawLineData = useMemo(() => {
        return {
            ...DrawLineState,
            DrawLineDispatch
        }
    }, [DrawLineState]);

    useEffect(()=>{
        if(!loadingCallAPI&&successCallAPI){
            if(dataFromAPI){
                DrawLineDispatch({
                    type:CHANGE_OUTPUT_IMAGE,
                    output_image_src:dataFromAPI,
                    output_image_type:api_type
                });
            }
            dispatch({type:INIT_CALL_DRAWLINE_API})
        }else if(!loadingCallAPI&&failureCallAPI){
            window.alert("api 요청 에러!");
            dispatch({type:INIT_CALL_DRAWLINE_API})
        }
    },[
        loadingCallAPI,
        failureCallAPI,
        successCallAPI,
        dataFromAPI,
        api_type
    ])

    return (
        <DrawLineContext.Provider value={DrawLineData}>
            <EntireContainer>

                <EntireWrapper>
                    <h1 id="title">이미지로 Toon 생성</h1>
                    <div className="input-image-banner-container">
                        <div className="input-image-banner-wrapper">
                            <DrawlineInputBanner />
                        </div>
                    </div>
                    <div className="show-image-container">
                        <div className="show-image-wrapper">
                            <h1 className="title">이미지로 Toon 생성</h1>
                            <div className="image-box">
                                <DrawLineCanvasBox />
                            </div>
                        </div>
                    </div>
                    <div className="output-image-banner-contain">
                        <div className="output-image-banner-wrapper">
                            <DrawlineOutputBanner />
                        </div>
                    </div>
                </EntireWrapper>
            </EntireContainer>
        </DrawLineContext.Provider>
    )
})

export default DrawLineLayout;
