import { schema } from '@ui-schema/ui-schema/CommonTypings'

export type additionalProps = boolean|number[]

export type addAdditionalProps = (additionalProps: additionalProps, schema: schema) => additionalProps
