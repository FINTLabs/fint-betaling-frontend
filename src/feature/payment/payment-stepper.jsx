import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { useSelector } from 'react-redux';
import { Box } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

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
    return ['Velg mottaker', 'Velg produkt', 'Velg forfall'];
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
