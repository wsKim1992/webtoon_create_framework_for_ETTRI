import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    position:absolute;
    width:200px;
    height:200px;
    margin:-100px -100px;
    top:50%;left:50%;
`
const ImageWrap = styled.div`
    position:absolute;
    width:100%;height:100%;
    display:flex;
    flex-direction:column;
    justify-content:space-evenly;
    align-item:center;
`

const StyledImg = styled.img`
    display:block;
    width:100%;
    height:56%;
`
const StyledPTag = styled.p`
    width:100%;
    height:33%;
    text-align:center;
`
const LoadingPage = ()=>{

    return (
        <Container>
            <ImageWrap>
                <StyledImg src="/assets/gif/giphy-unscreen.gif"/>
                <StyledPTag>로딩중</StyledPTag>
            </ImageWrap>
        </Container>
    )
}

export default LoadingPage;