import React, {useState} from 'react';
import Paper from "@material-ui/core/Paper";
import Autosuggest from "react-autosuggest";
import {updateSearchValue} from "../../../../data/redux/actions/payment";
import {useDispatch, useSelector} from "react-redux";
import deburr from "lodash/deburr";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core";
import {GROUP} from "../../constants";

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

    console.log("suggestion:", suggestions);
    console.log("stateSugg:", stateSuggestions);

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

    function renderSuggestion(suggestion, {query, isHighlighted}) {
        console.log("renderSuggestion: ", query, suggestion);
        const matches = match(suggestion.navn, query);
        const parts = parse(suggestion.navn, matches);

        return (
            <MenuItem selected={isHighlighted} component="div">
                <div>
                    {parts.map(part => (
                        <span key={part.text} style={{fontWeight: part.highlight ? 500 : 400}}>
            {part.text}
          </span>
                    ))}
                </div>
            </MenuItem>
        );
    }

    function getSuggestions(value) {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;

        return inputLength === 0
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
                keep = count < 5 && suggestion.fulltNavn.slice(0, input.length).toLowerCase() === input;
            }
            if (keep) {
                count += 1;
            }
            return keep;
        });
    }

    function getSuggestionValue(suggestion) {
        console.log("GetsuggestionValue / suggestion:", suggestion);
        return recipientType === GROUP ? suggestion.navn : suggestion.fulltNavn;
    }


    const handleSuggestionsFetchRequested = ({value}) => {
        console.log("kommer jeg hit da? Value: ", value);
        console.log("og svaret er: ", getSuggestions(value));
        setSuggestions(getSuggestions(value));
    };

    const handleSuggestionsClearRequested = () => {
        setSuggestions([]);
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
        dispatch(updateSearchValue(event.target.value));
    }

    return (
        <Autosuggest
            {...autosuggestProps}
            inputProps={{
                classes,
                id: 'react-autosuggest-simple',
                label: 'Country',
                placeholder: 'Search a country (start with a)',
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
                <Paper {...options.containerProps} square>
                    {options.children}
                </Paper>
            )}
        />
    );
};

export default RecipientSearch;