import React from 'react';
import {ListItemText, makeStyles, Paper, Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {countChecked} from "../../utils/list_utils";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ConfirmedProducts from "../confirm_send/confirmed_products";

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
        textAlign:"left",
    },
        listItemBox: {
        display: "inline",

        },
    recipientListItem: {
        display: "inline-block",
        flexDirection: "column",
        width: "30%",
        textAlign:"end",
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
}));

const PaymentSent = () => {
    const classes = useStyles();
    const expirationDays = useSelector(state => state.payment.payment.expirationDate);
    const dispatch = useDispatch();
    const recipients = useSelector(state => state.payment.payment.recipients);
    const products = useSelector(state => state.payment.payment.products);
    const productsAmount = useSelector(state => state.payment.product.amount);

    function getTodayDate() {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today;
    }

    function getExpirationDate() {
        let expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + parseInt(expirationDays.toString()));
        const dd = String(expirationDate.getDate()).padStart(2, '0');
        const mm = String(expirationDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = expirationDate.getFullYear();
        expirationDate = mm + '/' + dd + '/' + yyyy;
        return expirationDate;
    }

    return (
        <Box className={classes.root}>
            <Paper className={classes.titlePaper}>
                <Typography variant="h5" className={classes.titleText}>
                    Oppsummering
                </Typography>
            </Paper>
            <Paper className={classes.tablePaper}>
                <Box className={classes.mainPaperTopText}>
                    <Box className={classes.mainTextAmount}>
                        <Typography>
                            Antall fakturaer: {countChecked(recipients)}
                        </Typography>
                    </Box>
                    <Box className={classes.mainTextTodaysDate}>
                        <Typography>
                            Faktura opprettet: {getTodayDate()}
                        </Typography>
                    </Box>
                    <Box className={classes.mainTextExpirationDate}>
                        <Typography>
                            Forfallsdato: {getExpirationDate()}
                        </Typography>
                    </Box>
                </Box>
                <Box>
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
                                            primary={<Typography className={classes.listItemPrimaryText}>{recipients[key].name}</Typography>}
                                        />
                                        <ListItemText
                                            primary={<Typography className={classes.listItemSecondaryText}>Klasse: 1XXX</Typography>}
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
            </Paper>
        </Box>
    );
};

export default PaymentSent;