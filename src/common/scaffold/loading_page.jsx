import React from 'react';
import Typography from "@material-ui/core/Typography";
import {Box, LinearProgress, ListItemIcon, ListItemText, makeStyles} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {useDispatch, useSelector} from "react-redux";
import LoadingIcon from "@material-ui/icons/Remove";
import LoadedIcon from "@material-ui/icons/Done";
import VigoLogo from "../../assets/vigo-logo-no-iks.svg";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {updateSchool} from "../../data/redux/actions/payment";

const useStyles = makeStyles(theme => ({
    loadingContainer: {
        marginLeft: "20%",
        width: "60%",
        height: "80vh",
        textAlign: "center",
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
        alignSelf: "center",
    },
    linearProgress: {},
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    loadingIcon: {
        color: "red",
    },
    loadedIcon: {
        color: theme.palette.secondary.dark,
    },
    logoCard: {},
    vigoLogo: {
        marginTop: "10vh",
        height: "100px",
        width: "auto",
        objectFit: "contain",
    },
}));

const LoadingPage = (props) => {

    const customers = useSelector(state => state.customers);
    const dates = useSelector(state => state.dates);
    const employers = useSelector(state => state.employers);
    const groups = useSelector(state => state.groups);
    const me = useSelector(state => state.me);
    const mva = useSelector(state => state.mva);
    const orderLines = useSelector(state => state.orderLines);
    const payments = useSelector(state => state.payments);
    const school = useSelector(state => state.payment.payment.school);
    const classes = useStyles();
    const {progress} = props;
    let linearProgressValue = (progress * 100) / 8;
    let dispatch = useDispatch();
    const circularProgress = linearProgressValue !== 100 ? <CircularProgress className={classes.progress}/> : <div/>;
    const loadingMessage = linearProgressValue !== 100 ? "Loading... " + linearProgressValue + "%" : "Skoledata ferdig lastet. Venter på ditt skolevalg";

    function handleSchoolChange(event) {
        dispatch(updateSchool(event.target.value));
    }

    return (
        <Box className={classes.loadingContainer}>
            <img src={VigoLogo} title="Vigo IKS logo" className={classes.vigoLogo}/>
            <Typography variant="h5" className={classes.loadingText}>
                Betaling
            </Typography>
            {circularProgress}
            <Typography className={classes.loadingText}>
            {loadingMessage}
            </Typography>
            <Box className={classes.linearProgressBox}>
                <LinearProgress className={classes.linearProgress} variant="determinate" value={linearProgressValue}
                                color="secondary"/>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-simple">Velg skole</InputLabel>
                    <Select
                        value={school}
                        onChange={handleSchoolChange}
                        inputProps={{
                            name: 'school',
                            id: 'school-simple',
                        }}
                    >
                        <MenuItem value={"Skien VGS"}>Skien VGS</MenuItem>
                        <MenuItem value={"Porsgrunn VGS"}>Porsgrunn VGS</MenuItem>
                        <MenuItem value={"Bamble VGS"}>Bamble VGS</MenuItem>
                    </Select>
                </FormControl>
                <List>
                    <ListItem>
                        <ListItemText>
                            Laster elever
                        </ListItemText>
                        <ListItemIcon>
                            {!customers.loaded ? <LoadingIcon className={classes.loadingIcon}/> :
                                <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster ansatte
                        </ListItemText>
                        <ListItemIcon>
                            {!employers.loaded ? <LoadingIcon className={classes.loadingIcon}/> :
                                <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster basisgrupper og undervisningsgrupper
                        </ListItemText>
                        <ListItemIcon>
                            {!groups.loaded ? <LoadingIcon className={classes.loadingIcon}/> :
                                <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster personlig data
                        </ListItemText>
                        <ListItemIcon>
                            {!me.loaded ? <LoadingIcon className={classes.loadingIcon}/> :
                                <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster MVA-satser
                        </ListItemText>
                        <ListItemIcon>
                            {!mva.loaded ? <LoadingIcon className={classes.loadingIcon}/> :
                                <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster forfallsdatoer
                        </ListItemText>
                        <ListItemIcon>
                            {!dates.loaded ? <LoadingIcon className={classes.loadingIcon}/> :
                                <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>
                    <ListItem>
                        <ListItemText>
                            Laster produkter
                        </ListItemText>
                        <ListItemIcon>
                            {!orderLines.loaded ? <LoadingIcon className={classes.loadingIcon}/> :
                                <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>

                    <ListItem>
                        <ListItemText>
                            Laster betalingshistorikk
                        </ListItemText>
                        <ListItemIcon>
                            {!payments.loaded ? <LoadingIcon className={classes.loadingIcon}/> :
                                <LoadedIcon className={classes.loadedIcon}/>}
                        </ListItemIcon>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};

export default LoadingPage;