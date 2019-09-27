import React, {useState} from 'react';
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

const useStyles = makeStyles(theme => ({
    table: {
        overflow: 'auto',
    },
    tableCell: {
        overflow: 'auto',
        wordWrap: 'break-word',
    },
    tableCellArrow: {
        overflow: 'auto',
        wordWrap: 'break-word',
        cursor: "pointer",
    },
    tableCellNoPadding: {
        paddingTop: 0,
        paddingBottom: 0,
    }
}));

const GroupTable = (props) => {
    const [open, setOpen] = useState([]);
    const classes = useStyles();
    const {suggestions, query, onChange} = props;
    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell>Navn</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Beskrivelse</TableCell>
                    <TableCell align="right" className={classes.tableCell}>Velg som mottaker</TableCell>
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
                                        <Checkbox onChange={onChange} value={recipient}/>
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        className={classes.tableCellArrow}
                                        onClick={() =>
                                            setOpen({
                                                ...open, [recipient]: !open[recipient]
                                            })}
                                    >
                                        <ArrowDropDown/>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className={classes.tableCellNoPadding}/>
                                    <TableCell className={classes.tableCellNoPadding} colSpan={3}>
                                        <Collapse in={open[recipient]} timeout="auto" unmountOnExit
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
                                                                            <Checkbox onChange={onChange} value={kunde.kundenummer}/>
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

export default GroupTable;