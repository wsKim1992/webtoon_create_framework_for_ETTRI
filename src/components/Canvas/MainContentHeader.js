import React,{memo,useContext,useCallback} from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo,faRedo,faImage,faCamera } from '@fortawesome/free-solid-svg-icons';
import {actions,PenManagerContext} from '../Layout'

const MainContentHeaderWrapper = styled.div`
    width:calc(100% - 51px);height:100%;
    margin:0 auto;
    display:flex;flex-direction:row;
    align-items:center;
    justify-content:space-between;
    .history-button-list{
        width:auto;height:100%;
        display:flex;
        flex-direction:row;
        align-items:center;justify-content:space-evenly;
        .history-btn{
            width:30px;height:30px;
            cursor:pointer;
            font-size:var(--canvas-function-button-icon);
            color:#4b544d;font-weight:bold;
            line-height:30px;
            text-align:center;
        }
        .history-btn+.history-btn{
            margin-left:15.5px;
        }
    }
    .img-upload-btn-wrap{
        width:auto;height:100%;
        >input{display:none}
        label{
            user-select:none;
            display:block;
            width:auto;height:100%;
            display:flex;
            flex-direction:row;
            align-item:center;
            cursor:pointer;
            >p{
                width:auto;height:100%;
                text-align:center;
                line-height:55.5px;
                color:#4b544d;
                &.text{
                    font-size:var(--canvas-function-button);
                    font-weight:bold;
                }
                &.icon{
                    font-size:var(--canvas-function-button-icon);
                    font-weight:bold;
                }
            }
            p+p{
                margin-left:8.5px;
            }
        }
    }
    @media screen and (max-width:450px){
        width:calc(100% - 25.5px);
        .img-upload-btn-wrap{
            label{
                >p{
                    line-height:45.5px;
                }
            }
        }
    }
`;

const findElement = (element,findCondition,endCondition)=>{
    const classNameOfElement = element.tagName.toUpperCase()
    const classContainsCondition = element.classList.contains(findCondition);
    const flag = classNameOfElement===findCondition||classContainsCondition;
    if(flag){
        return element;
    }else{
        const classNameIsEndCondition = classNameOfElement===endCondition;
        const classContainsEndCondition = element.classList.contains(endCondition);
        const endFlag = classNameIsEndCondition||classContainsEndCondition;
        if(endFlag){
            return null;
        }else{
            return findElement(element.parentElement,findCondition,endCondition);
        }
    }
}

const adjustSize = (src)=>{
    return new Promise((resolve,reject)=>{
        try{
            const tempImage = new Image();
            tempImage.src= src;
            tempImage.onload=()=>{
                const widthOrHeight = tempImage.width>tempImage.height;
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width=512;
                tempCanvas.height=512;
                tempCanvas.getContext('2d').fillStyle="#fff";
                tempCanvas.getContext('2d').fillRect(0,0, tempCanvas.width, tempCanvas.height);
                const widthInDraw = widthOrHeight?tempCanvas.width:parseFloat(tempImage.width/tempImage.height)*tempCanvas.width;
                const heightInDraw = widthOrHeight?parseFloat(tempImage.height/tempImage.width)*tempCanvas.height : tempCanvas.height;
                const offsetLength = widthOrHeight?(tempCanvas.height-heightInDraw)/2:(tempCanvas.width-widthInDraw)/2;
                if(widthOrHeight){tempCanvas.getContext('2d').drawImage(tempImage,0,offsetLength,widthInDraw,heightInDraw);}
                else{tempCanvas.getContext('2d').drawImage(tempImage,offsetLength,0,widthInDraw,heightInDraw);}
                resolve(tempCanvas.toDataURL("image/jpeg"));
            }
        }catch(err){
            reject("적절한 이미지가 아닙니다.");
        }
    })
}

const MainContentHeader = memo(()=>{
    const {penStateDispatch}=useContext(PenManagerContext);

    const onClickMainContentHeader = useCallback((evt)=>{
        const {target:thisElement} = evt;
        const elementToReturn = findElement(thisElement,'history-btn','history-button-list');
        if(elementToReturn){
            const {direction} = elementToReturn.dataset;
            if(direction==="before"){
                penStateDispatch({type:actions.CHANGE_HISTORY_BACK});
            }else{
                penStateDispatch({type:actions.CHANGE_HISTORY_FRONT})
            }
        }
    },[])

    const onChangeFileInput = useCallback((evt)=>{
        const {files} = evt.target;
        const targetFile = files[0];
        try{
            if(targetFile===undefined){return false;}
            if(targetFile.type.match("image/*")){
                const fileReader = new FileReader();
                fileReader.onload=async(evt)=>{
                    const bs64 =await adjustSize(evt.target.result);
                    console.log(bs64);
                    penStateDispatch({type:actions.CHANGE_BACKGROUND_IMG,bs64});
                    evt.target.value='';
                }
                fileReader.readAsDataURL(targetFile);
    
            }else{
                window.alert("이미지 파일을 업로드 해주세요!");
                return false;
            }
        }catch(err){
            console.error(err);
        }
        
    },[])
    return (
        <MainContentHeaderWrapper  className="entire-wrapper">
            <div onClick={onClickMainContentHeader} className="history-button-list">
                <p data-direction={"before"} className="history-btn">
                    <FontAwesomeIcon icon={faUndo} />
                </p>
                <p data-direction={"after"} className="history-btn">
                    <FontAwesomeIcon icon={faRedo} />
                </p>
            </div>
            <div className="img-upload-btn-wrap">
                <input onChange={onChangeFileInput} id="imageFile" type="file" accept="image/*"/>
                <label htmlFor='imageFile'>
                    <p className='icon'>
                        <FontAwesomeIcon icon={faImage} />
                    </p>
                    <p className='text'>
                        이미지 가져오기
                    </p>
                </label>
            </div>        
        </MainContentHeaderWrapper>
    )
})

export default MainContentHeader;