---
docModule:
    package: '@ui-schema/json-pointer'
    modulePath: "json-pointer/src/"
    #exportsFrom:
    #    - ""
    #    - "/*" # single level directory
    files:
        - "**/*.ts"
        #- "escapePointer/escapePointer.ts"
        #- "resolvePointer/resolvePointer.ts"
        #- "toPointer/toPointer.ts"
        #- "unescapePointer/unescapePointer.ts"
        #- "walkPointer/walkPointer.ts"
---

# JSON-Pointer

The `@ui-schema/json-pointer` package provides a robust and flexible solution for working with JSON Pointers ([RFC 6901](https://tools.ietf.org/html/rfc6901)) in JavaScript and TypeScript applications. It is designed to handle both standard JavaScript data structures and Immutable.js collections, making it a versatile tool for a wide range of use cases, from simple object property access to complex data manipulation in state management.

## Key Features

* **RFC 6901 Compliant**: Implements the JSON Pointer specification for consistent and reliable behavior.
* **Immutable.js Support**: Works seamlessly with Immutable.js `List` and `Map` types, in addition to plain JavaScript objects and arrays.
* **TypeScript-First**: Developed in TypeScript, providing strong typing and improved developer experience.
* **Modular Design**: The package is split into small, focused modules, allowing you to import only the functionality you need.

## Installation

```bash
npm install @ui-schema/json-pointer
```

## Core API

### escapePointer

Escapes special characters (`~` and `/`) in a JSON Pointer segment. This is useful when creating pointers from user input or other sources that may contain these characters.

**Usage:**

```javascript
import { escapePointer } from '@ui-schema/json-pointer';

const escaped = escapePointer('foo/bar~baz');
// escaped is now "foo~1bar~0baz"
```

### unescapePointer

Unescapes special characters (`~0` and `~1`) in a JSON Pointer segment. This is the inverse of `escapePointer`.

**Usage:**

```javascript
import { unescapePointer } from '@ui-schema/json-pointer';

const unescaped = unescapePointer('foo~1bar~0baz');
// unescaped is now "foo/bar~baz"
```

### pointerToKeySeq

Converts a JSON Pointer string into an Immutable.js `List` of keys (segments). This is useful for programmatically accessing parts of a data structure.

**Usage:**

```javascript
import { pointerToKeySeq } from '@ui-schema/json-pointer';

const keySeq = pointerToKeySeq('/foo/bar/0');
// keySeq is now List [ "foo", "bar", "0" ]
```

### toPointer

Converts an array or Immutable.js `List` of keys into a JSON Pointer string. This is the inverse of `pointerToKeySeq`.

**Usage:**

```javascript
import { toPointer } from '@ui-schema/json-pointer';
import { List } from 'immutable';

const pointer = toPointer(['foo', 'bar', 0]);
// pointer is now "/foo/bar/0"

const pointerFromList = toPointer(List(['foo', 'bar', 0]));
// pointerFromList is now "/foo/bar/0"
```

### walkPointer

Traverses a data structure using a JSON Pointer. The `pick` function gives you control over how to access the next value in the structure, making `walkPointer` a flexible tool for navigating custom data types.

**Usage:**

```javascript
import { walkPointer } from '@ui-schema/json-pointer';

const data = {
    foo: {
        bar: ['a', 'b', 'c']
    }
};

const value = walkPointer('/foo/bar/1', data, (current, key) => {
    if(Array.isArray(current)) {
        return current[key];
    }
    if(typeof current === 'object' && current !== null) {
        return current[key];
    }
    return undefined;
});

// value is now "b"
```

### resolvePointer

A specific implementation of `walkPointer` that resolves a JSON Pointer in plain JavaScript objects/arrays and Immutable.js data structures. This is the most common way to use the package.

**Usage:**

```javascript
import { resolvePointer } from '@ui-schema/json-pointer';
import { fromJS } from 'immutable';

// With plain JavaScript objects
const data = {
    foo: {
        bar: ['a', 'b', 'c']
    }
};
const value = resolvePointer('/foo/bar/1', data);
// value is now "b"

// With Immutable.js
const immutableData = fromJS(data);
const immutableValue = resolvePointer('/foo/bar/1', immutableData);
// immutableValue is now "b"
```

## Practical Examples

### Accessing Nested Data

```javascript
import { resolvePointer } from '@ui-schema/json-pointer';

const user = {
    name: 'John Doe',
    address: {
        street: '123 Main St',
        city: 'Anytown'
    }
};

const city = resolvePointer('/address/city', user);
// city is "Anytown"
```

### Working with Arrays

```javascript
import { resolvePointer } from '@ui-schema/json-pointer';

const data = {
    items: [
        {id: 'a', value: 1},
        {id: 'b', value: 2}
    ]
};

const secondItemValue = resolvePointer('/items/1/value', data);
// secondItemValue is 2
```

### Dynamic Pointer Creation

```javascript
import { toPointer } from '@ui-schema/json-pointer';

function createPointer(base, ...segments) {
    return toPointer([base, ...segments]);
}

const pointer = createPointer('users', 1, 'name');
// pointer is "/users/1/name"
```
