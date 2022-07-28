import React,{memo} from 'react';
import styled from 'styled-components';
import MainContentHeader from './MainContentHeader';
import Canvas from './Canvas'
/* import { PenManagerContext,actions } from '../Layout/Layout';  */

const MainContentContainer = styled.div`
    width:100%;height:100%;
    background-color:#bbc7be;
`;

const MainContentWrapper = styled.div`
    width:100%;height:100%;
    .function-container{
        width:100%;height:55.5px;
        box-shadow: 10.5px 0px 5px #4b544d;
        background-color:#fff;
    }
    .canvas-container1{
        width:100%;height:calc(100% - 55.5px);
        overflow-y:scroll;
    }
    @media screen and (max-width:450px){
        .function-container{
            height:45.5px;
        }
        .canvas-container1{
            width:100%;height:calc(100% - 45.5px);
        }
    }
`;

const CanvasWrap = memo(()=>{
    console.log('canvas Wrap')
    return(
        <MainContentContainer>
            <MainContentWrapper>
                <div className="function-container">
                    <MainContentHeader/>
                </div>
                <div className="canvas-container1">
                    <Canvas/>
                </div>
                
            </MainContentWrapper>
            
        </MainContentContainer>
    )
})

export default CanvasWrap;