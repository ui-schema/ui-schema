import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
    Link
} from "react-router-dom";
import {makeStyles} from '@material-ui/core/styles';

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
    return {id, date, name, shipTo, paymentMethod, amount};
}

const rows = [
    createData(0, '16 Mar, 2019', 'Elvis Presley', 'Tupelo, MS', 'VISA ⠀•••• 3719', 312.44),
    createData(1, '16 Mar, 2019', 'Paul McCartney', 'London, UK', 'VISA ⠀•••• 2574', 866.99),
    createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', 'MC ⠀•••• 1253', 100.81),
    createData(3, '16 Mar, 2019', 'Michael Jackson', 'Gary, IN', 'AMEX ⠀•••• 2000', 654.39),
    createData(4, '15 Mar, 2019', 'Bruce Springsteen', 'Long Branch, NJ', 'VISA ⠀•••• 5919', 212.79),
];

function preventDefault(event) {
    event.preventDefault();
}

const useStyles = makeStyles(theme => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
}));

export default function Orders() {
    const classes = useStyles();
    return (
        <React.Fragment>
            <table>Recent Orders</table>
            <table size="small">
                <thead>
                <tr>
                    <td>Date</td>
                    <td>Name</td>
                    <td>Ship To</td>
                    <td>Payment Method</td>
                    <td align="right">Sale Amount</td>
                </tr>
                </thead>
                <tbody>
                {rows.map(row => (
                    <tr key={row.id}>
                        <td>{row.date}</td>
                        <td>{row.name}</td>
                        <td>{row.shipTo}</td>
                        <td>{row.paymentMethod}</td>
                        <td align="right">{row.amount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className={classes.seeMore}>
                <Link color="primary" to={"/#"} onClick={preventDefault}>
                    See more orders
                </Link>
            </div>
        </React.Fragment>
    );
}
