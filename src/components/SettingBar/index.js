import React,{memo,useContext,useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import {PenManagerContext} from '../Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFaceGrin} from '@fortawesome/free-regular-svg-icons';
import APIButtonList from './APIButtonList';
import MediaSettingBar from './MediaSettingBar';

const SettingBarContainer = styled.div`
    width:100%;height:100%;
    background-color:#4b544d;
    .env-setting-wrapper{
        width:100%;height:25.5px;
        .env-setting-button{
            width:100%;height:100%;
            background-color:#141c16;
            color:#fff;
            font-size:var(--call-api-button);
            font-weight:bold;
            box-sizing:border-box;
            padding: 0 15.5px;
            line-height:25.5px;
            cursor:pointer;
            &.on{
                background-color:#4b544d;
            }
        }
    }
    .setting-bar-wrapper{
        width:100%;height: calc(100% - 25.5px);
        position:relative;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:space-between;
        .media-setting-bar{
            position:absolute;
            top:0;left:0;
            z-index:1001;
            width:100%;height:100%;
            padding-top: 15.5px;
            box-sizing: border-box;
            background: #4b544d;
            .media-setting-bar-wrap{
                width:calc(100% - 64px);
                height:auto;
                margin:0 auto;
                .media-controller-box{
                    width:100%;height:auto;
                    .controller-name{
                        width:100%;height:auto;
                        padding:5.5px 0;
                        font-size: var(--call-api-button);
                        color:#fff;
                        box-sizing:border-box;
                    }
                    .controller{
                        width:100%;height:auto;
                        padding:1.5px 0;
                        background-color:#4b544d;
                    }
                }
            }
        }
        .initial-page{
            position:absolute;
            top:0;left:0;
            z-index:10;
            width:100%;height:100%;
            background-color:#4b544d;
            display:flex;flex-direction:column;
            align-items:center;
            justify-content:center;
            .message-component{
                width: 85%;height: auto;
                .icon-box{
                    width:100%;height:300px;
                    display:flex;
                    justify-content:center;align-items:center;
                    font-size:155px;
                }
                .text-box{
                    width:100%;height:auto;
                    font-size:var(--call-api-button);
                    color:#bbc7be;
                    text-align: center;
                    line-height: 18.5px;
                }
            }
        }
        .setting-bar{
            width:100%;height:auto;
            display:flex;
            flex-direction:column;
            align-items:center;
            .button-component{
                position:relative;
                width:calc(100% - 64px);height:32.5px;
                border-radius:5.5px;
                background-color:#141c16;
                font-size:var(--call-api-button);
                font-weight:bold;
                line-height:32.5px;
                text-align:center;
                color:#fff;
                margin:15.5px 0;
                cursor:pointer;
                .choose-face-expression-component{
                    position:absolute;
                    top:105.5%;left:0;
                    display: flex;
                    width:100%; height: 60.5px;
                    box-sizing:border-box;
                    border-radius:5.5px;
                    background-color:#141c16;
                    flex-direction:row;
                    align-items:center;
                    justify-content:space-evenly;
                    .expression{
                        width:45.3px;height:45.3px;
                        border-radius:5.5px;
                        background-color:#4b544d;
                        font-size:35.5px;line-height:45.3px;
                        color:#bbc7be;
                        text-align:center;
                        &:hover{
                            background-color:#bbc7be;
                            color:#141c16;
                        }
                    }
                    &.off{
                        display:none;
                    }
                    
                }
                &.disabled{
                    background-color:#bcc2be;
                    color:#fff;
                    cursor:none;
                    &:hover{
                        background-color:#bcc2be;
                        color:#fff;
                    }
                }
                &:hover{
                    background-color:#bbc7be;
                    color:#141c16;
                }
            }
        }
    }
`;



const SettingBar = memo(()=>{
    

    const [showMediaSetting,setshowMediaSetting]=useState(false);

    const {globalState}=useContext(PenManagerContext);

    return (
        <SettingBarContainer>
            <div className="env-setting-wrapper">
                <div onClick={()=>setshowMediaSetting(prev=>!prev)} 
                    className={`env-setting-button ${showMediaSetting&&'on'}`}
                >
                    SETTING
                </div>
            </div>
            <div className="setting-bar-wrapper">
                {
                    globalState===0&&
                    <div className="initial-page">
                        <div className="message-component">
                            <p className="icon-box">
                                <FontAwesomeIcon icon={faFaceGrin}/>
                            </p>
                            <p className="text-box">
                                아직 이미지 업로드가 안되어 있네요!<br/>
                                캔버스 가운데 '사진 촬영하기 버튼'
                                이나 상단에 '이미지 가져오기' 버튼을 클릭해 주세요.
                            </p>
                        </div>
                    </div>
                }
                <APIButtonList/>
                {
                    showMediaSetting&&
                    <MediaSettingBar/>
                }
            </div>
        </SettingBarContainer>
    )
})

export default SettingBar;