import React,{memo} from 'react';
import styled from 'styled-components';
import CanvasTool from './CanvasTool';
import PalleteBar from './PalleteBar';

const PaintToolBarComponent = styled.div`
    width:100%;height:100%;
    padding:20.5px;
    box-sizing:border-box;
    .tool-box{
        width:100%;
        height:100%;
    }
`;

const PaintToolBar = memo(()=>{
    return(
        <PaintToolBarComponent>
            <div className="tool-box">
                <CanvasTool/>
                <PalleteBar/>
            </div>
        </PaintToolBarComponent>
    )
});

export default PaintToolBar;
