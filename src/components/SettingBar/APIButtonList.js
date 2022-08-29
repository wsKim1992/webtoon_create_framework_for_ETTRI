import React, { useCallback, useContext, useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actions, PenManagerContext, convertIntoBase64 } from '../Layout/Layout';
import { LOADING_CALL_API, INIT_CALL_API } from "../../reducers/callAPIReducer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSurprise, faFaceMeh, faFaceGrin, faFaceAngry, faFaceSadCry } from '@fortawesome/free-regular-svg-icons';

const findElement = (element, findCondition, endCondition) => {
    const classNameOfElement = element.tagName.toUpperCase()
    const classContainsCondition = element.classList.contains(findCondition);
    const flag = classNameOfElement === findCondition || classContainsCondition;
    if (flag) {
        return element;
    } else {
        const classNameIsEndCondition = classNameOfElement === endCondition;
        const classContainsEndCondition = element.classList.contains(endCondition);
        const endFlag = classNameIsEndCondition || classContainsEndCondition;
        if (endFlag) {
            return null;
        } else {
            return findElement(element.parentElement, findCondition, endCondition);
        }
    }
}

const convertIntoFile = (src) => {
    const base64 = src.split(",")[1];
    const base64IntoByte = atob(base64);
    let arr = [];
    for (let i = 0; i < base64IntoByte.length; i++) {
        arr.push(base64IntoByte.charCodeAt(i));
    }
    //const imgUpload = new Blob([new Uint8Array(asciiArr)],{'type':'image/jpeg'});
    let byteArr = new Uint8Array(arr);
    return new Blob([byteArr], { 'type': 'image/jpeg' });
}

const APIButtonList = memo(() => {
    const dispatch = useDispatch();

    const { pen, globalState, urlObj, colorizeImg, penStateDispatch } = useContext(PenManagerContext);

    const onClickSettingBar = useCallback((evt) => {
        const { target: thisElement } = evt;
        const clickedElement = findElement(thisElement, 'button-component', 'setting-bar');
        if (clickedElement) {
            if (clickedElement.classList.contains('disabled')) { return false; }
            const { api } = clickedElement.dataset;
            switch (api) {
                case 'remove-bg': {
                    if (0 < globalState && globalState >= 1 && pen.src1 && !urlObj) {
                        console.log(pen.src1);
                        const input_image = convertIntoFile(pen.src1);
                        let formData = new FormData();
                        formData.append('input_image', input_image);
                        formData.append('function', 'image2pen');
                        console.log(globalState);
                        dispatch({ type: LOADING_CALL_API, data: formData, globalState });
                    } else if (0 < globalState && globalState >= 1 && pen.src1 && urlObj) {
                        convertIntoBase64(urlObj.input_path[1]).then(result => {
                            penStateDispatch({ type: actions.CHANGE_GLOBAL_STATE, bs64: result, newGlobalState: globalState });
                        })
                    } else {
                        window.alert("사진을 찍거나 이미지를 업로드 해주세요!");
                    }
                    break;
                }
                case 'convert-line': {
                    if (1 < globalState && globalState >= 2 && urlObj) {
                        console.log(urlObj);
                        convertIntoBase64(urlObj.output_rembg_modeP_path[0]).then(result => {
                            penStateDispatch({ 
                                type: actions.CHANGE_GLOBAL_STATE, 
                                bs64: result, 
                                newGlobalState:  globalState === 2?3:globalState 
                            })
                        })
                    }
                    break;
                }
                case 'put-color': {
                    console.log(colorizeImg);
                    if (2 < globalState && globalState >= 3 && urlObj && !colorizeImg) {
                        let formData = new FormData();
                        formData.append('img_path', `${urlObj.input_path[0]}`);
                        formData.append('line_path', `${urlObj.output_modeP_path[0]}`)
                        //const data = {img_path:`${urlObj.input_path[0]}`,line_path:`${urlObj.output_modeO_path[2]}`}

                        dispatch({ type: LOADING_CALL_API, data: formData, globalState });
                    } else if (2 < globalState && globalState >= 3 && urlObj && colorizeImg) {
                        convertIntoBase64(colorizeImg).then(result => {
                            penStateDispatch({ 
                                type: actions.CHANGE_GLOBAL_STATE, 
                                bs64: result, 
                                newGlobalState: globalState
                            })
                        })
                    }
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }, [globalState, pen.src1, urlObj, colorizeImg])

    const onClickFacialExpressionList = useCallback((evt)=>{
        if(globalState>=4&&colorizeImg){
            const {target:ThisElement}=evt;
            const targetElement = findElement(ThisElement,'expression','choose-face-expression-component')
            if(targetElement){
                const {expression}=targetElement.dataset;
                convertIntoBase64(colorizeImg).then(result => {
                    let input_image = convertIntoFile(result);
                    let expression_name = expression;
                    const formData= new FormData();
                    formData.append('input_image',input_image);
                    formData.append('expression_name',expression_name);
                    dispatch({type:LOADING_CALL_API,data:formData,globalState});
                })


            }
        }
        
    },[globalState,colorizeImg])

    return (
        <>
            <div onClick={onClickSettingBar} className="setting-bar">
                <div data-api="remove-bg" className={`button-component ${globalState < 1 && 'disabled'}`}>
                    배경 제거하기
                </div>
                <div data-api="convert-line" className={`button-component ${globalState < 2 && 'disabled'}`}>
                    선화로 변환하기
                </div>
                <div data-api="put-color" className={`button-component ${globalState < 3 && 'disabled'}`}>
                    채색하기
                </div>
                <div data-api="change-face-expression" className={`button-component ${globalState < 4 && 'disabled'}`}>
                    표정 변경하기
                    <div onClick={onClickFacialExpressionList} className={`choose-face-expression-component ${globalState < 4 && 'off'}`}>
                        <p className="expression" data-expression='Neutral'>
                            <FontAwesomeIcon icon={faFaceMeh} />
                        </p>
                        <p className="expression" data-expression='Angry'>
                            <FontAwesomeIcon icon={faFaceAngry} />
                        </p>
                        <p className="expression"  data-expression='Happy'>
                            <FontAwesomeIcon icon={faFaceGrin}/>
                        </p>
                        <p className="expression" data-expression='Surprise'>
                            <FontAwesomeIcon icon={faFaceSurprise} />
                        </p>
                        <p className="expression" data-expression='Sad'>
                            <FontAwesomeIcon icon={faFaceSadCry} />
                        </p>
                    </div>
                </div>
            </div>
            <div className="setting-bar">
                <div className={`button-component ${globalState < 5 && 'disabled'}`}>
                    컷 생성
                </div>
            </div>
        </>
    )
})

export default APIButtonList;