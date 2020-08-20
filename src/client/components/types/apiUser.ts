export interface UserError {
    message: string;
    status: number;
}

export interface UserAddress {
    city: string;
    country: string;
    street: string;
}

export interface UserDetail {
    email: string;
    firstName: string;
    lastName: string;
    address: UserAddress;
}

export interface UserState {
    error: UserError;
    userDetail: UserDetail;
}

export const USER_ERROR = "USER_ERROR";
export const FETCH_USER_DETAIL = "FETCH_USER_DETAIL";

interface UserErrorAction {
    type: typeof USER_ERROR;
    payload: UserError;
}

interface FetchUserAction {
    type: typeof FETCH_USER_DETAIL;
    payload: UserDetail;
}

export type UserActionTypes = UserErrorAction | FetchUserAction;