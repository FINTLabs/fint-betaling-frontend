import React, { useState } from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import ConfirmRemoveIcon from '@material-ui/icons/DeleteForever';
import RemoveIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';


const useStyles = makeStyles((theme) => ({
    removeAllBox: {
        display: 'flex',
        flexDirection: 'end',
        marginInlineStart: 'auto',
        alignItems: 'center',
    },
    toDeleteBox: {
        display: 'flex',
    },
    removeIcon: {
        cursor: 'pointer',
        verticalAlign: 'bottom',
    },
    removeIconRed: {
        color: theme.palette.warning.dark,
        cursor: 'pointer',
        verticalAlign: 'bottom',
    },
}));

const ChipsListContainer = ({
    children,
    content,
    onClear,
    count,
    title,
}) => {
    const classes = useStyles();
    const step = useSelector((state) => state.payment.form.step)
        .toString();
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const [timer, setTimer] = React.useState(null);
    const deleteText = 'Fjern alle';
    return (
        <Box
            display="flex"
            p={2}
            flexDirection="column"
            alignItems="center"
            flexWrap="flex"
            width="100%"
            mt={2}
            mb={2}
            height={content === 'recipient' ? 220 : 160}
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
                justifyContent="space-between"
            >
                <Typography variant="h6">
                    {title}
                    {' '}
                    (
                    {count}
                    )
                </Typography>
                <Box mt={1} mr="22px">
                    {' '}
                    {
                        ((step !== '1' || (step === '1' && content !== 'recipient')) && !deleteConfirmed)
                    && <Typography variant="caption" pl={1}>{deleteText}</Typography>
                    }
                    {(step !== '1' || content !== 'recipient')
                        ? deleteConfirmed
                            ? (
                                <div>
                                    <Typography variant="caption">Bekreft</Typography>
                                    <ConfirmRemoveIcon
                                        className={classes.removeIconRed}
                                        onClick={onClear}

                                    />
                                </div>
                            )

                            : (
                                <RemoveIcon
                                    className={classes.removeIcon}
                                    onClick={() => {
                                        setDeleteConfirmed(true);
                                        clearTimeout(timer);
                                        setTimer(
                                            setTimeout(() => {
                                                setDeleteConfirmed(false);
                                            }, 1500),
                                        );
                                    }}
                                />
                            ) : <></>}
                </Box>

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
    title: PropTypes.string.isRequired,
};

export default ChipsListContainer;
