import { List } from 'immutable'

export const testCases: {
    description: string
    selector: string
    listSelector?: List<string>
    data: Object
    value: string
}[] = [
    // testCases and description from:
    // https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/aa71850ef93c7e6e9bb2f7e36d084cf0c45d8be1/tests/draft2019-09/optional/format/json-pointer.json
    {
        'description': 'a valid JSON-pointer',
        'selector': '/foo/bar~0/baz~1/%a',
        data: {
            foo: {'bar~': {'baz/': {'%a': 'value'}}},
        },
        value: 'value',
    },/*
    {
        'description': 'valid JSON-pointer with empty segment',
        'selector': '/foo//bar',
    },
    {
        'description': 'valid JSON-pointer with the last empty segment',
        'selector': '/foo/bar/',
    },*/
    {
        'description': 'valid JSON-pointer as stated in RFC 6901 #1',
        'selector': '',
        data: {
            foo: {'bar~': {'baz/': {'%a': 'value'}}},
        },
        value: 'value',
    },
    {
        'description': 'valid JSON-pointer as stated in RFC 6901 #2',
        'selector': '/foo',
        data: {
            foo: 'value',
        },
        value: 'value',
    },
    {
        'description': 'valid JSON-pointer as stated in RFC 6901 #3',
        'selector': '/foo/0',
        data: {
            foo: ['bar', 'baz'],
        },
        value: 'bar',
    },
    {
        'description': 'valid JSON-pointer as stated in RFC 6901 #4',
        'selector': '/',
        data: {
            foo: 'bar',
        },
        value: 'bar',
    },
    {
        'description': 'valid JSON-pointer as stated in RFC 6901 #9',
        'selector': '/i\\j',
        data: {
            'i\\j': 'value',
        },
        value: 'value',
    },
    {
        'description': 'valid JSON-pointer as stated in RFC 6901 #11',
        'selector': '/ ',
        data: {
            ' ': 'value',
        },
        value: 'value',
    },
    /*{
        'description': 'valid JSON-pointer used adding to the last array position',
        'selector': '/foo/-',
        data: {
            'foo': ['bar', 'baz'],
        },
        value: 'value',
    },*/
    {
        'description': 'valid JSON-pointer (- used as object member name)',
        'selector': '/foo/-/bar',
        data: {
            'foo': {
                '-': {'bar': 'a', 'baz': 'b'},
            },
        },
        value: 'a',
    },/*
    {
        'description': 'Fragment / URI encoded selectors',
        'selector': '#/c%d',
        'selectorUri': '#/c%25d',// uri encoded
    },*/
]
