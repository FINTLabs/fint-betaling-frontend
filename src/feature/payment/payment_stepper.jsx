import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import {useSelector} from "react-redux";

const useStyles = makeStyles(theme => ({
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    stepper: {
        width: "80%",
        margin: "auto"
    },

    root: {
        "&$active": {
            color: theme.palette.secondary.main
        },
        "&$completed": {
            color: theme.palette.secondary.dark
        }
    },
    active: {},
    completed: {}
}));

function getSteps() {
    return ['Velg mottakere', 'Velg varer', 'Bekreft og send'];
}

export default function PaymentStepper() {
    const classes = useStyles();
    const step = useSelector(state => state.payment.form.step);
    const steps = getSteps();

    return (
        <div>
            <Stepper className={classes.stepper} activeStep={step}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}
                                       StepIconProps={{
                                           classes: {
                                               root: classes.root,
                                               active: classes.active,
                                               completed: classes.completed
                                           }
                                       }}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    );
                })}

            </Stepper>

        </div>
    );
    /*<div>
                    <div>
                        <div>
                            <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </div>

                </div>*/
}