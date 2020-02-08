import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import { Box, makeStyles, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {
    clearRecipients,
    updateRecipients,
    updateShowAllRecipients,
    updateStep,
} from '../../../data/redux/actions/payment';
import { getCheckedCount } from '../utils/list_utils';
import { STEP_PICK_RECIPIENTS } from '../constants';

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

    if (recipients && Object.keys(recipients).length > 0) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                p={2}
                flexDirection="column"
                alignItems="center"
                flexWrap="flex"
                mt={2}
                bgcolor="grey.100"
                borderRadius="borderRadius"
            >
                <Typography variant="h6">Valgte mottakere</Typography>
                <Box display="flex" justifyContent="center" flexWrap="wrap" m={1}>
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

                </Box>
                <Box m={1}>
                    <Button size="small" onClick={toggleShowAllRecipients}>
                        {showAllRecipients
                            ? 'Vis færre mottakere'
                            : 'Vis alle mottakere'}
                    </Button>
                    |
                    <Button size="small" onClick={clearSelection}>
                        Nullstill
                    </Button>
                </Box>

                <Typography>
                    Antall:
                    {getCheckedCount(recipients)}
                </Typography>
            </Box>
        );
    }
    return <div />;
};

export default RecipientChipList;
