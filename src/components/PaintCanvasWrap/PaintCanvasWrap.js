import React,{memo} from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
/* import UpperButtonList from './UpperButtonList'; */
import CanvasWrap from './CanvasWrap';
/* import MainButtonList from './MainButtonList'; */

const EntireCanvasWrap = styled.div`
    width:100%;height:100%;
    background-color:#E7E7DC;
    overflow-y:scroll;
    -ms-overflow-style:none;
    scrollbar-width:none;
    &::-webkit-scrollbar{
        display:none;
    }
    .upper-button-list{
        width:100%;
        height:62.5px;
        .upper-button-list-wrap{
            width:100%;height:100%;
            display:flex;
            align-items:center;
            justify-content:flex-start;
            .canvas-button{
                padding:10px;
                font-size:var(--canvas-function-button);
                color:#4b544d;
                margin:0 15.5px;
                border-radius:4.5px;
                border:1px solid #4b544d;
                background-color:#fff;
                &:hover{
                    border:1px solid #fff;
                    background-color:#4b544d;
                    color:#fff;
                }
            }
        }
    }
    .canvas-container{
        width:100%;height:100%;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        .canvas-wrap{
            width:1250px;height:auto;
            display:flex;
            align-items:center;
            justify-content:space-evenly;
            flex-direction:column;
            margin: 0 auto;
            .canvas-box{
                width:100%;
                height:100%;
                display: flex;
                align-items: center;
                justify-content: center;
                position:relative;
                .loading-component{
                    position:absolute;
                    top:0;left:0;
                    width:100%;height:100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(45,45,45,0.65);
                    >img{
                        display:block;
                        width:auto;
                        height:auto;
                        object-fit:contain;
                    }
                }
            }
            .canvas-button-list-wrap{
                margin-top: 15px;
                width:100%;height:45px;
                display:flex;
                flex-direction:row;
                align-items:center;
                justify-content:space-between;
                .init-button-wrap{
                    width:auto;height:100%;
                    .init-button{
                        height:100%;
                        padding:10.5px;
                        box-sizing:border-box;
                        border-radius:4.5px;
                        font-size:var(--canvas-function-button);
                        color:#4b544d;
                        background-color:#fff;
                        &:hover{
                            border:1px solid #bbc7be;
                            color:#bbc7be;background-color:#669DFD;
                        }
                    }
                }
                .paint-button{
                    height: 100%;
                    display:flex;
                    flex-direction:row;
                    align-items:center;
                    vertical-align:space-evenly;
                    .checkbox-wrap{
                        height: 100%;
                        line-height: 45px;
                        font-size: var(--canvas-function-button-icon);
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        #auto-paint-checkbox{
                            display: inline-block;
                            width: 25.5px;
                            height: 25.5px;
                            margin-right:10.5px;
                            accent-color:#3CF113;
                        }
                        margin-right:10.5px;
                    }
                    .paint-button-wrap{
                        height:100%;width:auto;
                        button{
                            display:inline-block;
                            height:100%;
                            padding:10.5px;
                            border-radius:4.5px;
                            font-size:var(--canvas-function-button);
                            color:#4b544d;
                            background-color:#fff;
                            &:hover{
                                border:1px solid #bbc7be;
                                color:#bbc7be;background-color:#4b544d;
                            }
                            &.disalbed{
                                border:1px solid #fff;
                                color:#bbc7be;background-color:#fff;
                                background:#454545;
                            }
                            &.disalbed:hover{
                                border:1px solid #fff;
                                color:#bbc7be;background-color:#fff;
                                background:#454545;
                            }

                        }
                    }
                }
            }
        }
        
    }
    .main-button-list{
        width:100%;height:62.5px;
        .main-button-list-wrap{
            width:100%;height:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            .main-button{
                padding:15.5px 10px;
                font-size:var(--canvas-function-button);
                border-radius:4.5px;
                color:#4b544d;
                border:1px solid #4b544d;
                background-color:#fff;
                &:hover{
                    border:1px solid #fff;
                    background-color:#4b544d;
                    color:#fff;
                }
            }
        }
    }
    @media screen and (max-width:2499px){
        .canvas-container{
            .canvas-wrap{
                width:850px;
            }
        }
    }
    @media screen and (max-width:1900px){
        .canvas-container{
            .canvas-wrap{
                width:615px;
            }
        }
    }
    @media screen and (max-width:1249px){
        .canvas-container{
            .canvas-wrap{
                width:682px;
            }
        }
    }
    @media screen and (max-width:1024px){
        .canvas-container{
            .canvas-wrap{
                width:682px;
            }
        }
    }
    @media screen and (max-width:655px){
        .canvas-container{
            .canvas-wrap{
                width:582px;
            }
        }
    }
    @media screen and (max-width:434px){
        .canvas-container{
            .canvas-wrap{
                width:315px;
            }
        }
    }
`;



const PaintCanvasWrap = memo(()=>{
    return(
        <EntireCanvasWrap>
            
                {/* <div className="upper-button-list">
                    <UpperButtonList/>
                </div> */}
                <div className="canvas-container">
                    <CanvasWrap/>
                </div>
                
                {/* <div className="main-button-list">
                    <MainButtonList/>
                </div> */}
        </EntireCanvasWrap>
    )
});

export default PaintCanvasWrap;
