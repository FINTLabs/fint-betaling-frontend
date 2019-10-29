import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Card, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import InvoiceAdd from '@material-ui/core/SvgIcon/SvgIcon';
import InvoiceHistory from '@material-ui/icons/History';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(2),
  },
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  cardLink: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
  },
}));

const CardMenu = () => {
  const classes = useStyles();
  return (
    <Grid container justify="center" spacing={5} className={classes.root}>
      <Grid item>
        <Card className={classes.card}>
          <Link to="/betaling" className={classes.cardLink}>
            <CardActionArea target="/betaling">
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Opprett betalinger
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Opprett nye betalinger mot elever, grupper eller foresatte
                </Typography>
              </CardContent>
            </CardActionArea>
          </Link>
          <CardActions>
            <Link to="/betaling" className={classes.cardLink}>
              <Button size="small" color="secondary">
                <InvoiceAdd className={classes.icon} />
                Opprett betaling
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
      <Grid item>
        <Card className={classes.card}>
          <Link to="/betalinger" className={classes.cardLink}>
            <CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Betalingsoversikt
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Se betalinger som er opprettet og betalingsstatus
                  {' '}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Link>
          <CardActions>
            <Link to="/betalinger" className={classes.cardLink}>
              <Button size="small" color="secondary">
                <InvoiceHistory className={classes.icon} />
                Til betalingsoversikt
              </Button>
            </Link>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CardMenu;
