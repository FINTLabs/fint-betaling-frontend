import React, {useEffect, useState} from 'react';
import Paper from "@material-ui/core/Paper";
import Autosuggest from "react-autosuggest";
import {updateSearchValue} from "../../../../data/redux/actions/payment";
import {useDispatch, useSelector} from "react-redux";
import deburr from "lodash/deburr";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import {ListItemIcon, makeStyles} from "@material-ui/core";
import {GROUP} from "../../constants";
import AddIcon from "@material-ui/icons/Add";
import List from "@material-ui/core/List";
import GroupAndPersonList from "./group_and_person_list";


const useStyles = makeStyles(theme => ({

    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    root: {
        height: 250,
        flexGrow: 1,
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
}));

const RecipientSearch = (props) => {

    const searchValue = useSelector(state => state.payment.form.searchValue);
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const classes = useStyles();
    const {suggestions, recipientType} = props;
    const [stateSuggestions, setSuggestions] = useState(suggestions);
    const searchLabel = "Søk";
    const searchPlaceHolder = recipientType === GROUP ? "Gruppenavn" : "Navn";

    console.log("stateSugg:", stateSuggestions);

    useEffect(() => {
        console.log("useEffect kjører....");
        setSuggestions(suggestions);
    }, [suggestions]);

    function renderInputComponent(inputProps) {
        const {
            classes, inputRef = () => {
            }, ref, ...other
        } = inputProps;

        return (
            <TextField
                fullWidth
                InputProps={{
                    inputRef: node => {
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
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;

        return inputLength < 0
            ? []
            : filterSuggestions(inputValue);
    }

    function filterSuggestions(input) {
        let count = 0;

        return suggestions.filter(suggestion => {
            let keep;
            if (recipientType === GROUP) {
                keep = count < 5 && suggestion.navn.slice(0, input.length).toLowerCase() === input;
            } else {
                keep = (
                    count < 5 && (
                        (suggestion.fulltNavn && suggestion.fulltNavn.slice(0, input.length).toLowerCase() === input) ||
                        (suggestion.navn.fornavn && suggestion.navn.fornavn.slice(0, input.length).toLowerCase() === input) ||
                        (suggestion.navn.mellomnavn && suggestion.navn.mellomnavn.slice(0, input.length).toLowerCase() === input) ||
                        (suggestion.navn.etternavn && suggestion.navn.etternavn.slice(0, input.length).toLowerCase() === input)
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
        return;
    }

    function handleAddToRecipient(event) {
        console.log("handleAddToReciptient: ", event, event.currentTarget.dataset.value);
        //dispatch(addRecipient(event.target.value));
    }

    function getSuggestionValue(suggestion) {
        return recipientType === GROUP ? suggestion.navn : suggestion.fulltNavn;
    }


    const handleSuggestionsFetchRequested = ({value}) => {
        setSuggestions(getSuggestions(value).sort());
    };

    const handleSuggestionsClearRequested = () => {
        setSuggestions(suggestions);
    };

    const autosuggestProps = {
        renderInputComponent,
        suggestions: stateSuggestions,
        onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
        onSuggestionsClearRequested: handleSuggestionsClearRequested,
        getSuggestionValue,
        renderSuggestion,
    };

    function handleSearchValue(event) {
        console.log("handleSearchValue", event.target.value);
        dispatch(updateSearchValue(event.target.value));
    }

    return (
        <Paper>
            <Autosuggest
                {...autosuggestProps}
                inputProps={{
                    classes,
                    id: 'react-autosuggest-simple',
                    label: searchLabel,
                    placeholder: searchPlaceHolder,
                    value: searchValue,
                    onChange: handleSearchValue,
                }}
                theme={{
                    container: classes.containerSuggestions,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                }}
                renderSuggestionsContainer={options => (
                    <GroupAndPersonList {...options.containerProps} recipientType={recipientType} options={options}/>
                )}
            />
        </Paper>
    );
};

export default RecipientSearch;