import React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Dialog,
    Typography,
    CircularProgress,
    LinearProgress,
} from '@mui/material';
import { SEND_ORDERS_BATCH_SIZE } from '../data/repository/ClaimRepository';

const SendingOrdersDialog = ({
    open,
    currentBatch,
    totalBatches,
    sentCount,
    totalCount,
    batchSize,
}) => {
    const showBatchProgress = totalBatches > 1;
    const fromOrder = sentCount + 1;
    const toOrder = Math.min(sentCount + batchSize, totalCount);
    const progressValue = totalCount > 0
        ? Math.round((sentCount / totalCount) * 100)
        : 0;

    return (
        <Dialog
            open={open}
            BackdropProps={{ invisible: true }}
            PaperProps={{ style: { borderRadius: '20px' } }}
            id="loading-dialog"
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="180px"
                width="340px"
                p={2}
                textAlign="center"
            >
                <Typography variant="h5">Ordre sendes...</Typography>
                {showBatchProgress && (
                    <>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {`Pulje ${currentBatch} av ${totalBatches}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {batchSize > 0
                                ? `Sender ordre ${fromOrder}–${toOrder} av ${totalCount}`
                                : `${sentCount} av ${totalCount} ordre sendt`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                            {`Sender ${SEND_ORDERS_BATCH_SIZE} ordre om gangen`}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            color="secondary"
                            value={progressValue}
                            sx={{ width: '80%', mt: 2 }}
                        />
                    </>
                )}
                <CircularProgress style={{ marginTop: '20px' }} />
            </Box>
        </Dialog>
    );
};

SendingOrdersDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    currentBatch: PropTypes.number,
    totalBatches: PropTypes.number,
    sentCount: PropTypes.number,
    totalCount: PropTypes.number,
    batchSize: PropTypes.number,
};

SendingOrdersDialog.defaultProps = {
    currentBatch: 1,
    totalBatches: 1,
    sentCount: 0,
    totalCount: 0,
    batchSize: 0,
};

export default SendingOrdersDialog;
