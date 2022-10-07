import React, { useState, memo, useEffect, createContext, useReducer, useMemo } from 'react';
import styled from 'styled-components';
import PaintHeader from '../PaintLayoutHeader/PaintHeader';
import PaintCanvasWrap from '../PaintCanvasWrap/PaintCanvasWrap';
import PaintHistory from '../PaintHistory/PaintHistory';
import PaintToolBar from '../PaintToolBar/PaintToolBar';
import PaintInitialComponent from '../PaintInitialComponent';
import { useDispatch, useSelector } from 'react-redux';
import { INIT_CALL_PAINT_API, LOADING_CALL_PAINT_API } from '../../reducers/callAPIInPaintReducer';
import PaintFunctionMobileComponent from '../PaintFunctionMobileComponent';

const EntireLayoutContainer = styled.div`
    background-color:#EBEAE3;
    width:100%;height:${window.innerHeight}px;
    min-height:${window.innerHeight}px;
    @media screen and (max-width:1330px){
        height:100%;min-height:100%;
        background-color:#fff;
    }
`;
const PaintLayoutWrapper = styled.div`
    width:100%;height:100%;
    .header-container{
        width:100%;height:75.5px;
        border-bottom:1px solid #454545;
    }
    .body-container{
        width:100%; height:100%;
        .body-wrapper{
            width:100%;height:100%;
            display:flex;
            flex-direction:row;
            .mobile-tool-bar-container{
                display:none;
            }
            .initial-canvas-container{
                background: rgba(255,255,255,0.60);
                overflow-y:scroll;
                -ms-overflow-style:none;
                scrollbar-width:none;
                &::-webkit-scrollbar{
                    display:none;
                }
                width:calc(100% - 285.5px);
                height:100%;
                .initial-canvas-wrapper{
                    width:100%;height:100%;
                }
            }
            .canvasWrapper-container{
                overflow-y:scroll;
                width:calc(100% - 441px);
                height:100%;
                .canvasWrapper-wrapper{
                    width:100%;height:100%;
                }
            }
            .toolbar-container{
                width:285.5px;height:100%;
                background-color:#fff;
                overflow-y:scroll;
                -ms-overflow-style:none;
                scrollbar-width:none;
                &::-webkit-scrollbar{
                    display:none;
                }
                .toolbar-wrapper{
                    width:100%;height:100%;
                }
            }
            .history-container{
                width:155.5px;height:100%;
                background-color:#fff;
                .history-wrapper{
                    width:100%;height:100%;
                    overflow-y:scroll;
                    padding:10px;
                    box-sizing:border-box;
                    -ms-overflow-style:none;
                    scrollbar-width:none;
                    &::-webkit-scrollbar{
                        display:none;
                    }
                    >div{
                        .history-record{
                            width:135.5px;height:135.5px;
                            margin-bottom:10px;
                            border-radius:4.5px;
                            box-sizing:border-box;
                            border:1.5px solid rgba(45,45,45,0.65);
                            cursor:pointer;
                            img{
                                display:block;
                                height:100%;width:100%;
                                object-fit:contain;
                            }
                            &.on{
                                border:5.5px solid #669DFD;
                            }
                            &:hover{
                                border:5.5px solid #669DFD;
                            }
                        }
                    }
                }
            }
        }
    }
    @media screen and (max-width:1220px){
        .body-container{
            .body-wrapper{
                width:100%;height:100%;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:space-between;
                .mobile-tool-bar-container{
                    display:block;
                    height:80px;
                    width:100%;
                    background-color:#fff;
                    .mobile-tool-bar-wrapper{
                        width:100%;height:100%;
                    }
                }
                .initial-canvas-container{
                    width:calc(100% - 285.5px);
                    height: calc(100% - 85px);
                }
                .canvasWrapper-container{
                    width: 100%;
                    height: calc(100% - 85px);
                }
                .toolbar-container{
                    display:none;
                }
                .history-container{
                    display:none;
                }
            }
        }
    }
    @media screen and (max-width:910px){
        .body-container{
            .body-wrapper{
                .initial-canvas-container{
                    width:calc(100% - 105.5px);
                }
                .canvasWrapper-container{
                    height:100%;
                }
            }
        }
    }
    @media screen and (max-width:785px){
        .body-container{
            .body-wrapper{
                .initial-canvas-container{
                    width:100%;
                }
                .canvasWrapper-container{
                    width:100%;
                    height:100%;
                }
            }
        }
    }
    @media screen and (max-width:550px){
        .body-container{
            .body-wrapper{
                .mobile-tool-bar-container{
                    height:56px;
                }
            }
        }
        
    }
`;

export const canvasMode = {
    BRUSH: 'BRUSH',
    ERASER: 'ERASER',
    HOLD_AND_DRAG: 'HOLD_AND_DRAG',
    COLOR_PICKER: 'COLOR_PICKER'
}

export const INIT_CANVAS = 'INIT_CANVAS';
export const UPDATE_PAINT_AXIS = 'UPDATE_PAINT_AXIS';
export const PAINT_COLOR = 'PAINT_COLOR';
export const CHANGE_MODE = 'CHANGE_MODE';
export const CHANGE_API_MODE ='CHANGE_API_MODE';
export const DELETE_PAINT_AXIS = 'DELETE_PAINT_AXIOS';
export const CHANGE_HISTORY = 'CHANGE_HISTORY';
export const CHANGE_STROKE_STYLE = 'CHANGE_STROKE_STYLE';
export const ZOOM_IN_AND_OUT = 'ZOOM_IN_AND_OUT';
export const DRAW_BACKGROUND = 'DRAW_BACKGROUND';
export const CHANGE_COLOR = 'CHANGE_COLOR';
export const TOGGLE_CALL_API_AUTO = 'TOGGLE_CALL_API_AUTO';
export const TOGGLE_SHOW_HINT = 'TOGGLE_SHOW_HINT';
export const STEP_BACK = 'STEP_BACK';
export const CALL_API_BY_CLICK_BTN = 'CALL_API_BY_CLICK_BTN';

const initialState = {
    pen: {
        initialSrc: null,
        src: null,
        mode: canvasMode.BRUSH,
        strokeStyle: '#669DFD',
        lineWidth: 2.5,
    },
    history: {
        history_record_array: [],
        history_offset: 0,
    },
    paint_axis_arr: [],
    show_pointer: true,
    zoomed_ratio: 1,
    isAuto: true,
    call_api: false,
    delete_call_api:false,
    delete_paint_axis_arr:[],
    api_mode:2
};

export const PaintStateContext = createContext({ ...initialState, PaintStateDispatch: () => { } });

const PaintStateReducer = (state, action) => {
    const { type } = action;
    switch (type) {
        case INIT_CANVAS: {
            return { ...initialState };
        }
        case CALL_API_BY_CLICK_BTN: {
            return { ...state, call_api: true };
        }
        case CHANGE_MODE: {
            const { mode } = action;
            const { pen } = state;
            const newPen = { ...pen, mode };
            return { ...state, pen: newPen };
        }
        case CHANGE_API_MODE:{
            const {api_mode} = action;
            return {...state,api_mode};
        }
        case DRAW_BACKGROUND: {
            const { bs64 } = action;
            const { pen, history } = state;
            const newPen = { ...pen, src: bs64 };
            const newHistory = { ...history, history_record_array: [{ bs64, timeStamp: Date.now() }], history_offset: 0 };
            return { ...state, initialSrc: bs64, pen: newPen, history: newHistory };
        }
        case CHANGE_COLOR: {

            const { strokeStyle } = action;
            const { pen } = state;
            if (!pen.src) return { ...state };
            const newPen = { ...pen, strokeStyle };
            return { ...state, pen: newPen };
        }
        case TOGGLE_CALL_API_AUTO: {
            const { isAuto: prevIsAuto } = state;
            return { ...state, isAuto: !prevIsAuto };
        }
        case TOGGLE_SHOW_HINT: {
            const { show_pointer: prevShowPointer, pen } = state;
            if (!pen.src) return { ...state };
            return { ...state, show_pointer: !prevShowPointer };
        }
        case UPDATE_PAINT_AXIS: {
            const { axisX, axisY } = action;

            const { paint_axis_arr, isAuto, history } = state;
            let timeStamp;
            timeStamp = history.history_record_array[history.history_offset].timeStamp;
            const axis = paint_axis_arr.find(v => v.timeStamp === timeStamp);
            /* console.log(axis);
            console.log(isAuto) */
            if (axis && isAuto) {
                timeStamp = Date.now();
            } else if (!axis && isAuto) {
                timeStamp = Date.now();
            } else if (!axis && !isAuto) {
                if (paint_axis_arr.length === 0) {
                    timeStamp = Date.now();
                } else {
                    timeStamp = paint_axis_arr[paint_axis_arr.length - 1].timeStamp;
                }
            }else {
                timeStamp = axis.timeStamp;
            }
            if (isAuto) {
                return {
                    ...state, paint_axis_arr: [...paint_axis_arr, { axisY, axisX, timeStamp, color: convertStrokeStyleIntoArr(state.pen.strokeStyle) }],
                    call_api: true,
                }
            } else {

                return {
                    ...state, paint_axis_arr: [...paint_axis_arr, { axisX, axisY, timeStamp, color: convertStrokeStyleIntoArr(state.pen.strokeStyle) }],
                };
            }

        }
        case PAINT_COLOR: {
            const { bs64 } = action;
            const { delete_call_api,history: prevHistory, pen, paint_axis_arr: prevPaintAxisArr,call_api } = state;
            if (call_api) {
                let newHistoryArr; let newPaintAxisArr;
                let timeStamp = prevPaintAxisArr[prevPaintAxisArr.length - 1].timeStamp;
                if (prevHistory.history_offset < prevHistory.history_record_array.length - 1) {
                    newHistoryArr = prevHistory.history_record_array.slice(0, prevHistory.history_offset + 1);
                    newHistoryArr=[...newHistoryArr, { bs64, timeStamp }]
                    timeStamp=prevHistory.history_record_array[prevHistory.history_offset].timeStamp;
                    newPaintAxisArr = [
                        ...prevPaintAxisArr.filter(v => v.timeStamp <= timeStamp),
                        prevPaintAxisArr[prevPaintAxisArr.length - 1]
                    ];
                } else {
                    newHistoryArr = [...prevHistory.history_record_array, { bs64, timeStamp }];
                    newPaintAxisArr = [...prevPaintAxisArr];
                }
                return {
                    ...state,
                    pen: {
                        ...pen,
                        src: bs64
                    },
                    history: {
                        ...prevHistory,
                        history_offset: newHistoryArr.length-1,
                        history_record_array: [...newHistoryArr]
                    },
                    paint_axis_arr: [...newPaintAxisArr],
                    call_api: false,
                }
            }else if(delete_call_api){
                let newHistoryArr;
                if (prevHistory.history_offset < prevHistory.history_record_array.length - 1) {
                    newHistoryArr = prevHistory.history_record_array.slice(0, prevHistory.history_offset + 1);
                    newHistoryArr=[...newHistoryArr, { bs64, timeStamp:Date.now() }]
                } else {
                    newHistoryArr = [...prevHistory.history_record_array];
                    newHistoryArr=[...newHistoryArr, { bs64, timeStamp:Date.now() }]
                }
                return {
                    ...state,
                    pen:{
                        ...pen,
                        src:bs64
                    },
                    history:{
                        ...prevHistory,
                        history_offset: newHistoryArr.length-1,
                        history_record_array: [...newHistoryArr]
                    },
                    delete_call_api:false,
                    delete_paint_axis_arr:[]
                }
            }

        }
        case CHANGE_HISTORY: {
            try{
                const { history: prevHistory, pen: prevPen } = state;
                if (!prevPen.src) return { ...state };
                const { history_record_array } = prevHistory;
                const { offset: newOffset } = action;
                if (newOffset > history_record_array.length - 1) { return { ...state } };
                return {
                    ...state,
                    history: { ...prevHistory, history_offset: newOffset },
                    pen: { ...prevPen, src: prevHistory.history_record_array[newOffset].bs64 }
                };
            }catch(err){
                return{
                    ...state
                }
            }
            
        }
        case STEP_BACK: {
            const { paint_axis_arr: prev_paint_axis_arr } = state;
            return { ...state, call_api: false, paint_axis_arr: [...(prev_paint_axis_arr.slice(0, prev_paint_axis_arr.length - 1))] }
        }
        case DELETE_PAINT_AXIS: {
            const { prevX, prevY, axisX, axisY } = action;
            const {history}=state;
            const {history_offset,history_record_array}=history;
            const { paint_axis_arr: prev_paint_axis_arr } = state;
            const new_paint_axis_arr = prev_paint_axis_arr.filter(v => (v.timeStamp<=history_record_array[history_offset].timeStamp)&&(v.axisX < prevX || v.axisX > axisX) || (v.axisY < prevY || v.axisY > axisY));
            if(new_paint_axis_arr.length===prev_paint_axis_arr){return {...state}}
            return { ...state, delete_paint_axis_arr: new_paint_axis_arr, delete_call_api: true };
        }
        default: {
            return { ...state };
        }
    }
}

const drawImageAsync = (src, canvasRef) => {
    return new Promise((resolve, reject) => {
        try {
            let img = new Image();
            img.src = src;
            img.onload = () => {
                canvasRef.getContext('2d').drawImage(img, 0, 0, canvasRef.width, canvasRef.height);
                resolve(true);
            }
        } catch (err) {
            console.error(err);
            reject(err);
        }

    })
}

export const drawPointsOnCanvas = async (canvas, bs64, paint_axis_arr, history) => {
    await drawImageAsync(bs64, canvas);
    const { timeStamp } = history.history_record_array[history.history_offset];
    const new_paint_axis = paint_axis_arr.filter(v => v.timeStamp <= timeStamp);
    const originalCanvasStrokeStyle = canvas.getContext('2d').strokeStyle;
    if (new_paint_axis.length > 0) {
        new_paint_axis.forEach((v) => {
            canvas.getContext('2d').strokeStyle = invertStrokeStyle(v.color);
            const radius = canvas.getContext('2d').lineWidth * 2;
            canvas.getContext('2d').beginPath();
            canvas.getContext('2d').arc(v.axisX, v.axisY, radius, 0, Math.PI * 2);
            canvas.getContext('2d').stroke();
        })
    }
    canvas.getContext('2d').strokeStyle = originalCanvasStrokeStyle;
}

const convertStrokeStyleIntoArr = (strokeStyle) => {
    const splitedStrokeStyle = strokeStyle.split("#")[1];
    let arr = splitedStrokeStyle.match(/.{1,2}/g);
    return arr.map(v => Number(parseInt(v, 16)));
}

const invertStrokeStyle = (strokeStyle) => {
    let invertedColorArr = strokeStyle.map(v => 256 - v);
    invertedColorArr = invertedColorArr.map(v => {
        let colorHex = v.toString(16);
        if (colorHex.length < 2) { colorHex = `0${colorHex}` }
        return colorHex
    })
    return `#${invertedColorArr.join('')}`;
}

export const drawImage = (src, canvasRef) => {
    let img = new Image();
    img.src = src;
    img.onload = () => {
        canvasRef.getContext('2d').drawImage(img, 0, 0, canvasRef.width, canvasRef.height);
    }
}

export const findElement = (element, findCondition, endCondition) => {
    const flag = element.tagName.toUpperCase() === findCondition || element.classList.contains(findCondition);
    if (flag) {
        return element;
    } else {
        const endFlag = element.tagName.toUpperCase() === endCondition
            || element.classList.contains(endCondition);
        if (endFlag) return null;
        return findElement(element.parentElement, findCondition, endCondition);
    }
}

export const settingCanvasSize = () => {
    const { innerWidth } = window;
    if (1900 <= innerWidth && innerWidth < 2500) {
        return { width: 850, height: 850 };
    } else if (1250 <= innerWidth && innerWidth < 1900) {
        return { width: 615, height: 615 };
    } else if (1025 <= innerWidth && innerWidth < 1250) {
        return { width: 682, height: 682 };
    } else if(655<=innerWidth && innerWidth<1025){
        return {width:682,height:682}
    } else if(535<=innerWidth && innerWidth<655){
        return {width:582,height:582}
    }else if(335<=innerWidth && innerWidth<435){
        return {width:385,height:385}
    }else {
        return { width: 315, height: 315 };
    }
}

export const adjustCanvas = (canvas,src)=>{
    const {width:canvasWidth,height:canvasHeight} = settingCanvasSize();
    const img = new Image();
    img.src = src;
    img.onload = ()=>{
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
    }
}

export const adjustSize = (src) => {
    return new Promise((resolve, reject) => {
        try {
            const tempImage = new Image();
            tempImage.src = src;
            tempImage.onload = () => {
                const widthOrHeight = tempImage.width > tempImage.height;
                const tempCanvas = document.createElement('canvas');
                const { width: canvasWidth, height: canvasHeight } = settingCanvasSize();
                tempCanvas.width = canvasWidth;
                tempCanvas.height = canvasHeight;
                tempCanvas.getContext('2d').fillStyle = "#fff";
                tempCanvas.getContext('2d').fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                const widthInDraw = widthOrHeight ? tempCanvas.width : parseFloat(tempImage.width / tempImage.height) * tempCanvas.width;
                const heightInDraw = widthOrHeight ? parseFloat(tempImage.height / tempImage.width) * tempCanvas.height : tempCanvas.height;
                const offsetLength = widthOrHeight ? (tempCanvas.height - heightInDraw) / 2 : (tempCanvas.width - widthInDraw) / 2;
                if (widthOrHeight) { tempCanvas.getContext('2d').drawImage(tempImage, 0, offsetLength, widthInDraw, heightInDraw); }
                else { tempCanvas.getContext('2d').drawImage(tempImage, offsetLength, 0, widthInDraw, heightInDraw); }
                resolve(tempCanvas.toDataURL("image/jpeg"));
            }
        } catch (err) {
            reject("적절한 이미지가 아닙니다.");
        }
    })
}

export const convertIntoFile = (bs64) => {
    const imageData = bs64.split(",")[1];
    const binaryObj = window.atob(imageData);
    const binaryArr = [];
    for (let i = 0; i < binaryObj.length; i++) {
        binaryArr.push(binaryObj.charCodeAt(i));
    }

    let byteArr = new Uint8Array(binaryArr);
    return new Blob([byteArr], { 'type': 'image/jpeg' });
}

const PaintLayout = memo(() => {
    const dispatch = useDispatch();
    const {
        loadingCallAPI,
        failureCallAPI,
        successCallAPI,
        dataFromAPI
    } = useSelector(state => state.callAPIPaintReducer);

    const [PaintState, PaintStateDispatch] = useReducer(PaintStateReducer, initialState);
    const PaintData = useMemo(() => {
        return {
            ...PaintState,
            PaintStateDispatch
        }
    }, [PaintState]);

    useEffect(() => {
        if (!loadingCallAPI && successCallAPI) {
            if (dataFromAPI) {
                adjustSize(dataFromAPI).then(result => {
                    PaintStateDispatch({
                        type: PAINT_COLOR,
                        bs64: result
                    });
                    dispatch({ type: INIT_CALL_PAINT_API });
                    return false;
                }).catch(err => {
                    console.error(err);
                    dispatch({ type: INIT_CALL_PAINT_API });
                    PaintStateDispatch({ type: STEP_BACK });
                    return false;
                })
            }

        } else if (!loadingCallAPI && failureCallAPI) {
            window.alert(failureCallAPI);
            dispatch({ type: INIT_CALL_PAINT_API });
            PaintStateDispatch({ type: STEP_BACK });
        }
    }, [
        loadingCallAPI,
        failureCallAPI,
        successCallAPI,
        dataFromAPI
    ])

    useEffect(()=>{
        const { delete_call_api, delete_paint_axis_arr, initialSrc } = PaintState;
        if(delete_call_api){
            if(delete_paint_axis_arr.length>0){
                const file = convertIntoFile(initialSrc);
                const axisArr = delete_paint_axis_arr.map(v => [[v.axisY, v.axisX], ...v.color]);
                let formData = new FormData();
                formData.append('input_image', file);
                formData.append('hint_list', JSON.stringify(axisArr));
                dispatch({ type: LOADING_CALL_PAINT_API, data: formData });
            }else{
                PaintStateDispatch({type:PAINT_COLOR,bs64:initialSrc});
            }
            
        }
    },[
        PaintState.delete_call_api,PaintState.delete_paint_axis_arr,
        PaintState.initialSrc,
    ])

    useEffect(() => {
        const { call_api, paint_axis_arr, initialSrc,api_mode } = PaintState;
        if (call_api) {
            if (paint_axis_arr.length > 0) {
                const { timeStamp } = paint_axis_arr[paint_axis_arr.length - 1];
                const axisArr = [...paint_axis_arr.filter(v => v.timeStamp <= timeStamp)].map(v => [[v.axisY, v.axisX], ...v.color]);
                const file = convertIntoFile(initialSrc);
                let formData = new FormData();
                formData.append('input_image', file);
                formData.append('hint_list', JSON.stringify(axisArr));
                dispatch({ type: LOADING_CALL_PAINT_API, data: formData ,api_mode});
                /* console.log(PaintState.history.history_record_array);
                console.log(PaintState.paint_axis_arr); */
            } 
        }
    }, [
        PaintState.call_api,PaintState.paint_axis_arr,
        PaintState.initialSrc,PaintState.api_mode
    ]);

    return (
        <PaintStateContext.Provider value={PaintData}>
            <EntireLayoutContainer>
                <PaintLayoutWrapper>
                    {/* <div className="header-container">
                        <PaintHeader />
                    </div> */}
                    <div className="body-container">
                        <div className="body-wrapper">
                            <div className="toolbar-container">
                                <div className="toolbar-wrapper">
                                    <PaintToolBar />
                                </div>
                            </div>
                            {
                                PaintData.pen.src && (
                                    <>
                                        <div className="canvasWrapper-container">
                                            <div className="canvasWrapper-wrapper">
                                                <PaintCanvasWrap />
                                            </div>
                                        </div>
                                    </>)
                            }
                            {
                                !PaintData.pen.src && (
                                    <>
                                        <div className="initial-canvas-container">
                                            <div className="initial-canvas-wrapper">
                                                <PaintInitialComponent />
                                            </div>
                                        </div>
                                    </>
                                )
                            }
                            
                            <div className="history-container">
                                <div className="history-wrapper">
                                    <PaintHistory />
                                </div>
                            </div>
                            <div className="mobile-tool-bar-container">
                                <div className="mobile-tool-bar-wrapper">
                                    <PaintFunctionMobileComponent />
                                </div>
                            </div>
                        </div>
                    </div>

                </PaintLayoutWrapper>
            </EntireLayoutContainer>
        </PaintStateContext.Provider>
    )
})

export default PaintLayout;
