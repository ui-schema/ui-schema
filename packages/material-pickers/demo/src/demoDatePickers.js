import {createOrderedMap} from '@ui-schema/ui-schema';

const schemaDatePickers = createOrderedMap({
    type: 'object',
    properties: {
        timeInMs1: {
            'type': 'string',
            'format': 'date+time',
            'widget': 'DateTime',
            'default': 'now',
            'date': {
                'clearable': true,
                'toolbar': true,
                'views': [
                    'year',
                    'month',
                    'day',
                    'hours',
                    'minutes',
                ],
                'format': 'dd.MM.yyyy HH:mm z',
                'formatData': 'X',
            },
            'view': {
                'sizeXs': 12,
                'sizeMd': 4,
            },
        },
        timeInMs: {
            'type': 'string',
            'format': 'date+time',
            'widget': 'DateTime',
            'title': 'Time (view as date, save as ms)',
            'date': {
                'clearable': true,
                'toolbar': true,
                'format': 'yyyy-MM-ddTZZ',
                'formatData': 'x',
                views: ['year', 'month', 'day', 'hours', 'minutes', 'seconds'],
            },
        },
        time: {
            type: 'string',
            format: 'time',
            widget: 'Time',
            date: {
                format: 'HH.mm',
                formatData: 'HH:mm',
                ampm: false,
                views: ['hours', 'minutes'],
            },
            view: {
                sizeXs: 12,
                sizeMd: 4,
            },
        },
        time_mobile: {
            type: 'string',
            format: 'time',
            widget: 'Time',
            default: 'now',
            date: {
                variant: 'dialog',
                clearable: true,
                toolbar: true,
                views: ['hours', 'minutes'],
            },
            view: {
                sizeXs: 12,
                sizeMd: 4,
            },
        },
        time_view: {
            type: 'string',
            format: 'time',
            widget: 'Time',
            default: '10:11',
            date: {
                clearable: true,
                views: ['hours', 'minutes'],
            },
            view: {
                sizeXs: 12,
                sizeMd: 4,
            },
        },
        time_static_l: {
            type: 'string',
            format: 'time',
            widget: 'Time',
            date: {
                variant: 'static',
                autoOk: true,
                toolbar: true,
            },
            view: {
                sizeXs: 12,
                sizeMd: 6,
                justify: 'center',
            },
        },
        time_static_p: {
            type: 'string',
            format: 'time',
            widget: 'Time',
            date: {
                variant: 'static',
                formatData: 'HH:mm',
                // openTo: 'year',
                autoOk: true,
                minDate: '10:20',
                maxDate: '20:20',
            },
            view: {
                sizeXs: 12,
                sizeMd: 6,
                justify: 'right',
            },
        },
        datetime: {
            type: 'string',
            format: 'date+time',
            widget: 'DateTime',
            date: {
                clearable: true,
                format: 'dd.MM.yyyy HH:mm',
                formatData: 'yyyy/dd/MM HH:mm',
                views: ['year', 'month', 'day', 'hours', 'minutes'],
            },
            view: {
                sizeXs: 12,
                sizeMd: 4,
            },
        },
        datetime_mobile: {
            type: 'string',
            format: 'date+time',
            widget: 'DateTime',
            default: 'now',
            date: {
                clearable: true,
                toolbar: true,
                views: ['year', 'month', 'day', 'hours', 'minutes'],
            },
            view: {
                sizeXs: 12,
                sizeMd: 4,
            },
        },
        datetime_view: {
            type: 'string',
            format: 'date+time',
            widget: 'DateTime',
            default: '2017-10-30 12:11',
            date: {
                clearable: true,
                views: ['year', 'month', 'day', 'hours', 'minutes'],
            },
            view: {
                sizeXs: 12,
                sizeMd: 4,
            },
        },
        datetime_static_l: {
            type: 'string',
            format: 'date+time',
            widget: 'DateTime',
            date: {
                variant: 'static',
                autoOk: true,
                toolbar: true,
            },
            view: {
                sizeXs: 12,
                sizeMd: 6,
                justify: 'center',
            },
        },
        datetime_static_p: {
            type: 'string',
            format: 'date+time',
            widget: 'DateTime',
            date: {
                variant: 'static',
                formatData: 'yyyy-MM-dd HH',
                views: ['year', 'month', 'day', 'hours'],
                openTo: 'year',
                autoOk: true,
                minDate: '2018',
                maxDate: '2023',
            },
            view: {
                sizeXs: 12,
                sizeMd: 6,
                justify: 'right',
            },
        },
        date: {
            type: 'string',
            format: 'date',
            widget: 'Date',
            date: {
                clearable: true,
            },
            view: {
                sizeXs: 12,
                sizeMd: 4,
            },
        },
        year_mobile: {
            type: 'string',
            format: 'date',
            widget: 'Date',
            default: 'now',
            date: {
                variant: 'dialog',
                format: 'y',
                clearable: true,
                views: ['year'],
            },
            view: {
                sizeXs: 12,
                sizeMd: 4,
            },
        },
        date_view: {
            type: 'string',
            format: 'date',
            widget: 'Date',
            date: {
                format: 'y-MM',
                clearable: true,
                views: ['year', 'month'],
            },
            view: {
                sizeXs: 12,
                sizeMd: 4,
            },
        },
        date_static_l: {
            type: 'string',
            format: 'date',
            widget: 'Date',
            date: {
                variant: 'static',
                orientation: 'landscape',
                autoOk: true,
                toolbar: true,
                views: ['year', 'month', 'day'],
            },
            view: {
                sizeXs: 12,
                sizeMd: 7,
            },
        },
        date_static_p: {
            type: 'string',
            format: 'date',
            widget: 'Date',
            date: {
                variant: 'static',
                orientation: 'portrait',
                format: 'y',
                views: ['year'],
                openTo: 'year',
                autoOk: true,
                minDate: '2018',
                maxDate: '2023',
            },
            view: {
                sizeXs: 12,
                sizeMd: 5,
            },
        },
    },
});

export {schemaDatePickers}
