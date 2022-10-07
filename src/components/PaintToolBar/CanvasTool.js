import React,{memo} from "react";
import styled from "styled-components";
import CanvasFunctionBtn from "./CanvasFunctionBtn";
import HistoryController from "./HistoryController";
import ShowPoint from "./ShowPoint";

const CanvasToolComponent = styled.div`
    width:100%;height:auto;
    .single-part{
        width:100%;height:75px;
        margin:15.5px 0;
    }
`;

const CanvasTool = ()=>{
    return (
        <CanvasToolComponent>
            <div className="canvas-btn-list single-part">
                <CanvasFunctionBtn/>
            </div>
            <div className="single-part">
                <HistoryController/>
            </div>
            <div className="single-part">
                <ShowPoint/>
            </div>
        </CanvasToolComponent>
    )
};

export default CanvasTool;
