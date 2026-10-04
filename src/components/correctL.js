import {useEffect, useRef, useState} from "react";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {getMonthPayExt, getMonthPayRep, getWeekDec, getWeekExt, getWeekRep, onSaveCorrect} from "../actions/actions";
import {getWeekMass, setIsFetching} from "../reducers/profileReducer";
import {setCorrectVisible} from "../reducers/correctLesson";
import moment from "moment";
import PriceSelect from "./PriceSelect";
import FormSelect from "./FormSelect";

const hourOptions = Array.from({length: 15}, (_, index) => {
    const hour = index + 8;
    return {value: String(hour), label: String(hour).padStart(2, '0')};
});
const minuteOptions = Array.from({length: 12}, (_, index) => {
    const minute = index * 5;
    return {value: String(minute), label: String(minute).padStart(2, '0')};
});
const durationOptions = [
    {value: 1, label: '1 час'}, {value: 1.5, label: '1,5 часа'}, {value: 2, label: '2 часа'},
];
const weekdayOptions = [
    {value: '0', label: 'Понедельник'}, {value: '1', label: 'Вторник'}, {value: '2', label: 'Среда'},
    {value: '3', label: 'Четверг'}, {value: '4', label: 'Пятница'}, {value: '5', label: 'Суббота'}, {value: '6', label: 'Воскресенье'},
];



const CorrectL = ({fullYear, monthNumber, name, durMin, sub, cost, monthFullName, homeW, isPay}) => {
    const [selectedWeek, setSelectedWeek] = useState("");
    const [selectedDay, setSelectedDay] = useState("");
    const [timeStH, setTimeStH] = useState(0);
    const [timeStM, setTimeStM] = useState(0);
    const [cos, setCos] = useState(cost);
    const [durInHour, setDurInHour] = useState(durMin/60);
    const [isClosing, setIsClosing] = useState(false);
    const isVisible = useSelector(state => state.correctLess.isCorrectVisible);
    const dispatch = useDispatch();
    const fDay = useSelector(state => state.profile.fDay);
    const sDay = useSelector(state => state.profile.sDay);

    const closeDialog = () => {
        setIsClosing(true);
        window.setTimeout(() => {
            dispatch(setCorrectVisible(false));
            setIsClosing(false);
        }, 180);
    }

    const createDate = () => {//при формировании даты занятий
        let a = moment({ year :2023, month :0, day :1, hour :8, minute: 0, second :0, millisecond :0});
        let b = moment({ year :2023, month :0, day :1, hour :Number(timeStH), minute: Number(timeStM), second :0, millisecond :0});
        let diffMin = b.diff(a, 'minutes');
        let pushStartTime = diffMin / 5;
        localStorage.setItem('newStartTime', pushStartTime)
    }

    const delayButton = async () => {//при корректирвке и нажатии на сохранить
        dispatch(setIsFetching(true));
        let cos2 = Number(cos)
        let selWeek = Number(selectedWeek)
        if (selWeek > 0 ) await dispatch(onSaveCorrect(fullYear, localStorage.getItem('monthNumberN'), localStorage.getItem('fDayNext'), localStorage.getItem('dayWeekSelected'), durInHour*12, sub, name, cos2, homeW, isPay));
        else if (selWeek < 0 ) await dispatch(onSaveCorrect(fullYear, localStorage.getItem('monthNumberLast'), localStorage.getItem('fDayLast'), localStorage.getItem('dayWeekSelected'), durInHour*12, sub, name, cos2, homeW, isPay));
            else await dispatch(onSaveCorrect(fullYear, monthNumber, localStorage.getItem('fDay'), localStorage.getItem('dayWeekSelected'), durInHour*12, sub, name, cos2, homeW, isPay));
        dispatch(getWeekMass());
        await dispatch(getWeekExt(fullYear, monthNumber, localStorage.getItem('fDay')));
        await dispatch(getWeekDec(fullYear, monthNumber, localStorage.getItem('fDay')));
        await dispatch(getWeekRep(fullYear, monthNumber, localStorage.getItem('fDay')));
        await dispatch(getMonthPayExt(fullYear, monthNumber));
        await dispatch(getMonthPayRep(fullYear, monthNumber));
        closeDialog();
        dispatch(setIsFetching(false));
    }

    return(
        <div className={isVisible ? (isClosing ? "adderField adderField--closing" : "adderField") : "adderField-none"}>
            <div className="pupData">
                <input className="select-field-input text-center" value={name} placeholder="Имя"/>
                <div className="time-center">
                    <FormSelect value={timeStH} onChange={setTimeStH} options={hourOptions} placeholder="Часы" columns={3}/>
                    <FormSelect value={timeStM} onChange={setTimeStM} options={minuteOptions} placeholder="Минуты" columns={3}/>
                </div>
                <FormSelect value={durInHour} onChange={setDurInHour} options={durationOptions} placeholder="Длительность"/>
                <input className="select-field-input text-center" value={sub} placeholder="Предмет"/>
                <PriceSelect value={cos} onChange={setCos}/>
                <button className="top-auto" onClick={() => {
                    createDate()
                    delayButton()
                }}>Сохранить</button>
            </div>
            <div className="timeData">
                <FormSelect value={selectedWeek || '0'} onChange={setSelectedWeek} options={[
                    {value: '0', label: `${monthFullName} ${fDay} — ${sDay}`},
                    {value: '1', label: `${localStorage.getItem('monthNumberNext')} ${localStorage.getItem('fDayNext')} — ${localStorage.getItem('sDayNext')}`},
                    {value: '-1', label: `${localStorage.getItem('monthNumberL')} ${localStorage.getItem('fDayLast')} — ${localStorage.getItem('sDayLast')}`},
                ]} placeholder="Неделя" columns={1}/>
                <FormSelect value={selectedDay} onChange={(value) => {
                    setSelectedDay(value);
                    localStorage.setItem('dayWeekSelected', value);
                }} options={weekdayOptions} placeholder="День недели" columns={1}/>
                <button className="top-auto-close" onClick={closeDialog}>Закрыть</button>
            </div>
        </div>
    )
}

export default CorrectL;
