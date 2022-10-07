import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaintBrush, faPalette, faEraser } from "@fortawesome/free-solid-svg-icons";
import { faFaceMehBlank, faFaceSurprise, faFaceMeh, faFaceGrin, faFaceAngry, faFaceSadCry } from '@fortawesome/free-regular-svg-icons';
import { useDispatch } from "react-redux";
import {
    convertIntoBase64, convertIntoFile,
    api_result_type, src_type_obj, DrawLineContext, findElement
} from "../Layout/DrawLineLayout";
import { CanvasSizeContext } from '../DrawLineCanvasWrapper';
import { LOADING_CALL_DRAWLINE_API } from '../../reducers/callAPIInDrawLinePage'
import { img_type_obj, output_type } from '../Layout/DrawLineLayout';
/* import { faCamera } from '@fortawesome/free-solid-svg-icons'; */
const EntireContainer = styled.div`
    width:100%;height:100%;
    display:flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
    position:relative;
    .expression-button-list{
        position:absolute;top:80%;left:50%;
        transform:translateX(-50%);
        width:auto;height:auto;
        padding:10px;
        background-image:linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.85));
        border-radius:4.5px;
        overflow:hidden;
        display:flex;
        justify-content:center;
        .expression-button{
            float:left;
            display:block;
            padding:10.5px;
            font-size:var(--canvas-function-button-icon);
            background:transparent;
            margin:0 10.5px;
            background: transparent;
            box-sizing: border-box;
            border: 1.5px solid #fff;
            border-radius:4.5px;
            color:#fff;
            &:hover{
                background-color:#fff;
                color:#000;
            }
        }
    }
    .box{
        width:auto;
        height:auto;
        margin:0 10.5px;
        border-radius:4.5px;
        background-image:linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.85));
        .function-btn{
            background: transparent;
            box-sizing: border-box;
            border: 1.5px solid #fff;
            padding: 25.5px;
            font-size:var(--canvas-function-button-icon);
            font-weight:bold;
            color:#fff;
            border-radius:4.5px;
            outline: none;
            >span{margin-left:4.5px;}
            &.disable{
                background:#454545;
                color:#fff;
                cursor:none;
                border: none;
                &:hover{
                    background-color:#454545;
                    color:#fff;
                }
            }
            &:hover{
                background-color:#fff;
                color:#000;
            }
        }
    }
    @media screen and (max-height:965px){
        .expression-button-list{
            top: -120%;
        }
    }
    @media screen and (max-width:1270px){
        .box{
            .function-btn{
                padding: 10.5px;
                display:flex;
                flex-direction:column;
                align-items:center;
                >span{margin-top:5.5px;}
            }
        }
        .expression-button-list{
            display:flex;
            flex-direction:row;
            align-items:center;
            justify-contents:space-evenly;
        }
    }
    @media screen and (max-width:1210px){
        .box{
            width:18.5%;
            .function-btn{
                box-sizing:border-box;
                display:block;
                width:100%;
                padding: 10.5px;
                >span{display:none;}
            }
        }
        .expression-button-list{
            .expression-button{
                padding: 5.5px;
                font-size:var(--tablet-canvas-function-button);
            }
        }
    }
    @media screen and (max-width:640px){
        .box{
            .function-btn{
                padding:5.5px;
                font-size:var(--tablet-canvas-function-button);
            }
        }
        .expression-button-list{
            .expression-button{
                padding: 5.5px;
                font-size:var(--tablet-canvas-function-button);
            }
        }
    }

    @media screen and (max-height:450px) and (orientation:landscape){
        .box{
            width:10.5%;
            .function-btn{
                padding:5.5px;
                font-size:10.5px;
            }
        }
    }
`;

const FunctionBtnWrapper = () => {
    const [showExpressionList, setShowExpressionList] = useState(false);
    const { width, height } = useContext(CanvasSizeContext);
    const {
        input_image_src,
        input_image_src_type,
        input_image_type,
        output_image_src,
        output_image_type
    } = useContext(DrawLineContext);
    const dispatch = useDispatch();
    const functionName = {
        [api_result_type.REMOVE_BACKGROUND]: 'image2pen',
        [api_result_type.CONVERT_INTO_LINE]: 'image2pen',
        [api_result_type.COLORIZE]: 'image2pen'
    }

    useEffect(() => {
        if (input_image_type === img_type_obj.PERSON_IMAGE) {
            setShowExpressionList(false);
        } else if (!input_image_src) {
            setShowExpressionList(false);
        }
    }, [input_image_type, input_image_src])

    const onClickContainer = useCallback(async (evt) => {
        if (!input_image_src) {
            if (!output_image_src) return false;
        }
        const input_src = output_image_src ? output_image_src : input_image_src;
        const { target: thisElement } = evt;
        const findCondition = 'box';
        const endCondition = 'function-btn-list-container';
        const element = findElement(thisElement, findCondition, endCondition);
        if (element) {
            const { api_type } = element.dataset;
            console.log(input_image_type);
            if (input_image_type === img_type_obj.CARTOONIZED_IMAGE) {
                if (api_type === api_result_type.CHANGE_FACIAL_EXPRESSION) {
                    setShowExpressionList(prev => !prev);
                    return false;
                }
            } else {
                if(api_type===api_result_type.CHANGE_FACIAL_EXPRESSION){
                    return false;
                }
                let bs64 = input_src;
                if (input_image_src_type === src_type_obj.DIR_PATH) {
                    bs64 = await convertIntoBase64(input_src, width, height);
                }
                const file = convertIntoFile(bs64);
                if (functionName.hasOwnProperty(api_type)) {
                    const formData = new FormData();
                    formData.append('input_image', file);
                    formData.append('function', functionName[api_type]);
                    dispatch({ type: LOADING_CALL_DRAWLINE_API, api_type, data: formData });
                } else if(api_type===api_result_type.CARTOONIZE){
                    const formData = new FormData();
                    formData.append('input_image', file);
                    dispatch({ type: LOADING_CALL_DRAWLINE_API, api_type, data: formData });
                }
            }
        }
    }, [
        input_image_src,
        input_image_src_type,
        input_image_type,
        width, height,
        output_image_src,
    ])

    const onClickExpressionList = useCallback(async (evt) => {
        if (!input_image_src) {
            return false;
        }
        const { target: thisElement } = evt;
        const findCondition = 'expression-button';
        const endCondition = 'expression-button-list';
        const element = findElement(thisElement, findCondition, endCondition);
        if (element) {
            const { expression } = element.dataset;
            let bs64 = input_image_src;
            if (input_image_src_type === src_type_obj.DIR_PATH) {
                bs64 = await convertIntoBase64(input_image_src, width, height);
            }
            const file = convertIntoFile(bs64);
            const formData = new FormData();
            formData.append('input_image', file);
            formData.append('expression_name', expression);
            dispatch({ type: LOADING_CALL_DRAWLINE_API, data: formData, api_type: api_result_type.CHANGE_FACIAL_EXPRESSION })
        }
    }, [
        input_image_src,
        input_image_src_type,
        width, height,
        output_image_src
    ])

    return (
        <EntireContainer onClick={onClickContainer} className="function-btn-list-container">
            {
                (showExpressionList) &&
                (<div onClick={onClickExpressionList} className="expression-button-list">
                    <button data-expression='Surprise' className="expression-button">
                        <FontAwesomeIcon icon={faFaceSurprise} />
                        <span>Surprise</span>
                    </button>
                    <button data-expression='Neutral' className="expression-button">
                        <FontAwesomeIcon icon={faFaceMeh} />
                        <span>Neutral</span>
                    </button>
                    <button data-expression='Angry' className="expression-button">
                        <FontAwesomeIcon icon={faFaceAngry} />
                        <span>Angry</span>
                    </button>
                    <button data-expression='Sad' className="expression-button">
                        <FontAwesomeIcon icon={faFaceSadCry} />
                        <span>Sad</span>
                    </button>
                    <button data-expression='Happy' className="expression-button">
                        <FontAwesomeIcon icon={faFaceGrin} />
                        <span>Happy</span>
                    </button>
                </div>)
            }
            <div data-api_type={api_result_type.REMOVE_BACKGROUND} className="box">
                <button disabled={input_image_type !== img_type_obj.PERSON_IMAGE} className={`${input_image_type !== img_type_obj.PERSON_IMAGE ? 'function-btn disable' : 'function-btn'}`}>
                    <FontAwesomeIcon icon={faEraser} />
                    <span>배경제거</span>
                </button>
            </div>
            {/* <div data-api_type={api_result_type.CONVERT_INTO_LINE} className="box">
                <button disabled={input_image_type!==img_type_obj.PERSON_IMAGE} className={`${input_image_type!==img_type_obj.PERSON_IMAGE?'function-btn disable':'function-btn'}`}>
                    <FontAwesomeIcon icon={faPaintBrush}/>
                    <span>선화변환</span>
                </button>
            </div> */}
            <div data-api_type={api_result_type.CARTOONIZE} className="box">
                <button disabled={output_image_type === output_type.LINE || input_image_type !== img_type_obj.PERSON_IMAGE} className={`${(output_image_type === output_type.LINE || input_image_type !== img_type_obj.PERSON_IMAGE) ? 'function-btn disable' : 'function-btn'}`}>
                    <FontAwesomeIcon icon={faFaceMehBlank} />
                    <span>캐릭터 변환</span>
                </button>
            </div>
            {/* <div data-api_type={api_result_type.COLORIZE} className="box">
                <button disabled={input_image_type !== img_type_obj.PERSON_IMAGE} className={`${input_image_type !== img_type_obj.PERSON_IMAGE ? 'function-btn disable' : 'function-btn'}`}>
                    <FontAwesomeIcon icon={faPalette} />
                    <span>채색하기</span>
                </button>
            </div> */}
            <div data-api_type={api_result_type.CHANGE_FACIAL_EXPRESSION} className="box">
                <button disabled={input_image_type !== img_type_obj.CARTOONIZED_IMAGE} className={`${input_image_type !== img_type_obj.CARTOONIZED_IMAGE ? 'function-btn disable' : 'function-btn'}`}>
                    <FontAwesomeIcon icon={faFaceGrin} />
                    <span>표정변환</span>
                </button>
            </div>
        </EntireContainer>
    )
}

export default FunctionBtnWrapper;