import {combineReducers} from 'redux';
import {reducer as form} from 'redux-form';
import auth from './authentication';
import admin  from './admin';
import core from './apiCore';
import user from './apiUser';
import markdown from './markdown';


const rootReducer = combineReducers({
    form,
    auth,
    admin,
    core,
    user,
    markdown
});
export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;