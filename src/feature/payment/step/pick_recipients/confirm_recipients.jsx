import React from 'react';
import List from '@material-ui/core/List';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {useDispatch, useSelector} from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import {ListItemIcon, ListItemText, makeStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Delete from '@material-ui/icons/Delete';
import {updateRecipients} from "../../../../data/redux/actions/payment";
import Box from "@material-ui/core/Box";


const useStyles = makeStyles(theme => ({
    root: {
        maxHeight: "45%",
    },
    list: {
        overflow: "auto",
    },
    listItemIcon: {
        float: "right",
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    removeIcon: {},
    listItem: {
        '&:hover': {
            background: "#f2f2f2",
        }
    },
    buttonBox: {
      display: "flex",
      justifyContent:"center",
      margin:theme.spacing(1),
    },
    confirmButton: {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.main,
        marginLeft: theme.spacing(1),
    },
    cancelButton: {
        color: theme.palette.secondary.main,
    },
}));


function ConfirmRecipients(props) {
    const classes = useStyles();
    const {onClose, open, handleAllRemoved} = props;
    const recipients = useSelector(state => state.payment.payment.recipients);
    const dispatch = useDispatch();

    function removeItem(key) {
        console.log(key);
        const newArray = {...recipients};
        newArray[key] = {"checked": false, "name": ""};
        const keys = Object.keys(recipients);
        let shouldClose = true;
        for (let recipientKeyCounter = 0; recipientKeyCounter < keys.length; recipientKeyCounter++) {
            if (recipients[keys[recipientKeyCounter]].checked === true && recipients[keys[recipientKeyCounter]] !== recipients[key]) {
                shouldClose = false;
            }
        }
        if (shouldClose) {
            console.log("Hey!=!=!?!?!?!")
            handleAllRemoved();
        }
        dispatch(updateRecipients(newArray));
    }

    if (recipients && Object.keys(recipients).length > 0) {
        let recipientKeys = Object.keys(recipients);
        return (
            <Dialog className={classes.root} onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title">Dine mottakere</DialogTitle>
                <List className={classes.list} hover>
                    {
                        recipientKeys.map(key => {
                            if (recipients[key].checked) {
                                return (
                                    <ListItem className={classes.listItem}>
                                        <ListItemText>
                                            {recipients[key].name}
                                        </ListItemText>
                                        <ListItemIcon className={classes.listItemIcon}>
                                            <Button onClick={() => removeItem(key)}><Delete
                                                className={classes.removeIcon}/></Button>
                                        </ListItemIcon>
                                    </ListItem>
                                );
                            }
                        })
                    }
                </List>
                <Box className={classes.buttonBox}>
                    <Button variant="outlined" className={classes.cancelButton}>Tilbake</Button>
                    <Button variant="outlined" className={classes.confirmButton}>Velg varer</Button>
                </Box>
            </Dialog>
        );
    } else {
        return <div></div>
    }
}

export default ConfirmRecipients;