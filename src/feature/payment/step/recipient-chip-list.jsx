import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {DialogContent, makeStyles} from '@material-ui/core';
import {
    clearRecipients,
    updateRecipients,
    updateShowAllRecipients,
    updateStep,
} from '../../../data/redux/actions/payment';
import {getCheckedCount} from '../utils/list-utils';
import {STEP_PICK_RECIPIENTS} from '../constants';
import ChipsListContainer from '../../../common/chips-list-container';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import RecipientIcon from '@material-ui/icons/Person';
import RemoveIcon from '@material-ui/icons/Delete';
import Divider from "@material-ui/core/Divider";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    listItem: {
        margin: theme.spacing(0.5),
        minWidth: 400,
    },
    recipientList: {
        maxHeight: "160px",
        overflow: "auto",
        paddingRight: "10px",
        minWidth: 300,
    },
    removeIcon: {
        marginInlineStart: "auto",
        cursor: "pointer",
    },
    dialogButtons: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        alignSelf:"center"
    },
    buttonDeleteRecipient: {
        margin: theme.spacing(1),
        color: "#FFF",
        backgroundColor: theme.palette.primary.dark,
    },
    buttonDontDeleteRecipient:{
        margin: theme.spacing(1),
    },
}));

const RecipientChipList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);
    const [nameToDelete, setNameToDelete] = React.useState("");
    const [keyToDelete, setKeyToDelete] = React.useState("");

    const recipients = useSelector((state) => state.payment.payment.recipients);
    const showAllRecipients = useSelector((state) => state.payment.recipientList.showAll);

    const recipientsKeys = Object.keys(recipients);

    const sortedRecipients = [];

    recipientsKeys.map(key => {
        if (recipients[key].checked) {
            let newEntry = {...recipients[key], key: key};
            sortedRecipients.push(newEntry);
        }
    });

    sortedRecipients.sort((a, b) => (a.name > b.name ? 1 : -1));

    function toggleShowAllRecipients() {
        dispatch(updateShowAllRecipients(!showAllRecipients));
    }

    function clearSelection() {
        dispatch(clearRecipients());
    }

    function handleDelete(key, label) {
        if (getCheckedCount(recipients) < 2) {
            dispatch(updateStep(STEP_PICK_RECIPIENTS));
        }
        const checkedRecipients = {...recipients};
        checkedRecipients[key] = {
            checked: false,
            name: label,
        };
        dispatch(updateRecipients(checkedRecipients));
        setOpen(false);
    }

    function openDeleteQuestion(key, name) {
        setOpen(true);
        setKeyToDelete(key);
        setNameToDelete(name);
    }

    function handleClose() {
        setOpen(false);
    };

    return (
        <ChipsListContainer
            show={getCheckedCount(recipients) > 0}
            toggleShowAllItems={toggleShowAllRecipients}
            showAllItems={showAllRecipients}
            onClear={clearSelection}
            count={getCheckedCount(recipients)}
            title="Valgte mottakere"
            content="recipient"
        >
            <List dense className={classes.recipientList}>{
                sortedRecipients
                    .map((entry) => (
                        <div key={entry.key}>
                            <ListItem
                                value={entry.key}
                                label={entry.name}
                                className={classes.listItem}
                            >
                                <ListItemIcon>
                                    <RecipientIcon/>
                                </ListItemIcon>
                                {entry.name}
                                <RemoveIcon className={classes.removeIcon}
                                            onClick={() => openDeleteQuestion(entry.key, entry.name)}/>
                            </ListItem>
                            <Divider/>
                        </div>
                    ))}
            </List>
            <Dialog onClose={handleClose} aria-labelledby="Fjerne mottaker" open={open}>
                <DialogTitle id="Fjerne mottaker">Slett mottaker</DialogTitle>
                <DialogContent>
                    Vil du fjerne {nameToDelete} som mottaker?
                </DialogContent>
                <div className={classes.dialogButtons}>
                <Button variant="outlined" className={classes.buttonDontDeleteRecipient} onClick={handleClose}>Nei</Button>
                <Button className={classes.buttonDeleteRecipient} variant="outlined" onClick={() => handleDelete(keyToDelete,nameToDelete)}>Ja</Button>
                </div>
            </Dialog>


        </ChipsListContainer>
    );
};
export default RecipientChipList;
