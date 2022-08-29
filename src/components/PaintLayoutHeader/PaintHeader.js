import React,{memo} from "react";
import styled from "styled-components";

const PaintHeaderContainer=styled.div`
    background-color:#fff;
    width:100%;height:100%;
`;

const PaintHeaderWrapper=styled.div`
    width:100%;
`;

const PaintHeader = memo(()=>{
    return (
        <PaintHeaderContainer>
            <PaintHeaderWrapper>
                
            </PaintHeaderWrapper>
        </PaintHeaderContainer>
    )
})

export default PaintHeader;