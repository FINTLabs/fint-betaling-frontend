import React from 'react';
import {
  Box, makeStyles, Paper, Typography,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '80%',
    alignSelf: 'center',
    margin: 'auto',
  },
  table: {
    overflow: 'auto',
    minWidth: '100%',
    maxWidth: '100%',
  },
  tableCell: {
    overflow: 'auto',
    wordWrap: 'break-word',
    paddingTop: 0,
    paddingBottom: 0,
  },
  confirmButton: {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    display: 'flex',
    margin: 'auto',
    marginTop: theme.spacing(1),
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
  },
  buttonToNewOrder: {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    display: 'flex',
    margin: theme.spacing(1),
    float: 'left',
  },
  buttonSendMore: {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    display: 'flex',
    margin: theme.spacing(1),
    float: 'right',

  },
}));

const SentToExternalContainer = () => {
  const data = useSelector((state) => state.payment.backEndResponse.responseOrder);
  const classes = useStyles();
  console.log('Redirected here, with data: ', data);
  return (
    <Box className={classes.root}>
      <Typography variant="h4">Ordre sendt til økonomisystem</Typography>
      <Typography variant="body1">Følgende ordre er sendt til fakturasystem</Typography>

      {data
        ? (
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                <TableCell>Ordrenummer</TableCell>
                <TableCell align="right" className={classes.tableCell}>Mottakernavn</TableCell>
                <TableCell align="right" className={classes.tableCell}>Restbeløp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                data.map(
                  (suggestion) => (
                    <TableRow hover>
                      <TableCell align="left" className={classes.tableCell}>
                        {suggestion.ordrenummer}
                      </TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        {suggestion.kunde
                          ? suggestion.kunde.fulltNavn
                            ? suggestion.kunde.fulltNavn
                            : '' : ''}
                      </TableCell>
                      <TableCell align="right" className={classes.tableCell}>
                        {suggestion.restBelop
                          ? (parseInt(suggestion.restBelop) / 100).toFixed(2) : ''}
                      </TableCell>
                    </TableRow>
                  ),
                )
              }
            </TableBody>
          </Table>
        )
        : <div />}
      {data
        ? (
          <Paper className={classes.buttonContainer}>
            <Button className={classes.buttonToNewOrder}>Opprett nye ordre</Button>
            <Button className={classes.buttonSendMore}>Send flere lagrede ordre til økonomisystem</Button>
          </Paper>
        )
        : <div />}
    </Box>
  );
};

export default SentToExternalContainer;
