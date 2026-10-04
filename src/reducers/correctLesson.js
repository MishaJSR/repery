import _ from 'lodash';
import moment from "moment";

const SET_IS_VISIBLE = 'SET_IS_VISIBLE'



const defaultState = {
    nowDay: moment().format('e') - 1,
    isCorrectVisible: null

}


export default  function correctLessReducer(state= defaultState, action){
    switch (action.type) {

        case SET_IS_VISIBLE:
            return {
                ...state,
                isCorrectVisible: action.payload
            }

        default:
            return state
    }
}

export const setCorrectVisible = (us) => ({type: SET_IS_VISIBLE, payload: us})
