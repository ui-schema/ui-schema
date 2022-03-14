import { tt } from "@ui-schema/ui-schema/Utils"

export interface UISchema {
    title?: string
    tt?: tt
    t?: {
        [key: string]: string | number
    } | {
        [key: string]: {
            [key: string]: string | number
        }
    }
    widget?: string
    api?: {
        endpoint: string
    }
    // keyword to render the schema level virtual, without HTML, only validators etc.
    hidden?: boolean
    view?: {
        sizeXs?: number
        sizeSm?: number
        sizeMd?: number
        sizeLg?: number
        sizeXl?: number
        // only for type=object
        noGrid?: boolean
        // only for type=object with no widget
        spacing?: number
        // only for some widgets; minimum rows visible
        rows?: number
        // only for some widgets; maximum rows visible
        rowsMax?: number
        // only for some widgets;
        variant?: string
        // only for some widgets;
        margin?: string | 'none' | 'dense' | 'normal'
        // only for some widgets;
        dense?: boolean
        // only for some widgets;
        denseOptions?: boolean
        // only for some widgets; if e.g. transparent background
        bg?: boolean
        // only for some widgets; e.g. [MUI] if the TextInput label should be showed like something is entered already
        shrink?: boolean
        // only for some widgets; e.g. MUI Code Editor which code styles should be possible
        formats?: string[]
        // only for some widgets;
        justify?: string
        // only for some widgets;
        marks?: boolean | number[] | string[]
        // only for some widgets; label for accessibility and marks
        marksLabel?: string
        // only for some widgets; `auto` enables tooltip on hover or `on` for permanent
        tooltip?: string
        // only for some widgets;
        topControls?: boolean
        // only for some widgets;
        alpha?: boolean
        // only for some widgets;
        iconOn?: boolean
        // only for some widgets;
        colors?: string[]
        // only for some widgets;
        btnSize?: 'normal' | 'medium' | 'small'
        // only for some widgets;
        track?: true | false | 'inverted'
        // only for some widgets; margin top
        mt?: number
        // only for some widgets; margin bottom
        mb?: number
    }
    // only for some widgets; https://ui-schema.bemit.codes/docs/widgets/DateTimePickers
    date?: {
        // format used to display
        format?: string
        // format used to save, if not set uses `format`
        formatData?: string
        keyboard?: boolean
        views?: ('year' | 'date' | 'month' | 'hours' | 'minutes')[]
        variant?: string
        autoOk?: boolean
        disableFuture?: boolean
        disablePast?: boolean
        toolbar?: boolean
        clearable?: boolean
        // must be specified in ISO format
        minDate?: string
        // must be specified in ISO format
        maxDate?: string
        openTo?: 'year' | 'date' | 'month'
        orientation?: 'landscape' | 'portrait'
        tabs?: boolean
        minutesStep?: number
        // to disable am/pm selection
        ampm?: boolean
    }
}
