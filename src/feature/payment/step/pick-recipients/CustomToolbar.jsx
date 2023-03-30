import React from 'react';
import {
    useDispatch,
    useSelector,
} from 'react-redux';
import {
    Box,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import {
    updateSearchBy,
    updateSearchPage,
    updateSearchValue,
    updateSuggestions,
    updateStep,
} from '../../../../data/redux/actions/payment';
import SearchField from '../../../../common/search-field';
import {
    GROUP,
    INDIVIDUAL,
    SEARCH_PAGE_START,
    STEP_PICK_PRODUCTS,
} from '../../constants';

const useStyles = makeStyles((theme) => ({
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    radioGroup: {
        display: 'flex',
        flexDirection: 'row',
        margin: theme.spacing(1),
    },
    searchField: {
        margin: theme.spacing(1),
        width: '50%',
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: theme.spacing(1),
    },
    button: {
        marginLeft: theme.spacing(1),
    },
    buttonForward: {
        margin: theme.spacing(1),
    },
    buttonBackward: {
        margin: theme.spacing(1),
    },
}));

// function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
function EnhancedTableToolbar() {
    const classes = useStyles();
    const dispatch = useDispatch();

    // const { numSelected } = props;
    const recipientType = useSelector((state) => state.payment.form.searchBy).toString();
    const groups = useSelector((state) => state.groups.groups);
    const individual = useSelector((state) => state.customers.customers);
    const searchPlaceHolder = recipientType === GROUP ? 'Gruppenavn' : 'Etternavn, Fornavn Mellomnavn';
    const searchValue = useSelector((state) => state.payment.form.searchValue);
    const recipients = useSelector((state) => state.payment.payment.recipients);

    const handleSearchBy = (event) => {
        dispatch(updateSearchBy(event.target.value));
        dispatch(updateSearchValue(''));
        dispatch(updateSuggestions(event.target.value === GROUP ? groups : individual));
        dispatch(updateSearchPage(SEARCH_PAGE_START));
    };

    const handleSearchValue = (event) => {
        dispatch(updateSearchPage(SEARCH_PAGE_START));
        dispatch(updateSearchValue(event.target.value));
    };

    const isConfirmButtonDisabled = Object.keys(recipients).filter((key) => recipients[key].checked).length === 0;

    const handleConfirmButtonClick = () => {
        dispatch(updateStep(STEP_PICK_PRODUCTS));
        dispatch(updateSearchPage(SEARCH_PAGE_START));
    };

    return (
        <Toolbar className={classes.toolbar}>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <RadioGroup
                        className={classes.radioGroup}
                        aria-label="recipientType"
                        name="recipientType"
                        value={recipientType}
                        onChange={handleSearchBy}
                    >
                        <FormControlLabel
                            value={GROUP.toString()}
                            control={<Radio size="small" />}
                            label="Gruppe"
                        />
                        <FormControlLabel
                            value={INDIVIDUAL.toString()}
                            control={<Radio size="small" />}
                            label="Person"
                        />
                    </RadioGroup>
                </Grid>
                <Grid item xs={6}>
                    <SearchField
                        className={classes.searchField}
                        label={`Søk på ${searchPlaceHolder.toLowerCase()}`}
                        onChange={handleSearchValue}
                        onClear={() => dispatch(updateSearchValue(''))}
                        value={searchValue}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Box className={classes.buttons}>
                        <Button
                            variant="contained"
                            color="secondary"
                            disabled
                            onClick={() => {}}
                            className={classes.buttonBackward}
                        >
                            Tilbake
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            disabled={isConfirmButtonDisabled}
                            onClick={handleConfirmButtonClick}
                            className={classes.button}
                            data-testid="recipientGoToProductsButton"
                        >
                            Videre
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Toolbar>
    );
}

export default EnhancedTableToolbar;
