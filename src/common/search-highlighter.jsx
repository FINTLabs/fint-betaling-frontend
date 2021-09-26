import PropTypes from 'prop-types';
import React from 'react';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';

const SearchHighlighter = ({
    query,
    value,
}) => {
    const matches = match(value, query);
    const highlights = parse(value, matches);

    return highlights.map((highlight) => (
        <span
            key={highlight.text}
            style={{ fontWeight: highlight.highlight ? 500 : 400 }}
        >
            {highlight.text}
        </span>
    ));
};

SearchHighlighter.propTypes = {
    query: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

export default SearchHighlighter;
