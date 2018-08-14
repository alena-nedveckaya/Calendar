import React from 'react';
import propTypes from 'prop-types';
import './Day.css'
import {openModal} from "../../src/actions/Modal_actions";
import connect from "react-redux/es/connect/connect";

class Day extends React.PureComponent{

    addNewEvent = (e) => {
        var moment = require('moment');
        this.props.cbSelectDay(moment(this.props.date).set('date',this.props.day))

    };

    render(){
        const {props:{day, firstDayInMonth}, addNewEvent} = this;
        let style = (day ===1)? {gridColumnStart: firstDayInMonth}:null
        return(
            <div className={'day'} style={style} onClick={addNewEvent}>{day}</div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(Day);