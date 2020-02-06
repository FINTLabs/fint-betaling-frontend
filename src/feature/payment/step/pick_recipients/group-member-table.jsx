import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';


const useStyles = makeStyles((theme) => ({
    individualTable: {
        backgroundColor: '#FFF',
        minWidth: '100%',
        marginBottom: theme.spacing(0.5),
        marginTop: theme.spacing(0.5),
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
    },
}));

const GroupMemberTable = ({ members, recipients, handleIndividualCheck }) => {
    const classes = useStyles();
    return (
        <Table className={classes.individualTable}>
            <TableHead>
                <TableRow>
                    <TableCell>Navn</TableCell>
                    <TableCell align="right" className={classes.tableCell}>
                        E-postadresse
                    </TableCell>
                    <TableCell align="right" className={classes.tableCell}>
                        Telefonnummer
                    </TableCell>
                    <TableCell align="right" className={classes.tableCell}>
                        Velg
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    members.map(
                        (customer) => (
                            <TableRow key={customer.id}>
                                <TableCell
                                    align="left"
                                    className={classes.tableCell}
                                >
                                    {customer.name}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    className={classes.tableCell}
                                >
                                    {customer.email || ''}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    className={classes.tableCell}
                                >
                                    {customer.mobile || ''}
                                </TableCell>
                                <TableCell
                                    align="center"
                                    className={classes.tableCell}
                                >
                                    <Checkbox
                                        onChange={handleIndividualCheck}
                                        name={customer.name}
                                        value={customer.id}
                                        checked={recipients[customer.id] ? recipients[customer.id].checked : false}
                                    />
                                </TableCell>
                            </TableRow>
                        ),
                    )
                }
            </TableBody>
        </Table>
    );
};

GroupMemberTable.propTypes = {
    members: PropTypes.array.isRequired,
    recipients: PropTypes.array.isRequired,
    handleIndividualCheck: PropTypes.func.isRequired,
};

export default GroupMemberTable;
