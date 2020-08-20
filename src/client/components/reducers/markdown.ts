import {
  MarkdownState,
  MARKDOWN_SUCCESS,
  MARKDOWN_ERROR,
  MarkdownActionTypes
} from '../types/markdown';

const initialState: MarkdownState = {
  data: {
    title: '',
    subTitle: '',
    backgroundImage: '',
    __content: ''
  },
  error: {
    message: '',
    status: 0
  }
};

export default function (state = initialState, action: MarkdownActionTypes): MarkdownState {
  switch (action.type) {
    case MARKDOWN_SUCCESS:
      return {
        ...state,
        data: action.payload
      }
    case MARKDOWN_ERROR:
      return {
        ...state,
        error: action.payload
      }
    default:
      return state
  }
}
