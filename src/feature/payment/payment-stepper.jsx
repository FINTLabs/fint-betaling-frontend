import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { grey } from '@mui/material/colors';

const useStyles = makeStyles((theme) => ({
    root: {
        color: grey['300'],
        '&$active': {
            color: theme.palette.secondary.main,
        },
        '&$completed': {
            color: theme.palette.secondary.main,
        },
    },
    active: {},
    completed: {},
}));

function getSteps() {
    return ['Velg mottaker', 'Velg produkt', 'Lagre'];
}

export default function PaymentStepper() {
    const classes = useStyles();
    const step = useSelector((state) => state.payment.form.step);
    const steps = getSteps();

    return (
        <Box width={1}>
            <Stepper activeStep={step}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel
                            StepIconProps={{
                                classes: {
                                    root: classes.root,
                                    active: classes.active,
                                    completed: classes.completed,
                                },
                            }}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}

            </Stepper>
        </Box>
    );
}
