import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
    Link
} from "react-router-dom";
import {makeStyles} from '@material-ui/core/styles';
import Title from './Title';

function preventDefault(event) {
    event.preventDefault();
}

const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});

export default function Deposits() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Title>Recent Deposits</Title>
            <p>
                <h4>$3,024.00</h4>
            </p>
            <p className={classes.depositContext}>
                on 15 March, 2019
            </p>
            <div>
                <Link to={"/#"} onClick={preventDefault}>
                    View balance
                </Link>
            </div>
        </React.Fragment>
    );
}
