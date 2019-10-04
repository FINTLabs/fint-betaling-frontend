import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import PaymentIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Chip from '@material-ui/core/Chip';
import {makeStyles} from "@material-ui/core";
import DoneIcon from '@material-ui/icons/Done';
import {updateRecipients} from "../../../../data/redux/actions/payment";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        padding: theme.spacing(0.5),
    },
    chip: {
        margin: theme.spacing(0.5),
    },
}));

const RecipientList = () => {
    const classes = useStyles();
    const recipientList = useSelector(state => state.payment.payment.recipients);
    const dispatch = useDispatch();

    function handleDelete(key, label) {
        console.log("Du slettet: ", key, label);
        const newArray = {...recipientList};
        newArray[key] = {"checked": false, "name": label};
        dispatch(updateRecipients(newArray))
    }

    if (recipientList && Object.keys(recipientList).length > 0) {
        let recipientListKeys = Object.keys(recipientList);
        return (
            <div className={classes.root}>
                {
                    recipientListKeys.map(key => {
                            if (recipientList[key].checked) {
                                return (
                                    <Chip
                                        key={key}
                                        value={key}
                                        onDelete={() => handleDelete(key, recipientList[key].name)}
                                        icon={PaymentIcon}
                                        deleteIcon={DoneIcon}
                                        label={recipientList[key].name}
                                        className={classes.chip}
                                    >
                                    </Chip>
                                )
                            }
                        }
                    )
                }
            </div>
        );
    } else {
        return <div/>
    }
};

export default RecipientList;