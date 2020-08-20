import {
    AdminError,
    ADMIN_ERROR,
    AdminActionTypes
} from "../types/admin";

export function adminError(error: AdminError): AdminActionTypes {
    return {
        type: ADMIN_ERROR,
        payload: error
    };
}