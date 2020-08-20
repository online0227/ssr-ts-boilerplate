import {
    AdminState,
    ADMIN_ERROR,
    AdminActionTypes
} from '../types/admin';

const initialState: AdminState = {
    error: {
        message: '',
        status: 0
    },
};

export default function AdminReducer(state = initialState, action: AdminActionTypes): AdminState {
    switch (action.type) {
        case ADMIN_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};