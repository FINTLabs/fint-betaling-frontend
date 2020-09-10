import React, {useCallback, useEffect, useState} from 'react';
import {makeStyles, Typography} from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@material-ui/core/Box';
import RecipientSearch from './recipient-search';
import {
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
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import File from "@material-ui/icons/CloudUpload"

const useStyles = makeStyles(() => ({
    h2: {
        textAlign: 'center',
    },
    radioGroup: {
        flexDirection: "row",
    }
}));

const PickPaymentRecipient = () => {
    const classes = useStyles();
    const recipientType = useSelector((state) => state.payment.form.searchBy);
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups.groups);
    const individual = useSelector((state) => state.customers.customers);
    const schoolOrgId = useSelector((state) => state.payment.payment.schoolOrgId);
    const [fileAlertOpen, setFileAlertOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);


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
                    if (file.type === "text/csv") {

                    } else {

                    }
                })
            }

        }, []);
        const {getRootProps, getInputProps} = useDropzone({onDrop});

        return (
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Typography>Last opp liste. Dra en fil hit</Typography>
            </div>
        );
    };

    function handleClose() {
        setFileAlertOpen(false);
    }

    function sendToBackend(file) {
        console.log("sending to backend!");
        setFileAlertOpen(false);
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
                        )):<></>}
                    </List>
                </Dialog>
            </Box>
        </Box>
    );
};

export default PickPaymentRecipient;
