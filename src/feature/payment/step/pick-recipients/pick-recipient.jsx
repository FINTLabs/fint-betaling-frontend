import React, {useCallback, useEffect, useState} from 'react';
import {DialogContent, makeStyles, Typography} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@material-ui/core/Box';
import RecipientSearch from './recipient-search';
import {
    updateRecipients,
    updateSearchBy,
    updateSearchPage,
    updateSearchValue,
    updateSuggestions,
} from '../../../../data/redux/actions/payment';
import {GROUP, INDIVIDUAL, SEARCH_PAGE_START,} from '../../constants';
import RecipientChipList from '../recipient-chip-list';
import fetchGroup from '../../../../data/redux/actions/groups';
import fetchCustomer from '../../../../data/redux/actions/customers';
import fetchPrincipal from '../../../../data/redux/actions/principal';
import {useDropzone} from "react-dropzone";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import File from "@material-ui/icons/CloudUpload"
import FileRepository from "../../../../data/repository/FileRepository";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
    h2: {
        textAlign: 'center',
    },
    radioGroup: {
        flexDirection: "row",
    },
    okButton: {
      margin: theme.spacing(2),
    },
}));

const PickPaymentRecipient = () => {
        const classes = useStyles();
        const recipientType = useSelector((state) => state.payment.form.searchBy);
        const dispatch = useDispatch();
        const groups = useSelector((state) => state.groups.groups);
        const individual = useSelector((state) => state.customers.customers);
        const schoolOrgId = useSelector((state) => state.payment.payment.schoolOrgId);
        const recipients = useSelector((state) => state.payment.payment.recipients);
        const [fileAlertOpen, setFileAlertOpen] = useState(false);
        const [uploadedFiles, setUploadedFiles] = useState([]);
        const [fileRejectOpen, setFileRejectOpen] = useState(false);
        const [errormessage, setErrormessage] = useState("");
        const [customerNotFoundOpen, setCustomerNotFoundOpen] = useState(false);
        const [customersFromBackEnd, setCustomersFromBackend] = useState(null);

        useEffect(() => {
            if (schoolOrgId) {
                dispatch(fetchGroup(schoolOrgId));
                dispatch(fetchCustomer(schoolOrgId));
                dispatch(fetchPrincipal(schoolOrgId));
            }
        }, [dispatch, schoolOrgId]);

        function handleSearchBy(event) {
            dispatch(updateSearchBy(event.target.value));
            dispatch(updateSearchValue(''));
            dispatch(updateSuggestions(event.target.value === GROUP ? groups : individual));
            dispatch(updateSearchPage(SEARCH_PAGE_START));
        }

        function MyDropzone() {

            const onDrop = useCallback((acceptedFiles) => {
                if (acceptedFiles.length > 1) {
                    setUploadedFiles(acceptedFiles);
                    setFileAlertOpen(true);
                } else {
                    acceptedFiles.forEach((file) => {
                        sendToBackend(file);
                    })
                }

            }, []);
            const onDropRejected = useCallback((rejected) => {
                setFileRejectOpen(true);
                setErrormessage(rejected[0].errors[0].message);
            }, []);
            const {getRootProps, getInputProps} = useDropzone({onDrop, onDropRejected});

            return (
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Typography>
                        {'Dra en fil hit for å laste opp'}
                    </Typography>
                </div>
            );
        }

        function handleClose() {
            setFileAlertOpen(false);
        }

        function handleRecjectClose() {
            setFileRejectOpen(false);
            setErrormessage("");
        }

        function sendToBackend(file) {
            FileRepository.sendFile(schoolOrgId, file).then(r => {
                console.log(r);
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
                    setErrormessage("Ukjent feil");
                }
            });
        }

        function handleRecipientList(individualList) {
            const recipientList = {...recipients};
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

        function handleNotFoundClose() {
            setCustomerNotFoundOpen(false);
        }

        return (
            <Box width="90%" mt={4}>
                <Typography variant="h3" className={classes.h2}>Velg mottaker</Typography>
                <RecipientChipList/>
                <Box m={2} ml={"auto"} p={1.5} width={150} border={2} borderRadius={50} borderColor={"secondary.main"}>
                    <MyDropzone/>
                </Box>
                <Box mt={4}>
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                            className={classes.radioGroup}
                            aria-label="recipientType"
                            name="recipientType"
                            value={recipientType}
                            onChange={handleSearchBy}
                        >
                            <FormControlLabel
                                value={GROUP.toString()}
                                control={<Radio/>}
                                label="Gruppe"
                            />
                            <FormControlLabel
                                value={INDIVIDUAL.toString()}
                                control={<Radio/>}
                                label="Person"
                            />
                        </RadioGroup>
                        <Box mt={2}>
                            <RecipientSearch/>

                        </Box>
                    </FormControl>
                    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={fileAlertOpen}>
                        <DialogTitle id="simple-dialog-title">Bare mulig å laste opp 1 fil. Velg en</DialogTitle>
                        <List>
                            {uploadedFiles ? uploadedFiles.map((file) => (
                                <ListItem button onClick={() => sendToBackend(file)} key={file.name}>
                                    <ListItemAvatar>
                                        <Avatar className={classes.avatar}>
                                            <File/>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={file.name}/>
                                </ListItem>
                            )) : <></>}
                        </List>
                    </Dialog>

                    <Dialog onClose={handleRecjectClose} aria-labelledby="simple-dialog-title" open={fileRejectOpen}>
                        <DialogTitle id="simple-dialog-title">Feil ved opplasting</DialogTitle>
                        <DialogContent>
                            Årsak: {errormessage}
                            <Button className={classes.okButton} variant={"contained"} color={"secondary"} onClick={handleRecjectClose}>Ok</Button>
                        </DialogContent>
                    </Dialog>
                    <Dialog onClose={handleNotFoundClose} aria-labelledby="simple-dialog-title" open={customerNotFoundOpen}>
                        <DialogTitle id="simple-dialog-title">Opplasting klar</DialogTitle>
                        <DialogContent>
                            <List>
                                {customersFromBackEnd && customersFromBackEnd.foundCustomers && customersFromBackEnd.foundCustomers.customers.length > 0 &&
                                <b>Følgende lagt til som mottaker:</b>}
                                {customersFromBackEnd && customersFromBackEnd.foundCustomers.customers.map(customer => {
                                    return <ListItem> {customer.name}</ListItem>
                                })}
                            </List>
                            <List>
                                {customersFromBackEnd && customersFromBackEnd.notFoundCustomers && customersFromBackEnd.notFoundCustomers.length > 0 &&
                                <b>Fant ikke følgende på din skole:</b>}
                                {customersFromBackEnd && customersFromBackEnd.notFoundCustomers.map(customer => {
                                    return <ListItem> {customer}</ListItem>
                                })}
                            </List>
                            <Button className={classes.okButton} variant={"contained"} color={"secondary"} onClick={handleNotFoundClose}>Ok</Button>
                        </DialogContent>
                    </Dialog>
                </Box>
            </Box>
        );
    }
;

export default PickPaymentRecipient;
