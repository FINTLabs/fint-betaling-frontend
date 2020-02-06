import React from 'react';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import { updateRecipients, updateSearchPage } from '../../../../data/redux/actions/payment';
import { SEARCH_PAGE_ROWS } from '../../constants';

const useStyles = makeStyles((theme) => ({
    table: {
        overflow: 'auto',
        minWidth: '100%',
        maxWidth: '100%',
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellName: {
        minWidth: '30%',
        maxWidth: '30%',
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellEmail: {
        minWidth: '30%',
        maxWidth: '30%',
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellNoPadding: {
        paddingTop: 0,
        paddingBottom: 0,
    },

}));

const IndividualTable = () => {
    const query = useSelector((state) => state.payment.form.searchValue);
    let suggestions = useSelector((state) => state.payment.form.filteredSuggestions);
    const recipients = useSelector((state) => state.payment.payment.recipients);
    const activePage = useSelector((state) => state.payment.form.page);
    const rowsPerPage = SEARCH_PAGE_ROWS;
    const suggestionLengthTemp = useSelector((state) => state.payment.form.suggestionLength);
    const suggestionsLength = query.length === 0 ? 0 : suggestionLengthTemp;
    suggestions = query.length === 0 ? [] : suggestions;
    const classes = useStyles();
    const dispatch = useDispatch();
    const tablePagination = suggestionsLength > 10
        ? (
            <TableRow>
                <TablePagination
                    rowsPerPageOptions={[rowsPerPage]}
                    colSpan={5}
                    count={suggestionsLength}
                    rowsPerPage={rowsPerPage}
                    page={activePage}
                    SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                />
            </TableRow>
        ) : null;

    function handleIndividualCheck(event, email, cellPhoneNumber, addressLine, addressZip, addressPlace) {
        const newArray = { ...recipients };
        newArray[event.target.value] = {
            checked: event.target.checked,
            name: event.target.name,
            email,
            cellPhoneNumber,
            addressLine,
            addressZip,
            addressPlace,
        };
        dispatch(updateRecipients(newArray));
    }

    function handleChangePage(event, newPage) {
        dispatch(updateSearchPage(newPage));
    }

    function handleChangeRowsPerPage() {
    }

    return (
        <Table className={classes.table} size="small">
            <TableHead>
                <TableRow>
                    <TableCell className={classes.tableCellName}>Navn</TableCell>
                    <TableCell align="left" className={classes.tableCellEmail}>E-postadresse</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Telefonnummer</TableCell>
                    <TableCell align="center" className={classes.tableCell}>Velg</TableCell>

                </TableRow>
            </TableHead>
            <TableBody>
                {
                    suggestions.map(
                        (suggestion) => {
                            const recipient = suggestion.name;
                            const matches = match(recipient, query);
                            const parts = parse(recipient, matches);

                            return (
                                <TableRow hover key={suggestion.id}>
                                    <TableCell align="left" className={classes.tableCellName}>
                                        {parts.map((part) => (
                                            <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
                                                {part.text}
                                            </span>
                                        ))}
                                    </TableCell>
                                    <TableCell align="left" className={classes.tableCellEmail}>
                                        {suggestion.email || ''}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {suggestion.mobile || ''}
                                    </TableCell>
                                    <TableCell align="center" className={classes.tableCell}>
                                        <Checkbox
                                            checked={recipients[suggestion.id] ? recipients[suggestion.id].checked : false}
                                            onChange={(event) => handleIndividualCheck(
                                                event,
                                                suggestion.email || '',
                                                suggestion.mobile || '',
                                                suggestion.postalAddress || '',
                                                suggestion.postalCode || '',
                                                suggestion.city || '',
                                            )}
                                            name={suggestion.name}
                                            value={suggestion.id}
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        },
                    )
                }
                {tablePagination}
            </TableBody>
        </Table>
    );
};

export default IndividualTable;
