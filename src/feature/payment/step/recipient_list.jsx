import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Chip from '@material-ui/core/Chip';
import {Box, makeStyles, Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {updateRecipientListOpen, updateRecipients, updateStep} from '../../../data/redux/actions/payment';
import {countChecked} from '../utils/list_utils';
import {STEP_PICK_RECIPIENTS} from '../constants';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(0.5),
        flexDirection: 'column',
        alignContent: 'center',
        textAlign: 'center',
    },
    chipBox: {
        flexDirection: 'row',
        textAlign: 'start',
        width: '70%',
    },
    chip: {
        flexDirection: 'row',
        margin: theme.spacing(0.5),
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.secondary.contrastText,
    },
    collapseButton: {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.secondary.contrastText,
        display: 'flex',
        margin: 'auto',
        marginTop: theme.spacing(1),
    },
}));

const RecipientList = () => {
    const classes = useStyles();
    const recipientList = useSelector((state) => state.payment.payment.recipients);
    const openCollapse = useSelector((state) => state.payment.recipientList.open);
    const dispatch = useDispatch();
    const recipientCounted = countChecked(recipientList);
    const recipientHeaderText = recipientCounted > 0
        ? <Typography variant="h6">Mine mottakere:</Typography> : '';
    const recipientCountText = recipientCounted > 0
        ? (
            <Typography>
                Antall:
                {recipientCounted}
            </Typography>
        ) : '';
    const recipientListKeys = Object.keys(recipientList);
    const count = countChecked(recipientList);
    let countChipsFirst = 0;
    let countChipsSecond = 0;

    function updateRecipientExtrasOpen() {
        dispatch(updateRecipientListOpen(!openCollapse));
    }

    const chips = count <= 10
        ? recipientListKeys.filter(key => recipientList[key].checked).map(key => {
            return (
                <Chip
                    size="small"
                    key={key}
                    value={key}
                    onDelete={() => handleDelete(key, recipientList[key].name)}
                    label={recipientList[key].name}
                    className={classes.chip}
                />
            );
        }) : (
            <div>
                {recipientListKeys
                    .filter(key => recipientList[key].checked).map(key => {
                        countChipsFirst += 1;
                        if (countChipsFirst <= 10){
                        return (
                            <Chip
                                size="small"
                                key={key}
                                value={key}
                                onDelete={() => handleDelete(key, recipientList[key].name)}
                                label={recipientList[key].name}
                                className={classes.chip}
                            />
                        );
                        }else return null;
                    })
                }
                {!openCollapse ? (
                    <Button className={classes.collapseButton} onClick={updateRecipientExtrasOpen}>
                        Vis alle
                        mottakere
                    </Button>
                ) : <div/>}
                {openCollapse ? recipientListKeys
                    .filter(key => recipientList[key].checked).map(key => {
                        countChipsSecond +=1;
                    if (countChipsSecond >10){
                            return (
                                <Chip
                                    size="small"
                                    key={key}
                                    value={key}
                                    onDelete={() => handleDelete(key, recipientList[key].name)}
                                    label={recipientList[key].name}
                                    className={classes.chip}
                                />
                            );
                    }else return null;
                    }) : <div/>}
                {openCollapse ? (
                    <Button className={classes.collapseButton} onClick={updateRecipientExtrasOpen}>
                        Vis færre
                        mottakere
                    </Button>
                ) : <div/>}
            </div>
        );


    function handleDelete(key, label) {
        if (countChecked(recipientList) < 2) {
            dispatch(updateStep(STEP_PICK_RECIPIENTS));
        }
        const newArray = {...recipientList};
        newArray[key] = {
            checked: false,
            name: label,
        };
        dispatch(updateRecipients(newArray));
    }

    if (recipientList && Object.keys(recipientList).length > 0) {
        return (
            <div className={classes.root}>
                {recipientHeaderText}
                <Box className={classes.chipBox}>
                    {
                        chips
                    }
                </Box>
                {recipientCountText}
            </div>
        );
    }
    return <div/>;
};

export default RecipientList;
