import {
    AuthInfo,
    AuthError,
    SIGN_IN,
    SIGN_OUT,
    SIGN_ERROR,
    AuthActionTypes
} from '../types/authentication';

export function signError(error: AuthError): AuthActionTypes {
    return {
        type: SIGN_ERROR,
        payload: error
    };
}

export function signIn(data: AuthInfo): AuthActionTypes {
    return {
        type: SIGN_IN,
        payload: data
    };
}

export function signOut(): AuthActionTypes {
    return {
        type: SIGN_OUT
    };
}

export const signUp = (site: string, email: string, password: string, failed: Function = null) => async (dispatch, getState, api) => {
    try {
        const response = await api.post(`auth/register`, { email, password }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });

        return true;

    } catch (error) {
        if (failed) failed();
        dispatch(signError(error.response.data));
        return false;
    }
}

export const Login = (site: string, email: string, password: string, failed: Function = null) => async (dispatch, getState, api) => {
    try {
        const response = await api.post(`/auth/login`, { email: email, password: password }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        });

        dispatch(signIn(response.data));
        return true;

    } catch (error) {
        if (failed) {
            failed();
        }

        dispatch(signError(error.response.data));
        return false;
    }
}

export const refreshToken = (site: string) => async (dispatch, getState, api) => {
    try {
        const response = await api.post(`/auth/refresh-token`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            withCredentials: true
        });

        if (response.data) {
            dispatch(signIn(response.data));
        }
    } catch (error) {
        console.log("refreshing token error : ", error.response.data);
    }
}

export const fetchSignOut = (site: string) => async (dispatch, getState, api) => {
    try {
        const response = await api.post(`/auth/logout`);
        dispatch(signOut());
        return response.data;
    } catch (error) {
        dispatch(signError(error.response.data));
        return false;
    }
}