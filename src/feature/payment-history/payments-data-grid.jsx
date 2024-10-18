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
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${day}.${month}.${year}`;
            },
        },
    ];
    const isInBatch = (currentRow, allRows) => {
        const currentTimestamp = new Date(currentRow.createdDate).getTime();
        const matchedRows = allRows.filter((row) => new Date(row.createdDate).getTime() === currentTimestamp);
        return matchedRows.length > 1;
    };

    const getBatchColorClass = (batchIndex) => (
        batchIndex % 2 === 0 ? 'gray' : 'light-gray'
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
                    components={{
                        Toolbar: CustomToolbar,
                    }}
                    componentsProps={{
                        toolbar: {
                            selectedItems: selectionModel,
                        },
                    }}
                />
            </div>
            <style>
                { `
                .gray {
                    background-color: rgba(211,211,211, 0.5) !important;
                }

                .light-gray {
                    background-color: rgba(137,137,137, 0.3) !important;
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
