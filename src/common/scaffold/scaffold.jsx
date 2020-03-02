import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import InvoiceHistory from '@material-ui/icons/History';
import NewInvoice from '@material-ui/icons/NoteAdd';
import LogOut from '@material-ui/icons/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import VigoLogo from '../../assets/vigo-logo-no-iks.svg';
import Routes from './routes';
import OrganisationSelector from './organisation-selector';
import fetchMe from '../../data/redux/actions/me';
import {
    initializePayment, setOrgId, setSchool, setSchoolOrgId,
} from '../../data/redux/actions/payment';
import ListItemLink from './list-item-link';
import UnsendtAlertButton from './unsendt-alert-button';
import ErrorAlertButton from './error-alert-button';
import fetchPayments from '../../data/redux/actions/payments';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    menuLink: {
        textDecoration: 'none',
        color: 'inherit',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        overflow: 'hidden',
        marginTop: 68,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    vigoLogo: {
        height: '35px',
        marginLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
}));

export default function Scaffold() {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);

    const me = useSelector((state) => state.me);
    const isPaymentsLoading = useSelector((state) => state.payments.isLoading);
    const isCustomersLoading = useSelector((state) => state.customers.isLoading);
    const isOrderLinesLoading = useSelector((state) => state.orderLines.isLoading);
    const isGroupsLoading = useSelector((state) => state.groups.isLoading);
    const isDatesLoading = useSelector((state) => state.dates.isLoading);

    const school = useSelector((state) => state.payment.payment.school);

    let localStorageSchool = localStorage.getItem('school');
    let localStorageSchoolOrgId = localStorage.getItem('schoolOrgId');

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

    useEffect(() => {
        if (_.isEmpty(me.me)) {
            dispatch(fetchMe());
        }
        dispatch(fetchPayments());
    }, [dispatch, me.me]);


    if (me.loaded && school.toString() === '') {
        localStorage.setItem('school', localStorageSchool
        && me.me.organisationUnits.some((ou) => ou.name === localStorageSchool)
            ? localStorageSchool
            : me.me.organisationUnits[0].name);

        localStorage.setItem('schoolOrgId',
            localStorageSchoolOrgId
            && me.me.organisationUnits.some((ou) => ou.organisationNumber === localStorageSchoolOrgId)
                ? localStorageSchoolOrgId
                : me.me.organisationUnits[0].organisationNumber);

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


    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    const loading = isCustomersLoading
        || isDatesLoading
        || isGroupsLoading
        || isOrderLinesLoading
        || isPaymentsLoading
        || me.isLoading;

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Link className={classes.menuLink} to="/">
                        <img src={VigoLogo} alt="Vigo logo" className={classes.vigoLogo} />
                    </Link>
                    <Typography variant="h6" noWrap>
                        FINT Betaling
                    </Typography>
                    <Box display="flex" ml="auto" alignItems="center">
                        <UnsendtAlertButton />
                        <ErrorAlertButton />
                        <OrganisationSelector />
                    </Box>
                </Toolbar>
                {loading && <LinearProgress color="secondary" />}

            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
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
                        <ListItemIcon><NewInvoice /></ListItemIcon>
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
                        <ListItemIcon><LogOut /></ListItemIcon>
                        <ListItemText primary="Send ordre" />
                    </ListItem>
                    <ListItem
                        button
                        to="/betaling/historikk"
                        component={Link}
                    >
                        <ListItemIcon><InvoiceHistory /></ListItemIcon>
                        <ListItemText primary="Ordrehistorikk" />
                    </ListItem>
                    <Divider />
                    <ListItemLink href="/AGLogout">
                        <ListItemIcon><LogOut /></ListItemIcon>
                        <ListItemText primary="Logg ut" />
                    </ListItemLink>
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <Routes />
            </main>
        </div>
    );
}
