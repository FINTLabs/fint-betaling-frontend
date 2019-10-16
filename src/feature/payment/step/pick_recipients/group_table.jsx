import React from 'react';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TableBody from "@material-ui/core/TableBody";
import Checkbox from "@material-ui/core/Checkbox";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import {Collapse, makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {updateGroupContentOpen, updateRecipients} from "../../../../data/redux/actions/payment";


const useStyles = makeStyles(theme => ({
    table: {
        overflow: 'auto',
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellArrow: {
        cursor: "pointer",
    },
    tableCellNoPadding: {
        paddingTop: 0,
        paddingBottom: 0,
    }
}));

const GroupTable = () => {
    const query = useSelector(state => state.payment.form.searchValue);
    let suggestions = useSelector(state => state.payment.form.filteredSuggestions);
    const dispatch = useDispatch();
    suggestions = query.length === 0 ? [] : suggestions;

    const groupContentOpen = useSelector(state => state.payment.form.groupContentOpen);
    const recipients = useSelector(state => state.payment.payment.recipients);
    const classes = useStyles();

    function handleIndividualCheck(event) {
        const newArray = {...recipients};
        newArray[event.target.value] = {"checked": event.target.checked, "name": event.target.name};
        dispatch(updateRecipients(newArray));
    }

    function handleGroupChange(event, individualList) {
        const newArray = {...recipients};
        for (let customer = 0; customer < individualList.length; customer++) {
            const customerNumber = individualList[customer].kundenummer;
            newArray[customerNumber] = {
                "checked": event.target.checked,
                "name": individualList[customer].fulltNavn,
                "email": individualList[customer].kontaktinformasjon ? individualList[customer].kontaktinformasjon.epostadresse : "",
                "cellPhoneNumber": individualList[customer].kontaktinformasjon ? individualList[customer].kontaktinformasjon.mobiltelefonnummer : "",
                "addressLine": individualList[customer].postadresse ? individualList[customer].postadresse.adresselinje : "",
                "addressZip": individualList[customer].postadresse ? individualList[customer].postadresse.postnummer : "",
                "addressPlace": individualList[customer].postadresse ? individualList[customer].postadresse.poststed : "",
            };
        }
        dispatch(updateRecipients(newArray));
    }

    function groupShouldBeChecked(customerList) {
        let status = true;
        for (let iterator = 0; iterator < customerList.length; iterator++) {
            if (!recipients[customerList[iterator].kundenummer] || !recipients[customerList[iterator].kundenummer].checked) {
                status = false;
            }
        }
        return status;
    }

    function handleGroupOpenClick(recipient) {
        const newArray = {...groupContentOpen};
        newArray[recipient] = !groupContentOpen[recipient];
        dispatch(updateGroupContentOpen(newArray));
    }

    function groupCheckboxIndeterminateCheck(customerList) {
        let partlyChecked = false;
        for (let iterator = 0; iterator < customerList.length; iterator++) {
            if (recipients[customerList[iterator].kundenummer] && recipients[customerList[iterator].kundenummer].checked) {
                partlyChecked = true;
                console.log("JEg kom hit!");
            }
        }
        return partlyChecked;
    }

    return (
        <Table className={classes.table} size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Navn</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Beskrivelse</TableCell>
                    <TableCell align="center" className={classes.tableCell}>Velg som mottaker</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Vis innhold</TableCell>
                </TableRow>
            </TableHead>
            {
                suggestions.map(
                    suggestion => {
                        const recipient = suggestion.navn;
                        const matches = match(recipient, query);
                        const parts = parse(recipient, matches);
                        return (
                            <TableBody key={suggestion.navn}>
                                <TableRow hover>
                                    <TableCell align="left" className={classes.tableCell}>
                                        {parts.map(part => (
                                            <span key={part.text}
                                                  style={{fontWeight: part.highlight ? 500 : 400}}>
                                            {part.text}
                                        </span>
                                        ))}
                                    </TableCell>
                                    <TableCell align="right" className={classes.tableCell}>
                                        {suggestion.beskrivelse}
                                    </TableCell>
                                    <TableCell align="center" className={classes.tableCell}>
                                        <Checkbox onChange={event => handleGroupChange(event, suggestion.kundeliste)}
                                                  value={suggestion.kundeliste}
                                                  indeterminate={groupShouldBeChecked(suggestion.kundeliste) ? false : groupCheckboxIndeterminateCheck(suggestion.kundeliste)}
                                                  checked={groupShouldBeChecked(suggestion.kundeliste)}/>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className={classes.tableCellArrow}
                                        onClick={() =>
                                            handleGroupOpenClick(recipient)
                                        }
                                    >
                                        <ArrowDropDown/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.tableCellNoPadding}/>
                                    <TableCell className={classes.tableCellNoPadding} colSpan={3}>
                                        <Collapse in={groupContentOpen[recipient]} timeout="auto" unmountOnExit
                                                  style={{display: "block", float: "bottom"}}>
                                            <Table className={classes.table}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Navn</TableCell>
                                                        <TableCell align="right"
                                                                   className={classes.tableCell}>E-postadresse</TableCell>
                                                        <TableCell align="right"
                                                                   className={classes.tableCell}>Telefonnummer</TableCell>
                                                        <TableCell align="right" className={classes.tableCell}>Velg
                                                            som mottaker</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        suggestion.kundeliste.map(
                                                            kunde => {
                                                                return (
                                                                    <TableRow key={kunde.kundenummer}>
                                                                        <TableCell align="left"
                                                                                   className={classes.tableCell}>
                                                                            {kunde.fulltNavn}
                                                                        </TableCell>
                                                                        <TableCell align="right"
                                                                                   className={classes.tableCell}>
                                                                            {kunde.kontaktinformasjon ?
                                                                                kunde.kontaktinformasjon.epostadresse ?
                                                                                    kunde.kontaktinformasjon.epostadresse
                                                                                    : "" : ""}
                                                                        </TableCell>
                                                                        <TableCell align="right"
                                                                                   className={classes.tableCell}>
                                                                            {kunde.kontaktinformasjon ?
                                                                                kunde.kontaktinformasjon.mobiltelefonnummer ?
                                                                                    kunde.kontaktinformasjon.mobiltelefonnummer
                                                                                    : "" : ""}
                                                                        </TableCell>
                                                                        <TableCell align="center"
                                                                                   className={classes.tableCell}>
                                                                            <Checkbox onChange={handleIndividualCheck}
                                                                                      name={kunde.fulltNavn}
                                                                                      value={kunde.kundenummer}
                                                                                      checked={recipients[kunde.kundenummer] ? recipients[kunde.kundenummer].checked : false}/>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                );
                                                            }
                                                        )
                                                    }
                                                </TableBody>
                                            </Table>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        );
                    }
                )
            }
        </Table>
    );
};

export default GroupTable