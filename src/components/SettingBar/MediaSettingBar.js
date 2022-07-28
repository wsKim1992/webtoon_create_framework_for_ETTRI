import React, { useState, useCallback, memo } from "react";
import { useDispatch ,useSelector} from 'react-redux';
import 'antd/dist/antd.css';
import { Slider } from 'antd';
import {
    CHANGE_MEDIA_BRIGHTNESS,
    CHANGE_MEDIA_CONTRAST,
    CHANGE_MEDIA_SATURATION
} from '../../reducers/MediaReducer';

const MediaiSettingBar = memo(() => {
    const {
        media_brightness,
        media_contrast,
        media_saturation
    }=useSelector(state=>state.MediaReducer);
    const dispatch = useDispatch();

    const onChangeBrightness=useCallback((value)=>{
        dispatch({type:CHANGE_MEDIA_BRIGHTNESS,data:value})
    },[]);

    const onChangeContrast = useCallback((value)=>{
        dispatch({type:CHANGE_MEDIA_CONTRAST,data:value});
    },[]);

    const onChangeSaturation = useCallback((value)=>{
        dispatch({type:CHANGE_MEDIA_SATURATION,data:value});
    },[]);

    return (
        <div className="media-setting-bar">
            <div className="media-setting-bar-wrap">
                <div className="media-controller-box">
                    <p className="controller-name">
                        웹캠 밝기 조정
                    </p>
                    <div className="controller">
                        <Slider
                            step={0.01}
                            min={0}
                            max={2}
                            onChange={onChangeBrightness}
                            defaultValue={media_brightness}
                            value={media_brightness}
                        />
                    </div>
                </div>
                <div className="media-controller-box">
                    <p className="controller-name">
                        명암 대비 조정
                    </p>
                    <div className="controller">
                        <Slider
                            step={0.01}
                            min={0}
                            max={2}
                            onChange={onChangeContrast}
                            defaultValue={media_contrast}
                            value={media_contrast}
                        />
                    </div>
                </div>
                <div className="media-controller-box">
                    <p className="controller-name">
                        체도 조정
                    </p>
                    <div className="controller">
                        <Slider
                            step={0.01}
                            min={0}
                            max={2}
                            onChange={onChangeSaturation}
                            defaultValue={media_saturation}
                            value={media_saturation}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
});

export default MediaiSettingBar;

