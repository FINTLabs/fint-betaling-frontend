import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core';
import {
    clearRecipients,
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
                recipientsKeys.filter((key) => recipients[key].checked)
                    .splice(0, showAllRecipients ? recipientsKeys.length : 5)
                    .map((key) => (
                        <Chip
                            size="small"
                            key={key}
                            value={key}
                            onDelete={() => handleDelete(key, recipients[key].name)}
                            label={recipients[key].name}
                            className={classes.chip}
                            color="secondary"
                        />
                    ))
            }
        </ChipsListContainer>
    );
};

export default RecipientChipList;
