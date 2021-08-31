import React,{useState,memo, useEffect, useRef, useCallback,forwardRef, useContext} from 'react';
import PropTypes from 'prop-types';
import s from '../ListGroup.module.scss';
import { MAX_BOLDNESS } from '../../Sidebar';
import { PenManagerContext } from '../../../Layout/Layout';
const CYLINDER_HEIGHT = 312.0;

const ControllBold = memo(({basicBoldness,actionType})=>{
    const cylinderRef = useRef(null);
    const [gageHeight,setGageHeight]=useState(0);
    const {penStateDispatch}=useContext(PenManagerContext);

    useEffect(()=>{
        setGageHeight((basicBoldness/MAX_BOLDNESS)*parseFloat(cylinderRef.current.style.height.split('.')[0]));
    },[])

    useEffect(()=>{
        const boldness = (gageHeight/parseFloat(cylinderRef.current.style.height.split('.')[0]))*MAX_BOLDNESS;
        penStateDispatch({type:actionType,boldness})
    },[gageHeight])

    const onClickDiv = (e)=>{
        const {nativeEvent} = e;
        const cylinderClickedOffset = parseFloat(cylinderRef.current.style.height.split('.')[0])-nativeEvent.offsetY

        setGageHeight(cylinderClickedOffset)
    }

    return(
        <React.Fragment>
            <div onClick={onClickDiv} ref={cylinderRef} className={s.cylinder} style={{height:CYLINDER_HEIGHT}}>
                <Gage setGageHeight={setGageHeight} gageHeight={gageHeight}/>
            </div>
        </React.Fragment>
    )
})

const Gage = memo(({setGageHeight,gageHeight})=>{
    const clickedTemp = (e)=>{
        e.stopPropagation();
        console.log(gageHeight-e.nativeEvent.offsetY);
        setGageHeight(gageHeight-e.nativeEvent.offsetY);
    }
    return(
        <div onClick={clickedTemp} className={s.gage} style={{height:gageHeight}}></div>
    )
})

Gage.proptypes={
    gageHeight:PropTypes.string
}

ControllBold.proptypes = {
    boldness:PropTypes.number.isRequired
}

export default ControllBold;


