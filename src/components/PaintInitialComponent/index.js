import React ,{memo,useCallback,useContext} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload,faPalette} from '@fortawesome/free-solid-svg-icons';
import {PaintStateContext,DRAW_BACKGROUND,adjustSize} from '../Layout/PaintLayout';

const InitialComponentComponent = styled.div`
    width:100%;height:100%;
    box-sizing:border-box;
    padding:25.5px;
    .upload-file-container{
        width:100%;height:100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color:#fff;
        box-sizing:border-box;
        border:3.5px dashed #669DFD;
        .upload-file-wrapper{
            width:100%;height:auto;
            .paint-symbol-box{
                display:flex;
                flex-direction:row;
                align-items:center;
                justify-content:center;
                width:100%;height:90px;
                .paint-symbol{
                    width:80px;height:80px;
                    font-size:65.5px;
                    line-height:120px;
                    color:#669DFD;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
            .message-box{
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                width:100%;height:95px;
                .main-message{
                    width:auto;height:auto;
                    font-weight:bold;
                    font-size:var(--main-title);
                }
                .sub-message{
                    margin-top:12.5px;
                    width:auto;height:auto;
                    font-size:var(--canvas-function-button-icon);
                }
            }
            .file-upload-btn-box{
                width:100%; height:65px;
                display:flex;
                flex-direction:row;
                align-items:center;
                justify-content:center;
                input{
                    display:none;
                }
                label{
                    background-color:#669DFD;
                    padding:10.5px;
                    color:#fff;
                    font-size:var(--canvas-function-button);
                    border-radius:4.5px;
                    margin: 0 auto;
                    cursor:pointer;
                }
            }
        }
    }
    @media screen and (max-width:480px){
        .upload-file-container{
            .upload-file-wrapper{
                .message-box{
                    .main-message{
                        font-size:16.5px;
                    }
                    .sub-message{
                        margin-top:12.5px;
                        width:auto;height:auto;
                        font-size:var(--canvas-function-button-icon);
                    }
                }
            }
        }
    }
`;


const PaintInitialComponent = memo(()=>{
    const {PaintStateDispatch}=useContext(PaintStateContext);

    const onChangeFile = useCallback((evt)=>{
        const {files}=evt.target;
        if(files[0].type.match('image/*')){
            let fileReader = new FileReader();
            fileReader.readAsDataURL(files[0]);
            fileReader.onload = async(evt)=>{
                const bs64 = await adjustSize(evt.target.result);
                PaintStateDispatch({type:DRAW_BACKGROUND,bs64});
            }
        }
    },[]);

    return(
        <InitialComponentComponent>
            <div className="upload-file-container">
                <div className="upload-file-wrapper">
                    <div className="paint-symbol-box">
                        <div className="paint-symbol">
                            <FontAwesomeIcon icon={faPalette}/>
                        </div>
                    </div>
                    <div className="message-box">
                        <p className="main-message">내가 그린 스케치를 채색해 보세요!</p>
                        <p className="sub-message">버튼을 클릭하여 업로드 하세요.</p>
                    </div>
                    <div className="file-upload-btn-box">
                        <input onChange={onChangeFile} type="file" id="fileUpload" match="image/*"/>
                        <label htmlFor="fileUpload">
                            내 파일 업로드 하기 <FontAwesomeIcon icon={faUpload}/>
                        </label>
                    </div>
                </div>
            </div>
            
        </InitialComponentComponent>
    )
})

export default PaintInitialComponent;