import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import AddIcon from '@material-ui/icons/Add';
import Fab from "@material-ui/core/Fab";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import {useDispatch, useSelector} from "react-redux";
import RecipientSearch from "./recipient_search";
import {updateSearchBy, updateSearchValue} from "../../../../data/redux/actions/payment";
import {GROUP} from "../../constants";
import RecipientList from "./recipient_list";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        minHeight: 500
    },
    formControl: {
        margin: theme.spacing(3),
        minWidth: 120,
    },
    fab: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

const PickPaymentRecipient = () => {

    const classes = useStyles();
    const recipientType = useSelector(state => state.payment.form.searchBy);
    const dispatch = useDispatch();
    const [state, setState] = useState({
        open: false,
        recipients: [],
    });
    const groups = useSelector(state => state.groups.groups);
    const customers = useSelector(state => state.customers.customers);
    const suggestions = recipientType.toString() === GROUP ? groups : customers;

    function handleClickOpen() {
        setState({...state, open: true});
    }

    function handleClose() {
        setState({...state, open: false});
    }
    function handleSearchBy(event) {
        dispatch(updateSearchBy(event.target.value));
    }

    return (
        <div>
            <Fab color="secondary" variant="extended" size="small" aria-label="add" className={classes.fab}
                 onClick={handleClickOpen}>
                <AddIcon className={classes.extendedIcon}/>
                Legg til
            </Fab>
                    <form className={classes.container}>
                        <FormControl component="fieldset" className={classes.formControl}>
                            <RadioGroup aria-label="recipientType" name="recipientType" value={recipientType}
                                        onChange={handleSearchBy}>
                                <FormControlLabel value="group" control={<Radio/>} label="Gruppe"/>
                                <FormControlLabel value="individual" control={<Radio/>} label="Person"/>
                            </RadioGroup>
                            <RecipientSearch suggestions={suggestions} recipientType={recipientType}/>
                        </FormControl>
                    </form>
                    <RecipientList/>
        </div>
    );
};

export default PickPaymentRecipient;