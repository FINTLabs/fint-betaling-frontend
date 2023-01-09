import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper,
    Popper,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
} from '@mui/material';

import RouteButton from '../route-button';
import fetchPaymentsStatusCount from '../../data/redux/actions/status';

const UnsentAlertButton = (props) => {
    const {
        handleClick,
        handleClose,
        anchorEl,
    } = props;
    const dispatch = useDispatch();

    const unsentPayments = useSelector((state) => state.payments.statusCountUnsent);

    if (unsentPayments === null) {
        dispatch(fetchPaymentsStatusCount());
    }

    const open = Boolean(anchorEl);
    const id = open ? 'spring-popper' : undefined;

    return (
        <Box data-cy="UnsentAlertButton">
            <IconButton
                aria-label="show new notifications"
                color="inherit"
                aria-owns={open ? 'mouse-over-popover' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                size="large"
            >
                <Badge badgeContent={unsentPayments} color="secondary">
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
                            {unsentPayments > 0
                                ? 'Du har ordre som ikke er sendt til økonomisystemet.'
                                : 'Alt er i orden :)'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Lukk
                        </Button>
                        {unsentPayments > 0
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

UnsentAlertButton.propTypes = {
    handleClick: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    anchorEl: PropTypes.object,
};

UnsentAlertButton.defaultProps = {
    anchorEl: null,
};
export default UnsentAlertButton;
