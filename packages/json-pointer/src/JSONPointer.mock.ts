export const testCases: {
    pointer: string
    keys: (string | number)[]
    data: Object
    value: string
}[] = [
    // testCases and description from:
    // https://github.com/json-schema-org/JSON-Schema-Test-Suite/blob/aa71850ef93c7e6e9bb2f7e36d084cf0c45d8be1/tests/draft2019-09/optional/format/json-pointer.json
    {
        // a valid JSON-pointer
        pointer: '/foo/bar~0/baz~1/%a',
        keys: ['foo', 'bar~', 'baz/', '%a'],
        data: {
            foo: {'bar~': {'baz/': {'%a': 'value'}}},
        },
        value: 'value',
    },/*
    {
        // valid JSON-pointer with empty segment
        pointer: '/foo//bar',
    },
    {
        // valid JSON-pointer with the last empty segment
        pointer: '/foo/bar/',
    },*/
    {
        // valid JSON-pointer as stated in RFC 6901 #1
        pointer: '',
        keys: [],
        data: 'value',
        value: 'value',
    },
    {
        // valid JSON-pointer as stated in RFC 6901 #2
        pointer: '/foo',
        keys: ['foo'],
        data: {
            foo: 'value',
        },
        value: 'value',
    },
    {
        // valid JSON-pointer as stated in RFC 6901 #3
        pointer: '/foo/0',
        keys: ['foo', '0'],
        data: {
            foo: ['bar', 'baz'],
        },
        value: 'bar',
    },
    {
        // valid JSON-pointer as stated in RFC 6901 #4
        pointer: '/',
        keys: [],
        data: 'bar',
        value: 'bar',
    },
    {
        // valid JSON-pointer as stated in RFC 6901 #9
        pointer: '/i\\j',
        keys: ['i\\j'],
        data: {
            'i\\j': 'value',
        },
        value: 'value',
    },
    {
        // valid JSON-pointer as stated in RFC 6901 #11
        pointer: '/ ',
        keys: [' '],
        data: {
            ' ': 'value',
        },
        value: 'value',
    },
    /*{
        // valid JSON-pointer used adding to the last array position
        pointer: '/foo/-',
        data: {
            'foo': ['bar', 'baz'],
        },
        value: 'value',
    },*/
    {
        // valid JSON-pointer (- used as object member name)
        pointer: '/foo/-/bar',
        keys: ['foo', '-', 'bar'],
        data: {
            'foo': {
                '-': {'bar': 'a', 'baz': 'b'},
            },
        },
        value: 'a',
    },
    {
        // valid JSON-pointer (float used as object member name)
        pointer: '/foo/1.0',
        keys: ['foo', '1.0'],
        data: {
            'foo': {
                '1.0': 'var',
            },
        },
        value: 'var',
    },/*
    {
        // Fragment / URI encoded pointers
        pointer: '#/c%d',
        'pointerUri': '#/c%25d',// uri encoded
    },*/
]
