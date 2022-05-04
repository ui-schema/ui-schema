import React from 'react';
import MuiStepper from '@mui/material/Stepper';
import MuiStep from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {memo} from '@ui-schema/ui-schema/Utils';
import {extractValidity} from '@ui-schema/ui-schema/UIStore';
import {isInvalid} from '@ui-schema/ui-schema/ValidityReporter';
import {PluginStack} from '@ui-schema/ui-schema/PluginStack';
import {TransTitle} from '@ui-schema/ui-schema/Translate/TransTitle';
import Box from '@mui/material/Box';
import {useTheme} from '@mui/material/styles';

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
        const theme = useTheme()
        const [showValidity, setShowValidity] = React.useState(false);

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

        return <div style={{width: '100%'}}>
            <MuiStepper activeStep={activeStep}>
                {steps.map((step, name) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <MuiStep key={name} {...stepProps}>
                            <StepLabel {...labelProps}><TransTitle schema={schema.get('title') ? schema : schema.set('title', name)} storeKeys={storeKeys}/></StepLabel>
                        </MuiStep>
                    );
                }).valueSeq()}
            </MuiStepper>
            <div>
                {activeStep === stepOrder.size ? (
                    <Box pb={2}>
                        <Typography gutterBottom>
                            All steps completed - you&apos;re finished
                        </Typography>
                        <Button onClick={handleReset} style={{marginRight: theme.spacing(1)}}>
                            Reset
                        </Button>
                    </Box>
                ) : (
                    <Box pb={2}>
                        <Typography gutterBottom><TransTitle schema={schema} storeKeys={storeKeys.push(stepOrder.get(activeStep))}/></Typography>

                        <PluginStack
                            showValidity={showValidity}
                            schema={steps.get(stepOrder.get(activeStep))} parentSchema={schema}
                            storeKeys={storeKeys.push(stepOrder.get(activeStep))} level={level + 1}
                        />

                        <div style={{margin: '24px 0 0 0'}}>
                            <Button disabled={activeStep === 0} onClick={handleBack} style={{marginRight: theme.spacing(1)}}>
                                Back
                            </Button>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNext}
                            >
                                {activeStep === steps.size - 1 ? 'Finish' : 'Next'}
                            </Button>
                        </div>
                    </Box>
                )}
            </div>
        </div>;
    },
));
