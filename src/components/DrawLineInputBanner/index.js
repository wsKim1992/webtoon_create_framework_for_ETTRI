import React,{memo,useContext,useCallback} from 'react';
import inputSample1 from '../../public/images/drawline/drawline_input/input_1.jpg';
import inputSample2 from '../../public/images/drawline/drawline_input/input_2.jpg';
import inputSample3 from '../../public/images/drawline/drawline_input/input_3.png';
import { CHANGE_INPUT_IMAGE, DrawLineContext, findElement, src_type_obj ,img_type_obj} from '../Layout/DrawLineLayout'

const DrawlineInputBanner = memo(()=>{

    const {
        input_image_type,
        input_image_idx, 
        person_image_list,
        DrawLineDispatch 
    }= useContext(DrawLineContext);

    const onClickBox = useCallback((evt) => {
        const { target } = evt;
        const findCondition = 'IMG';
        const endCondition = 'input-image-banner-box'
        const element = findElement(target, findCondition, endCondition);
        if (element) {
            const { input_image_src_type,idx} = element.dataset;
            const input_image_src = element.src;
            DrawLineDispatch({ type: CHANGE_INPUT_IMAGE,input_image_idx:Number(idx), input_image_src_type, input_image_src,input_image_type: img_type_obj.PERSON_IMAGE});
        }
    },[])

    return (
        <div onClick={onClickBox} className="input-image-banner-box">
            <div className={`${input_image_type===img_type_obj.PERSON_IMAGE&&input_image_idx===0?'single-image-wrapper on':'single-image-wrapper'}`}>
                <img data-idx={0} data-input_image_src_type={src_type_obj.DIR_PATH} src={inputSample1} alt="single-image"/>
            </div>
            <div className={`${input_image_type===img_type_obj.PERSON_IMAGE&&input_image_idx===1?'single-image-wrapper on':'single-image-wrapper'}`}>
                <img data-idx={1} data-input_image_src_type={src_type_obj.DIR_PATH} src={inputSample2} alt="single-image"/>
            </div>
            <div className={`${input_image_type===img_type_obj.PERSON_IMAGE&&input_image_idx===2?'single-image-wrapper on':'single-image-wrapper'}`}>
                <img data-idx={2} data-input_image_src_type={src_type_obj.DIR_PATH} src={inputSample3} alt="single-image"/>
            </div>
            {
                person_image_list.map((v,i)=>(
                    <div key={i} className={`${input_image_type===img_type_obj.PERSON_IMAGE&&input_image_idx===i+3?'single-image-wrapper on':'single-image-wrapper'}`}>
                        <img data-idx={i+3} data-input_image_src_type={v.src_type} src={v.src} alt="single-image" />
                    </div>
                ))
            }
        </div>
    )
})

export default DrawlineInputBanner;