import React from 'react';
import {ListItemText, makeStyles, Paper} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {countChecked} from "../../utils/list_utils";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ConfirmedProducts from "../confirm_send/confirmed_products";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {updateFromValue, updateToValue} from "../../../../data/redux/actions/payment";

const useStyles = makeStyles(theme => ({
    root: {
        textAlign: "-webkit-center",
        marginTop: theme.spacing(2),
    },
    tablePaper: {
        margin: theme.spacing(2),
        width: "80%",
    },
    titlePaper: {
        textAlign: "center",
        width: "40%",
    },
    titleText: {
        color: theme.palette.secondary.main,
    },
    mainPaperTopText: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
    },
    mainTextAmount: {
        flex: "1 0 30%",
        textAlign: "left",
        margin: theme.spacing(1),
    },
    mainTextTodaysDate: {
        flex: "1 0 30%",
        margin: theme.spacing(1),
        textAlign: "center",
    },
    mainTextExpirationDate: {
        flex: "1 0 30%",
        textAlign: "right",
        margin: theme.spacing(1),
    },
    recipientTitle: {
        color: theme.palette.secondary.main,
    },
    recipientListWrapper: {
        maxHeight: 200,
        overflow: "auto",
        textAlign: "left",
    },
    listItemBox: {
        display: "inline",

    },
    recipientListItem: {
        display: "inline-block",
        flexDirection: "column",
        width: "30%",
        textAlign: "end",
        marginLeft: theme.spacing(2),
    },
    listItemPrimary: {
        textAlign: "left",
    },
    listItemSecondary: {
        textAlign: "left",
    },
    listItemPrimaryText: {
        fontSize: "12px",
    },
    listItemSecondaryText: {
        fontSize: "12px",
    },
    table: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    confirmButton: {
        color: theme.palette.secondary.contrastText,
        "&:enabled": {
            backgroundColor: theme.palette.secondary.main,
        },
        "&:disabled": {},
        verticalAlign: "bottom",
        margin: theme.spacing(2),
    },
    warningText: {
      color: theme.status.danger,
    },
    link: {
        textDecoration: 'none',
        color: "rgba(0, 0, 0, 0.87)",
    },
}));

const PaymentSaved = () => {
    const classes = useStyles();
    const expirationDays = useSelector(state => state.payment.payment.expirationDate);
    const recipients = useSelector(state => state.payment.payment.recipients);
    const latestPayments = useSelector(state => state.payment.payments.latestSent);
    const dispatch = useDispatch();

    if (latestPayments){
        dispatch(updateFromValue(getFirstOrderNumber()));
        dispatch(updateToValue(getLastOrderNumber()));
    }

    function getTodayDate() {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today;
    }

    function getExpirationDate() {
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + parseInt(expirationDays.toString()));
        const dd = String(expirationDate.getDate()).padStart(2, '0');
        const mm = String(expirationDate.getMonth() + 1).padStart(2, '0');
        const yyyy = expirationDate.getFullYear();
        expirationDate = mm + '/' + dd + '/' + yyyy;
        return expirationDate;
    }

    function getFirstOrderNumber() {
        if (latestPayments){
            return latestPayments[0].ordrenummer;
        }
    }

    function getLastOrderNumber() {
        if (latestPayments){
            return latestPayments[latestPayments.length - 1].ordrenummer;
        }
    }

    return (
        <Box className={classes.root}>
            <Paper className={classes.titlePaper}>
                <Typography variant="h5" className={classes.titleText}>
                    Opprettede betalinger
                </Typography>
            </Paper>
            <Paper className={classes.tablePaper}>
                <Box className={classes.mainPaperTopText}>
                    <Box className={classes.mainTextAmount}>
                        <Typography>
                            Antall: {countChecked(recipients)}
                        </Typography>
                    </Box>
                    <Box className={classes.mainTextTodaysDate}>
                        <Typography>
                            Opprettet: {getTodayDate()}
                        </Typography>
                    </Box>
                    <Box className={classes.mainTextExpirationDate}>
                        <Typography>
                            Valgt forfall: {expirationDays} dager
                        </Typography>
                    </Box>
                </Box>
                <Box>
                    <Typography>{countChecked(recipients)} betalinger med ordrenummer fra: {getFirstOrderNumber()} til: {getLastOrderNumber()}</Typography>
                    <Typography variant="h6" className={classes.recipientTitle}>
                        Mottakere
                    </Typography>
                </Box>
                <Box className={classes.recipientListWrapper}>
                    <List disablePadding>
                        <Box flexDirection="row" className={classes.listItemBox}>
                            {Object.keys(recipients).map(key => {
                                if (recipients[key].checked) {
                                    return (
                                        <ListItem border={1} className={classes.recipientListItem} divider>
                                            <ListItemText className={classes.listItemPrimary}
                                                          disableTypography
                                                          primary={<Typography
                                                              className={classes.listItemPrimaryText}>{recipients[key].name}</Typography>}
                                            />
                                            <ListItemText
                                                primary={<Typography className={classes.listItemSecondaryText}>Klasse:
                                                    1XXX</Typography>}
                                                className={classes.listItemSecondary}
                                            >

                                            </ListItemText>
                                        </ListItem>
                                    )
                                }
                            })}
                        </Box>
                    </List>
                </Box>
                <ConfirmedProducts/>
                <Typography className={classes.warningText} variant="body2">Husk! Du må sende de opprettede betalingene til ditt fakturasystem</Typography>
                <Link to="/send-til-fakturasystem" className={classes.link}>
                    <Button className={classes.confirmButton}>Send til faktureringssystem</Button>
                </Link>
            </Paper>
        </Box>
    );
};

export default PaymentSaved;