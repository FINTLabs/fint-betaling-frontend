import React from 'react';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Checkbox from '@mui/material/Checkbox';
import makeStyles from '@mui/styles/makeStyles';
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

const GroupMemberTable = ({
    members,
    recipients,
    handleIndividualCheck,
}) => {
    const classes = useStyles();
    return (
        <Table className={classes.individualTable}>
            <TableHead>
                <TableRow>
                    <TableCell>Navn</TableCell>
                    <TableCell align="center" className={classes.tableCell}>
                        Velg
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    members.sort((a, b) => (
                        a.name > b.name
                            ? 1 : -1
                    ))
                        .map(
                            (customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell
                                        align="left"
                                        className={classes.tableCell}
                                    >
                                        {customer.name}
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
    recipients: PropTypes.object.isRequired,
    handleIndividualCheck: PropTypes.func.isRequired,
};

export default GroupMemberTable;
