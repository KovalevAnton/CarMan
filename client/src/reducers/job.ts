import {
    CREATE_NEW_JOB,
    GET_JOBS
} from "../constants/actions";
import _ from 'lodash'

export const initialState = {
    jobs: [],

};

const job = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_NEW_JOB: {
            return { ...state, jobs: [...state.jobs, action.payload] };
        }
        case GET_JOBS: {
            return { ...state, jobs: action.payload };
        }
        default: {
            return state;
        }
    }
};

export default job;
