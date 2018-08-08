import React from 'react';
import PropTypes from 'prop-types';
import './Buttons.css';

class Button extends React.PureComponent{
    static propTypes = {
        title: PropTypes.string,
        cbOnclick: PropTypes.func
    };
    state ={
        opened:false
    }
    handle = (e) => {
        this.setState ({opened:true});
        this.props.cbOnclick(this.props.type);
    };
    render (){
        const {props:{title}}= this;
        const {handle} = this;

        return <div >
            <button className={'button'} onClick={handle}>{title}</button>
        </div>
}
}
export default Button;