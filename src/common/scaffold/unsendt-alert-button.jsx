import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import Popper from '@mui/material/Popper';
import { Paper } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import RouteButton from '../route-button';

import fetchPaymentsStatusCount from '../../data/redux/actions/status';

const UnsendtAlertButton = (props) => {
    const {
        handleClick,
        handleClose,
        anchorEl,
    } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPaymentsStatusCount('STORED'));
    }, []);

    // const payments = useSelector((state) => state.payments.payments);
    // const me = useSelector((state) => state.me.me);
    // const unsendtPayments = payments.filter((payment) => payment.claimStatus === 'STORED'
    //    && payment.createdBy.name === me.name).length;

    const unsendtPayments = useSelector((state) => state.payments.statusCount);
    const open = Boolean(anchorEl);
    const id = open ? 'spring-popper' : undefined;

    return (
        <Box>
            <IconButton
                aria-label="show new notifications"
                color="inherit"
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                size="large"
            >
                <Badge badgeContent={unsendtPayments} color="secondary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="bottom-end"
                disablePortal
                modifiers={[
                    {
                        name: 'flip',
                        enabled: true,
                    },
                    {
                        name: 'preventOverflow',
                        enabled: true,
                        boundariesElement: 'scrollParent',
                    },
                    {
                        name: 'arrow',
                        enabled: false,
                    },
                ]}
            >
                <Paper sx={{ width: 350 }}>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {unsendtPayments > 0
                                ? 'Du har ordre som ikke er sendt til økonomisystemet.'
                                : 'Alt er i orden :)'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Lukk
                        </Button>
                        {unsendtPayments > 0
                        && (
                            <RouteButton to="/betaling/send" onClick={handleClose} color="secondary" autoFocus>
                                Gå til send ordre
                            </RouteButton>
                        )}
                    </DialogActions>
                </Paper>
            </Popper>
        </Box>
    );
};

UnsendtAlertButton.propTypes = {
    handleClick: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    anchorEl: PropTypes.object,
};

UnsendtAlertButton.defaultProps = {
    anchorEl: null,
};
export default UnsendtAlertButton;
