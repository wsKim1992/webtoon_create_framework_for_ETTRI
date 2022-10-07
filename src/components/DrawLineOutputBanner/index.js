import React, { memo, useContext, useCallback,useRef, useEffect } from 'react';
import outputSample1 from '../../assets/drawline_sample/drawline_sample_right/drawline_right/right1.png';
import outputSample2 from '../../assets/drawline_sample/drawline_sample_right/drawline_right/right2.png';
import outputSample3 from '../../assets/drawline_sample/drawline_sample_right/drawline_right/right3.png';
import outputSample4 from '../../assets/drawline_sample/drawline_sample_right/drawline_right/right4.png';
import outputSample5 from '../../assets/drawline_sample/drawline_sample_right/drawline_right/right5.png';
import { CHANGE_INPUT_IMAGE, DrawLineContext, findElement, src_type_obj ,img_type_obj} from '../Layout/DrawLineLayout'

const DrawlineInputBanner = memo(() => {
    const containerRef = useRef(null);
    const { 
        input_image_type,
        input_image_idx, 
        cartoonize_image_list,
        DrawLineDispatch 
    } = useContext(DrawLineContext);
    
    const onClickBox = useCallback((evt) => {
        const { target } = evt;
        const findCondition = 'IMG';
        const endCondition = 'output-image-banner-box'
        const element = findElement(target, findCondition, endCondition);
        if (element) {
            const { input_image_src_type,idx} = element.dataset;
            const input_image_src = element.src;
            DrawLineDispatch({ type: CHANGE_INPUT_IMAGE,input_image_idx:Number(idx), input_image_src_type, input_image_src,input_image_type: img_type_obj.CARTOONIZED_IMAGE});
        }
    },[])

    useEffect(()=>{
        if(containerRef.current){
            const singleImageWrapper = document.querySelectorAll('.single-image-wrapper');
            const singleImageWrapperLength = singleImageWrapper.length;
            const top = singleImageWrapper[singleImageWrapperLength-1].offsetTop;
            console.log(top);
            containerRef.current.scrollTo({
                top:containerRef.current.scrollHeight-top,
                behavior:'smooth'
            })
        }
    },[containerRef.current,cartoonize_image_list])

    return (
        <div ref={containerRef} onClick={onClickBox} className="output-image-banner-box">
            <div className={`${input_image_type===img_type_obj.CARTOONIZED_IMAGE&&input_image_idx===0?'single-image-wrapper on':'single-image-wrapper'}`}>
                <img  data-idx={0} data-input_image_src_type={src_type_obj.DIR_PATH} src={outputSample1} alt="single-image" />
            </div>
            <div
                className={`${input_image_type===img_type_obj.CARTOONIZED_IMAGE&&input_image_idx===1?'single-image-wrapper on':'single-image-wrapper'}`}
            >
                <img data-idx={1} data-input_image_src_type={src_type_obj.DIR_PATH} src={outputSample2} alt="single-image" />
            </div>
            <div 
                className={`${input_image_type===img_type_obj.CARTOONIZED_IMAGE&&input_image_idx===2?'single-image-wrapper on':'single-image-wrapper'}`}
            >
                <img data-idx={2} data-input_image_src_type={src_type_obj.DIR_PATH} src={outputSample3} alt="single-image" />
            </div>
            <div 
                className={`${input_image_type===img_type_obj.CARTOONIZED_IMAGE&&input_image_idx===3?'single-image-wrapper on':'single-image-wrapper'}`}
            >
                <img data-idx={3} data-input_image_src_type={src_type_obj.DIR_PATH} src={outputSample4} alt="single-image" />
            </div>
            <div 
                className={`${input_image_type===img_type_obj.CARTOONIZED_IMAGE&&input_image_idx===4?'single-image-wrapper on':'single-image-wrapper'}`}
            >
                <img data-idx={4} data-input_image_src_type={src_type_obj.DIR_PATH} src={outputSample5} alt="single-image" />
            </div>
            {
                cartoonize_image_list.map((v, i) => (
                    <div 
                        key={i}
                        className={`${input_image_type===img_type_obj.CARTOONIZED_IMAGE&&input_image_idx===i+5?'single-image-wrapper on':'single-image-wrapper'}`}
                    >
                        <img data-idx={i+5} data-input_image_src_type={v.src_type} src={v.src} alt="single-image" />
                    </div>
                ))
            }
        </div>
    )
})

export default DrawlineInputBanner;