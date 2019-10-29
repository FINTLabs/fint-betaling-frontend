import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

function createData(type, total) {
  return {
    type,
    total,
  };
}

const rowsToday = [
  createData('Ubetalt', '32.450,00 kr'),
  createData('Betalte', '129.000,00 kr'),
  createData('Sendt', '161.450,00 kr'),
];
const rowsAll = [
  createData('Ubetalt', '691.610,00 kr'),
  createData('Betalte', '1.750.300,00 kr'),
  createData('Sendt', '2.441.910,00 kr'),
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '50%',
    overflowX: 'auto',
    margin: 'auto',
  },
  table: {},
  tableHead: {
    fontSize: 18,
  },
  tableSubType: {
    color: 'grey',
    fontSize: 14,
    textAlign: 'center',
  },
}));

export default function PaymentInformationList() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell className={classes.tableHead}>Type</StyledTableCell>
            <StyledTableCell align="right" className={classes.tableHead}>
              Totalt
              beløp
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow key="I dag">
            <StyledTableCell
              colSpan={2}
              component="th"
              scope="row"
              className={classes.tableSubType}
            >
              Betalinger i dag
            </StyledTableCell>
          </StyledTableRow>
          {rowsToday.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.type}
              </StyledTableCell>
              <StyledTableCell align="right">{row.total}</StyledTableCell>
            </StyledTableRow>
          ))}
          <StyledTableCell
            colSpan={2}
            component="th"
            scope="row"
            className={classes.tableSubType}
          >
            Alle betalinger
          </StyledTableCell>
          {rowsAll.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.type}
              </StyledTableCell>
              <StyledTableCell align="right">{row.total}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
