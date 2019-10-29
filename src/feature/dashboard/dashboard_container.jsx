import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import PaymentInformationList from './payment_information/payment_information_list';
import CardMenu from './card_menu/card_menu';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    width: '100%',
  },
}));

const DashboardContainer = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <CardMenu />
      <PaymentInformationList />
    </Box>
  );
};

export default DashboardContainer;
