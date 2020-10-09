import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core';
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
import ConfirmRemoveIcon from '@material-ui/icons/DeleteForever';
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    listItem: {
        margin: theme.spacing(0.5),
        minWidth: 400,
    },
    recipientList: {
        maxHeight: "160px",
        overflow: "auto",
        paddingRight: "10px",
        width: "100%",
    },
    removeIcon: {
        marginInlineStart: "auto",
        cursor: "pointer",
    },
    removeIconRed: {
        marginInlineStart: "auto",
        color: theme.palette.warning.dark,
        cursor: "pointer",
    },
    dialogButtons: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        alignSelf: "center"
    },
    buttonDeleteRecipient: {
        margin: theme.spacing(1),
        color: "#FFF",
        backgroundColor: theme.palette.primary.dark,
    },
    buttonDontDeleteRecipient: {
        margin: theme.spacing(1),
    },
    toDeleteBox: {
        display:"flex",
        alignItems: "center",
        marginInlineStart: "auto",
    },
}));

const RecipientChipList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const recipients = useSelector((state) => state.payment.payment.recipients);
    const showAllRecipients = useSelector((state) => state.payment.recipientList.showAll);
    const [toDelete, setToDelete] = React.useState({
        key: "",
        name: "",
    });

    let [timer, setTimer] = React.useState(null);


    const recipientsKeys = Object.keys(recipients);
    if (recipients.length === 0) {
        dispatch(updateStep(0));
    }

    const sortedRecipients = [];

    recipientsKeys.map(key => {
        if (recipients[key].checked) {
            let newEntry = {...recipients[key], key: key};
            sortedRecipients.push(newEntry);
        }
        return key;
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
        setToDelete({key: "", name:""});
        dispatch(updateRecipients(checkedRecipients));
    }

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
                                dense
                            >
                                <ListItemIcon>
                                    <RecipientIcon/>
                                </ListItemIcon>
                                {entry.name}
                                {
                                    entry.key === toDelete.key && entry.name === toDelete.name ?
                                        <div className={classes.toDeleteBox}>
                                            <Typography variant={"caption"}>Bekreft</Typography>
                                        <ConfirmRemoveIcon
                                            className={classes.removeIconRed}
                                            onClick={() => {
                                                handleDelete(toDelete.key, toDelete.name)
                                            }}
                                        />
                                        </div>:

                                        <RemoveIcon
                                            className={classes.removeIcon}
                                            onClick={() => {
                                                setToDelete({key: entry.key, name: entry.name});
                                                clearTimeout(timer);
                                                setTimer(
                                                    setTimeout(function(){
                                                        setToDelete({key: "", name:""});
                                                    },1500)
                                                );
                                            }}
                                        />
                                }

                            </ListItem>
                            <Divider/>
                        </div>
                    ))}
            </List>
        </ChipsListContainer>
    );
};
export default RecipientChipList;
