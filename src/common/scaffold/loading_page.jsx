import React from 'react';
import Typography from '@material-ui/core/Typography';
import {Box, LinearProgress, ListItemIcon, ListItemText, makeStyles,} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {useSelector} from 'react-redux';
import LoadingIcon from '@material-ui/icons/Remove';
import LoadedIcon from '@material-ui/icons/Done';
import VigoLogo from '../../assets/vigo-logo-no-iks.svg';

const useStyles = makeStyles((theme) => ({
    loadingContainer: {
        marginLeft: '20%',
        width: '60%',
        height: '80vh',
        textAlign: 'center',
    },
    loadingText: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
    },
    progress: {
        color: theme.palette.secondary.main,
        margin: theme.spacing(2),
    },
    linearProgressBox: {
        alignSelf: 'center',
    },
    linearProgress: {},
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    loadingIcon: {
        color: 'red',
    },
    loadedIcon: {
        color: theme.palette.secondary.dark,
    },
    logoCard: {},
    vigoLogo: {
        marginTop: '10vh',
        height: '100px',
        width: 'auto',
        objectFit: 'contain',
    },
}));

const LoadingPage = (props) => {
    const customers = useSelector((state) => state.customers);
    const dates = useSelector((state) => state.dates);
    const employers = useSelector((state) => state.employers);
    const groups = useSelector((state) => state.groups);
    const me = useSelector((state) => state.me);
    const mva = useSelector((state) => state.mva);
    const orderLines = useSelector((state) => state.orderLines);
    const payments = useSelector((state) => state.payments);
    const classes = useStyles();
    const {progress} = props;
    const linearProgressValue = (progress * 100) / 8;
    const circularProgress = linearProgressValue !== 100 ? <CircularProgress className={classes.progress}/> : <div/>;
    const loadingMessage = linearProgressValue !== 100 ? `Loading... ${linearProgressValue}%` : 'Skoledata ferdig lastet. Venter på ditt skolevalg';

    return (
        <Box className={classes.loadingContainer}>
            <img src={VigoLogo} title="Vigo IKS logo" className={classes.vigoLogo} alt={"Vigo IKS logo"}/>
            <Typography variant="h5" className={classes.loadingText}>
                Betaling
            </Typography>
            {circularProgress}
            <Typography className={classes.loadingText}>
                {loadingMessage}
            </Typography>
            <Box className={classes.linearProgressBox}>
                <LinearProgress
                    className={classes.linearProgress}
                    variant="determinate"
                    value={linearProgressValue}
                    color="secondary"
                />
                <List>
                    <ListItem>
                        <ListItemText>
                            Laster elever
                        </ListItemText>
                        <ListItemIcon>
                            {!customers.loaded ? <LoadingIcon className={classes.loadingIcon}/>
                                : <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster ansatte
                        </ListItemText>
                        <ListItemIcon>
                            {!employers.loaded ? <LoadingIcon className={classes.loadingIcon}/>
                                : <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster basisgrupper og undervisningsgrupper
                        </ListItemText>
                        <ListItemIcon>
                            {!groups.loaded ? <LoadingIcon className={classes.loadingIcon}/>
                                : <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster personlig data
                        </ListItemText>
                        <ListItemIcon>
                            {!me.loaded ? <LoadingIcon className={classes.loadingIcon}/>
                                : <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster MVA-satser
                        </ListItemText>
                        <ListItemIcon>
                            {!mva.loaded ? <LoadingIcon className={classes.loadingIcon}/>
                                : <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster forfallsdatoer
                        </ListItemText>
                        <ListItemIcon>
                            {!dates.loaded ? <LoadingIcon className={classes.loadingIcon}/>
                                : <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>
                    <ListItem>
                        <ListItemText>
                            Laster produkter
                        </ListItemText>
                        <ListItemIcon>
                            {!orderLines.loaded ? <LoadingIcon className={classes.loadingIcon}/>
                                : <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster betalingshistorikk
                        </ListItemText>
                        <ListItemIcon>
                            {!payments.loaded ? <LoadingIcon className={classes.loadingIcon}/>
                                : <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};

export default LoadingPage;
