import * as React from 'react';
import PropTypes from 'prop-types';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarExport,
} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Send } from '@mui/icons-material';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import CircularProgress from '@mui/material/CircularProgress';
import Amount from '../payment/utils/amount';
import noNB from '../../common/translations/noNB';
import PaymentStatusChip from './payment-status-chip';
import { FILTER_LIST } from '../payment/constants';
import PaymentStatusMessageDialog from './payment-status-message-dialog';
import PaymentSelect from './payment-select';
import ClaimRepository from '../../data/repository/ClaimRepository';
import {
    updateInvoiceSnackbarContent,
    updateInvoiceSnackbarOpen, updateNeedFetch,
} from '../../data/redux/actions/payment';
import PaymentSnackbar from './payment-snackbar';
import fetchPayments from '../../data/redux/actions/payments';
import fetchPaymentsStatusCountUnsent from '../../data/redux/actions/status';

function CustomToolbar({ selectedItems }) {
    const dispatch = useDispatch();
    const periodSelection = useSelector((state) => state.payment.payments.periodSelection);
    const schoolSelection = useSelector((state) => state.payment.payments.schoolSelection);
    const [loading, setLoading] = React.useState(false);

    function handleConfirmSendPayments() {
        // TODO We need to get this from the me object
        const orgId = 'fintlabs.no';

        if (selectedItems.length < 1) return;
        ClaimRepository.sendOrders(
            orgId,
            selectedItems,
        )
            .then(({ status, data }) => {
                if (status === 201) {
                    dispatch(updateNeedFetch(true));
                    dispatch(fetchPaymentsStatusCountUnsent('STORED'));
                    dispatch(fetchPayments(periodSelection));
                    dispatch(updateInvoiceSnackbarContent(`${data.length} ordre er sendt til økonomisystemet!`));
                    dispatch(updateInvoiceSnackbarOpen(true));
                } else {
                    dispatch(updateInvoiceSnackbarContent(`En feil oppstod ved sending til økonomisystemet!
                    (Response status: ${status})`));
                    dispatch(updateInvoiceSnackbarOpen(true));
                }
            })
            .catch((error) => {
                dispatch(updateInvoiceSnackbarContent(`En feil oppstod ved sending til økonomisystemet! 
                (Error: ${error})`));
                dispatch(updateInvoiceSnackbarOpen(true));
            });
    }

    function handleUpdateStatus() {
        setLoading(true);
        // Assuming you have a function to make the API call
        ClaimRepository.updateClaimStatus(periodSelection, schoolSelection)
            .then(() => {
                dispatch(fetchPayments(periodSelection, schoolSelection));
            })
            .catch((error) => {
                dispatch(updateInvoiceSnackbarContent(`En feil oppstod ved updating fra økonomisystemet! 
                (Error: ${error})`));
                dispatch(updateInvoiceSnackbarOpen(true));
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <GridToolbarContainer>
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={8}>
                    <PaymentSelect />
                </Grid>
                <Grid item xs={3}>
                    <Button
                        data-testid="updateButton"
                        onClick={() => {
                            handleUpdateStatus();
                        }}
                        startIcon={loading ? <CircularProgress size={24} /> : <SyncAltIcon />}
                        disabled={loading}
                        sx={{ fontSize: 13 }}
                    >
                        Oppdater
                    </Button>
                    <Button
                        data-testid="resendButton"
                        onClick={() => {
                            handleConfirmSendPayments();
                        }}
                        startIcon={<Send />}
                        sx={{ fontSize: 13 }}
                    >
                        Resend
                    </Button>
                    <GridToolbarExport />
                </Grid>
            </Grid>
        </GridToolbarContainer>

    );
}

const PaymentsDataGrid = () => {
    const [selectionModel, setSelectionModel] = React.useState([]);
    // const [hideSchoolCol, setHideSchoolCol] = React.useState(false);
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
            valueGetter: (params) => params.row.customerName,
        },
        {
            field: 'organisationUnit.name',
            headerName: 'Skole',
            width: 150,
            valueGetter: (params) => params.row.organisationUnit.name,
            // hide: hideSchoolCol,
        },
        {
            field: 'orderNumber',
            headerName: 'Ordrenummer',
            width: 150,
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
        {
            field: 'createdDate',
            headerName: 'Opprettet',
            width: 150,
            type: 'date',
            valueFormatter: (params) => {
                const date = new Date(params.value);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
                const year = date.getFullYear();
                return `${day}.${month}.${year}`; // Concatenates the date in dd.mm.yyyy format
            },
        },
    ];
    const isInBatch = (currentRow, allRows) => {
        const currentTimestamp = new Date(currentRow.createdDate).getTime();
        const matchedRows = allRows.filter((row) => new Date(row.createdDate).getTime() === currentTimestamp);
        return matchedRows.length > 1;
    };

    const getBatchColorClass = (batchIndex) => (
        batchIndex % 2 === 0 ? 'yellow' : 'coral'
    );

    return (
        <Box width={1}>
            <PaymentStatusMessageDialog />

            <PaymentSnackbar />

            <div style={{ height: 800, width: '100%' }}>
                <DataGrid
                    isRowSelectable={
                        (params) => params.row.claimStatus === 'SEND_ERROR'
                            || params.row.claimStatus === 'STORED'
                            || params.row.claimStatus === 'ACCEPT_ERROR'
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
                    getRowClassName={(params) => {
                        const allRows = rows;
                        if (isInBatch(params.row, allRows)) {
                            const currentTimestamp = new Date(params.row.createdDate).getTime();
                            const sortedTimestamps = [...new Set(
                                allRows.map((row) => new Date(row.createdDate).getTime()),
                            )].sort();
                            const batchIndex = sortedTimestamps.indexOf(currentTimestamp);
                            return getBatchColorClass(batchIndex);
                        }
                        return '';
                    }}
                    localeText={noNB}
                />
            </div>
            <style>
                { `
                .yellow {
                    background-color: rgba(255, 250, 205, 1) !important;
                }

                .coral {
                    background-color: rgba(255, 127, 80, 0.2) !important;
                }
            ` }
            </style>
        </Box>
    );
};
CustomToolbar.propTypes = {
    selectedItems: PropTypes.array,
};
CustomToolbar.defaultProps = {
    selectedItems: [],
};

export default PaymentsDataGrid;
