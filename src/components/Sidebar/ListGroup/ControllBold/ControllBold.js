import React,{useState,memo,useMemo, useEffect} from 'react';
import PropTypes from 'prop-types';
import s from '../ListGroup.module.scss';

const FULL_GAGE_PX = 48.0;
const CYLINDER_HEIGHT = 312.0;

const ControllBold = memo(({boldness})=>{
    
    const gageHeight = useMemo(()=>{
        console.log('useMemo');
        const gageHeightStr=parseFloat(boldness/FULL_GAGE_PX)*CYLINDER_HEIGHT;
        console.log(`${gageHeightStr}px`);
        return `${gageHeightStr}px`;
    },[boldness]);

    return(
        <React.Fragment>
            <div className={s.cylinder}>
                <Gage gageHeight={gageHeight}/>
            </div>
        </React.Fragment>
    )
})

const Gage = memo(({gageHeight})=>{
    console.log(`gageHeight : ${gageHeight}`);
    return(
        <div className={s.gage} style={{height:gageHeight}}></div>
    )
})

Gage.proptypes={
    gageHeight:PropTypes.string
}

ControllBold.proptypes = {
    boldness:PropTypes.number.isRequired
}

export default ControllBold;


