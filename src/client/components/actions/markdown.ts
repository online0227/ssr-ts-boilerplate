import {
  MarkdownError,
  MarkdownData,
  MarkdownActionTypes,
  MARKDOWN_SUCCESS,
  MARKDOWN_ERROR
} from "../types/markdown";

export function fetchSuccess(response: MarkdownData): MarkdownActionTypes {
  return {
    type: MARKDOWN_SUCCESS,
    payload: response
  };
}

export function fetchError(error: MarkdownError): MarkdownActionTypes {
  return {
    type: MARKDOWN_ERROR,
    payload: error
  };
}

export const fetchMD_Homepage = (site: string) => async (dispatch, getState, api) => {
  try {
    const response = await api.get('/markdown/Homepage')
    const items: MarkdownData = await response.data;
    dispatch(fetchSuccess(items))
  } catch (err) {
    dispatch(fetchError(err.response.data))
  }
}