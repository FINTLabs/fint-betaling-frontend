import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
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
// import ChipsListContainer from '../chips-list-container';

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        maxWidth: 350,
        overflow: 'auto',
    },
    popper: {
        zIndex: 1,
        '&[x-placement*="bottom"] $arrow': {
            top: 0,
            left: 0,
            marginTop: '-0.9em',
            width: '3em',
            height: '1em',
            '&::before': {
                borderWidth: '0 1em 1em 1em',
                borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
            },
        },
        '&[x-placement*="top"] $arrow': {
            bottom: 0,
            left: 0,
            marginBottom: '-0.9em',
            width: '3em',
            height: '1em',
            '&::before': {
                borderWidth: '1em 1em 0 1em',
                borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
            },
        },
        '&[x-placement*="right"] $arrow': {
            left: 0,
            marginLeft: '-0.9em',
            height: '3em',
            width: '1em',
            '&::before': {
                borderWidth: '1em 1em 1em 0',
                borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
            },
        },
        '&[x-placement*="left"] $arrow': {
            right: 0,
            marginRight: '-0.9em',
            height: '3em',
            width: '1em',
            '&::before': {
                borderWidth: '1em 0 1em 1em',
                borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
            },
        },
    },
    arrow: {
        position: 'absolute',
        fontSize: 7,
        width: '3em',
        height: '3em',
        '&::before': {
            content: '""',
            margin: 'auto',
            display: 'block',
            width: 0,
            height: 0,
            borderStyle: 'solid',
        },
    },
}));

const ErrorAlertButton = (props) => {
    const classes = useStyles();
    const {
        handleClick,
        handleClose,
        anchorEl,
        arrowRef,
        setArrowRef,
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
                className={classes.popper}
                modifiers={{
                    flip: {
                        enabled: true,
                    },
                    preventOverflow: {
                        enabled: true,
                        boundariesElement: 'scrollParent',
                    },
                    arrow: {
                        enabled: true,
                        element: arrowRef,
                    },
                }}
            >
                <span className={classes.arrow} ref={setArrowRef} />
                <Paper className={classes.paper}>
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
    anchorEl: PropTypes.func.isRequired,
    arrowRef: PropTypes.func.isRequired,
    setArrowRef: PropTypes.func.isRequired,
};

export default ErrorAlertButton;
