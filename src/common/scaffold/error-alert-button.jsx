import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Error';
import { useSelector } from 'react-redux';
import Popper from '@mui/material/Popper';
import { Paper } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import RouteButton from '../route-button';

const ErrorAlertButton = (props) => {
    const {
        handleClick,
        handleClose,
        anchorEl,
    } = props;

    const payments = useSelector((state) => state.payments.payments);

    const me = useSelector((state) => state.me.me);
    const errorPayments = payments.filter((payment) => payment.claimStatus.includes('ERROR')
        && payment.createdBy.name === me.name).length;
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
                <Badge badgeContent={errorPayments} color="error">
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
                <Paper>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {errorPayments > 0
                                ? 'Du har ordre med feil.'
                                : 'Alt er i orden :)'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="secondary">
                            Lukk
                        </Button>
                        {errorPayments > 0
                        && (
                            <RouteButton to="/betaling/historikk" onClick={handleClose} color="secondary" autoFocus>
                                Gå til ordrehistorikk
                            </RouteButton>
                        )}
                    </DialogActions>
                </Paper>
            </Popper>
        </Box>
    );
};

ErrorAlertButton.propTypes = {
    handleClick: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    anchorEl: PropTypes.func,
};

ErrorAlertButton.defaultProps = {
    anchorEl: null,
};

export default ErrorAlertButton;
