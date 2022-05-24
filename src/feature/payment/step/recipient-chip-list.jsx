import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import RecipientIcon from '@mui/icons-material/Person';
import RemoveIcon from '@mui/icons-material/Delete';
import ConfirmRemoveIcon from '@mui/icons-material/DeleteForever';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ChipsListContainer from '../../../common/chips-list-container';
import { STEP_PICK_RECIPIENTS } from '../constants';
import { getCheckedCount } from '../utils/list-utils';
import {
    clearRecipients,
    updateRecipients,
    updateShowAllRecipients,
    updateStep,
} from '../../../data/redux/actions/payment';

const useStyles = makeStyles((theme) => ({
    listItem: {
        margin: theme.spacing(0.5),
        minWidth: 400,
    },
    recipientList: {
        maxHeight: '160px',
        overflow: 'auto',
        paddingRight: '10px',
        width: '100%',
    },
    removeIcon: {
        marginInlineStart: 'auto',
        cursor: 'pointer',
    },
    removeIconRed: {
        marginInlineStart: 'auto',
        color: theme.palette.warning.dark,
        cursor: 'pointer',
    },
    dialogButtons: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        alignSelf: 'center',
    },
    buttonDeleteRecipient: {
        margin: theme.spacing(1),
        color: '#FFF',
        backgroundColor: theme.palette.primary.dark,
    },
    buttonDontDeleteRecipient: {
        margin: theme.spacing(1),
    },
    toDeleteBox: {
        display: 'flex',
        alignItems: 'center',
        marginInlineStart: 'auto',
    },
}));

const RecipientChipList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const recipients = useSelector((state) => state.payment.payment.recipients);
    const showAllRecipients = useSelector((state) => state.payment.recipientList.showAll);
    const [toDelete, setToDelete] = React.useState({
        key: '',
        name: '',
    });

    const [timer, setTimer] = React.useState(null);

    const recipientsKeys = Object.keys(recipients);

    const sortedRecipients = [];

    recipientsKeys.map((key) => {
        if (recipients[key].checked) {
            const newEntry = {
                ...recipients[key],
                key,
            };
            sortedRecipients.push(newEntry);
        }
        return key;
    });

    sortedRecipients.sort((a, b) => (a.name > b.name ? 1 : -1));

    const toggleShowAllRecipients = () => {
        dispatch(updateShowAllRecipients(!showAllRecipients));
    };

    const clearSelection = () => {
        dispatch(clearRecipients());
    };

    function handleDelete(key, label) {
        const checkedRecipients = { ...recipients };
        checkedRecipients[key] = {
            checked: false,
            name: label,
        };
        setToDelete({
            key: '',
            name: '',
        });
        dispatch(updateRecipients(checkedRecipients));
        if (getCheckedCount(recipients) < 2) {
            dispatch(updateStep(STEP_PICK_RECIPIENTS));
        }
    }

    return (
        <ChipsListContainer
            toggleShowAllItems={toggleShowAllRecipients}
            showAllItems={showAllRecipients}
            onClear={clearSelection}
            count={getCheckedCount(recipients)}
            title="Valgte mottakere"
            content="recipient"
        >
            <List dense className={classes.recipientList}>
                {
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
                                        <RecipientIcon />
                                    </ListItemIcon>
                                    {entry.name}
                                    {
                                        entry.key === toDelete.key && entry.name === toDelete.name
                                            ? (
                                                <div className={classes.toDeleteBox}>
                                                    <Typography variant="caption">Bekreft</Typography>
                                                    <ConfirmRemoveIcon
                                                        className={classes.removeIconRed}
                                                        onClick={() => {
                                                            handleDelete(toDelete.key, toDelete.name);
                                                        }}
                                                    />
                                                </div>
                                            )

                                            : (
                                                <RemoveIcon
                                                    className={classes.removeIcon}
                                                    onClick={() => {
                                                        setToDelete({
                                                            key: entry.key,
                                                            name: entry.name,
                                                        });
                                                        clearTimeout(timer);
                                                        setTimer(
                                                            setTimeout(() => {
                                                                setToDelete({
                                                                    key: '',
                                                                    name: '',
                                                                });
                                                            }, 1500),
                                                        );
                                                    }}
                                                />
                                            )
                                    }

                                </ListItem>
                                <Divider />
                            </div>
                        ))
                }
            </List>
        </ChipsListContainer>
    );
};
export default RecipientChipList;
