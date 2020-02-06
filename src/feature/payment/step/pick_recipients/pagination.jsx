import React from 'react';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from '@material-ui/core/TablePagination/TablePaginationActions';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { SEARCH_PAGE_ROWS } from '../../constants';

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
            onChangePage={handleChangePage}
            // onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
            component={Box}
        />
    ) : <Box />);

Pagination.propTypes = {
    suggestionsLength: PropTypes.number.isRequired,
    activePage: PropTypes.string.isRequired,
    handleChangePage: PropTypes.func.isRequired,
};

export default Pagination;