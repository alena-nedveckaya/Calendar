import React from 'react';
import PropTypes from 'prop-types';
import DayPicker, {DateUtils} from "react-day-picker";
import {EVENT_CLOSE_POPUPS, popupEvents} from '../../events';
import 'react-day-picker/lib/style.css';
import MomentLocaleUtils from "react-day-picker/moment";
// import Calendar from "../../../primitive/BPSsite/icons2/Calendar";

import './InputDate.scss'
// import Close from "../../../primitive/BPSsite/icons2/Close";
import {CSSTransition} from "react-transition-group";

const WEEKDAYS_SHORT = {
    ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
};
const MONTHS = {
    ru: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь',
    ],
};

const WEEKDAYS_LONG = {
    ru: [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота',
    ],
};

const FIRST_DAY_OF_WEEK = {
    ru: 1,
};
// Translate aria-labels
const LABELS = {
    ru: {nextMonth: 'следующий месяц', previousMonth: 'предыдущий месяц'},
};

class InputDate extends React.PureComponent {

    static defaultProps = {
        locale:                 'ru',
        numberOfMonths:         1,
        isOpen:                 false,
        pattern:                'DD.MM.YYYY',
        dateEnd:                new Date(),
        disabled:               false,
        cbChange:               null
    };

    constructor(props) {
        super(props);
        this.handleDayClick = this.handleDayClick.bind(this);

        this.state = {
            selectedDay: new Date(),
            // isDisabled: false,
            isOpen: false,
            editValue:this.toStringDate(this.props.defValue),
            value: this.props.defValue                         //this.toStringDate(this.props.defValue)
        };
    }
    mainClassCss = 'inputDate';
    componentDidMount() {
        popupEvents.addListener(EVENT_CLOSE_POPUPS, this.closeCalendar);
        this.changed( this.state.value)
    }
    componentWillUnmount() {
        popupEvents.removeListener(EVENT_CLOSE_POPUPS, this.closeCalendar);
    };
    closeCalendar= () =>{
    this.setState({isOpen: false})
};
    isExists = ( value ) => ( value !== null && value !== undefined );
    isNotEmpty = ( value ) => ( value !== null && value !== undefined && value.length > 0 );

    preventClosePopups = (event) => {
        event.stopPropagation();
    };

    handleDayClick(day, modifiers) {
        this.setState({
            value: day,
            editValue:this.toStringDate(day)
            // isDisabled: modifiers.disabled === true,
        });
    };
    inputBlur = ( e ) => {
        if ( !this.state.isReadOnly ) {
            let value = e.currentTarget.value;
            // console.log( 'DateInput: inputBlur: ', value );
            this.setNewValue( value );
        }
    };
    changed = ( value ) => {
        if ( this.props.cbChanged ) {
            this.props.cbChanged( value )
        }
    };
    handlerCalendar = () => {
        console.log('handlerCalendar', this.state.isOpen)
        this.setState({isOpen: !this.state.isOpen})
    };
    inputChange = ( e ) => {
        this.setState( {
            editValue: e.currentTarget.value,
        }, ()=>{
            // console.log( "input: ", this.state.editValue );
        } );
    };
    inputKeyDown = ( e ) => {

        let editValue
        switch( e.keyCode ) {
            case 13:
                e.currentTarget.blur();
                //this.inputBlur( e );
                break;
            case 27:
                editValue = this.analyzeValue( this.state.editValue );
                let escape = ( this.toStringDate( this.state.value ) === this.toStringDate( editValue ) );
                // console.log( 'ESCAPE: ', escape );
                if ( escape ) {
                    //this.inputBlur( e );
                    e.currentTarget.blur();
                }
                else {
                    this.setState( {
                        editValue: this.toStringDate( this.state.value ),
                    }, () => {} );
                }
                break;
        }
    };


    // closeCalendar = () => {this.setState({isOpen: !this.state.isOpen})};

    // handleDayClick = (day)=> {
    //     console.log("day selected", day.toLocaleDateString());
    //     this.setState({ selectedDay: day.toLocaleDateString() });
    // };


    toStringDate = ( dateObj ) => {
        let { pattern } = this.props;
        if ( this.isExists( dateObj ) && this.isExists( dateObj.getFullYear ) ) {
            let year = String(dateObj.getFullYear());
            let month = String(dateObj.getMonth() + 1);
            let day = String(dateObj.getDate());
            pattern = pattern.replace(/YYYY/g, year);
            pattern = pattern.replace(/YY/g, year.substr(2, 2));
            pattern = pattern.replace(/MM/g, month.padStart(2, '0'));
            pattern = pattern.replace(/DD/g, day.padStart(2, '0'));
            pattern = pattern.replace(/D\*/g, day);
            return pattern;
        } else return '';
    };


    analyzeValue = ( value ) => {
        let newValue = this.primaryEditorValueAnalysis( value );// returns { date: ..., month: ..., years: ... }
        // console.log('newvalue', newValue)
        newValue = this.dateValuesValidation( newValue.date, newValue.month, newValue.year );
        newValue = new Date( newValue.year, newValue.month, newValue.date );
        return newValue;
    };

    primaryEditorValueAnalysis = ( value ) => {
        let tempDate = new Date();
        let date =  '';
        let month = '';
        let year =  '';
        if ( this.isNotEmpty( value ) ) {
            //remove non-numbers from start and from the end
            let newValue = this.smartStrTrim( value );
            //find date
            newValue = this.checkNumberTillLengthOrNonNumber( newValue, 0, 2 );
            date = parseInt( newValue.value ) || tempDate.getDate();
            newValue = this.smartStrTrim( newValue.substring );
            newValue = this.checkNumberTillLengthOrNonNumber( newValue, 0, 2 );
            month = parseInt( newValue.value ) || ( tempDate.getMonth() + 1 );
            newValue = this.smartStrTrim( newValue.substring );
            newValue = this.checkNumberTillLengthOrNonNumber( newValue, 0, 4 );
            year = parseInt( this.primaryYearAnalysis( newValue.value ) ) || tempDate.getFullYear();
            //console.log( 'primaryAnalysis: date: ', date, ': month: ',month, ':year: ', year );
        }
        return { date: date, month: month, year: year };
    };

    smartStrTrim = ( value ) => {
        let newValue = '';
        if ( this.isNotEmpty( value ) ) {
            let i = 0;
            let t = parseInt( value.charAt( i ) );
            while( i < value.length && ( t === null || t === undefined || isNaN( t ) ) ) {
                t = parseInt( value.charAt( i ) );
                i++;
            }
            i = ( i > 0 ) ? --i : i;

            newValue = value.substring( i );
            if ( newValue.length > 0 )
                i = newValue.length - 1;
            do {
                t = parseInt( newValue.charAt( i ) );
                i--;
            } while( i >= 0 && ( t === null || t === undefined || isNaN( t ) ) );
            i = ( i >= 0 ) ? ( i + 2 ) : 0;
            newValue = newValue.substring( 0, i );
        }
        return newValue;
    };

    checkNumberTillLengthOrNonNumber = ( value, startPos, length ) => {
        let endPos = 0;
        if ( this.isNotEmpty( value ) ) {
            startPos = ( startPos !== null &&
                startPos !== undefined &&
                !isNaN( startPos ) ) ?
                startPos : 0 ;
            endPos = ( ( startPos + length ) <= value.length ) ?
                ( startPos + length - 1 ) : ( value.length - 1 );
        }
        let i = startPos;
        let t = parseInt( value.charAt( i ) );
        while( i <= endPos && t !== null && t !== undefined && !isNaN( t ) ) {
            t = parseInt( value.charAt( i ) );
            i++;
        }
        i = ( i === startPos ) ? i :
            ( t === null || t=== undefined || isNaN( t ) ) ? --i : i;
        let newValue = value.substring( startPos, i );
        return { value: newValue, substring: value.substring( i ) };
    };

    primaryYearAnalysis = ( year ) => {
        let nYear;
        if ( year !== null && year !== undefined && year.length > 0 ) {
            if ( year.length < 3 ) {
                nYear = parseInt( year );
                nYear = ( nYear > 40 && nYear < 100 ) ? ( 1900 + nYear ) : ( 2000 + nYear );
                nYear = nYear + '';
            }
            else nYear = year;
        }
        return nYear;
    };

    dateValuesValidation = ( date, month, year ) => {
        if ( this.isExists( date ) && this.isExists( month ) && this.isExists( year ) ) {
            //months 1..12 as it was filled in
            let testDate = new Date();
            let nYear = ( year < 1904 ) ? 1904 :
                ( year > ( testDate.getFullYear() + 96 ) ) ?
                    testDate.getFullYear() + 96 : year;
            let nMonth = month - 1;
            nMonth = ( nMonth < 0 ) ? 0 : ( nMonth > 11 ) ? 11 : nMonth;
            //months 0..11
            let months31 = [ 0, 2, 4, 6, 7, 9, 11 ];
            let months30 = [ 3, 5, 8, 10 ];
            let nDate = ( date < 1 ) ? 1 : date;
            if ( nMonth !== 1 ) {
                nDate = ( date > 31 && ( months31.indexOf( nMonth ) > -1 ) ) ? 31 :
                    date > 30 && ( months30.indexOf( nMonth ) > -1 ) ? 30 :
                        nDate;
            }
            else {
                nDate = ( nDate > 29 && this.isLeapYear( nYear ) ) ? 29 :
                    ( nDate > 28 ) ? 28 : nDate;
            }
            //returns months 0..11 for Date object
            return { date: nDate, month: nMonth, year: nYear }
        }
        else {
            return { date: date, month: month, year: year };
        }
    };
    setNewValue = ( newValue ) => {
        // console.log('setNewValue')
        if ( this.isExists( newValue ) ) {
            let newValue1 = ( this.isNotEmpty( newValue ) ) ? this.analyzeValue( newValue ) : null;
            // console.log( 'setNewValue: ', newValue1 );
            this.setState( {
                value: newValue1,
                editValue:  this.toStringDate( newValue1 ),
                dateArray:  this.fillDates( newValue1 ),
                yearsArray: this.fillYears( ( this.isExists( newValue1 ) ) ? newValue1.getFullYear() : null ),
            }, () => {
                // console.log( 'setNewValue: this.state.value: ', this.state.value );
                this.changed( this.state.value );
            } );
        }
    };
    fillDates = ( newDate ) => {
        if ( !this.isExists( newDate ) ) {
            newDate = new Date();
        }
        let startDate = new Date( newDate.getFullYear(), newDate.getMonth() );
        let day = startDate.getDay() - 1;
        day = ( day < 0 ) ? 6: day; // 0 - Monday
        startDate.setDate( startDate.getDate() - day );
        // console.log( 'DateInput: fillDate: startDate: ', startDate );
        let countDays = 0;
        let dateArray = [];
        for ( let j = 0; j < 6; j++ ) {
            dateArray[ j ] = [];
            for ( let i = 0; i < 7; i++ ) {
                dateArray[ j ][ i ] = new Date( startDate.getFullYear(),
                    startDate.getMonth(),
                    startDate.getDate() + countDays );
                countDays++;
            }
        }
        return dateArray;
    };
    fillYears = ( newYear ) => {
        let yearArray = null;
        newYear = ( this.isExists( newYear ) ) ? newYear : ( ( date ) => date.getFullYear() )( new Date() );
        // console.log( 'fillYears: newYear: ', newYear );
        if ( this.isExists( newYear ) ) {
            yearArray = [];
            let testDate = new Date();
            if ( newYear > ( testDate.getFullYear() + 96 ) ) {
                newYear = testDate.getFullYear() + 96;
            } else if ( newYear < 1904 ) {
                newYear = 1904;
            }
            for ( let i = newYear - 4; i < newYear + 5; i++ ) {
                yearArray.push( i );
            }
        }
        return yearArray;
    };


    render() {
        const {selectedDay, isDisabled, value, editValue} = this.state;
        const {locale, disabled} = this.props;
        const {mainClassCss} = this;
        console.log('inputDate', editValue)
        return (
            <div className={mainClassCss}>
                <div className={`${mainClassCss}__input-box`} data-dsi = {disabled} >
                    <input value={editValue}
                           onChange={this.inputChange}
                           className={`${mainClassCss}__input ${(disabled)? 'disabled': ''}`}
                           // onClick={this.handlerCalendar}
                           onMouseDown={this.preventClosePopups}
                           onKeyDown = { this.inputKeyDown }
                           onBlur = { this.inputBlur }
                           type={'text'}
                           disabled={disabled}
                           // disabled={true}
                    />
                    <div className={`${mainClassCss}__value--svg`} onClick={!disabled? this.handlerCalendar : null} onMouseDown={this.preventClosePopups}>
                        {/*<Calendar />*/}+
                    </div>
                </div>
                <CSSTransition classNames="fade"

                               in={this.state.isOpen}
                               unmountOnExit
                               timein={2}
                               timeout={2}>
                    <div className={``} onMouseDown={this.preventClosePopups}>
                        <div /*className={mainClassCss + "__header-menu--close-btn"}*/
                             onClick={this.handlerCalendar}>+
                            {/*<Close color={'rgba(27, 39, 51, 0.5)'}/>*/}
                        </div>

                        <DayPicker
                            localeUtils={MomentLocaleUtils}
                            locale={locale}
                            months={MONTHS[locale]}
                            weekdaysLong={WEEKDAYS_LONG[locale]}
                            weekdaysShort={WEEKDAYS_SHORT[locale]}
                            firstDayOfWeek={FIRST_DAY_OF_WEEK[locale]}
                            labels={LABELS[locale]}
                            selectedDays={value}
                            onDayClick={this.handleDayClick}
                            className={mainClassCss + '__day-picker'}
                            // disabled={true}
                            dayPickerProps={{
                                selectedDays: value,
                                disabledDays: {
                                    daysOfWeek: [0, 6],
                                },
                            }}
                        />
                    </div>
                </CSSTransition>
            </div>
        )
    }

}

export default InputDate














