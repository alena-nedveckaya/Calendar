import React from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {closeModal} from "../../src/actions/Modal_actions";
import './Modal.scss'
import {EVENT_CLOSE_POPUPS, popupEvents} from "../../events";
import InputDate from "../InputDate/InputDate";

class Modal extends React.PureComponent{
    constructor(props){
        super(props);
        var moment = require('moment');
        let times = [];
        let minutes = 0;
        while (minutes!==1440){
            times.push(moment({hour:0, minute: 0}).add(minutes, 'm').format('HH:mm'))
            minutes += 30;
        }
        let reminder = [
            {title:'за 5 минут', value:5, time:'m'},
            {title:'за 15 минут', value:15, time:'m'},
            {title:'за 30 минут', value:30, time:'m'},
            {title:'за 1 ч', value:1, time:'h'},
            {title:'за 2 ч', value:2, time:'h'},
            {title:'за 1 дн', value:1, time:'d'},
            {title:'за 2 дн', value:2, time:'d'},
            {title:'за неделю', value:1, time:'w'}

        ];
        this.state ={
            currentTime: moment().get('h'),
            times,
            reminder,
            isChecked:false,
            selectedTime:'',
            selectedLabel:'',
            selectedTimePeriod:'',
            selectedTimeReminder:''
        }
    }
    // static propTypes = {
    //     dispatch:propTypes.func.isRequired,
    //     modal:propTypes.object.isRequired
    // }


    componentDidMount() {
        popupEvents.addListener(EVENT_CLOSE_POPUPS,this.props.toggleActive);
    };
    componentWillUnmount() {
        console.log('unmount')
        popupEvents.removeListener(EVENT_CLOSE_POPUPS, this.props.toggleActive);
        this.setState({
            isChecked:false,
            selectedTime:'',
            selectedLabel:'',
            selectedTimePeriod:'',
            selectedTimeReminder:''
        })
    }
        preventClosePopups = (event) => {
        event.stopPropagation();
    };

    isChangeSelectTime = (e)=>{
        this.setState({selectedTime:e.currentTarget.value})
        console.log(e.currentTarget.value)
    };
    isChangeSelectTimePeriod = (e)=>{
        this.setState({selectedTimePeriod:e.currentTarget.value})
        console.log(e.currentTarget.value)

    };
    isChangeSelectReminder = (e) =>{
        this.setState({selectedTimeReminder:e.currentTarget.value})
        console.log(e.currentTarget.value)
    };
    isChangeChecked = () => {
        this.setState({isChecked: !this.state.isChecked})
    };
    isChangeLabel = (e) =>{
        this.setState({selectedLabel:e.currentTarget.value})
    };
    isChangeNameEvent = (e) =>{
        this.setState({selectedNameEvent:e.currentTarget.value})
    };
    isChangeDescription = (e) =>{
        this.setState({selectedDescription:e.currentTarget.value})
    };

    saveCurrEvent = () => {
        const {selectedTime, selectedLabel, selectedTimeReminder, selectedTimePeriod ,selectedNameEvent, selectedDescription} = this.state;
        if(selectedNameEvent && selectedTime && selectedLabel && selectedTimeReminder && selectedDescription) {
            this.setState({
                newEvent: {
                    name: selectedNameEvent,
                    label: selectedLabel,
                    date: 'selectedNameEvent',
                    time: {start: selectedTime, end: selectedTimePeriod},
                    description: selectedDescription,
                },
                errorValid: false,
            })
        } else { this.setState({ errorValid: true }) }
    };

    render() {
        console.log('state модального окна', this.state)
        const {isOpen} = this.props.modal;
        const {times, reminder, isChecked, errorValid} = this.state;
        const {isChangeSelectTime, isChangeSelectReminder, isChangeChecked, isChangeLabel, isChangeSelectTimePeriod,isChangeNameEvent, isChangeDescription} = this;

        const {value} = this.props
        // var moment = require('moment');

        let optionsTimes = times.map((v,i) => <option key={i} value={v}>{v}</option>);
        let optionsReminder = reminder.map((v,i) => <option key={i} value={`${v.value} '${v.time}'`}>{v.title}</option>)


        if (!isOpen) return null;
        return (
            <div className={'newEvent__wrapper'} >
                <div className={'newEvent'} onMouseDown={this.preventClosePopups}>
                    <div className={'newEvent__title'}>Добавить новое событие
                    </div>
                    <div className={'newEvent__close-window'} onClick={this.props.toggleActive}>+</div>
                    <div className={'newEvent__row'}>
                        <input onBlur={isChangeNameEvent} placeholder={'Название события'}/>

                        <select defaultValue={'Выбрать метку'} onChange={isChangeLabel}>
                            <option value='' selected hidden>Выбрать метку</option>
                            <option value={'work'}>Работа</option>
                            <option value={'family'}>Семья</option>
                            <option value={'home'}>Дом</option>
                        </select>
                    </div>
                    <div className={'newEvent__date'}>
                        <div>Выберите дату:</div>
                        <InputDate defValue={value.toDate()}/>
                    </div>
                    <div className={'newEvent__time'}>
                        <div>Выберите время:</div>
                       <select onChange={isChangeSelectTime}>
                           {optionsTimes}
                       </select>
                        {isChecked &&
                        <select onChange={isChangeSelectTimePeriod}>
                            {optionsTimes}
                        </select>}
                    </div>
                    <div className={'newEvent__checkbox'}>
                        <input className={'switcher__input'} type={'checkbox'} name={'period'} id={'switcher'} onClick={isChangeChecked} checked={isChecked} />
                        <label className={'switcher__label'} htmlFor="switcher"><span className={'switcher__text'}>Период</span></label>
                    </div>
                    <div className={'newEvent__remember'}>
                        <select defaultValue={'Напомнить за..'} onChange={isChangeSelectReminder}>
                            <option value='' selected hidden>Напомнить за..</option>
                            {optionsReminder}
                        </select>
                    </div>
                    <div className={'newEvent__description'}>
                        <textarea onChange = {isChangeDescription} placeholder={'Примечание'}/>
                    </div>
                    {errorValid && <div className={"newEvent__error"}>Заполните все поля для события</div>}
                    <div className={'newEvent__buttons'}>
                        <button>Отмена</button>
                        <button onClick = {this.saveCurrEvent}>Сохранить</button>
                    </div>
                </div>
            </div>
        );
    }

}

function mapStateToProps(state) {
    return {
        modal:state.modal
    }
}
const mapDispatchToProps = function(dispatch, ownProps) {
    return {
        toggleActive: function() {
            dispatch(closeModal());
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Modal)