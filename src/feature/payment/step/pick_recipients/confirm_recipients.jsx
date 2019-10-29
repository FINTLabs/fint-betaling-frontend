import React from 'react';
import List from '@material-ui/core/List';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import { ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Delete from '@material-ui/icons/Delete';
import Box from '@material-ui/core/Box';
import { updateConfirmRecipientsOpen, updateRecipients, updateStep } from '../../../../data/redux/actions/payment';
import { STEP_PICK_PRODUCTS } from '../../constants';

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: '45%',
  },
  list: {
    overflow: 'auto',
  },
  listItemIcon: {
    float: 'right',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  removeIcon: {},
  listItem: {
    '&:hover': {
      background: '#f2f2f2',
    },
  },
  buttonBox: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(1),
  },
  confirmButton: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
    marginLeft: theme.spacing(1),
  },
  cancelButton: {
    color: theme.palette.secondary.main,
  },
}));


function ConfirmRecipients() {
  const classes = useStyles();
  const open = useSelector((state) => state.payment.form.confirmRecipientsOpen);
  const recipients = useSelector((state) => state.payment.payment.recipients);
  const dispatch = useDispatch();
  const recipientKeys = Object.keys(recipients);

  function removeItem(key) {
    const newArray = { ...recipients };
    newArray[key] = {
      checked: false,
      name: '',
    };
    let shouldClose = true;
    for (let recipientKeyCounter = 0; recipientKeyCounter < recipientKeys.length; recipientKeyCounter++) {
      if (recipients[recipientKeys[recipientKeyCounter]].checked === true && recipients[recipientKeys[recipientKeyCounter]] !== recipients[key]) {
        shouldClose = false;
      }
    }
    if (shouldClose) {
      handleCloseConfirmRecipients();
    }
    dispatch(updateRecipients(newArray));
  }

  function handleConfirmClick() {
    dispatch(updateStep(STEP_PICK_PRODUCTS));
  }

  function handleCloseConfirmRecipients() {
    dispatch(updateConfirmRecipientsOpen(false));
  }

  return (
    <Dialog
      className={classes.root}
      onClose={handleCloseConfirmRecipients}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Dine mottakere</DialogTitle>
      <List className={classes.list} hover>
        {
          recipientKeys.map((key) => {
            if (recipients[key].checked) {
              return (
                <ListItem className={classes.listItem}>
                  <ListItemText>
                    {recipients[key].name}
                  </ListItemText>
                  <ListItemIcon className={classes.listItemIcon}>
                    <Button onClick={() => removeItem(key)}>
                      <Delete className={classes.removeIcon} />
                    </Button>
                  </ListItemIcon>
                </ListItem>
              );
            }
          })
        }
      </List>
      <Box className={classes.buttonBox}>
        <Button
          variant="outlined"
          className={classes.cancelButton}
          onClick={handleCloseConfirmRecipients}
        >
          Tilbake
        </Button>
        <Button
          variant="outlined"
          className={classes.confirmButton}
          onClick={handleConfirmClick}
        >
          Velg varer
        </Button>
      </Box>
    </Dialog>
  );
}

export default ConfirmRecipients;
