import PropTypes from 'prop-types';
import React from 'react';
import {Box, Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Cancel';


const ChipsListContainer = ({
                                children, content, show, showAllItems, showAllItemsLabel, showLessItemsLabel, toggleShowAllItems, onClear, count, title,
                            }) => {
    if (show) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                p={2}
                flexDirection="column"
                alignItems="center"
                flexWrap="flex"
                mt={2}
                mb={2}
                border={1}
                borderColor="grey.100"
                bgcolor="grey.100"
                borderRadius="borderRadius"
            >
                <Typography variant="h6">{title}</Typography>
                <Box display="flex" justifyContent="center" flexWrap="wrap" m={1}>
                    {children}

                </Box>
                <Box
                    m={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="row"
                >
                    {
                        content !== "recipient" ?
                            toggleShowAllItems
                            && (
                                <>
                                    <Button size="small" onClick={toggleShowAllItems}>
                                        {showAllItems
                                            ? showLessItemsLabel
                                            : showAllItemsLabel}
                                    </Button>
                                    <Box mr={1} ml={1}>
                                        |
                                    </Box>
                                </>
                            )
                            : "Fjern alle mottakere"}
                    < IconButton size="small" onClick={onClear}>
                        <ClearIcon/>
                    </IconButton>

                </Box>

                <Typography>
                    Antall:
                    {count}
                </Typography>
            </Box>
        );
    }
    return <div/>;
};


ChipsListContainer.propTypes = {
    children: PropTypes.any.isRequired,
    count: PropTypes.number.isRequired,
    onClear: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    showAllItems: PropTypes.bool.isRequired,
    showAllItemsLabel: PropTypes.string,
    showLessItemsLabel: PropTypes.string,
    title: PropTypes.string.isRequired,
    toggleShowAllItems: PropTypes.func,
};

ChipsListContainer.defaultProps = {
    showAllItemsLabel: 'Vis alle',
    showLessItemsLabel: 'Vis færre',
    toggleShowAllItems: null,
};
export default ChipsListContainer;
