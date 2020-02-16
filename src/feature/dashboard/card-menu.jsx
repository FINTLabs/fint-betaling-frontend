import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Card, makeStyles } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: theme.spacing(2),
    },
    card: {
        maxWidth: '500px',
        padding: theme.spacing(),
    },
}));

const CardMenu = () => {
    const classes = useStyles();
    return (
        <Grid container justify="center" spacing={5} className={classes.root}>
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
                        <Button href="/betaling/ny" size="small" color="secondary">
                            Til opprett ordre
                        </Button>
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
                        <Button href="/betaling/ny" size="small" color="secondary">
                            Til send ordre
                        </Button>
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
                                    Ordrehistorikk
                                </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Se ordrene som er opprettet og betalingsstatus
                                </Typography>
                            </Box>
                        </Box>

                    </CardContent>
                    <CardActions>
                        <Button href="/betaling/historikk" size="small" color="secondary">
                            Til ordrehistorikk
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CardMenu;
