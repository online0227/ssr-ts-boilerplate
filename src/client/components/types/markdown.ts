export interface MarkdownError {
    message: string;
    status: number;
}

export interface MarkdownData {
    title: string;
    subTitle: string;
    backgroundImage: string;
    __content: string;
}

export interface MarkdownState {
    error: MarkdownError;
    data: MarkdownData;
}

export const MARKDOWN_ERROR = "MARKDOWN_ERROR";
export const MARKDOWN_SUCCESS = "MARKDOWN_SUCCESS";

interface MarkdownErrorAction {
    type: typeof MARKDOWN_ERROR;
    payload: MarkdownError;
}

interface FetchSuccessAction {
    type: typeof MARKDOWN_SUCCESS;
    payload: MarkdownData;
}

export type MarkdownActionTypes = MarkdownErrorAction | FetchSuccessAction;