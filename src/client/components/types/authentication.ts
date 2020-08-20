export interface AuthError {
    message: string;
    status: number;}

export interface AuthInfo {
    logged: boolean;
    email: string;
    uid: number;
    role: number;
}

export interface AuthState {
    error: AuthError;
    userInfo: AuthInfo;
}

export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";
export const SIGN_ERROR = "SIGN_ERROR";

interface SignInAction {
    type: typeof SIGN_IN;
    payload: AuthInfo;
}

interface SignOutAction {
    type: typeof SIGN_OUT;
}

interface SignErrorAction {
    type: typeof SIGN_ERROR;
    payload: AuthError;
}

export type AuthActionTypes = SignInAction | SignOutAction | SignErrorAction;