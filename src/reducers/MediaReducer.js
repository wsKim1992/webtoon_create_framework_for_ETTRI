import produce from 'immer';

export const INIT_MEDIA_STATE = 'INIT_MEDIA_STATE';
export const CHANGE_MEDIA_BRIGHTNESS = 'CHANGE_MEDIA_BRIGHTNESS';
export const CHANGE_MEDIA_CONTRAST = 'CHANGE_MEDIA_CONTRAST';
export const CHANGE_MEDIA_SATURATION = 'CHANGE_MEDIA_SATURATION';

const initialState = {
    media_brightness: 1.0,
    media_contrast: 1.0,
    media_saturation: 1.0
};

const reducer = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case INIT_MEDIA_STATE:{
                draft.media_brightness=1.0;
                draft.media_contrast=1.0;
                draft.media_saturation=1.0;
                break;
            }
            case CHANGE_MEDIA_BRIGHTNESS:{
                draft.media_brightness=action.data;
                break;
            }
            case CHANGE_MEDIA_CONTRAST:{
                draft.media_contrast=action.data;
                break;
            }
            case CHANGE_MEDIA_SATURATION:{
                draft.media_saturation=action.data;
                break;
            }
    }
    })
}

export default reducer;