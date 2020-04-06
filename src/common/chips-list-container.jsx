import PropTypes from 'prop-types';
import React from 'react';
import {Box, Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Cancel';
import {makeStyles} from "@material-ui/core/styles";
import {useSelector} from "react-redux";


const useStyles = makeStyles(() => ({
    removeAllBox: {
        display:"flex",
        flexDirection: "end",
        marginInlineStart: "auto",
        alignItems:"center",
    },
}));


const ChipsListContainer = ({
                                children, content, show, showAllItems, showAllItemsLabel, showLessItemsLabel, toggleShowAllItems, onClear, count, title,
                            }) => {
    const classes = useStyles();
    const step = useSelector(state => state.payment.form.step).toString();
    const deleteText = content === "recipient" ? "Fjern alle mottakere" : "Fjern alle produkter";
        return (
            <Box
                visibility={!show ? "hidden": "visible"}
                display="flex"
                justifyContent="center"
                p={2}
                flexDirection="column"
                alignItems="center"
                flexWrap="flex"
                width="100%"
                mt={2}
                mb={2}
                height={content ==="recipient" ? 220 : 160}
                border={1}
                borderColor="grey.100"
                bgcolor="grey.100"
                borderRadius="borderRadius"
            >
                <Box
                    m={1}
                    display="flex"
                    flexDirection="row"
                    width="100%"
                >
                    <Typography variant="h6">{title} ({count})</Typography>
                    <div className={classes.removeAllBox}> {
                        // content !== "recipient" ?
                        //     toggleShowAllItems
                        //     && (
                        //         <>
                        //             <Button size="small" onClick={toggleShowAllItems}>
                        //                 {showAllItems
                        //                     ? showLessItemsLabel
                        //                     : showAllItemsLabel}
                        //             </Button>
                        //             <Box mr={1} ml={1}>
                        //                 |
                        //             </Box>
                        //         </>
                        //     )
                        //     :
                        (step !== "1" || (step === "1" && content !== "recipient") ) && <Typography variant="caption" pl={1}>{deleteText}</Typography>}
                        {(step !== "1" || content !== "recipient") && < IconButton size="small" onClick={onClear}>
                            <ClearIcon/>
                        </IconButton>}
                    </div>

                </Box>
                <Box display="flex" width="100%" justifyContent="center" flexWrap="wrap" m={1}>
                    {children}
                </Box>
            </Box>
        );
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
