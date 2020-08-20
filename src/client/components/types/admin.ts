export interface AdminError {
    message: string;
    status: number;
}

export interface AdminState {
    error: AdminError;
}

export const ADMIN_ERROR = "ADMIN_ERROR";

interface AdminErrorAction {
    type: typeof ADMIN_ERROR;
    payload: AdminError;
}

export type AdminActionTypes = AdminErrorAction;