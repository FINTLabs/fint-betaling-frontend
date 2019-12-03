import React, {useEffect} from 'react';
import Paper from '@material-ui/core/Paper';
import Autosuggest from 'react-autosuggest';
import {useDispatch, useSelector} from 'react-redux';
import TextField from '@material-ui/core/TextField';
import {Box, makeStyles} from '@material-ui/core';
import {ORDER_NUMBER} from '../payment/constants';
import {
    updateOrderStatusContent,
    updateOrderStatusOpen,
    updatePaymentsSearchValue,
    updatePaymentsSuggestions
} from '../../data/redux/actions/payment';
import PaymentsTable from './payments_table';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";


const useStyles = makeStyles((theme) => ({

    textField: {},
    root: {
        margin: theme.spacing(3),
        textAlign: "-webkit-center",
        '& .MuiInput-underline:after': {
            content: "none"
        },
        '& .MuiInput-underline:before': {
            content: "none"
        },
    },
    containerSuggestions: {
        position: 'relative',
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing(1),
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing(2),
    },
    container: {
        width: '30%',
        justifyContent: 'center',
        overflow: 'auto',
    },
}));

const PaymentSearch = () => {
    const payments = useSelector((state) => state.payments.payments);
    const searchValue = useSelector((state) => state.payment.payments.searchValue);
    const filteredSuggestions = useSelector((state) => state.payment.payments.filteredSuggestions);
    const searchBy = useSelector((state) => state.payment.payments.searchBy).toString();
    const statusOpen = useSelector(state => state.payment.payment.statusOpen);
    const statusMessage = useSelector(state => state.payment.payment.statusContent);
    const filterValue = useSelector(state => state.payment.payments.filter);
    const dispatch = useDispatch();
    const suggestions = payments;
    const classes = useStyles();
    const searchPlaceHolder = searchBy === ORDER_NUMBER ? 'Ordrenummer' : 'Fakturamottaker';

    useEffect(() => {
        console.log("KJØRER");
    });

    function renderInputComponent(inputProps) {
        const {
            classes, inputRef = () => {
            }, ref, ...other
        } = inputProps;

        return (
            <TextField
                fullWidth
                InputProps={{
                    inputRef: (node) => {
                        ref(node);
                        inputRef(node);
                    },
                    classes: {
                        input: classes.input,
                    },
                }}
                {...other}
            />
        );
    }

    function getSuggestions(value) {
        const inputValue = value.trim()
            .toLowerCase();
        const inputLength = inputValue.length;

        return inputLength < 0
            ? []
            : filterSuggestions(inputValue);
    }

    function filterSuggestions(input) {
        let count = 0;

        return suggestions.filter((suggestion) => {
            let keep;
            if (searchBy === ORDER_NUMBER) {
                keep = count < 10 && suggestion.orderNumber.toString()
                        .slice(0, input.length)
                        .toLowerCase() === input &&
                    ((suggestion.claimStatus.toString() === filterValue.toString()) || filterValue.toString() === "ALL");
            } else {
                keep = (
                    count < 10 && (
                        (suggestion.customer.name && suggestion.customer.name.slice(0, input.length)
                                .toLowerCase() === input &&
                            ((suggestion.claimStatus.toString() === filterValue.toString()) || filterValue.toString() === "ALL"))
                        || (suggestion.customer.name && suggestion.customer.name.slice(0, input.length)
                                .toLowerCase() === input &&
                            ((suggestion.claimStatus.toString() === filterValue.toString()) || filterValue.toString() === "ALL"))
                        || (suggestion.customer.name && suggestion.customer.name.slice(0, input.length)
                                .toLowerCase() === input &&
                            ((suggestion.claimStatus.toString() === filterValue.toString()) || filterValue.toString() === "ALL"))
                        || (suggestion.customer.name && suggestion.customer.name.slice(0, input.length)
                                .toLowerCase() === input &&
                            ((suggestion.claimStatus.toString() === filterValue.toString()) || filterValue.toString() === "ALL"))
                    )
                );
            }
            if (keep) {
                count += 1;
            }
            return keep;
        });
    }

    function renderSuggestion(suggestion, {query, isHighlighted}) {
    }

    function getSuggestionValue(suggestion) {
        console.log(filterValue.toString());
        return searchBy === ORDER_NUMBER ? suggestion.orderNumber : suggestion.customer.name;
    }

    const handleSuggestionsFetchRequested = ({value}) => {
        dispatch(updatePaymentsSuggestions(getSuggestions(value)));
    };

    const handleSuggestionsClearRequested = () => {
        if (searchValue < 1) {
            dispatch(updatePaymentsSuggestions(suggestions));
        }
    };

    function handleSearchValue(event) {
        dispatch(updatePaymentsSearchValue(event.target.value));
    }

    function handleClose() {
        dispatch(updateOrderStatusOpen(false));
        dispatch(updateOrderStatusContent(''));
    }

    return (
        <Box className={classes.root}>
            <Paper className={classes.container}>
                <Autosuggest
                    renderInputComponent={renderInputComponent}
                    getSuggestionValue={getSuggestionValue}
                    suggestions={filteredSuggestions}
                    onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
                    onSuggestionsClearRequested={handleSuggestionsClearRequested}
                    renderSuggestion={renderSuggestion}

                    inputProps={{
                        classes,
                        autoFocus: true,
                        id: 'react-autosuggest-simple',
                        placeholder: `Søk på ${searchPlaceHolder.toLowerCase()}`,
                        value: searchValue,
                        onChange: handleSearchValue,
                        input: {
                            paddingLeft: '100px',
                        },
                    }}
                    theme={{
                        container: classes.containerSuggestions,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                    }}
                />
            </Paper>
            <PaymentsTable/>
            <Dialog
                open={statusOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Status: </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {statusMessage ? statusMessage : ""}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Tilbake
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PaymentSearch;
