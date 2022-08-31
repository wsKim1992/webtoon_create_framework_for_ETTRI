import React, { memo, useCallback, useContext, useState, useRef, useEffect } from "react";
import styled from 'styled-components';
import { faCamera, faImage,faSquareX } from "@fortawesome/free-solid-svg-icons";
import {faCircleXmark} from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { convertIntoBase64WithMedia, img_type_obj, src_type_obj, UPLOAD_PERSON_IMAGE, UPLOAD_CARTOONIZED_IMAGE, DrawLineContext } from "../Layout/DrawLineLayout"
import {
    CanvasSizeContext,SET_WIDTH_AND_HEIGHT,
    INIT_STATE} from '../DrawLineCanvasWrapper';
import { useSelector } from "react-redux";
import loadingGIF1 from '../../assets/gif/0015.gif';
import loadingGIF2 from '../../assets/gif/0019.gif';

const EntireContainer = styled.div`
    width:100%;height:100%;
    display:flex;
    flex-direction:row;
    justify-content:center;
    align-items:center;
    position:relative;
    .image-padding{
        display: flex;
        align-items: center;
        height:100%;width:100%;
        
        .image{
            margin:0 auto;
            position:relative;
            width:715px;height:715px;
            background-color:#fff;
            >img{
                display:block;
                width:100%;height:100%;
                object-fit:contain;
            }
            .loading-component{
                width:100%;height:100%;
                position:absolute;
                top:0; left:0;
                z-index:1;
                display:flex;
                align-items:center;
                justify-content:center;
                background-color:#fff;
                img{
                    width:auto;height:auto;
                    object-fit:contain;
                }
            }
            .video-component{
                position:absolute;
                top:0;left:0;
                z-index:3;
                width:100%;height:100%;
                background:#fff;
                .video{
                    position:absolute;
                    top:0;left:0;
                    object-fit:fill;
                }
                .button-component{
                    position:absolute;
                    bottom:10.5px;left:50%;
                    transform:translateX(-50%);
                    width:auto;height:auto;
                    background-image:linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.85));
                    border-radius:4.5px;
                    .single-button{
                        background:transparent;
                        font-size:var(--canvas-function-button-icon);
                        box-sizing: border-box;
                        border: 1.5px solid #fff;
                        padding: 15.5px;
                        border: 1.5px solid #fff;
                        color:#fff;
                        border-radius:4.5px;
                        outline: none;
                        &:hover{
                            background-color:#fff;
                            color:#669DFD;
                        }
                    }
                }
    
            }
            
            .camera-component{
                position:absolute;
                top:0;left:0;
                width:100%;height:100%;
                z-index:1;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                cursor:pointer;
                .camera-icon-box{
                    width:100px;height:100px;
                    text-align:center;
                    line-height: 95px;
                    font-size: 45.5px;
                    color:#000;
                    box-sizing:border-box;
                    border:2.5px solid #000;
                    border-radius:100%;
                }
                .camera-text-box{
                    margin-top:9.5px;
                    font-size:var(--main-title);
                    height:20px;width:100%;
                    color:#000;
                    line-height:20px;
                    text-align:center;
                    font-weight:bold;
                }
                
            }
            .init-component{
                height:50px;width:auto;
                position: absolute;
                bottom: 100%;
                right: 0;
                .init-text-box{
                    cursor:pointer;
                    height:100%;width:50px;
                    font-size:25.5px;
                    margin: 0 auto;
                    background: rgba(0,0,0,0.35);
                    color: #fff;
                    line-height: 50px;
                    border-radius: 4.5px;
                    padding: 0;
                    text-align:center;
                    font-weight:bold;
                    &:hover{
                        color:#000;
                        background:#fff;
                    }
                }
            }
            .file-uploader-box{
                position:absolute;
                top:10px;left:0;
                z-index:2;
                overflow:hidden;
                width:100%;height:85.5px;
                .file-uploader{
                    cursor:pointer;
                    width:auto;height:auto;
                    float:left;
                    margin-left:10px;
                    input{
                        display:none;
                    }
                    label{
                        font-size:var(--canvas-function-button-icon);
                        width:auto;height:auto;
                        padding:5.5px;
                        border: 1.5px solid #fff;
                        border-radius:4.5px;
                        background-color:rgba(45,45,45,0.65);
                        color:#fff;
                        cursor:pointer;
                        &:hover{
                            background-color:#fff;
                            color:#669DFD;
                        }
                    }
                }
                .file-uploader+.file-uploader{
                    float:right;
                    margin-right:10px;
                }
            }
        }
    }
    @media screen and (max-width:1270px){
        .image-padding{
            position:relative;
            height:0;width:100%;
            padding-top:100%;
            .image{
                position:absolute;
                top:0;left:0;right:0;bottom:0;
                width:100%;height:100%;
                .camera-component{
                    .camera-text-box{
                        font-size: 15.5px;
                    }
                }
                .init-component{
                    .init-text-box{
                        font-size:19.5px;
                    }
                }
            }
        }
    }
    @media screen and (max-width:640px){
        .image-padding{
            .image{
                .camera-component{
                    .camera-icon-box{
                        text-align: center;
                        line-height: 45.5px;
                        width: 55px;
                        height: 55px;
                        font-size: 27.5px;
                    }
                    .camera-text-box{
                        font-size: 15.5px;
                    }
                    
                    
                }
            }
        }
    }
`;

const ImageWrapper = memo(() => {
    const [showCameraVideo, setShowCameraVideo] = useState(false);
    const [imageURL, setImageURL] = useState(null);
    const videoComponentRef = useRef(null);
    const webcamStreamRef = useRef(null);
    const imageRef = useRef(null);
    const {CanvasSizeDispatch} = useContext(CanvasSizeContext);
    const { DrawLineDispatch, input_image_src, output_image_src } = useContext(DrawLineContext);
    const {loadingCallAPI}=useSelector(state=>state.callAPIInDrawLineReducer)
    useEffect(()=>{
        if(loadingCallAPI){
            console.log(loadingCallAPI);
        }
    },[loadingCallAPI])
    
    useEffect(()=>{
        if(imageRef.current){
            const style = document.defaultView.getComputedStyle(imageRef.current);
            CanvasSizeDispatch({type:SET_WIDTH_AND_HEIGHT,width:parseFloat(style.width),height:parseFloat(style.height)});
            return ()=>{
                CanvasSizeDispatch({type:INIT_STATE});
            }
        }
    },[imageRef.current])

    useEffect(() => {
        if (output_image_src) {
            setImageURL(output_image_src)
        } else if (!output_image_src && input_image_src) {
            setImageURL(input_image_src);
        }else if(!output_image_src && !input_image_src){
            setImageURL(null)
        }
    }, [input_image_src, output_image_src]);

    const windowBeforeUnload = useCallback(() => {
        if (videoComponentRef.current) {
            videoComponentRef.current.pause();
            videoComponentRef.current.srcObject = null;
            videoComponentRef.current = null;
        }
        if (webcamStreamRef.current) {
            webcamStreamRef.current.getTracks()[0].stop();
            webcamStreamRef.current = null;
        }
    }, [
        videoComponentRef.current,
        webcamStreamRef.current
    ]);

    useEffect(() => {
        window.addEventListener("beforeunload", windowBeforeUnload);
    }, [
        videoComponentRef.current,
        webcamStreamRef.current
    ]);

    useEffect(() => {
        if (videoComponentRef.current && showCameraVideo && imageRef.current) {
            //console.log(videoComponentRef.current);
            let style = document.defaultView.getComputedStyle(imageRef.current)
            console.log(parseFloat(style.height));
            videoComponentRef.current.width = parseFloat(style.width);
            videoComponentRef.current.height = parseFloat(style.height);

            onStartCamera();
        }
    }, [videoComponentRef.current, imageRef.current, showCameraVideo])

    const onStartCamera = useCallback(async () => {
        if (videoComponentRef.current && showCameraVideo) {
            try {
                const mediaOption = {
                    video: {
                        facingMode: "user",
                        width: videoComponentRef.current.width,
                        height: videoComponentRef.current.height
                    },
                    audio: false,
                }
                const mediaStream = await navigator.mediaDevices.getUserMedia(mediaOption);
                videoComponentRef.current.srcObject = mediaStream;
                videoComponentRef.current.play();
                webcamStreamRef.current = mediaStream;

            } catch (err) {
                console.error(err);
                setShowCameraVideo(false);
                window.alert("Camera 모듈 연결 문제!");
            }
        }
    }, [
        showCameraVideo, videoComponentRef.current
    ])

    const onClickInit = ()=>{
        DrawLineDispatch({type:INIT_STATE});
    }

    const onClickCameraOn = useCallback(() => {
        if (!showCameraVideo) {
            setShowCameraVideo(true);
        }
    }, [showCameraVideo]);

    const turnCameraOff = useCallback(() => {
        if (showCameraVideo) {
            videoComponentRef.current.srcObject = null;
            videoComponentRef.current.pause();
            webcamStreamRef.current.getTracks().forEach((track) => {
                track.stop();
            })
            webcamStreamRef.current = null;
            setShowCameraVideo(false);
        }
    }, [showCameraVideo, videoComponentRef.current, webcamStreamRef.current]);

    const onClickCapture = useCallback(() => {
        if (showCameraVideo) {
            const base64 = convertIntoBase64WithMedia(videoComponentRef.current, imageRef.width, imageRef.height);
            videoComponentRef.current.pause();
            videoComponentRef.current.srcObject = null;
            videoComponentRef.current = null;
            webcamStreamRef.current.srcObject = null;
            webcamStreamRef.current.getTracks()[0].stop();
            webcamStreamRef.current = null;
            setShowCameraVideo(false);
            DrawLineDispatch({type:UPLOAD_PERSON_IMAGE,src:base64,
                src_type:src_type_obj.BS64,img_type:img_type_obj.PERSON_IMAGE

            })
        }
    }, [
        showCameraVideo,
        videoComponentRef.current,
        webcamStreamRef.current,
    ])

    const onChangePersonImage = useCallback((evt) => {
        const { target: thisElement } = evt;
        const id = thisElement.id;
        //console.log(id);
        const { files } = thisElement;
        //console.log(files);
        if (files[0].type.match("image/*")) {
            let fileReader = new FileReader();
            fileReader.onload = (e) => {
                if (id === 'upload-person-image') {
                    DrawLineDispatch({
                        type: UPLOAD_PERSON_IMAGE,
                        src: e.target.result,
                        img_type: img_type_obj.PERSON_IMAGE,
                        src_type: src_type_obj.BS64
                    });
                } else if (id === 'upload-charactor-image') {
                    DrawLineDispatch({
                        type: UPLOAD_CARTOONIZED_IMAGE,
                        src: e.target.result,
                        img_type: img_type_obj.CARTOONIZED_IMAGE,
                        src_type: src_type_obj.BS64
                    });
                }
            }
            fileReader.readAsDataURL(files[0]);
        }
    }, []);

    return (
        <EntireContainer>
            <div className="image-padding">
                <div className="image" ref={imageRef}>
                    {
                        imageURL&&
                        <img src={imageURL} alt="rendered-image"/>
                    }
                    {
                        loadingCallAPI&&(
                            <div className="loading-component">
                                <img src={loadingGIF1} alt="loading-image" />
                            </div>
                        )

                    }
                    {
                        !imageURL && showCameraVideo &&
                        (
                            <div className="video-component">
                                <video className="video" playsInline ref={videoComponentRef} />
                                <div className="button-component">
                                    <button onClick={onClickCapture} className="single-button">
                                       <FontAwesomeIcon icon={faCamera}/>  캡처
                                    </button>
                                    {/* <button onClick={turnCameraOff} className="single-button">카메라 끄기</button> */}
                                </div>
                            </div>
                        )
                    }
                    {
                        !imageURL && (
                            <div onClick={onClickCameraOn} className="camera-component">
                                <p className="camera-icon-box">
                                    <FontAwesomeIcon icon={faCamera} />
                                </p>
                                <p className="camera-text-box">
                                    사진 촬영하기
                                </p>
                            </div>
                        )
                    }
                    {
                        (
                            imageURL&&
                            <div onClick={onClickInit} className="init-component">
                                <p className="init-text-box">
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </p>
                            </div>
                        )
                    }
                    <div className="file-uploader-box">
                        <p className="file-uploader">
                            <input onChange={onChangePersonImage} type="file" id="upload-person-image" />
                            <label htmlFor="upload-person-image">
                                <FontAwesomeIcon icon={faImage} />
                            </label>
                        </p>
                        <p className="file-uploader">
                            <input onChange={onChangePersonImage} type="file" id="upload-charactor-image" />
                            <label htmlFor="upload-charactor-image">
                                <FontAwesomeIcon icon={faImage} />
                            </label>
                        </p>
                    </div>
                </div>

            </div>
        </EntireContainer>
    )
});

export default ImageWrapper;
