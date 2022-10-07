import React,{memo} from 'react';

const UpperButtonList = memo(()=>{
    return (
        <div className="upper-button-list-wrap">
            <button className="canvas-button">
                초기화
            </button>
            <button className="canvas-button">
                파일 업로드
            </button>
        </div>
    )
})

export default UpperButtonList;

