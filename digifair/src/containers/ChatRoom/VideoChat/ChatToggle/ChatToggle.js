import React from 'react';

import classes from './ChatToggle.module.css';

const chatToggle = (props) => (
    // <div className={classes.} onClick={props.clicked}>

    // </div>
    <div className={classes.ChatToggle} onClick={props.toggle}>
        <div className={classes.Toggle}></div>
    </div>
);

export default chatToggle;