import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { demoStepperSchema } from '../content/docs/widgets/StepperDemo'

const schemaStepper = createOrderedMap(demoStepperSchema)

const dataStepper = createOrderedMap({
    'step-1': {name: 'Max'},
})

export { schemaStepper, dataStepper }

