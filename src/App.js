
import './App.css';
import arrowl from '../src/icons/left.png'
import loader from '../src/preloader/loader.png'
import arrowr from '../src/icons/right.png'
import {Link} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    fakeMinusWeek,
    fakePlusWeek,
    getWeekMass,
    minusWeek,
    plusWeek, setIsFetching,
    setNewWeek,
    setNowDay,
} from "./reducers/profileReducer";
import {
    saveActiveExt, correctField,
    createExt, createRep, decayLess,
    getMonthPayExt, getMonthPayRep,
    getWeekDec,
    getWeekExt,
    getWeekRep,
    deleteLess, getAllPup
} from "./actions/actions";
import moment from "moment";
import PreloaderLogin from "./preloader/Preloader";
import CorrectL from "./components/correctL";
import PriceSelect from "./components/PriceSelect";
import FormSelect from "./components/FormSelect";
import {setCorrectVisible} from "./reducers/correctLesson";

const formatMoney = (amount) => new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
}).format(Number(amount) || 0);

const paymentProgress = (paid, total) => {
    const safeTotal = Number(total) || 0;
    const percent = safeTotal > 0 ? Math.round(((Number(paid) || 0) / safeTotal) * 100) : 0;
    return Math.min(100, Math.max(0, percent));
};

const getTimelineHeight = () => {
    if (window.innerWidth < 981) return 840;
    return Math.max(560, window.innerHeight - 198);
};

const monthInDate = {
    Январь: 'января',
    Февраль: 'февраля',
    Март: 'марта',
    Апрель: 'апреля',
    Май: 'мая',
    Июнь: 'июня',
    Июль: 'июля',
    Август: 'августа',
    Сентябрь: 'сентября',
    Октябрь: 'октября',
    Ноябрь: 'ноября',
    Декабрь: 'декабря',
};

const hourOptions = Array.from({length: 15}, (_, index) => {
    const hour = index + 8;
    return {value: String(hour), label: String(hour).padStart(2, '0')};
});
const minuteOptions = Array.from({length: 12}, (_, index) => {
    const minute = index * 5;
    return {value: String(minute), label: String(minute).padStart(2, '0')};
});
const durationOptions = [
    {value: '12', label: '1 час'}, {value: '18', label: '1,5 часа'}, {value: '24', label: '2 часа'},
];
const subjectOptions = [
    {value: 'History', label: 'История'}, {value: 'Society', label: 'Обществознание'},
];
const weekdayOptions = [
    {value: '0', label: 'Понедельник'}, {value: '1', label: 'Вторник'}, {value: '2', label: 'Среда'},
    {value: '3', label: 'Четверг'}, {value: '4', label: 'Пятница'}, {value: '5', label: 'Суббота'}, {value: '6', label: 'Воскресенье'},
];


const App = () => {
    const refStH = useRef()
    const refStM = useRef()
    const refEnH = useRef()
    const refEnM = useRef()

        //create
    const [startHourNew, setStartHourNew] = useState("");
    const [startMinuteNew, setStartMinuteNew] = useState("");

    const [nameNew, setNameNew] = useState("");
    const [durMinNew, setDurMinNew] = useState("");
    const [subNew, setSubNew] = useState("");
    const [costNew, setCostNew] = useState("");
    const [checkedNew, setCheckedNew] = useState(false);

        //create
    const [name, setName] = useState("");
    const [timeStH, setTimeStH] = useState("");
    const [timeStM, setTimeStM] = useState("");
    const [timeEnH, setTimeEnH] = useState("");
    const [timeEnM, setTimeEnM] = useState("");
    const [durMin, setDurMin] = useState("");
    const [sub, setSub] = useState("");
    const [cost, setCost] = useState("");
    const [isPay, setIsPay] = useState("");
    const [idDay1, setIdDay1] = useState("");
    const [startTime1, setStartTime1] = useState("");
    const [displaySpanNew, setDisplaySpanNew] = useState(false);
    const [isNewDialogClosing, setIsNewDialogClosing] = useState(false);
    const [hasSelectedLesson, setHasSelectedLesson] = useState(false);
    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [timelineHeight, setTimelineHeight] = useState(getTimelineHeight);
    const [homeW, setHome] = useState("");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [selectedCreateDay, setSelectedCreateDay] = useState("");
    const nowDay = useSelector(state => state.profile.nowDay);
    const fDay = useSelector(state => state.profile.fDay);
    const sDay = useSelector(state => state.profile.sDay);
    const monthWeek = useSelector(state => state.profile.monthWeek);
    const endMonthWeek = useSelector(state => state.profile.endMonthWeek);
    const monthNumber = useSelector(state => state.profile.monthNumber);
    const fullYear = useSelector(state => state.profile.fullYear);
    const dayMass = useSelector(state => state.profile.dayMass);
    const endLessonsMass = useSelector(state => state.profile.endLessonsMass);
    const isFetch = useSelector(state => state.profile.isFetch);
    const payInWeek = useSelector(state => state.profile.payInWeek);
    const nowPayInWeek = useSelector(state => state.profile.nowPayInWeek);
    const payInDay = useSelector(state => state.profile.payInDay);
    const nowPayInDay = useSelector(state => state.profile.nowPayInDay);
    const monthSumCost = useSelector(state => state.profile.monthSumCost);
    const monthPayCost = useSelector(state => state.profile.monthPayCost);
    const nowDate = useSelector(state => state.profile.nowDate);
    const arrAllPup = useSelector(state => state.profile.allPup);
    const nowTime = new Date()
    const paymentSummary = [
        { label: 'За месяц', paid: monthPayCost, total: monthSumCost },
        { label: 'За неделю', paid: nowPayInWeek, total: payInWeek },
        { label: 'За день', paid: nowPayInDay, total: payInDay },
    ];
    const isMonthBoundaryWeek = monthWeek !== endMonthWeek;
    const headerMonth = isMonthBoundaryWeek ? `${monthWeek} — ${endMonthWeek}` : monthWeek;
    const weekRange = isMonthBoundaryWeek
        ? `${fDay} ${monthInDate[monthWeek]} — ${sDay} ${monthInDate[endMonthWeek]}`
        : `${fDay} — ${sDay} ${monthInDate[monthWeek]}`;
    const timeSlotHeight = timelineHeight / 168;
    const calendarStyle = {
        '--lesson-area-height': `${timelineHeight}px`,
        '--calendar-height': `${timelineHeight + 34}px`,
        '--line-10': `${34 + timelineHeight * 2 / 14}px`,
        '--line-12': `${34 + timelineHeight * 4 / 14}px`,
        '--line-14': `${34 + timelineHeight * 6 / 14}px`,
        '--line-16': `${34 + timelineHeight * 8 / 14}px`,
        '--line-18': `${34 + timelineHeight * 10 / 14}px`,
        '--line-20': `${34 + timelineHeight * 12 / 14}px`,
        '--line-22': `${34 + timelineHeight}px`,
    };

    const dispatch = useDispatch();

    const openNewDialog = () => {
        setIsNewDialogClosing(false);
        setDisplaySpanNew(true);
    }

    const closeNewDialog = () => {
        setIsNewDialogClosing(true);
        window.setTimeout(() => {
            setDisplaySpanNew(false);
            setIsNewDialogClosing(false);
        }, 180);
    }

    useEffect(  async () => {
        dispatch(setNewWeek())
        dispatch(fakePlusWeek())
        dispatch(fakeMinusWeek())
        await toStartLoader(fullYear)
    }, []);

    useEffect(() => {
        const updateTimelineHeight = () => setTimelineHeight(getTimelineHeight());
        window.addEventListener('resize', updateTimelineHeight);
        return () => window.removeEventListener('resize', updateTimelineHeight);
    }, []);

    const toStartLoader = async (fullY) => {
        dispatch(setIsFetching(true));
        dispatch(getWeekMass());
        await dispatch(getAllPup())
        await dispatch(getWeekExt(fullY, localStorage.getItem('monthNumber'), localStorage.getItem('fDay')))
        await dispatch(getWeekDec(fullY, localStorage.getItem('monthNumber'), localStorage.getItem('fDay')));
        await dispatch(getWeekRep(fullY, localStorage.getItem('monthNumber'), localStorage.getItem('fDay')))
        await dispatch(getMonthPayExt(fullY, localStorage.getItem('monthNumber')))
        await dispatch(getMonthPayRep(fullY, localStorage.getItem('monthNumber')));
        dispatch(setIsFetching(false));
    }

    const clickOnLessonPart = (ind) => {//при клике на день недели
        dispatch(setNowDay(ind))
    }

    const toggleLessonPayment = async (lesson) => {
        await dispatch(correctField(
            fullYear,
            monthNumber,
            localStorage.getItem('fDay'),
            lesson.idDay,
            lesson.startTime,
            lesson.durationTime,
            lesson.subj,
            lesson.namePup,
            lesson.cost,
            lesson.homework || '',
            !lesson.isPayed,
        ));
        setIsPay(!lesson.isPayed);
        await toStartLoader(fullYear);
    }

        const createNewDate = () => {//при формировании даты занятий для новых
        let a = moment({ year :2023, month :0, day :1, hour :8, minute: 0, second :0, millisecond :0});
        let b = moment({ year :2023, month :0, day :1, hour :startHourNew, minute: startMinuteNew, second :0, millisecond :0});
        let diffMin = b.diff(a, 'minutes');
        let pushNew = diffMin / 5;
        localStorage.setItem('newCreateStartTime', pushNew)
    }

    const correctSome = async () => {//при сохранении дз
        await dispatch(correctField(fullYear, monthNumber, localStorage.getItem('fDay'), idDay1, startTime1, durMin/5, sub, name, cost, homeW, isPay));
        await toStartLoader(fullYear)

    }

    const payedLesson = async () => {//при клике на оплатить
        if (isPay) {
            setIsPay(false)
            await  dispatch(correctField(fullYear, monthNumber, localStorage.getItem('fDay'), idDay1, startTime1, durMin / 5, sub, name, cost, homeW, false));
        }
        else {
            setIsPay(true)
            await dispatch(correctField(fullYear, monthNumber, localStorage.getItem('fDay'), idDay1, startTime1, durMin / 5, sub, name, cost, homeW, true));
        }
          await  toStartLoader(fullYear)

    }

    const createNewButton = async () => {//при клике на сохранить в новом занятии
        let dur = Number(durMinNew)
        let cos = Number(costNew)
        let selWeek = Number(selectedWeek);
        if (!checkedNew) {
            if (selWeek === 0) await dispatch(createExt(fullYear, monthNumber, fDay, localStorage.getItem('createDayWeekSelected'), localStorage.getItem('newCreateStartTime'), dur, subNew, nameNew, cos));
            else await dispatch(createExt(fullYear, localStorage.getItem('monthNumberN'), localStorage.getItem('fDayNext'),localStorage.getItem('createDayWeekSelected'), localStorage.getItem('newCreateStartTime'), dur, subNew, nameNew, cos));
        } else {
            if (selWeek === 0) await dispatch(createRep(fullYear, monthNumber, fDay, localStorage.getItem('createDayWeekSelected'), localStorage.getItem('newCreateStartTime'), dur, subNew, nameNew, cos));
            else await dispatch(createRep(fullYear, localStorage.getItem('monthNumberN'), localStorage.getItem('fDayNext'),localStorage.getItem('createDayWeekSelected'), localStorage.getItem('newCreateStartTime'), dur, subNew, nameNew, cos));
        }
        await toStartLoader(fullYear)
        closeNewDialog()
    }

    const reductButton = async () => {//при клике на корректировать
        await dispatch(saveActiveExt(fullYear, monthNumber, localStorage.getItem('fDay'), idDay1, startTime1, durMin/5, sub, name, cost, homeW, isPay));
        await toStartLoader(fullYear)
    }

    const reductButtonDec = async () => {//при клике на отмену
        await dispatch(decayLess(fullYear, monthNumber, localStorage.getItem('fDay'), idDay1, startTime1, durMin/5, sub, name, cost, homeW, isPay));
        await toStartLoader(fullYear)
    }

    const reductButtonDelete = async () => {//при клике на отмену
        await dispatch(deleteLess(idDay1, name));
        await toStartLoader(fullYear)
    }



    const changeWeekPlus = async () => {
        setHasSelectedLesson(false);
        setSelectedLessonId(null);
        dispatch(plusWeek());
        dispatch(fakePlusWeek())
        dispatch(fakeMinusWeek())
        await toStartLoader(fullYear)
    }

    const changeWeekMinus = async () => {
        setHasSelectedLesson(false);
        setSelectedLessonId(null);
        dispatch(minusWeek());
        dispatch(fakePlusWeek())
        dispatch(fakeMinusWeek())
        await toStartLoader(fullYear)
    }

  return (!isFetch && endLessonsMass.length > 0)?(
    <div className="app">
      <div className="header">
          <div className="pay" aria-label="Сводка выплат">
              <div className="pay-heading">
                  <span className="pay-heading__eyebrow">Финансы</span>
                  <span className="pay-heading__title">Выплаты</span>
              </div>
              <div className="payment-summary">
                  {paymentSummary.map(({label, paid, total}) => {
                      const progress = paymentProgress(paid, total);
                      return <article className="payment-card" key={label}>
                          <div className="payment-card__topline">
                              <span>{label}</span>
                              <span>{progress}%</span>
                          </div>
                          <div className="payment-card__amount">
                              <strong>{formatMoney(paid)}</strong>
                              <span>из {formatMoney(total)}</span>
                          </div>
                          <div className="progress" aria-label={`Оплачено ${progress}%`}>
                              <div className="prog_bar" style={{ width: `${progress}%` }}></div>
                          </div>
                      </article>
                  })}
              </div>
          </div>
          <div className="date_field">
              <Link to="/" onClick={changeWeekMinus}>
                  <img className="left_arrow" src={arrowl}></img>
              </Link>
              <Link to="/" onClick={changeWeekPlus}>
                  <img className="right_arrow" src={arrowr}></img>
              </Link>

              <div className="date-field__caption">Расписание занятий</div>
              <div className="year">{fullYear}</div>
              <div className="month">{headerMonth}</div>
              <div className="week">{weekRange}</div>
          </div>
      </div>
        <div className={hasSelectedLesson ? "main" : "main main--calendar-only"}>
            {hasSelectedLesson && <div className="activity">
                <input className="input_activity text-center" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя"/>
                <div className="timeF">
                    <input className="timeF_input text-center" ref={refStH} value={timeStH} onChange={(e) => setTimeStH(e.target.value)} />
                    <input className="timeF_input text-center" ref={refStM} value={(timeStM < 10)? "0" + timeStM : timeStM} onChange={(e) => setTimeStM(e.target.value)} />
                    <input className="timeF_input padR-10 text-center" ref={refEnH} value={timeEnH} onChange={(e) => setTimeEnH(e.target.value)} />
                    <input className="timeF_input text-center" ref={refEnM} value={(timeEnM < 10)? "0" + timeEnM : timeEnM} onChange={(e) => setTimeEnM(e.target.value)} />
                </div>
                <input className="input_activity text-center" value={durMin/60 + " ч"} onChange={(e) => setDurMin(e.target.value)} placeholder="Длительность"/>
                <input className="input_activity text-center" value={sub} onChange={(e) => setSub(e.target.value)} placeholder="Предмет"/>
                <div className="payField">
                    <input className="input_activity text-center payLabel" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="Стоимость"/>
                    <button className={(isPay)? "payButton green-but": "payButton"} onClick={() => {
                        payedLesson()
                    }
                    }></button>
                </div>
                <div className="homeFiled">
                    <div className="homeSpan text-center">
                        Homework
                    </div>
                    <textarea name="" id="" value={homeW} onChange={(e) => setHome(e.target.value)}></textarea>
                    <button className="saveDZ" onClick={() => correctSome()}>Сохранить</button>
                </div>



                <button className="correct activity-buttons" onClick={() => {
                    reductButton();
                    dispatch(setCorrectVisible(true))
                }}>Коррекция занятия</button>
                <button className="create-new activity-buttons" onClick={openNewDialog}>Создать новое занятие</button>
                <button className="delete-one activity-buttons" onClick={() => reductButtonDec()}
                >Удалить текущее занятие</button>
                <button className="end-work activity-buttons" onClick={() => reductButtonDelete()}>Удалить текущее и закончить работу с учеником</button>
            </div>}
            <div className="calendar_field" style={calendarStyle}>
                    <div className="lines8"></div>
                    <div className="lines10"></div>
                    <div className="lines12"></div>
                    <div className="lines14"></div>
                    <div className="lines16"></div>
                    <div className="lines18"></div>
                    <div className="lines20"></div>
                    <div className="lines22"></div>
                <div className="timeBar">

                </div>
                {!hasSelectedLesson && <button className="calendar-create" onClick={openNewDialog}>
                    + Создать занятие
                </button>}
                {dayMass.map((e, index) => {
                    return <div className="dayWeek_field" >
                        <div className="monthPart">
                            <span>{e.date}</span>
                            <span>.</span>
                            <span>{e.day}</span>
                        </div>
                        <div onClick={(event) => {
                            if (event.target === event.currentTarget) {
                                clickOnLessonPart(index);
                                setHasSelectedLesson(false);
                                setSelectedLessonId(null);
                            }
                        }} className={(Number(nowDate) === e.date )? "nowDayStyle lessonsPart" :  (nowDay == index)? "lessonsPart nowDayOnClickStyle" : "lessonsPart"}>
                            {endLessonsMass[index].map((e) => {
                                let currentTimeForFirst = new Date();
                                currentTimeForFirst.setHours(8, 0);
                                currentTimeForFirst.setMinutes(currentTimeForFirst.getMinutes() + 5*e.startTime);
                                let currentTimeForSecond = new Date();
                                currentTimeForSecond.setHours(8, 0);
                                currentTimeForSecond.setMinutes(currentTimeForSecond.getMinutes() + 5*e.durationTime + 5*e.startTime);
                                const dayLess = fDay + e.idDay
                                const minLess = (e.startTime + e.durationTime) * 5
                                const lessDate = new Date(fullYear, monthNumber, dayLess, 8, 0, 0)
                                lessDate.setMinutes(lessDate.getMinutes() + minLess)
                                let stylePass = ''
                                if (lessDate < nowTime) {
                                    stylePass = 'past'
                                }
                                let classBut = `button-style lesson-social-not-payed ${stylePass}`;

                                if (e.isPayed) {
                                    if (e.subj === 'History') {
                                        classBut = `button-style lesson-history-payed ${stylePass}`;
                                    } else {
                                        classBut = `button-style lesson-social-payed ${stylePass}`;
                                    }
                                } else if (e.subj === 'History') {
                                    classBut = `button-style lesson-history-not-payed ${stylePass}`;
                                }
                                if (selectedLessonId === e.id) classBut += ' lesson-selected';
                                return <div className={classBut}
                                               role="button"
                                               tabIndex="0"
                                               style={{ top:`${e.startTime * timeSlotHeight}px`, height:`${e.durationTime * timeSlotHeight}px`}}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    if (selectedLessonId === e.id) {
                                        setHasSelectedLesson(false);
                                        setSelectedLessonId(null);
                                        return;
                                    }
                                    setName(e.namePup);
                                    setTimeStH(currentTimeForFirst.getHours())
                                    setTimeStM(currentTimeForFirst.getMinutes())
                                    setTimeEnH(currentTimeForSecond.getHours())
                                    setTimeEnM(currentTimeForSecond.getMinutes())
                                    setSub(e.subj)
                                    setCost(e.cost)
                                    setIdDay1(e.idDay);
                                    localStorage.setItem('idChooseLess', e.id)
                                    setStartTime1(e.startTime);
                                    setDurMin(Number(e.durationTime)*5);
                                    setHome(e.homework);
                                    setHasSelectedLesson(true);
                                    setSelectedLessonId(e.id);
                                    if (!e.isPayed) setIsPay(false); else setIsPay(e.isPayed)
                                    if (!e.homework) setHome("")
                                }
                                }
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        event.currentTarget.click();
                                    }
                                }}>
                                    <button
                                        type="button"
                                        className={e.isPayed ? "lesson-payment-toggle lesson-payment-toggle--paid" : "lesson-payment-toggle"}
                                        aria-label={e.isPayed ? "Отменить оплату занятия" : "Отметить занятие оплаченным"}
                                        title={e.isPayed ? "Оплата отмечена" : "Отметить как оплаченное"}
                                        onClick={async (event) => {
                                            event.stopPropagation();
                                            await toggleLessonPayment(e);
                                        }}
                                    >{e.isPayed ? '✓' : '₽'}</button>
                                    <span>{e.namePup}</span>
                                    <br/>
                                    <span>{(currentTimeForFirst.getMinutes() === 0)? currentTimeForFirst.getHours()+":"+"00"
                                        : (currentTimeForFirst.getMinutes() === 5)? currentTimeForFirst.getHours()+":"+ "0" + currentTimeForFirst.getMinutes() : currentTimeForFirst.getHours()+":"+ currentTimeForFirst.getMinutes()}</span>
                                    <span>-</span>
                                    <span>{(currentTimeForSecond.getMinutes() === 0)? currentTimeForSecond.getHours()+":"+"00"
                                        : (currentTimeForSecond.getMinutes() === 5)? currentTimeForSecond.getHours()+":" + "0" + currentTimeForSecond.getMinutes() : currentTimeForSecond.getHours()+":" + currentTimeForSecond.getMinutes()}</span>
                                </div>
                            })}
                        </div>
                    </div>
                })
                }
            </div>
        </div>

        <div className={displaySpanNew ? (isNewDialogClosing ? "adderFieldNew adderField--closing" : "adderFieldNew") : "adderField-none"}>
            <div className="pupData">
                <input className="select-field-input text-center" list="options_pup" value={nameNew} onChange={(e) => setNameNew(e.target.value)} placeholder="Имя"/>
                <datalist id="options_pup">
                    {arrAllPup.map((value) => {
                        return <option value={value} />})}
                </datalist>
                <div className="time-center">
                    <FormSelect value={startHourNew} onChange={setStartHourNew} options={hourOptions} placeholder="Часы" columns={3}/>
                    <FormSelect value={startMinuteNew} onChange={setStartMinuteNew} options={minuteOptions} placeholder="Минуты" columns={3}/>
                </div>
                <FormSelect value={durMinNew} onChange={setDurMinNew} options={durationOptions} placeholder="Длительность"/>
                <FormSelect value={subNew} onChange={setSubNew} options={subjectOptions} placeholder="Предмет"/>
                <PriceSelect value={costNew} onChange={setCostNew}/>
                <button className="top-auto" onClick={() => {
                    createNewDate()
                    createNewButton()
                }}>Сохранить</button>
            </div>
            <div className="timeData">
                <FormSelect value={selectedWeek || '0'} onChange={setSelectedWeek} options={[
                    {value: '0', label: `${monthWeek} ${localStorage.getItem('fDay')} — ${localStorage.getItem('sDay')}`},
                    {value: '1', label: `${localStorage.getItem('monthNumberNext')} ${localStorage.getItem('fDayNext')} — ${localStorage.getItem('sDayNext')}`},
                ]} placeholder="Неделя" columns={1}/>
                <FormSelect value={selectedCreateDay} onChange={(value) => {
                    setSelectedCreateDay(value);
                    localStorage.setItem('createDayWeekSelected', value);
                }} options={weekdayOptions} placeholder="День недели" columns={1}/>
                <div className="isRepeat">
                    <input className="scale-check" type="checkbox" id="contactChoice1" checked={checkedNew} onChange={() => setCheckedNew(!checkedNew)}/> <label htmlFor="contactChoice1">Повторять каждую неделю</label>
                </div>
                <button className="top-auto-close" onClick={closeNewDialog}>Закрыть</button>
            </div>
        </div>
        <CorrectL fullYear={fullYear} name={name} cost={cost} monthNumber={monthNumber} durMin={durMin} homeW={homeW} isPay={isPay} monthFullName={monthWeek} sub={sub}></CorrectL>

    </div>
  ): (<>
      <PreloaderLogin img={loader}></PreloaderLogin>
  </>)
}

export default App;
