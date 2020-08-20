import {
    AuthState,
    SIGN_IN,
    SIGN_OUT,
    SIGN_ERROR,
    AuthActionTypes
} from '../types/authentication';

const initialState: AuthState = {
    error: {
        message: '',
        status: 0
    },
    userInfo: {
        logged: false,
        email: "",
        uid: null,
        role: null
    }
};

export default function (state = initialState, action: AuthActionTypes): AuthState {
    switch (action.type) {        case SIGN_IN:
            return {
                ...state,
                error: {
                    message: '',
                    status: 0
                },
                userInfo: { email: action.payload.email, uid: action.payload.uid, role: action.payload.role, logged: true }
            };
        case SIGN_OUT:
            return {
                ...state,
                error: {
                    message: '',
                    status: 0
                },
                userInfo: {
                    logged: false,
                    email: "",
                    uid: null,
                    role: null
                }
            };
        case SIGN_ERROR:
            return { ...state, error: action.payload };        default:
            return state;
    }
};