import {
    UserError,
    UserState,
    UserDetail,
    UserActionTypes,
    FETCH_USER_DETAIL,
    USER_ERROR
} from "../types/apiUser";
import { signOut } from '.';

export function userError(error: UserError): UserActionTypes {
    return {
        type: USER_ERROR,
        payload: error
    };
}

export function fetchUser(userDetail: UserDetail): UserActionTypes {
    return {
        type: FETCH_USER_DETAIL,
        payload: userDetail
    };
}

export const syncUser = (site: string) => async (dispatch, getState, api) => {
    try {
        const response = await api.get(`/auth/sync-user`);
        return dispatch(fetchUser(response.data));
    } catch (err) {
        dispatch(signOut());
        return false;
    }
}

export const updateUserProfile = (site, uid, firstName, lastName, city, country, street, email, password) =>
    async (dispatch, getState, api) => {
        try {

            let user = {
                firstName, lastName, email, password, address: { city, country, street }
            };

            const response = await api.put(`/users/update/${uid}`, user);

            return response.data;
        } catch (error) {
            dispatch(userError(error.response.data));
            return false;
        }
    };