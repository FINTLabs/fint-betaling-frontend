import React, { useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InvoiceHistoryIcon from '@mui/icons-material/History';
import NewInvoiceIcon from '@mui/icons-material/NoteAdd';
import LogOutIcon from '@mui/icons-material/ExitToApp';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { Card, CardHeader } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import ListItem from '@mui/material/ListItem';
import axios from 'axios';
import { useIdleTimer } from 'react-idle-timer';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import VigoLogo from '../../assets/vigo-logo-no-iks.svg';
import Routes from './routes';
import OrganisationSelector from './organisation-selector';
import fetchMe from '../../data/redux/actions/me';
import {
    initializePayment, setOrgId, setSchool, setSchoolOrgId,
} from '../../data/redux/actions/payment';
import UnsentAlertButton from './unsent-alert-button';
import ErrorAlertButton from './error-alert-button';

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(9)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Scaffold() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [customError, setCustomError] = React.useState(null);

    const [open, setOpen] = React.useState(false);

    const me = useSelector((state) => state.me);
    const isPaymentsLoading = useSelector((state) => state.payments.isLoading);
    const isCustomersLoading = useSelector((state) => state.customers.isLoading);
    const isGroupsLoading = useSelector((state) => state.groups.isLoading);

    const [alertAnchorEl, setAlertAnchorEl] = React.useState(null);
    const [alertArrowRef, setAlertArrowRef] = React.useState(null);
    const [errorAnchorEl, setErrorAnchorEl] = React.useState(null);
    const [errorArrowRef, setErrorArrowRef] = React.useState(null);

    const handleAlertClick = (event) => {
        setAlertAnchorEl(!alertAnchorEl ? event.currentTarget : null);
        setErrorAnchorEl(null);
    };

    const handleAlertClose = () => {
        setAlertAnchorEl(null);
    };

    const handleErrorClick = (event) => {
        setErrorAnchorEl(!errorAnchorEl ? event.currentTarget : null);
        setAlertAnchorEl(null);
    };

    const handleErrorClose = () => {
        setErrorAnchorEl(null);
    };

    const handleOnIdle = () => {
        //  eslint-disable-next-line no-console
        console.log('user is idle');
    };

    const handleOnActive = (event) => {
        //  eslint-disable-next-line no-console
        console.log('Check if we are authenticated ', event);
        axios.get('/api/me/ping')
            .then((result) => {
                if (result.status === 200 && result.data === 'Greetings from FINTLabs :)') {
                    //  eslint-disable-next-line no-console
                    console.log('We\'re still authenticated');
                }
            })
            .catch((result) => {
                //  eslint-disable-next-line no-console
                if (result.response.status === 500) {
                    setCustomError(result.response.data);
                    //  eslint-disable-next-line no-console
                    console.error('500 Error: ', customError);
                } else {
                    //  eslint-disable-next-line no-console
                    console.error('We need to re-authenticate!', result);
                }
                window.location = 'https://idp.felleskomponent.no/nidp/app/logout';
            });
    };

    useIdleTimer({
        timeout: me.me.idleTime,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        debounce: 500,
    });

    const school = useSelector((state) => state.payment.payment.school);

    let localStorageSchool = localStorage.getItem('school');
    let localStorageSchoolOrgId = localStorage.getItem('schoolOrgId');

    useEffect(() => {
        handleOnActive();
        if (me.me.organisationUnits) {
            const isSchoolPresentInMe = me.me.organisationUnits.some((ou) => ou.name === localStorageSchool);
            if (!isSchoolPresentInMe) {
                localStorageSchool = '';
                localStorageSchoolOrgId = '';
                localStorage.setItem('school', '');
                localStorage.setItem('schoolOrgId', '');
                dispatch(setSchool(''));
                dispatch(setSchoolOrgId(''));
            }
        }
    }, [me.me.organisationUnits]);

    useEffect(() => {
        if (_.isEmpty(me.me)) {
            dispatch(fetchMe());
        }
        // dispatch(fetchPayments());
    }, [dispatch, me.me]);

    if (me.loaded && school.toString() === '') {
        localStorage.setItem('school', localStorageSchool
        && me.me.organisationUnits.some((ou) => ou.name === localStorageSchool)
            ? localStorageSchool
            : me.me.organisationUnits[0].name);

        localStorage.setItem(
            'schoolOrgId',
            localStorageSchoolOrgId
            && me.me.organisationUnits.some((ou) => ou.organisationNumber === localStorageSchoolOrgId)
                ? localStorageSchoolOrgId
                : me.me.organisationUnits[0].organisationNumber,
        );

        dispatch(setOrgId(me.me.organisation.organisationNumber));

        dispatch(setSchoolOrgId(
            localStorageSchoolOrgId
            && me.me.organisationUnits.some((ou) => ou.organisationNumber === localStorageSchoolOrgId)
                ? localStorageSchoolOrgId
                : me.me.organisationUnits[0].organisationNumber,
        ));

        dispatch(setSchool(
            localStorageSchool
            && me.me.organisationUnits.some((ou) => ou.name === localStorageSchool)
                ? localStorageSchool
                : me.me.organisationUnits[0].name,
        ));
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const loading = isCustomersLoading
        || isGroupsLoading
        || isPaymentsLoading
        || me.isLoading;

    return (
        (!me.loaded && me.error) ? (
            <div>
                <Card>
                    <CardHeader title="Ingen tilgang" />
                    <CardContent>
                        <Typography variant="body2" component="p">
                            Dette kan skyldes at du ikke er registrert som ansatt ved en skole i FINT.
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        )
            : (
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBar position="fixed" open={open} style={{ background: '#fafafa' }}>

                        <Toolbar testid="toolbar" data-testid="toolbar">
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                size="large"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Link to="/">
                                <Box
                                    component="img"
                                    sx={{
                                        height: 35,
                                        ml: 8,
                                        pr: 1.5,
                                    }}
                                    alt="Vigo Logo"
                                    src={VigoLogo}
                                />
                            </Link>
                            <Typography variant="h6" noWrap>
                                FINT Elevfakturering
                            </Typography>
                            <Box display="flex" ml="auto" alignItems="center">
                                <UnsentAlertButton
                                    handleClick={handleAlertClick}
                                    handleClose={handleAlertClose}
                                    anchorEl={alertAnchorEl}
                                    arrowRef={alertArrowRef}
                                    setArrowRef={setAlertArrowRef}
                                />
                                <ErrorAlertButton
                                    handleClick={handleErrorClick}
                                    handleClose={handleErrorClose}
                                    anchorEl={errorAnchorEl}
                                    arrowRef={errorArrowRef}
                                    setArrowRef={setErrorArrowRef}
                                />
                                <Typography variant="button" sx={{ m: 2 }}>
                                    |
                                </Typography>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="flex-end"
                                    data-testid="userNameField"
                                >
                                    <Typography variant="button">
                                        {me.me.name}
                                    </Typography>
                                    <Typography variant="button" sx={{ m: 1.5 }}>
                                        |
                                    </Typography>
                                    {me.me.organisationUnits && <OrganisationSelector />}
                                </Box>
                            </Box>
                        </Toolbar>
                        {loading && <LinearProgress color="secondary" />}

                    </AppBar>
                    <Drawer variant="permanent" open={open}>
                        <DrawerHeader>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </DrawerHeader>
                        <Divider />
                        <List data-testid="homepageCards">
                            <ListItem button component={Link} to="/">
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Hjem" />
                            </ListItem>
                            <Divider />

                            <ListItem
                                button
                                component={Link}
                                to="/betaling/ny"
                                onClick={() => {
                                    dispatch(initializePayment());
                                }}
                            >
                                <ListItemIcon><NewInvoiceIcon /></ListItemIcon>
                                <ListItemText primary="Opprett ordre" />
                            </ListItem>

                            <ListItem
                                button
                                to="/betaling/send"
                                component={Link}
                                onClick={() => {
                                    dispatch(initializePayment());
                                }}
                            >
                                <ListItemIcon><SendIcon /></ListItemIcon>
                                <ListItemText primary="Send ordre" />
                            </ListItem>
                            <ListItem
                                button
                                to="/betaling/historikk"
                                component={Link}
                            >
                                <ListItemIcon><InvoiceHistoryIcon /></ListItemIcon>
                                <ListItemText primary="Ordrehistorikk" />
                            </ListItem>
                            <Divider />
                            <ListItem
                                button
                                component="a"
                                href="https://idp.felleskomponent.no/nidp/app/logout"
                            >
                                <ListItemIcon>
                                    <LogOutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Logg ut" />
                            </ListItem>
                        </List>
                    </Drawer>
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, mt: 8, p: 3 }}
                    >
                        <main>
                            <Routes />
                        </main>
                    </Box>
                </Box>
            )
    );
}
