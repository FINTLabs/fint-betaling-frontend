import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Send } from '@mui/icons-material';

import Amount from '../payment/utils/amount';
import noNB from './localeTextConstants';
import PaymentStatusChip from './paymen-status-chip';
import { FILTER_LIST } from '../payment/constants';
import PaymentStatusMessageDialog from './payment-status-message-dialog';
import PaymentSelect from './payment-select';
import ClaimRepository from '../../data/repository/ClaimRepository';
import {
    updateInvoiceSnackbarContent,
    updateInvoiceSnackbarOpen, updateNeedFetch, updateNeedFetchCounts,
} from '../../data/redux/actions/payment';
import PaymentSnackbar from './payment-snackbar';
import fetchPayments from '../../data/redux/actions/payments';

const PaymentsDataGrid = () => {
    const dispatch = useDispatch();

    const [selectionModel, setSelectionModel] = React.useState([]);
    const [hideSchoolCol, setHideSchoolCol] = React.useState(true);
    // const needsFetch = useSelector((state) => state.payment.sendToExternalSystem.needFetch);

    const handleSchool = (value) => {
        if (value && value === '0') {
            setHideSchoolCol(false);
        } else {
            setHideSchoolCol(true);
        }
    };

    const handleConfirmSendPayments = () => {
        // TODO We need to get this from the me object
        const orgId = 'fintlabs.no';

        if (selectionModel.length < 1) return;
        ClaimRepository.sendOrders(
            orgId,
            selectionModel,
        )
            .then(([response, data]) => {
                console.log('response', response);
                if (response.status === 201) {
                    // dispatch(updateSendOrderResponse(data));
                    // dispatch(updateOrderSearchValue(1));
                    // dispatch(updateRedirectFromExternal(true));
                    // dispatch(updateLoadingSendingInvoice(false));
                    dispatch(updateNeedFetch(true));
                    dispatch(updateNeedFetchCounts(true));
                    // dispatch(updateLatestSentPayment({}));
                    dispatch(fetchPayments());
                    dispatch(updateInvoiceSnackbarContent(`${data.length} ordre er sendt til økonomisystemet!`));
                    dispatch(updateInvoiceSnackbarOpen(true));
                } else {
                    dispatch(updateInvoiceSnackbarContent(`En feil oppstod ved sending til økonomisystemet!
                    (Response status: ${response.status})`));
                    dispatch(updateInvoiceSnackbarOpen(true));
                }
            })
            .catch((error) => {
                dispatch(updateInvoiceSnackbarContent(`En feil oppstod ved sending til økonomisystemet! 
                (Error: ${error})`));
                dispatch(updateInvoiceSnackbarOpen(true));
            });

        // dispatch(updateLoadingSendingInvoice(true));
        // dispatch(updateOrderSearchValue(''));
        // dispatch(updateLatestSentPayment({}));
        // dispatch(updateSelectedOrders([]));
    };

    const rows = useSelector((state) => state.payments.payments);

    const columns = [
        {
            renderCell: (params) => <PaymentStatusChip payment={params} />,
            field: 'claimStatus',
            headerName: 'Status',
            width: 175,
            type: 'singleSelect',
            valueOptions: FILTER_LIST,
        },
        {
            field: 'customer.name',
            headerName: 'Navn',
            width: 150,
            valueGetter: (params) => params.row.customer.name,
        },
        {
            field: 'organisationUnit.name',
            headerName: 'Skole',
            width: 150,
            valueGetter: (params) => params.row.organisationUnit.name,
            hide: hideSchoolCol,
        },
        {
            field: 'orderNumber',
            headerName: 'Ordrenummer',
            width: 150,
            type: 'number',
        },
        {
            field: 'invoiceNumbers',
            headerName: 'Fakturanummer',
            width: 150,
            type: 'number',
        },
        {
            field: 'originalAmountDue',
            headerName: 'Netto totalpris',
            width: 150,
            type: 'number',
            renderCell: (params) => <Amount>{params.row.originalAmountDue}</Amount>,
        },
        {
            field: 'amountDue',
            headerName: 'Å betale',
            width: 150,
            type: 'number',
            renderCell: (params) => <Amount>{params.row.amountDue}</Amount>,
        },
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <PaymentSelect onSelectSchool={handleSchool} />
                    </Grid>

                    <Grid item xs={2}>
                        <Button onClick={handleConfirmSendPayments} startIcon={<Send />}>
                            Resend
                        </Button>
                    </Grid>

                    <Grid item xs="auto">
                        <div>
                            <GridToolbarExport />
                        </div>
                    </Grid>
                </Grid>

            </GridToolbarContainer>
        );
    }

    return (
        <Box width={1}>
            <PaymentStatusMessageDialog />

            <PaymentSnackbar />

            <div style={{ height: 800, width: '100%' }}>
                <DataGrid
                    isRowSelectable={
                        (params) => params.row.claimStatus === 'SEND_ERROR' || params.row.claimStatus === 'STORED'
                    }
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                    }}
                    selectionModel={selectionModel}
                    disableSelectionOnClick
                    autoHeight
                    rows={rows}
                    columns={columns}
                    checkboxSelection
                    getRowId={(row) => row.orderNumber}
                    components={{ Toolbar: CustomToolbar }}
                    localeText={noNB}
                />
            </div>
        </Box>
    );
};

export default PaymentsDataGrid;
