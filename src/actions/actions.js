import axios from "axios";
import {
    filterEndMass, setAllPup, setDecMass,
    setError, setExtMass, setIsFetching,
    setMonthPay, setMonthSum, setRepMass,
} from "../reducers/profileReducer";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
    timeout: 15_000,
});

const getErrorMessage = (error) => error?.response?.data?.message || "Не удалось выполнить запрос";

const saveExt = async (payload) => {
    const response = await api.post("/extentions/upsert", payload);
    localStorage.setItem("idNowLesson", response.data.id);
    return response.data;
};

export const getMonthPayExt = (idYear, idMonth) => async (dispatch) => {
    try {
        const response = await api.post("/extentions/calsMonth", { idYear, idMonth });
        dispatch(setMonthPay(response.data));
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    }
};

export const getMonthPayRep = (idYear, idMonth) => async (dispatch) => {
    try {
        const response = await api.post("/repeateble/getMonth", { idYear, idMonth });
        dispatch(setMonthSum(response.data));
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    }
};

export const getWeekExt = (idYear, idMonth, idStartDayWeek) => async (dispatch) => {
    try {
        const response = await api.post("/extentions/getWeek", { idYear, idMonth, idStartDayWeek });
        dispatch(setExtMass(response.data));
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    }
};

export const getWeekDec = (idYear, idMonth, idStartDayWeek) => async (dispatch) => {
    try {
        const response = await api.post("/extentions/getWeekDecayed", { idYear, idMonth, idStartDayWeek });
        dispatch(setDecMass(response.data));
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    }
};

export const getWeekRep = (idYear, idMonth, idStartDayWeek) => async (dispatch) => {
    try {
        const response = await api.post("/repeateble/getWeekNew", { idYear, idMonth, idStartDayWeek });
        dispatch(setRepMass(response.data));
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    } finally {
        dispatch(filterEndMass());
    }
};

export const getAllPup = () => async (dispatch) => {
    try {
        const response = await api.get("/repeateble/getAllPup");
        dispatch(setAllPup(response.data));
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    }
};

export const correctField = (idYear, idMonth, idStartDayWeek, idDay, startTime, durationTime, subj, namePup, cost, homework, isPayed) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        await saveExt({ idYear, idMonth, idStartDayWeek, idDay, startTime, durationTime, subj, namePup, cost, homework, isPayed, isDecayed: false });
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    } finally {
        dispatch(setIsFetching(false));
    }
};

export const decayLess = (idYear, idMonth, idStartDayWeek, idDay, startTime, durationTime, subj, namePup, cost, homework, isPayed) => async (dispatch) => {
    try {
        await saveExt({ idYear, idMonth, idStartDayWeek, idDay, startTime, durationTime, subj, namePup, cost, homework, isPayed, isDecayed: true });
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    }
};

export const saveActiveExt = (idYear, idMonth, idStartDayWeek, idDay, startTime, durationTime, subj, namePup, cost, homework, isPayed) => async (dispatch) => {
    try {
        await saveExt({ idYear, idMonth, idStartDayWeek, idDay, startTime, durationTime, subj, namePup, cost, homework, isPayed, isDecayed: false });
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    }
};

export const onSaveCorrect = (idYear, idMonth, idStartDayWeek, idDay, durationTime, subj, namePup, cost, homework, isPayed) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        const response = await api.post("/extentions/replace", {
            idYear,
            idMonth,
            idStartDayWeek,
            idDay,
            startTime: localStorage.getItem("newStartTime"),
            durationTime,
            subj,
            namePup,
            cost,
            homework,
            isPayed,
            isDecayed: false,
            idExt: localStorage.getItem("idNowLesson"),
        });
        localStorage.setItem("idNowLesson", response.data.id);
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    } finally {
        dispatch(setIsFetching(false));
    }
};

export const createExt = (idYear, idMonth, idStartDayWeek, idDay, startTime, durationTime, subj, namePup, cost) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        await saveExt({
            idYear, idMonth, idStartDayWeek, idDay, startTime, durationTime, subj, namePup, cost,
            homework: "", isPayed: false, isDecayed: false,
        });
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    } finally {
        dispatch(setIsFetching(false));
    }
};

export const deleteLess = (idDay, namePup) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        await api.post("/repeateble/delete", { idDay, name: namePup });
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    } finally {
        dispatch(setIsFetching(false));
    }
};

export const createRep = (idYear, idMonth, idStartDayWeek, idDay, startTime, durationTime, subj, namePup, cost) => async (dispatch) => {
    dispatch(setIsFetching(true));
    try {
        await api.post("/repeateble", { idYear, idMonth, idStartDayWeek, idDay, startTime, durationTime, subj, namePup, cost, isDecayed: false });
    } catch (error) {
        dispatch(setError(getErrorMessage(error)));
    } finally {
        dispatch(setIsFetching(false));
    }
};
