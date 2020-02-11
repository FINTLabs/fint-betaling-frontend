import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TableBody from '@material-ui/core/TableBody';
import Checkbox from '@material-ui/core/Checkbox';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { Collapse, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import { updateGroupContentOpen, updateRecipients, updateSearchPage } from '../../../../data/redux/actions/payment';
import GroupMemberTable from './group-member-table';
import Pagination from '../../../../common/pagination';

const useStyles = makeStyles((theme) => ({
    table: {
        overflow: 'auto',
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellArrow: {
        cursor: 'pointer',
    },
    tableCellNoPadding: {
        paddingTop: 0,
        paddingBottom: 0,
    },
    rowSelected: {
        backgroundColor: theme.palette.secondary.main,
    },
}));

const GroupTable = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const query = useSelector((state) => state.payment.form.searchValue);
    const activePage = useSelector((state) => state.payment.form.page);
    const suggestionLengthTemp = useSelector((state) => state.payment.form.suggestionLength);
    const suggestionsLength = query.length === 0 ? 0 : suggestionLengthTemp;
    const groupContentOpen = useSelector((state) => state.payment.form.groupContentOpen);
    const recipients = useSelector((state) => state.payment.payment.recipients);

    let suggestions = useSelector((state) => state.payment.form.filteredSuggestions);
    suggestions = query.length === 0 ? [] : suggestions;


    function handleIndividualCheck(event) {
        const recipientList = { ...recipients };
        recipientList[event.target.value] = {
            checked: event.target.checked,
            name: event.target.name,
        };
        dispatch(updateRecipients(recipientList));
    }

    function handleGroupChange(event, individualList) {
        const recipientList = { ...recipients };
        for (let customer = 0; customer < individualList.length; customer += 1) {
            const customerNumber = individualList[customer].id;
            recipientList[customerNumber] = {
                checked: event.target.checked,
                name: individualList[customer].name,
                email: individualList[customer].email ? individualList[customer].email : '',
                cellPhoneNumber: individualList[customer].mobile ? individualList[customer].mobile : '',
                addressLine: individualList[customer].postalAddress ? individualList[customer].postalAddress : '',
                addressZip: individualList[customer].postalCode ? individualList[customer].postalCode : '',
                addressPlace: individualList[customer].city ? individualList[customer].city : '',
            };
        }
        dispatch(updateRecipients(recipientList));
    }

    function groupShouldBeChecked(customerList) {
        const { length } = customerList
            .filter((c) => recipients[c.id])
            .filter((c) => recipients[c.id].checked);
        return length === customerList.length && length > 0;
    }

    function groupCheckboxIndeterminateCheck(customerList) {
        const { length } = customerList
            .filter((c) => recipients[c.id])
            .filter((c) => recipients[c.id].checked);
        return length < customerList.length && length > 0;
    }

    function handleGroupOpenClick(recipient) {
        const newArray = { ...groupContentOpen };
        newArray[recipient] = !groupContentOpen[recipient];
        dispatch(updateGroupContentOpen(newArray));
    }


    function handleChangePage(event, newPage) {
        dispatch(updateSearchPage(newPage));
    }


    return (
        <Box>
            <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Navn</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Beskrivelse</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Velg</TableCell>
                        <TableCell align="right" className={classes.tableCell}>Vis innhold</TableCell>
                    </TableRow>
                </TableHead>
                {
                    suggestions.map(
                        (suggestion) => {
                            const recipient = suggestion.name;
                            const matches = match(recipient, query);
                            const parts = parse(recipient, matches);
                            return (
                                <TableBody key={suggestion.name}>
                                    <TableRow
                                        hover={!groupContentOpen[recipient]}
                                        className={groupContentOpen[recipient] ? classes.rowSelected : null}
                                    >
                                        <TableCell align="left" className={classes.tableCell}>
                                            {parts.map((part) => (
                                                <span
                                                    key={part.text}
                                                    style={{ fontWeight: part.highlight ? 500 : 400 }}
                                                >
                                                    {part.text}
                                                </span>
                                            ))}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            {suggestion.description}
                                        </TableCell>
                                        <TableCell align="right" className={classes.tableCell}>
                                            <Checkbox
                                                onChange={(event) => handleGroupChange(event, suggestion.customers)}
                                                value={suggestion.customers}
                                                indeterminate={groupShouldBeChecked(suggestion.customers)
                                                    ? false
                                                    : groupCheckboxIndeterminateCheck(suggestion.customers)}
                                                checked={groupShouldBeChecked(suggestion.customers)}
                                            />
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            className={classes.tableCellArrow}
                                            onClick={() => handleGroupOpenClick(recipient)}
                                        >
                                            <ArrowDropDown />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className={classes.tableCellNoPadding} colSpan={4}>
                                            <Collapse
                                                in={groupContentOpen[recipient]}
                                                timeout="auto"
                                                unmountOnExit
                                                style={{
                                                    display: 'block',
                                                    float: 'bottom',
                                                    minWidth: 'max-content',
                                                }}
                                            >
                                                <GroupMemberTable
                                                    recipients={recipients}
                                                    handleIndividualCheck={handleIndividualCheck}
                                                    members={suggestion.customers}
                                                />
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            );
                        },
                    )
                }

            </Table>
            <Pagination
                activePage={activePage}
                suggestionsLength={suggestionsLength}
                handleChangePage={handleChangePage}
            />

        </Box>
    );
};

export default GroupTable;
