import React from 'react';
import List from "@material-ui/core/List";
import {ListItemText} from "@material-ui/core";
import {GROUP} from "../../constants";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddIcon from "@material-ui/icons/Add";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

const GroupAndPersonList = (props) => {
    const {options, recipientType} = props;
    console.log("Test suggestions: ", options);

    function renderSuggestion(suggestion, query, isHighlighted) {
        const matches = match(suggestion, query);
        const parts = parse(suggestion, matches);

        return (
            <MenuItem isHighlighted={isHighlighted} selected="true" component="div">
                <ListItemIcon>
                    <AddIcon/>
                </ListItemIcon>
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

    return (
        <div></div>
    );
};

export default GroupAndPersonList;

/*
<List>
            {options.children.map(suggestion => {
                    if (recipientType === GROUP && suggestion.kundeliste) {
                        return (
                            <ListItem>
                                <ListItemText>
                                    {suggestion.navn}
                                </ListItemText>
                            </ListItem>
                        )
                    } else {
                        return (
                            renderSuggestion(suggestion.fulltNavn, options.query, options.isHighlighted)
                        )
                    }
                }
            )}

        </List>
 */