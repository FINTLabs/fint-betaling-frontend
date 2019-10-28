import React, {useEffect} from 'react';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/core/styles';
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
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import VigoLogo from "../../assets/vigo-logo-no-iks.svg";
import DashboardIcon from "@material-ui/icons/Dashboard";
import NewInvoice from "@material-ui/icons/NoteAdd";
import InvoiceHistory from "@material-ui/icons/History";
import LogOut from "@material-ui/icons/ExitToApp"
import {Send} from "@material-ui/icons";
import Routes from "./routes";
import {Link} from "react-router-dom";
import OrganisationSelector from "./organisation-selector";
import {fetchCustomer} from "../../data/redux/actions/customers";
import {fetchDate} from "../../data/redux/actions/dates";
import {fetchEmployer} from "../../data/redux/actions/employers";
import {fetchGroup} from "../../data/redux/actions/groups";
import {fetchMe} from "../../data/redux/actions/me";
import {fetchMva} from "../../data/redux/actions/mva";
import {fetchOrderLines} from "../../data/redux/actions/orderlines";
import {fetchPayment} from "../../data/redux/actions/payments";
import {useDispatch, useSelector} from "react-redux";
import LoadingPage from "./loading_page";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    vigoLogo: {
        height: "35px",
        paddingRight: theme.spacing(1),
    },
    menuLink: {
        textDecoration: 'none',
        color: "rgba(0, 0, 0, 0.87)",
    },
    organisationButton: {
        background: "red"
    },
}));

export default function Scaffold() {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const customers = useSelector(state => state.customers);
    const dates = useSelector(state => state.dates);
    const employers = useSelector(state => state.employers);
    const groups = useSelector(state => state.groups);
    const me = useSelector(state => state.me);
    const mva = useSelector(state => state.mva);
    const orderLines = useSelector(state => state.orderLines);
    const payments = useSelector(state => state.payments);
    const school = useSelector(state => state.payment.payment.school);

    let amountFinishedLoaded =
        (customers.loaded ? 1 : 0) +
        (dates.loaded ? 1 : 0) +
        (employers.loaded ? 1 : 0) +
        (groups.loaded ? 1 : 0) +
        (me.loaded ? 1 : 0) +
        (mva.loaded ? 1 : 0) +
        (orderLines.loaded ? 1 : 0) +
        (payments.loaded ? 1 : 0);

    const dispatch = useDispatch();

    function handleDrawerOpen() {
        setOpen(true);
    }

    function handleDrawerClose() {
        setOpen(false);
    }

    useEffect(() => {
        dispatch(fetchGroup());
        dispatch(fetchCustomer());
        dispatch(fetchDate());
        dispatch(fetchEmployer());
        dispatch(fetchMe());
        dispatch(fetchMva());
        dispatch(fetchOrderLines());
        dispatch(fetchPayment());
    }, [dispatch]);


    if (
        customers.isLoading ||
        dates.isLoading ||
        employers.isLoading ||
        groups.isLoading ||
        me.isLoading ||
        mva.isLoading ||
        orderLines.isLoading ||
        payments.isLoading ||
        !customers.loaded ||
        !dates.loaded ||
        !employers.loaded ||
        !groups.loaded ||
        !me.loaded ||
        !mva.loaded ||
        !orderLines.loaded ||
        !payments.loaded ||
        school.toString() === ''
    ) {
        return (<LoadingPage progress={amountFinishedLoaded}/>)
    } else {
        return (
            <div className={classes.root}>
                <CssBaseline/>
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
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <img src={VigoLogo} alt="Vigo logo" className={classes.vigoLogo}/>
                        <Typography variant="h6" noWrap>
                            FINT Betaling
                        </Typography>
                        <OrganisationSelector className={classes.organisationButton}/>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                >
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        <Link to={"/"} className={classes.menuLink}>
                            <ListItem button>
                                <ListItemIcon><DashboardIcon/></ListItemIcon>
                                <ListItemText primary="Dashboard"/>
                            </ListItem>
                        </Link>
                        <Divider/>
                        <Link to="/betaling" className={classes.menuLink}>
                            <ListItem button>
                                <ListItemIcon><NewInvoice/></ListItemIcon>
                                <ListItemText primary="Opprett betaling"/>
                            </ListItem>
                        </Link>
                        <Link to="/betalinger" className={classes.menuLink}>
                            <ListItem button>
                                <ListItemIcon><InvoiceHistory/></ListItemIcon>
                                <ListItemText primary="Sendte betalinger"/>
                            </ListItem>
                        </Link>
                        <Link to="/send-til-fakturasystem" className={classes.menuLink}>
                            <ListItem button>
                                <ListItemIcon><Send/></ListItemIcon>
                                <ListItemText primary="Send til fakturasystem"/>
                            </ListItem>
                        </Link>
                        <Link to="/logg-ut" className={classes.menuLink}>
                            <ListItem button>
                                <ListItemIcon><LogOut/></ListItemIcon>
                                <ListItemText primary="Logg ut"/>
                            </ListItem>
                        </Link>
                    </List>

                </Drawer>
                <main
                    className={clsx(classes.content, {
                        [classes.contentShift]: open,
                    })}
                >
                    <div className={classes.drawerHeader}/>

                    <Routes/>
                </main>
            </div>
        );
    }
}
