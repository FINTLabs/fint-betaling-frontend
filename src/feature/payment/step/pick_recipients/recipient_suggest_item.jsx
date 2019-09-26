import React from 'react';
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const RecipientSuggestItem = (props) => {
    const {suggestions, query} = props;
    suggestions.sort((a, b) => {
        console.log(a.kundenummer);
        return (
        suggestions.length > 0 ?
            a.kundenummer ?
                a.fulltNavn > b.fulltNavn ?
                    1 : -1
                : a.navn > b.navn ?
                1 : -1 : null)
    });
    if (!suggestions) {
        return <div></div>
    }
    return (
        <List>
            {
                suggestions.map(
                    suggestion => {
                        const recipient = suggestion.kundenummer ? suggestion.fulltNavn : suggestion.navn;
                        const matches = match(recipient, query);
                        const parts = parse(recipient, matches);

                        return (
                            <ListItem>
                                <ListItemText>
                                    {parts.map(part => (
                                        <span key={part.text} style={{fontWeight: part.highlight ? 500 : 400}}>
                                            {part.text}
                                        </span>
                                    ))}
                                </ListItemText>
                            </ListItem>
                        )
                    }
                )
            }
        </List>
    );
};

export default RecipientSuggestItem;

/*

 */