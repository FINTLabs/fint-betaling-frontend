import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Input from "@material-ui/core/Input";
import DialogActions from "@material-ui/core/DialogActions";

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

const PaymentTypeSelection = () => {
    const classes = useStyles();
    const [state, setState] = React.useState({
        open: false,
        age: '',
    });

    const handleChange = name => event => {
        setState({ ...state, [name]: Number(event.target.value) });
    };

    function handleClickOpen() {
        setState({ ...state, open: true });
    }

    function handleClose() {
        setState({ ...state, open: false });
    }

    return (
        <div>
            <Button onClick={handleClickOpen}>Open select dialog</Button>
            <Dialog disableBackdropClick disableEscapeKeyDown open={state.open} onClose={handleClose}>
                <DialogTitle>Fill the form</DialogTitle>
                <DialogContent>
                    <form className={classes.container}>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-native-simple">Age</InputLabel>
                            <Select
                                native
                                value={state.age}
                                onChange={handleChange('age')}
                                input={<Input id="age-native-simple" />}
                            >
                                <option value="" />
                                <option value={10}>Ten</option>
                                <option value={20}>Twenty</option>
                                <option value={30}>Thirty</option>
                            </Select>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-simple">Age</InputLabel>
                            <Select
                                value={state.age}
                                onChange={handleChange('age')}
                                input={<Input id="age-simple" />}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="secondary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PaymentTypeSelection;