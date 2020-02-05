import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Card, makeStyles } from '@material-ui/core';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';

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
                        <Typography gutterBottom variant="h5" component="h2">
                            Opprett betalinger
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Opprett nye betalinger mot elever, grupper eller foresatte
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button href="/betaling/ny" size="small" color="secondary">
                            Opprett betaling
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item>
                <Card className={classes.card}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Betalingshistorikk
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Se betalinger som er opprettet og betalingsstatus
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button href="/betaling/historikk" size="small" color="secondary">
                            Til betalingshistorikk
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    );
};

export default CardMenu;
