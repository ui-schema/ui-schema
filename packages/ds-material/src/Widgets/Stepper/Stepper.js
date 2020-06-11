import React from "react";
import {
    makeStyles, Stepper as MuiStepper, Step as MuiStep, StepLabel, Button, Typography,
} from "@material-ui/core";
import {NestedSchemaEditor, isInvalid, memo, extractValidity} from "@ui-schema/ui-schema";
import {TransTitle} from "@ui-schema/ui-schema/Translate/TransTitle";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

const Step = ({schema, storeKeys, level, ...p}) => {
    return <NestedSchemaEditor storeKeys={storeKeys} schema={schema.delete('widget')} level={level + 1} {...p}/>
};

const Stepper = extractValidity(memo(
    ({
         schema, storeKeys, validity,
     }) => {
        if(!schema) return null;

        const [showValidity, setShowValidity] = React.useState(false);

        const classes = useStyles();
        const [activeStep, setActiveStep] = React.useState(0);
        const steps = schema.get('properties');
        const stepOrder = steps.keySeq();

        let activeStepInvalid = isInvalid(validity, [stepOrder.get(activeStep)]);

        const handleNext = () => {
            if(activeStepInvalid) {
                setShowValidity(true);
            } else {
                setShowValidity(false);
                setActiveStep(prevActiveStep => prevActiveStep + 1);
            }
        };

        const handleBack = () => {
            setActiveStep(prevActiveStep => prevActiveStep - 1);
        };

        const handleReset = () => {
            setActiveStep(0);
        };

        return <div className={classes.root}>
            <MuiStepper activeStep={activeStep}>
                {steps.map((step, name) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <MuiStep key={name} {...stepProps}>
                            <StepLabel {...labelProps}><TransTitle schema={schema} storeKeys={storeKeys} ownKey={name}/></StepLabel>
                        </MuiStep>
                    );
                }).valueSeq()}
            </MuiStepper>
            <div>
                {activeStep === stepOrder.size ? (
                    <div>
                        <Typography className={classes.instructions}>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Button onClick={handleReset} className={classes.button}>
                            Reset
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Typography className={classes.instructions}><TransTitle schema={schema} storeKeys={storeKeys} ownKey={stepOrder.get(activeStep)}/></Typography>

                        <NestedSchemaEditor
                            showValidity={showValidity}
                            storeKeys={storeKeys.push(stepOrder.get(activeStep))}
                            schema={steps.get(stepOrder.get(activeStep))}
                        />

                        <div style={{margin: '24px 0 0 0'}}>
                            <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                Back
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                                className={classes.button}
                            >
                                {activeStep === steps.size - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>;
    }
));

export {Stepper, Step};
