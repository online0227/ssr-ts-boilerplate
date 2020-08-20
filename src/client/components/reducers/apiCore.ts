import {
    CoreState,
    CORE_ERROR,
    CoreActionTypes
} from '../types/apiCore';

const initialState: CoreState = {
    error: {
        message: '',
        status: 0
    },
};

export default function (state = initialState, action: CoreActionTypes): CoreState {
    switch (action.type) {
        case CORE_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};