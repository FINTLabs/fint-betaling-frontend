import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material';
import Grid from '@mui/material/Grid';

import Amount from '../payment/utils/amount';
import noNB from './localeTextConstants';
import PaymentStatusChip from './paymen-status-chip';
import { FILTER_LIST } from '../payment/constants';
import PaymentStatusMessageDialog from './payment-status-message-dialog';
import PaymentSelect from './payment-select';

const PaymentsDataGrid = () => {
    // const dispatch = useDispatch();

    const CustomizedGridToolbarExport = styled(GridToolbarExport)`
      color: #8cc640;
    `;

    const [hideSchoolCol, setHideSchoolCol] = React.useState(true);

    const handleSchool = (value) => {
        if (value && value === '0') {
            setHideSchoolCol(false);
        } else {
            setHideSchoolCol(true);
        }
    };

    // const rows = useSelector((state) => state.payment.payments.filteredSuggestions);
    const rows = useSelector((state) => state.payments.payments);

    const columns = [
        {
            // eslint-disable-next-line react/display-name
            renderCell: (params) => <PaymentStatusChip payment={params} />,
            field: 'claimStatus',
            headerName: 'Status',
            width: 175,
            type: 'singleSelect',
            // valueOptions: ['STORED', 'UPDATE_ERROR'],
            // valueOptions: FILTER_LIST.map((option) => option.key),
            valueOptions: FILTER_LIST,
            // onClick={(e) => handleStatusClick(e, "testing clicking")}
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
            // eslint-disable-next-line react/display-name
            // renderCell: (params) => <Amount>{params.getValue(params.id, 'originalAmountDue')}</Amount>,
            renderCell: (params) => <Amount>{params.row.originalAmountDue}</Amount>,
        },
        {
            field: 'amountDue',
            headerName: 'Å betale',
            width: 150,
            type: 'number',
            // eslint-disable-next-line react/display-name
            renderCell: (params) => <Amount>{params.row.amountDue}</Amount>,
        },
    ];

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <PaymentSelect onSelectSchool={handleSchool} />
                    </Grid>

                    <Grid item xs="auto">
                        <div>
                            <CustomizedGridToolbarExport />
                        </div>
                    </Grid>
                </Grid>

            </GridToolbarContainer>
        );
    }

    return (
        <Box width={1}>
            <PaymentStatusMessageDialog />
            <div style={{ height: 800, width: '100%' }}>
                <DataGrid
                    // pageSize={5}
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
