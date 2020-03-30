import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core';
import {
    clearRecipients, updateConfirmRecipientsOpen,
    updateRecipients,
    updateShowAllRecipients,
    updateStep,
} from '../../../data/redux/actions/payment';
import { getCheckedCount } from '../utils/list-utils';
import { STEP_PICK_RECIPIENTS } from '../constants';
import ChipsListContainer from '../../../common/chips-list-container';

const useStyles = makeStyles((theme) => ({
    chip: {
        margin: theme.spacing(0.5),
    },
}));

const RecipientChipList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const recipients = useSelector((state) => state.payment.payment.recipients);
    const showAllRecipients = useSelector((state) => state.payment.recipientList.showAll);

    const recipientsKeys = Object.keys(recipients);

    const sortedRecipients = [];

    recipientsKeys.map(key => {
        if (recipients[key].checked){
            let newEntry = {...recipients[key], key:key};
            sortedRecipients.push(newEntry);
        }
    });

    sortedRecipients.sort((a, b) => ( a.name > b.name ? 1 : -1 ));

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
        const checkedRecipients = { ...recipients };
        checkedRecipients[key] = {
            checked: false,
            name: label,
        };
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
        >
            {
                sortedRecipients
                    .splice(0, showAllRecipients ? recipientsKeys.length : 5)
                    .map((entry) => (
                        <Chip
                            size="small"
                            key={entry.key}
                            value={entry.key}
                            onDelete={() => handleDelete(entry.key, entry.name)}
                            label={entry.name}
                            className={classes.chip}
                            color="secondary"
                        />
                    ))
            }
        </ChipsListContainer>
    );
};

export default RecipientChipList;
