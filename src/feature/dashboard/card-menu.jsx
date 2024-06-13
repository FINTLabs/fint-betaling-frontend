import React from 'react';
import Grid from '@mui/material/Grid';
import { Card } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import RouteButton from '../../common/route-button';
import { initializePayment } from '../../data/redux/actions/payment';
import { INITIALIZE_PAYMENT } from '../../data/redux/actions/actions';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(2),
        width: 'auto',
    },
    card: {
        width: '400px',
        padding: theme.spacing(),
    },
}));

const CardMenu = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    return (
        <Grid container justifyContent="center" spacing={5} className={classes.root}>
            <Grid item>
                <Card className={classes.card}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Box>
                                <Typography variant="h1" component="h1">
                                    1
                                </Typography>
                            </Box>
                            <Box display="flex" flexDirection="column" width={4 / 5}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Opprett ordre
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Opprett nye betalinger mot elever, grupper eller foresatte
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <RouteButton
                            to="/betaling/ny"
                            size="small"
                            color="secondary"
                            onClick={() => {
                                dispatch(initializePayment(INITIALIZE_PAYMENT));
                            }}
                        >
                            Til opprett ordre
                        </RouteButton>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item>
                <Card className={classes.card}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h1" component="h1">
                                2
                            </Typography>
                            <Box display="flex" flexDirection="column" width={4 / 5}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Send ordre
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Etter at du har opprettet ordren må den sendes til økonomisystemet.
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                    <CardActions>
                        <RouteButton
                            to="/betaling/send"
                            size="small"
                            color="secondary"
                            onClick={() => {
                                dispatch(initializePayment(INITIALIZE_PAYMENT));
                            }}
                        >
                            Til send ordre
                        </RouteButton>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item>
                <Card className={classes.card}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h1" component="h1">
                                3
                            </Typography>
                            <Box display="flex" flexDirection="column" width={4 / 5}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Ordrehistorik
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Se ordrene som er opprettet og betalingsstatus
                                </Typography>
                            </Box>
                        </Box>

                    </CardContent>
                    <CardActions>
                        <RouteButton to="/betaling/historikk" size="small" color="secondary">
                            Til ordrehistorikk
                        </RouteButton>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CardMenu;
