import React from 'react';
import propTypes from 'prop-types';
import './Day.css'

class Day extends React.PureComponent{

    render(){
        const {props:{day, firstDayInMonth}} = this;
        let style = (day ===1)? {gridColumnStart: firstDayInMonth}:null
        return(
            <div className={'day'} style={style}>{day}</div>
        )
    }

}
export default Day;