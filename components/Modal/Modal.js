import React from 'react';
import propTypes from 'prop-types';
import {connect} from 'react-redux';
import {closeModal} from "../../src/actions/Modal_actions";
import './NewEvent.css'
import {EVENT_CLOSE_POPUPS, popupEvents} from "../../events";

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
            reminder
        }
    }
    // static propTypes = {
    //     dispatch:propTypes.func.isRequired,
    //     modal:propTypes.object.isRequired
    // }

    // closeModal = (eo) => {
    //     this.props.dispatch(closeModal())
    // };
    componentDidMount() {
        popupEvents.addListener(EVENT_CLOSE_POPUPS,this.props.toggleActive);



    };
    componentWillUnmount() {
        popupEvents.removeListener(EVENT_CLOSE_POPUPS, this.props.toggleActive);
    }


        preventClosePopups = (event) => {
        event.stopPropagation();
    };

    render() {
        console.log('пропсы модального окна', this.props.modal)
        const {isOpen} = this.props.modal;
        const {times, reminder} = this.state
        // var moment = require('moment');
        let optionsTimes = times.map((v,i) => <option key={i}>{v}</option>);
        let optionsReminder = reminder.map((v,i) => <option key={i}>{v.title}</option>)


        if (!isOpen) return null;
        return (
            <div className={'newEvent__wrapper'} >
                <div className={'newEvent'} onMouseDown={this.preventClosePopups}>
                    <div className={'newEvent__title'}>Добавить новое событие
                    </div>
                    <div className={'newEvent__close-window'} onClick={this.props.toggleActive}></div>
                    <div>
                        <input defaultValue={'Название события'}/>
                        <select defaultValue={'Выбрать метку'}>
                            <option>Работа</option>
                            <option>Семья</option>
                            <option>Дом</option>
                        </select>
                    </div>
                    <div>
                        {/*<input type="text" name="time" list="times"/>*/}
                            {/*<datalist id="times">*/}
                                {/*{options}*/}
                            {/*</datalist>*/}
                       <select>
                           {optionsTimes}
                       </select>
                    </div>
                    <div>
                        <select defaultValue={'Напомнить за..'}>
                            {optionsReminder}
                        </select>
                    </div>
                    <div>
                        <textarea defaultValue={'Примечание'}></textarea>
                    </div>
                    <div>
                        <button>Отмена</button>
                        <button>Сохранить</button>
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