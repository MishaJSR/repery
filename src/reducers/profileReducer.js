import _ from 'lodash';
import moment from "moment";

const SET_NOW_DAY = 'SET_NOW_DAY'
const WEEK_CHANGE = 'WEEK_CHANGE'
const PLUS_WEEK = 'PLUS_WEEK'
const MINUS_WEEK = 'MINUS_WEEK'
const GET_WEEK_MASS = 'GET_WEEK_MASS'
const SET_IS_FETCH = 'SET_IS_FETCH'
const SET_EXT_MASS = 'SET_EXT_MASS'
const SET_DEC_EXT_MASS = 'SET_DEC_EXT_MASS'
const SET_REPEAT_MASS = 'SET_REPEAT_MASS'
const SET_ERROR_MESS = 'SET_ERROR_MESS'
const FILTER_END_MASS = 'FILTER_END_MASS'
const FAKE_PLUS_WEEK = 'FAKE_PLUS_WEEK'
const FAKE_MINUS_WEEK = 'FAKE_MINUS_WEEK'
const SET_MONTH_SUM = 'SET_MONTH_SUM'
const SET_MONTH_PAY = 'SET_MONTH_PAY'
const SET_ALL_PUP = 'SET_ALL_PUP'
const monthName = [
    {name: 'Январь'},
    {name: 'Февраль'},
    {name: 'Март'},
    {name: 'Апрель'},
    {name: 'Май'},
    {name: 'Июнь'},
    {name: 'Июль'},
    {name: 'Август'},
    {name: 'Сентябрь'},
    {name: 'Октябрь'},
    {name: 'Ноябрь'},
    {name: 'Декабрь'},
]

const weekName = [
    {name: 'Понедельник'},
    {name: 'Вторник'},
    {name: 'Среда'},
    {name: 'Четверг'},
    {name: 'Пятница'},
    {name: 'Суббота'},
    {name: 'Воскресенье'},
]

const currentWeekStart = moment().startOf('isoWeek');
const currentWeekEnd = moment().endOf('isoWeek');

const defaultState = {
    nowDay: moment().format('e') - 1,
    firstWeekDay: null,
    secondWeekDay: null,
    nowDate: moment().format('DD'),
    nowMonth: moment().format('MM'),
    fDay: null,
    sDay: null,
    monthWeek: monthName[currentWeekStart.month()].name,
    endMonthWeek: monthName[currentWeekEnd.month()].name,
    monthNumber: currentWeekStart.month(),
    fullYear: currentWeekStart.year(),
    nowFullDate: null,
    ext: null,
    decExt: null,
    filtDecRep: null,
    repeateble: null,
    lessonsFilter: [],
    endLessonsMass: [],
    filtExt: [],
    dayMass: [],
    errorMessage: null,
    isFetch: true,
    errorMess: null,
    filterExt: null,
    payInWeek: null,
    nowPayInWeek: null,
    payInDay: null,
    nowPayInDay: null,
    monthSumCost: null,
    monthPayCost: null,
    allPup: null,
    secondWeekDayFull: null,
    firstWeekDayFull: null,
}


export default  function profileReducer(state= defaultState, action){
    switch (action.type) {

        case SET_IS_FETCH:
            return {
                ...state,
                isFetch: action.payload
            }
        case SET_EXT_MASS:
            return {
                ...state,
                ext: action.payload
            }

        case SET_NOW_DAY:
            return {
                ...state,
                nowDay: action.payload
            }

        case SET_REPEAT_MASS:
            return {
                ...state,
                repeateble: action.payload
            }
        case SET_DEC_EXT_MASS:
            return {
                ...state,
                decExt: action.payload
            }

        case SET_MONTH_SUM:
            return {
                ...state,
                monthSumCost: action.payload
            }

        case SET_MONTH_PAY:
            return {
                ...state,
                monthPayCost: action.payload
            }

        case SET_ERROR_MESS:
            return {
                ...state,
                errorMess: action.payload
            }

        case FILTER_END_MASS:
            let errExtRep = [] // надо удалить из ext
            let errRep = [] // надо удалить из repeat
            let dif = [] //будет итоговый совмещенный массив

            if (state.decExt.length > 0) {
                for (let i = 0; i < state.decExt.length; i++) {
                    state.repeateble.map((e) => {
                        if ((state.decExt[i].idDay === e.idDay) && (state.decExt[i].startTime === e.startTime)) {
                            if (!errRep.includes(e)) errRep.push(e);
                        }
                    })
                    state.ext.map((e) => {
                        if ((state.decExt[i].idDay === e.idDay) && (state.decExt[i].startTime === e.startTime)  && (state.decExt[i].id > e.id)) {
                            if (!errExtRep.includes(e)) errExtRep.push(e);
                        }
                    })
                }

                let extFilt = _.difference(state.ext, errExtRep);
                let filtRep = _.difference(state.repeateble, errRep);

                for (let i = 0; i < extFilt.length; i++) {
                    filtRep.map((e, index) => {
                        if ((extFilt[i].idDay === e.idDay) && (extFilt[i].startTime === e.startTime)) {

                            filtRep.splice(index, 1);
                        }
                    })
                }
                dif = extFilt.concat(filtRep);
            } else
            {
                let extFilt = _.difference(state.ext, errExtRep);
                let filtRep = _.difference(state.repeateble, errRep);

                for (let i = 0; i < extFilt.length; i++) {
                    filtRep.map((e, index) => {
                        if ((extFilt[i].idDay === e.idDay) && (extFilt[i].startTime === e.startTime)) {

                            filtRep.splice(index, 1);
                        }
                    })
                }

                dif = extFilt.concat(filtRep)
            }

            //calcPayWeek
            const sumOfFullCost = dif.reduce((acc, number) => acc + number.cost, 0);

            const truePayed = dif.filter(e => e.isPayed === true)
            const sumOfNowCost = truePayed.reduce((acc, number) => acc + number.cost, 0);

            //calcNowDayPay
            let nowD = Number(state.nowDay)

            const truePayedFildDay = dif.filter(e => e.idDay === nowD)
            const sumOfFullCostDay = truePayedFildDay.reduce((acc, number) => acc + number.cost, 0);
            const truePayedDay = truePayedFildDay.filter(e => e.isPayed === true)
            const sumOfNowCostDay = truePayedDay.reduce((acc, number) => acc + number.cost, 0);

            let dM = [[],[],[],[],[],[],[]]

            dif.map((e) => dM[e.idDay].push(e))

            return {
                ...state,
                errorMess: errRep,
                filtDecRep: dif,
                endLessonsMass: dM,
                payInWeek: sumOfFullCost,
                nowPayInWeek: sumOfNowCost,
                payInDay: sumOfFullCostDay,
                nowPayInDay: sumOfNowCostDay
            }


        case WEEK_CHANGE:
            const nowFullDateMoment = moment()
            const nowFullDateMoment2 = moment()
            const nowFullDate1 = moment().format('YYYY:MM:DD:HH:mm:ss')
            const endDayOfWeek1 = moment(nowFullDate1, 'YYYY:MM:DD:HH:mm:ss').endOf('isoWeek')
            const momentDate = moment(endDayOfWeek1)
            const firstDayOfWeek1 = momentDate.subtract(6, 'days')
            const firstDate1 = moment(firstDayOfWeek1).date()
            const endDate1 = moment(endDayOfWeek1).date()
            const firstFullDate1 = moment(firstDayOfWeek1).subtract(4, "hours").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            const endFullDate1 = moment(endDayOfWeek1).subtract(4, "hours").format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            const newMomentDateMon = nowFullDateMoment.date(firstDate1)
            const newMomentDateSun = nowFullDateMoment2.date(endDate1)
            return {
                ...state,
                nowFullDate: nowFullDate1,
                firstWeekDay: firstFullDate1,
                secondWeekDay: endFullDate1,
                firstWeekDayFull : newMomentDateMon,
                secondWeekDayFull: newMomentDateSun,
                fDay: firstDate1,
                sDay: endDate1,
                monthWeek: monthName[firstDayOfWeek1.month()].name,
                endMonthWeek: monthName[endDayOfWeek1.month()].name
            }



        case FAKE_MINUS_WEEK:
            const fakeMinusCopyFirst = moment(state.firstWeekDay)
            const fakeMinusCopySecond =  moment(state.secondWeekDay)
            const fakeMinusFirstDayMoment = fakeMinusCopyFirst.subtract(7, 'days')
            const fakeMinusFirstDay = fakeMinusFirstDayMoment.date()
            const fakeMinusSecondDayMoment = fakeMinusCopySecond.subtract(7, 'days')
            const fakeMinusSecondDay = fakeMinusSecondDayMoment.date()
            const fakeMinusMonth = fakeMinusFirstDayMoment.month()

            localStorage.setItem('fDayLast', fakeMinusFirstDay);
            localStorage.setItem('sDayLast', fakeMinusSecondDay);
            localStorage.setItem('monthNumberLast', fakeMinusMonth);
            localStorage.setItem('monthNumberL',  monthName[fakeMinusMonth].name)

            return {
                ...state,
            }


        case FAKE_PLUS_WEEK:
            const fakePlusCopyFirst = moment(state.firstWeekDay)
            const fakePlusCopySecond = moment(state.secondWeekDay)
            const fakePlusFirstDayMoment = fakePlusCopyFirst.add(7, 'days')
            const fakePlusFirstDay = fakePlusFirstDayMoment.date()
            const fakePlusSecondDayMoment = fakePlusCopySecond.add(7, 'days')
            const fakePlusSecondDay = fakePlusSecondDayMoment.date()
            const fakePlusMonth = fakePlusFirstDayMoment.month()
            localStorage.setItem('fDayNext', fakePlusFirstDay);
            localStorage.setItem('sDayNext', fakePlusSecondDay);
            localStorage.setItem('monthNumberNext', monthName[fakePlusMonth].name )
            localStorage.setItem('monthNumberN',  fakePlusMonth)
            return {
                ...state
            }

        case PLUS_WEEK:
            const plusCopyFirst = moment(state.firstWeekDay)
            const plusCopySecond = moment(state.secondWeekDay)
            const swapPlusFirstDayMoment = plusCopyFirst.add(7, 'days')
            const swapPlusFirstDay = swapPlusFirstDayMoment.date()
            const swapPlusSecondDayMoment = plusCopySecond.add(7, 'days')
            const swapPlusSecondDay = swapPlusSecondDayMoment.date()
            const swapPlusMonth = swapPlusFirstDayMoment.month()
            const swapPlusYear = swapPlusFirstDayMoment.year()
            localStorage.setItem('fDay', swapPlusFirstDay);
            localStorage.setItem('sDay', swapPlusSecondDay);
            localStorage.setItem('monthNumber', swapPlusMonth)

            return {
                ...state,
                firstWeekDay: swapPlusFirstDayMoment,
                secondWeekDay: swapPlusSecondDayMoment,
                fDay: swapPlusFirstDay,
                sDay: swapPlusSecondDay,
                monthWeek: monthName[swapPlusMonth].name,
                endMonthWeek: monthName[swapPlusSecondDayMoment.month()].name,
                monthNumber: swapPlusMonth,
                fullYear: swapPlusYear
            }

        case MINUS_WEEK:
            const minusCopyFirst = moment(state.firstWeekDay)
            const minusCopySecond = moment(state.secondWeekDay)
            const swapMinusFirstDayMoment = minusCopyFirst.subtract(7, 'days')
            const swapMinusFirstDay = swapMinusFirstDayMoment.date()
            const swapMinusSecondDayMoment = minusCopySecond.subtract(7, 'days')
            const swapMinusSecondDay = swapMinusSecondDayMoment.date()
            const swapMinusMonth = swapMinusFirstDayMoment.month()
            const swapMinusYear = swapMinusFirstDayMoment.year()

            localStorage.setItem('fDay', swapMinusFirstDay);
            localStorage.setItem('sDay', swapMinusSecondDay);
            localStorage.setItem('monthNumber', swapMinusMonth);

            return {
                ...state,
                firstWeekDay: swapMinusFirstDayMoment,
                secondWeekDay: swapMinusSecondDayMoment,
                fDay: swapMinusFirstDay,
                sDay: swapMinusSecondDay,
                monthWeek: monthName[swapMinusMonth].name,
                endMonthWeek: monthName[swapMinusSecondDayMoment.month()].name,
                monthNumber: swapMinusMonth,
                fullYear: swapMinusYear
            }


        case GET_WEEK_MASS:
            const startOfWeek = moment(state.firstWeekDay)
            const endOfWeek = moment(state.secondWeekDay)
            const weekDays = []
            while (startOfWeek.isSameOrBefore(endOfWeek)) {
                const formattedDay = weekName[startOfWeek.isoWeekday() - 1].name
                weekDays.push({ date: startOfWeek.date(), day: formattedDay })
                startOfWeek.add(1, 'days');
            }
            return {
                ...state,
                dayMass: weekDays
            }

        case SET_ALL_PUP:
            let data = new Date()
            data = data.setDate(data.getHours() + 4);
            return {
                ...state,
                allPup: action.payload,
                nowFullDate: data
            }

        default:
            return state
    }
}

export const setNowDay = (us) => ({type: SET_NOW_DAY, payload: us})
export const setNewWeek = () => ({type: WEEK_CHANGE})
export const plusWeek = () => ({type: PLUS_WEEK})
export const minusWeek = () => ({type: MINUS_WEEK})
export const getWeekMass = () => ({type: GET_WEEK_MASS})
export const setIsFetching = (bol) => ({type: SET_IS_FETCH, payload: bol})
export const setExtMass = (bol) => ({type: SET_EXT_MASS, payload: bol})
export const setRepMass = (bol) => ({type: SET_REPEAT_MASS, payload: bol})
export const setAllPup = (us) => ({type: SET_ALL_PUP, payload: us})
export const setError = (bol) => ({type: SET_ERROR_MESS, payload: bol})
export const filterEndMass = () => ({type: FILTER_END_MASS})
export const setDecMass = (bol) => ({type: SET_DEC_EXT_MASS, payload: bol})
export const fakePlusWeek = () => ({type: FAKE_PLUS_WEEK})
export const fakeMinusWeek = () => ({type: FAKE_MINUS_WEEK})
export const setMonthSum = (us) => ({type: SET_MONTH_SUM, payload: us})
export const setMonthPay = (us) => ({type: SET_MONTH_PAY, payload: us})

