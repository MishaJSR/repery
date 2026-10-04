import {combineReducers} from "redux";
import {applyMiddleware, createStore} from "redux";
import profileReducer from "./profileReducer";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import correctLessReducer from "./correctLesson";

const rootReducer = combineReducers({
    profile: profileReducer,
    correctLess: correctLessReducer
})

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))