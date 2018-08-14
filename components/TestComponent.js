import React from 'react';
//import PropTypes from 'prop-types';
import moment from 'moment';
import {connect} from 'react-redux'


import './TestComponent.css';
import Calendar from "./Calendar/Calendar";
import Button from "./Buttons/Button";
import Modal from "./Modal/Modal";
import {openModal} from "./../src/actions/Modal_actions";
import {closeModal} from "../src/actions/Modal_actions";

import {popupEvents, EVENT_CLOSE_POPUPS} from "../events";

class TestComponent extends React.PureComponent {

    static path = '/';

    static propTypes = {
        //name: PropTypes.string.isRequired,
    };
    static defaultProps = {

        // month: moment(),
        //   prevMonth:moment().subtract(1, 'month'),
        //   nextMonth: moment().add(1, 'month')
    };


    constructor() {
        super();
        this.state = {...this.props};
        var moment = require('moment');
        const month = moment();
        const prevMonth = moment().subtract(1, 'month');
        const nextMonth = moment().add(1, 'month');

        this.state = ({
            month,
            prevMonth,
            nextMonth,
            newEvent: false,
            listEvents: false,
            upcoming: false,
            setting: false,
            selectedDay: moment(),
            selectedDayFormat: moment().format('YYYY MM DD')
        })
    }

    openModal = (type) => {
        this.props.dispatch(openModal())
        // switch (type) {
        //     case 'new':
        //         this.setState({newEvent:true});
        //         break;
        //     case 'listEvents':
        //         this.setState({listEvents:true});
        //         break;
        //     case 'upcoming':
        //         this.setState({upcoming:true});
        //         break;
        //     case 'settings':
        //         this.setState({settings:true});
        //         break;
        //     default:
        //         break;
        //
        //
        // }
    };

    selectDay = (day) => {
        var moment = require('moment');
        this.setState({selectedDay:day, selectedDayFormat:day.format('YYYY MM D')});
        this.props.toggleActive();
    }



    handlePrevMonth = () => {
        const {state: {month, prevMonth, nextMonth}} = this;
        var moment = require('moment');
        const newMonth = moment().set('M', month.get('M')).subtract(1, 'month');
        const newPrevMonth = moment().set('M', prevMonth.get('M')).subtract(1, 'month');
        const newNextMonth = moment().set('M', nextMonth.get('M')).subtract(1, 'month');
        // console.log(newMonth.format('YYYY MM D'))

        this.setState({month: newMonth, prevMonth: newPrevMonth, nextMonth: newNextMonth})


    };
    handleNextMonth = () => {
        const {state: {month, prevMonth, nextMonth}} = this;
        var moment = require('moment');
        const newMonth = moment().set('M', month.get('M')).add(1, 'month');
        const newPrevMonth = moment().set('M', prevMonth.get('M')).add(1, 'month');
        const newNextMonth = moment().set('M', nextMonth.get('M')).add(1, 'month');
        // console.log(newMonth.format('YYYY MM D'))

        this.setState({...this.state, month: newMonth, prevMonth: newPrevMonth, nextMonth: newNextMonth})
    };
    appMouseDown = () => {
        console.log('appMouseDown')
//console.log("React app mousedown - closing all popups...");
        popupEvents.emit(EVENT_CLOSE_POPUPS);
    };

    render() {
        console.log('пропсы', this.props);
        console.log('state', this.state);


        const {handlePrevMonth, handleNextMonth, selectDay} = this;
        const {state: {month, prevMonth, nextMonth, newEvent, listEvents, setting, upcoming, selectedDay}} = this;
        const {openModal} = this;

        return (
            <div onMouseDown={this.appMouseDown}>
                {this.props.modal.isOpen && <Modal value={selectedDay}/>}
                <div className="STestComponent">
                    <div className={'buttons_wrapper'}>
                        <Button title={'Новое событие'} type={'new'} cbOnclick={this.props.toggleActive}/>
                        <Button title={'Список событий'} type={'listArray'} cbOnclick={openModal}/>
                        <Button title={'Ближайшее событие'} type={'upcoming'} cbOnclick={openModal}/>
                        <Button title={'Настройки'} type={'settings'} cbOnclick={openModal}/>
                    </div>
                    <div className={'calendar_wrapper'}>
                        <button onClick={handlePrevMonth}>prev</button>
                        <Calendar date={prevMonth} cbSelectDay = {selectDay}/>
                        <Calendar date={month} cbSelectDay = {selectDay}/>
                        <Calendar date={nextMonth} cbSelectDay = {selectDay}/>
                        <button onClick={handleNextMonth}>next</button>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {modal:state.modal}
}

const mapDispatchToProps = function (dispatch, ownProps) {
    return {
        toggleActive: function() {
            dispatch(openModal());
        }
    }

};
{

}

export default connect(mapStateToProps, mapDispatchToProps)(TestComponent);
