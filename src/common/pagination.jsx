import React from 'react';
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { SEARCH_PAGE_ROWS } from '../feature/payment/constants';

const Pagination = ({
    suggestionsLength,
    activePage,
    handleChangePage,
}) => (suggestionsLength > 10
    ? (
        <TablePagination
            rowsPerPageOptions={[SEARCH_PAGE_ROWS]}
            colSpan={5}
            count={suggestionsLength}
            rowsPerPage={SEARCH_PAGE_ROWS}
            page={activePage}
            SelectProps={{
                inputProps: { 'aria-label': 'rows per page' },
                native: true,
            }}
            onPageChange={handleChangePage}
            ActionsComponent={TablePaginationActions}
            component={Box}
        />
    ) : <Box />);

Pagination.propTypes = {
    suggestionsLength: PropTypes.number.isRequired,
    activePage: PropTypes.number.isRequired,
    handleChangePage: PropTypes.func.isRequired,
};

export default Pagination;
