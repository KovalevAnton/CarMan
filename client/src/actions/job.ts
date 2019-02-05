import {
    CREATE_NEW_JOB,
    GET_JOBS
} from "../constants/actions";
import io from "socket.io-client";
import _ from "lodash";
// import RNFetchBlob from 'rn-fetch-blob'
import { AsyncStorage } from "react-native";
import { doJsonAuthRequest, getToken, getRandomColor } from "./helper";
import { JOB_URL } from "./endpoinds";
import { CHAT_LIST_TIMESTAMP } from "../constants/storage";

export const createNewJob = (user, job) => async (dispatch) => {
    try {
        const newJob = await doJsonAuthRequest({
            url: JOB_URL,
            method: "post",
            data: { user, job }

        });
        dispatch({
            type: CREATE_NEW_JOB,
            payload: newJob
        });
    } catch (e) {
        console.log(e)
    }
};

export const getJobs = () => async (dispatch) => {
    try {
        const jobs = await doJsonAuthRequest({
            url: JOB_URL,
            method: "get"
        });
        dispatch({
            type: GET_JOBS,
            payload: jobs
        });
    } catch (e) {
        console.log(e)
    }
};