import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import ConfirmRemoveIcon from '@mui/icons-material/DeleteForever';
import RemoveIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

const ChipsListContainer = ({
    children,
    content,
    onClear,
    count,
    title,
}) => {
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
            borderRadius={1}
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
                {children.length > 0
                    ? (
                        <Box mt={1} mr="22px" data-testid="delete-icon">
                            {' '}
                            {
                                ((step !== '1' || (step === '1' && content !== 'recipient')) && !deleteConfirmed)
                                && <Typography variant="caption" pl={1}>{deleteText}</Typography>
                            }
                            {/* eslint-disable-next-line no-nested-ternary */}
                            {(step !== '1' || content !== 'recipient')
                                ? deleteConfirmed
                                    ? (
                                        <div>
                                            <Typography variant="caption">Bekreft</Typography>
                                            <ConfirmRemoveIcon
                                                sx={{
                                                    color: 'warning.dark',
                                                    cursor: 'pointer',
                                                    verticalAlign: 'bottom',
                                                }}
                                                onClick={onClear}
                                            />
                                        </div>
                                    )

                                    : (
                                        <RemoveIcon
                                            sx={{ cursor: 'pointer', verticalAlign: 'bottom' }}
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
                                    ) : <div />}
                        </Box>
                    )
                    : null }
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
    content: PropTypes.string,
};

ChipsListContainer.defaultProps = {
    content: '',
};

export default ChipsListContainer;
