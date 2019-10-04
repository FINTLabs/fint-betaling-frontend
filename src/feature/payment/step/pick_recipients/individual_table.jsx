import React from 'react';
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import {makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {updateRecipients} from "../../../../data/redux/actions/payment";

const useStyles = makeStyles(theme => ({
    table: {
        overflow: 'auto',
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellNoPadding: {
        paddingTop: 0,
        paddingBottom: 0,
    }
}));

const IndividualTable = () => {
    const query = useSelector(state => state.payment.form.searchValue);
    let suggestions = useSelector(state => state.payment.form.filteredSuggestions);
    const recipients = useSelector(state => state.payment.payment.recipients);
    suggestions = query.length === 0 ? [] : suggestions;
    const classes = useStyles();
    const dispatch = useDispatch();

    function handleIndividualCheck(event) {
        const newArray = {...recipients};
        newArray[event.target.value] = {"checked": event.target.checked, "name": event.target.name};
        dispatch(updateRecipients(newArray));
    }

    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>Navn</TableCell>
                    <TableCell align="right" className={classes.tableCell}>E-postadresse</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Telefonnummer</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Velg som mottaker</TableCell>

                </TableRow>
            </TableHead>
            <TableBody>
                {
                    suggestions.map(
                        suggestion => {
                            const recipient = suggestion.fulltNavn;
                            const matches = match(recipient, query);
                            const parts = parse(recipient, matches);

                            return (
                                <TableRow hover>
                                    <TableCell align="left" className={classes.tableCell}>
                                        {parts.map(part => (
                                            <span key={part.text} style={{fontWeight: part.highlight ? 500 : 400}}>
                                            {part.text}
                                        </span>
                                        ))}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {suggestion.kontaktinformasjon ?
                                            suggestion.kontaktinformasjon.epostadresse ?
                                                suggestion.kontaktinformasjon.epostadresse
                                                : "" : ""}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {suggestion.kontaktinformasjon ?
                                            suggestion.kontaktinformasjon.mobiltelefonnummer ?
                                                suggestion.kontaktinformasjon.mobiltelefonnummer
                                                : "" : ""}
                                    </TableCell>
                                    <TableCell align="center" className={classes.tableCell}>
                                        <Checkbox
                                            checked={recipients[suggestion.kundenummer] ? recipients[suggestion.kundenummer].checked : false}
                                            onChange={handleIndividualCheck} name={suggestion.fulltNavn}
                                            value={suggestion.kundenummer}/>
                                    </TableCell>
                                </TableRow>
                            );
                        }
                    )
                }
            </TableBody>
        </Table>
    );
};

export default IndividualTable;