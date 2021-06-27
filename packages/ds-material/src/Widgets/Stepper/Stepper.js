import React from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MuiStepper from '@material-ui/core/Stepper';
import MuiStep from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {memo} from '@ui-schema/ui-schema/Utils';
import {extractValidity} from '@ui-schema/ui-schema/UIStore';
import {isInvalid} from '@ui-schema/ui-schema/ValidityReporter';
import {PluginStack} from '@ui-schema/ui-schema/PluginStack';
import {TransTitle} from '@ui-schema/ui-schema/Translate/TransTitle';

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

export const Step = ({schema, storeKeys, level, ...p}) => {
    return <PluginStack
        schema={schema.delete('widget')}
        storeKeys={storeKeys} level={level + 1}
        {...p}
    />
};

export const Stepper = extractValidity(memo(
    ({
         schema, storeKeys, validity, level,
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

                        <PluginStack
                            showValidity={showValidity}
                            schema={steps.get(stepOrder.get(activeStep))} parentSchema={schema}
                            storeKeys={storeKeys.push(stepOrder.get(activeStep))} level={level + 1}
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
    },
));
