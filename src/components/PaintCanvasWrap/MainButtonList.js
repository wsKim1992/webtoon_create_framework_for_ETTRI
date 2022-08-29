import React,{memo} from "react";
import styled from "styled-components";

const MainButtonList = memo(()=>{
    return (
        <div className="main-button-list-wrap">
            <button className="main-button">
                저장하기
            </button>
        </div>
    )
})

export default MainButtonList;