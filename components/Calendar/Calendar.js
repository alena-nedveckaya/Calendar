import React from 'react';
import propTypes from 'prop-types';
import './Calendar.css'
import Day from "../Day/Day";
import 'moment/locale/ru';
import connect from "react-redux/es/connect/connect";
import {openModal} from "../../src/actions/Modal_actions";

// import moment from 'moment/src/moment';

class Calendar extends React.PureComponent {
    static defaultProps = {};
    static propTypes = {};

    state = {}

    constructor() {
        super();

    }

    render() {
        const {props:{date}}=this;
        var moment = require('moment');
        moment.locale('ru');
        console.log('calendar date', date)

        let daysInMonth = date.daysInMonth();
        let firstDayInMonth = date.set('date',1).isoWeekday();

        // console.log('firstDayInMonth', firstDayInMonth);

        const Days = [...Array(daysInMonth)].map((v, i) => {
                return <Day key={i} date={date} day={i + 1} firstDayInMonth={firstDayInMonth} cbSelectDay={this.props.cbSelectDay}/>
            }
        );

        let currentMonthName = date.format('MMMM')
        return (
            <div>
                <div className={'calendar__title'}>{currentMonthName}</div>
                <div className={"wrapper"}>

                    {Days}
                </div>
            </div>
        )
    }
}

export default (Calendar);
