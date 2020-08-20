import {
    CoreError,
    CORE_ERROR,
    CoreActionTypes,
} from "../types/apiCore";

export function coreError(error: CoreError): CoreActionTypes {
    return {
        type: CORE_ERROR,
        payload: error
    };
}