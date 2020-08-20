export interface CoreError {
    message: string;
    status: number;
}

export interface CoreState {
    error: CoreError;
}

export const CORE_ERROR = "CORE_ERROR";

interface CoreErrorAction {
    type: typeof CORE_ERROR;
    payload: CoreError;
}

export type CoreActionTypes = CoreErrorAction;