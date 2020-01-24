import React from "react";
import {
    makeStyles, Stepper as MuiStepper, Step as MuiStep, StepLabel, Button, Typography,
} from "@material-ui/core";
import {beautifyKey, NestedSchemaEditor} from "@ui-schema/ui-schema";

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


const Step = ({
                  //lastKey, required,
                  schema, storeKeys, level,
              }) => {
    return <NestedSchemaEditor storeKeys={storeKeys} schema={schema.delete('widget')} level={level + 1}/>
};

const Stepper = ({
                     //lastKey, required,
                     schema, storeKeys
                 }) => {
    if(!schema) return null;

    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());
    const steps = schema.get('properties');
    const stepOrder = steps.keySeq();

    React.useEffect(() => {
        //setActiveStep(0)
    }, [setActiveStep, schema]);

    const isStepOptional = step => {
        return step === 1;
    };

    const isStepSkipped = step => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if(isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep(prevActiveStep => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if(!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep(prevActiveStep => prevActiveStep + 1);
        setSkipped(prevSkipped => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return <div className={classes.root}>
        <MuiStepper activeStep={activeStep}>
            {steps.map((step, name) => {
                const stepProps = {};
                const labelProps = {};
                /*if(isStepOptional(name)) {
                    labelProps.optional = <Typography variant="caption">Optional</Typography>;
                }*/
                if(isStepSkipped(name)) {
                    stepProps.completed = false;
                }
                return (
                    <MuiStep key={name} {...stepProps}>
                        <StepLabel {...labelProps}>{beautifyKey(name)}</StepLabel>
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
                    <Typography className={classes.instructions}>{beautifyKey(stepOrder.get(activeStep))}</Typography>
                    <NestedSchemaEditor
                        storeKeys={storeKeys.push(stepOrder.get(activeStep))}
                        schema={steps.get(stepOrder.get(activeStep))}
                    />
                    <div style={{margin: '24px 0 0 0'}}>
                        <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                            Back
                        </Button>
                        {isStepOptional(activeStep) && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSkip}
                                className={classes.button}
                            >
                                Skip
                            </Button>
                        )}

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
};

export {Stepper, Step};
