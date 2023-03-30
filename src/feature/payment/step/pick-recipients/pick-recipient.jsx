import React, { useCallback, useEffect, useState } from 'react';
import { DialogContent, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import FormControl from '@mui/material/FormControl';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { useDropzone } from 'react-dropzone';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import File from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/CloudUploadRounded';
import FileRepository from '../../../../data/repository/FileRepository';
import fetchPrincipal from '../../../../data/redux/actions/principal';
import fetchCustomer from '../../../../data/redux/actions/customers';
import fetchGroup from '../../../../data/redux/actions/groups';
import RecipientChipList from '../recipient-chip-list';
// import {
//     GROUP,
//     SEARCH_PAGE_START
// } from '../../constants';
import {
    updateRecipients,
    // updateSearchBy,
    // updateSearchPage,
    // updateSearchValue,
    // updateSuggestions,
} from '../../../../data/redux/actions/payment';
import RecipientSearch from './recipient-search';

const useStyles = makeStyles((theme) => ({
    h2: {
        textAlign: 'center',
    },
    radioGroup: {
        flexDirection: 'row',
    },
    okButton: {
        margin: theme.spacing(2),
    },
}));

function MyDropzone(setUploadedFiles, setFileAlertOpen, setFileRejectOpen, setErrormessage, sendToBackend) {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 1) {
            setUploadedFiles(acceptedFiles);
            setFileAlertOpen(true);
        } else {
            acceptedFiles.forEach((file) => {
                sendToBackend(file);
            });
        }
    }, []);
    const onDropRejected = useCallback((rejected) => {
        setFileRejectOpen(true);
        setErrormessage(rejected[0].errors[0].message);
    }, []);
    const {
        getRootProps,
        getInputProps,
    } = useDropzone({
        onDrop,
        onDropRejected,
    });

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <div {...getRootProps()}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <input {...getInputProps()} />
            <Box display="flex" justifyContent="center">
                <Typography>
                    Dra en fil hit for å laste opp
                </Typography>
                <Box ml={2} display="flex">
                    <UploadIcon color="secondary" />
                </Box>
            </Box>
        </div>
    );
}

const PickPaymentRecipient = () => {
    const classes = useStyles();
    // const recipientType = useSelector((state) => state.payment.form.searchBy);
    const dispatch = useDispatch();
    // const groups = useSelector((state) => state.groups.groups);
    // const individual = useSelector((state) => state.customers.customers);
    const schoolOrgId = useSelector((state) => state.payment.payment.schoolOrgId);
    const recipients = useSelector((state) => state.payment.payment.recipients);
    const [fileAlertOpen, setFileAlertOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileRejectOpen, setFileRejectOpen] = useState(false);
    const [errormessage, setErrormessage] = useState('');
    const [customerNotFoundOpen, setCustomerNotFoundOpen] = useState(false);
    const [customersFromBackEnd, setCustomersFromBackend] = useState(null);

    useEffect(() => {
        if (schoolOrgId) {
            dispatch(fetchGroup(schoolOrgId));
            dispatch(fetchCustomer(schoolOrgId));
            dispatch(fetchPrincipal(schoolOrgId));
            console.log('test effect recipient school:', schoolOrgId);
        }
    }, [dispatch, schoolOrgId]);

    // const handleSearchBy = (event) => {
    //     dispatch(updateSearchBy(event.target.value));
    //     dispatch(updateSearchValue(''));
    //     dispatch(updateSuggestions(event.target.value === GROUP ? groups : individual));
    //     dispatch(updateSearchPage(SEARCH_PAGE_START));
    // };

    function handleRecipientList(individualList) {
        const recipientList = { ...recipients };
        for (let customer = 0; customer < individualList.length; customer += 1) {
            const customerNumber = individualList[customer].id;
            recipientList[customerNumber] = {
                checked: true,
                name: individualList[customer].name,
                email: individualList[customer].email ? individualList[customer].email : '',
                cellPhoneNumber: individualList[customer].mobile ? individualList[customer].mobile : '',
                addressLine: individualList[customer].postalAddress ? individualList[customer].postalAddress : '',
                addressZip: individualList[customer].postalCode ? individualList[customer].postalCode : '',
                addressPlace: individualList[customer].city ? individualList[customer].city : '',
            };
        }
        dispatch(updateRecipients(recipientList));
    }

    function sendToBackend(file) {
        FileRepository.sendFile(schoolOrgId, file)
            .then((r) => {
                if (r[0].status === 200) {
                    setCustomersFromBackend(r[1]);
                    setCustomerNotFoundOpen(true);
                    handleRecipientList(r[1].foundCustomers.customers);
                    setFileAlertOpen(false);
                } else if (r[0].status === 415) {
                    setFileRejectOpen(true);
                    setErrormessage(r[1].message);
                } else if (r[0].status === 400) {
                    setFileRejectOpen(true);
                    setErrormessage(r[1].message);
                } else {
                    setFileRejectOpen(true);
                    setErrormessage('Ukjent feil');
                }
            });
    }

    const handleClose = () => {
        setFileAlertOpen(false);
    };

    const handleRecjectClose = () => {
        setFileRejectOpen(false);
        setErrormessage('');
    };

    const handleNotFoundClose = () => {
        setCustomerNotFoundOpen(false);
    };

    return (
        <Box width="90%" mt={4}>
            <Typography variant="h3" className={classes.h2}>Velg mottaker</Typography>
            <RecipientChipList />
            <Box p={3} border={1} borderColor="secondary.main" bgcolor="grey.200" style={{ borderStyle: 'dashed' }}>
                {MyDropzone(setUploadedFiles, setFileAlertOpen, setFileRejectOpen, setErrormessage, sendToBackend)}
            </Box>
            <Box mt={4}>
                <FormControl component="fieldset" fullWidth>
                    <Box mt={2}>
                        <RecipientSearch />

                    </Box>
                </FormControl>
                <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={fileAlertOpen}>
                    <DialogTitle id="simple-dialog-title">Bare mulig å laste opp 1 fil. Velg en</DialogTitle>
                    <List>
                        {uploadedFiles ? uploadedFiles.map((file) => (
                            <ListItem button onClick={() => sendToBackend(file)} key={file.name}>
                                <ListItemAvatar>
                                    <Avatar className={classes.avatar}>
                                        <File />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={file.name} />
                            </ListItem>
                        )) : <div />}
                    </List>
                </Dialog>

                <Dialog onClose={handleRecjectClose} aria-labelledby="simple-dialog-title" open={fileRejectOpen}>
                    <DialogTitle id="simple-dialog-title">Feil ved opplasting</DialogTitle>
                    <DialogContent>
                        Årsak:
                        {' '}
                        {errormessage}
                        <Button
                            className={classes.okButton}
                            variant="contained"
                            color="secondary"
                            onClick={handleRecjectClose}
                        >
                            Ok
                        </Button>
                    </DialogContent>
                </Dialog>
                <Dialog onClose={handleNotFoundClose} aria-labelledby="simple-dialog-title" open={customerNotFoundOpen}>
                    <DialogTitle id="simple-dialog-title">Opplasting klar</DialogTitle>
                    <DialogContent>
                        <List>
                            {customersFromBackEnd
                                && customersFromBackEnd.foundCustomers
                                && customersFromBackEnd.foundCustomers.customers.length > 0
                                && <b>Følgende lagt til som mottaker:</b>}
                            {customersFromBackEnd && customersFromBackEnd.foundCustomers.customers.map((customer) => (
                                <ListItem key={customer.name}>
                                    {' '}
                                    {customer.name}
                                </ListItem>
                            ))}
                        </List>
                        <List>
                            {customersFromBackEnd
                                && customersFromBackEnd.notFoundCustomers
                                && customersFromBackEnd.notFoundCustomers.length > 0
                                && <b>Fant ikke følgende på din skole:</b>}
                            {customersFromBackEnd && customersFromBackEnd.notFoundCustomers.map((customer) => (
                                <ListItem key={customer}>
                                    {' '}
                                    {customer}
                                </ListItem>
                            ))}
                        </List>
                        <Button
                            className={classes.okButton}
                            variant="contained"
                            color="secondary"
                            onClick={handleNotFoundClose}
                        >
                            Ok
                        </Button>
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    );
};
export default PickPaymentRecipient;
